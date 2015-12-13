var API_KEY = 'R5BY7E9VFAU6GC05T';
var CONSUMER_KEY = '3a29732f217fbcdcf6b37f956cd99925';
var SHARED_SECRET = '6hLGAOJdTSSQY22z/uK0/A';

var en;

var catalogs = {
	CAERBWP1518E24EDE3: 'British Pop Profile'
};


var curSong = null;

var currentCatalogID = "CAERBWP1518E24EDE3";
var allItems = [];

function info(s) {
    $("#info").removeClass();
    if (s.length > 0) {
        $("#info").addClass("alert alert-info");
    }
    $("#info").text(s);
}

function tinfo(s) {
    info(s);
    setTimeout( function() { info(""); }, 5000);
}

function error(s) {
    $("#info").removeClass();
    if (s.length > 0) {
        $("#info").addClass("alert alert-error");
    }
    $("#info").text(s);
}

function terror(s) {
    error(s);
    setTimeout( function() { error(""); }, 5000);
}


// -------------------------------------- Fetching player info of taste profile ------------------------------------

function getArtistUpdateBlock(type) {
    var artists = $("#"+type).val();
    console.log("#"+type);
    artists = artists.split(",");
    var blocks = [];
    $.each(artists, 
        function(index, artist) {
            var artist = $.trim(artist);
            var item = {
                action : 'update',
                item : {
                    item_id : 'item-' + index,
                    artist_name: artist,
                    favorite : true
                }
            }
            blocks.push(item);
        }
    );
    return blocks;
}

function updateTasteProfile(id, blocks) {
	en.catalog.addArtists(id, blocks, function(data) {
	}, function(data) {
		error("Trouble waiting for catalog");
	});
}

function createTasteProfile() {
	var blocks = getArtistUpdateBlock("new-artist-name"), profileName = $('#new-tp-name').val();
	if (blocks.length == 0 || !profileName) {
		alert("Please enter artist name or profile name to start creating taste profiles...");
	} else {
		en.catalog.create(profileName, function(data){
			var profileID = data.response.id;
			catalogs[profileID] = profileName;
			localStorage.setItem('profiles', JSON.stringify(catalogs));
			console.log(catalogs);
			updateTasteProfile(profileID, blocks);
		}, function(data) {
                error("Couldn't create catalog " + profileName);
            });
	}
}

function deleteTasteProfile(id) {
	en.catalog.delete(id,
        function() {
            info("Your taste has been deleted");
        },
        function(data) {
            error('trouble deleting catalog ', data);
        }
    );
}

function createDynamicPlaylist() {
    tinfo("Creating the playlist ...");
    var args = {
        'bucket': [ 'id:rdio-US', 'tracks'], 'limit' : true,
        'type':'catalog-radio',
        'seed_catalog' : currentCatalogID,
        'session_catalog' : currentCatalogID,
    };
    en.playlist.create(args,
        function(data) {
            fetchNextTrack();
        },
        function() {
            error("Trouble creating playlist session");
        }
    );
}

function playNextSong() {
    fetchNextTrack();
}

function fetchNextTrack() {
    en.playlist.nextSong(1, 5,
        function(data) {
            if (data.response.songs.length > 0) {
                playSong(data.response.songs[0]);
            } else {
                info("No more songs to play on this station");
            }
        },
        function() {
            error("Trouble getting the next track on this station");
        }
    );
}

function playSong(song) {
	var rdioID = getRdioID(song);
    curSong = song;
    R.ready(function(){
    	R.player.play({
	        source: rdioID
	    });
    });
    $("#rp-song-title").text(song.title);
    $("#rp-artist-name").text(song.artist_name);
}

function getRdioID(song) {
	var id = song.tracks[0].foreign_id;
    var rawID = id.split(':')[2]
    return rawID;
}

function badSong() {
    terror("banning  " + curSong.artist_name);
    en.playlist.feedback('ban_artist', curSong.artist_id,
        function(data) {
            terror("banned songs by " + curSong.artist_name);
            playNextSong();
        },
        function() {
            error("Trouble flagging that as a bad song");
        }
    );
}

function skipSong() {
    tinfo("skipping  " + curSong.title);
    en.playlist.feedback('skip_song', curSong.id,
        function(data) {
            tinfo("skipped " + curSong.title);
            playNextSong();
        },
        function() {
            error("Trouble skipping song");
        }
    );
}

function goodSong() {
    var args = { 
        favorite_artist: curSong.artist_id,
        favorite_song: curSong.id
    };
    tinfo("Favoriting  " + curSong.artist_name);
    en.playlist.multifeedback(args,
        function(data) {
            
            tinfo("Favorited song by " + curSong.artist_name);
        },
        function() {
            terror("Trouble giving feedback");
        }
    );
}

function startPlaying() {

    createDynamicPlaylist();
}

// -------------------------------------- Fetching details of taste profile ------------------------------------

function fetchTasteProfile(id) {
	info("Getting the taste profile");
    allItems = [];
    fetchTasteProfileInfo(id);
    fetchMoreFromTasteProfile(id, 0);
}

function fetchTasteProfileInfo(id) {
    en.catalog.profile(id, 
        function(data) {
          var cat = data.response.catalog;
          //$("#tp-sum-id").text(cat.id);
          //$("#tp-sum-name").text(cat.name);
          //$("#tp-sum-type").text(cat.type);
          $("#total-number-songs").text(cat.total);
          //$("#tp-sum-resolved").text(cat.resolved);
        },
        
        function() {
            error("trouble fetching taste profile");
        }
    );
}

function fetchMoreFromTasteProfile(id, start) {
    var pageSize = 1000;
    var maxItems = 100000;
    info("Getting TP info ...");
    en.catalog.read(id, start, pageSize, ['genre'],
        function(data) {
            var curStart = data.response.catalog.start;
            var items = data.response.catalog.items;
            var total = data.response.catalog.total;
            $.each(items, 
                function(index, item) {
                    if ('artist_id' in item) {
                        if ('genres' in item) {
                            // console.log(item.genres);
                        }
                        allItems.push(item);
                    }
                }
            );
            if (start != curStart) {
                console.log('woah, something bad happend', start, curStart);
            }
            if (items.length == pageSize && start + items.length < total && start < maxItems) {
                fetchMoreFromTasteProfile(id, curStart + items.length);
            } else {
                info("");
                updateTasteProfileView();
            }
        },
        
        function() {
            error("trouble fetching taste profile");
        }
    );
}

function updateTasteProfileView() {
    var favArtists = _.filter(allItems, function(item) { return isArtist(item) && item.favorite; } );
    //console.log(favArtists);
    showSimpleTPArtistList("#fav-artist-list", favArtists);
    var playedArtists = _.filter(allItems, function(item) { return isArtist(item) && item.play_count; } );
    var mostPlayedArtists = _.sortBy(playedArtists, function(item) { return item.play_count; } ).reverse();
    //showSimpleTPArtistList("#tp-most-played-artists", "#tp-most-played-artist-rows", mostPlayedArtists.slice(0, 10));
    var favSongs = _.filter(allItems, function(item) { return isSong(item) && item.favorite; } );
    showSimpleTPSongList("#tp-favorite-songs", "#tp-favorite-song-rows", favSongs);
}

function showSimpleTPArtistList(top_div, artists) {
    if (artists.length > 0) {
        $(top_div).show();
        $.each(artists, 
            function(index, artist) {
                $(top_div).append( $("<li class='list-group-item'>").text(artist.artist_name) );
            }
        );
    } else {
        $(top_div).hide();
    }
}

function showSimpleTPSongList(top_div, row_div, songs) {
    if (songs.length > 0) {
        $(top_div).show();
        var rows = $(row_div);
        rows.empty();
        $.each(songs, 
            function(index, song) {
            	if (index >4) return;
                var tr = $("<tr>");
                tr.append( $("<td>").text( song.song_name ) );
                tr.append( $("<td>").text( song.artist_name ) );
                rows.append(tr);
            }
        );
    } else {
        $(top_div).hide();
    }
}


function isArtist(item) {
    return 'artist_id' in item && (!('song_id' in item));
}
function isSong(item) {
    return 'artist_id' in item && 'song_id' in item;
}



//---------------------------------------------Document ready--------------------------------------------------------

function initUI() {
	$('#profile-name').html(catalogs[currentCatalogID]);
}

$(document).ready(function(){
	en = new EchoNest(API_KEY);
	$.ajaxSetup( {cache: false});

	$('#bad-song').click(badSong);
    $('#good-song').click(goodSong);

    $('#create-tp-button').click(createTasteProfile);

    $('#update-tp-button').click(function(){
    	var blocks = getArtistUpdateBlock("update-artist-name");
    	if (blocks.length == 0) {
			alert("Please enter artist name to update taste profiles...");
		} else {
			updateTasteProfile(currentCatalogID, blocks);
		}
    });

    initUI();

	R.ready(function() {
            R.player.on("change:playingTrack", function(track) {
                if (track) {
                    var image = track.attributes.icon;
                    $("#rp-album-art").attr('src', image);
                } else {
                    playNextSong();
                }
            });

            R.player.on("change:playState", function(state) {
                if (state == R.player.PLAYSTATE_PAUSED) {
                    $("#rp-pause-play i").removeClass("fa-pause");
                    $("#rp-pause-play i").addClass("fa-play");
                }
                if (state == R.player.PLAYSTATE_PLAYING) {
                    $("#rp-pause-play i").removeClass("fa-play");
                    $("#rp-pause-play i").addClass("fa-pause");
                }
            });

            R.player.on("change:playingSource", function(track) {});

            $("#rp-pause-play").click(function() {
                R.player.togglePause();
            });

            $("#rp-next").click(function() {
                playNextSong();
            });
    });
	
	startPlaying();

	fetchTasteProfile(currentCatalogID);



})