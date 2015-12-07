var API_KEY = 'R5BY7E9VFAU6GC05T';
var CONSUMER_KEY = '3a29732f217fbcdcf6b37f956cd99925';
var SHARED_SECRET = '6hLGAOJdTSSQY22z/uK0/A';

var en;
var profiles = [];
var curSong = null;

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


function getArtistUpdateBlock() {
    var artists = $("#artists").val();
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
		var ticket = data.response.ticket;
		en.catalog.pollForStatus(ticket, 
                function(data) {
                    if (data.response.ticket_status === 'pending') {
                        var percent = 20 + Math.round(80 * data.response.percent_complete / 100.0)
                        info("Resolving artists " + percent + " % complete");
                        progressBar.css('width', percent  + '%');
                    } else if (data.response.ticket_status === 'complete') {
                        progressBar.css('width', '100%');
                        info("Done!");
                        tasteProfileReady(id);
                    } else {
                        error("Can't resolve taste profile " + data.response.details);
                    }
                },
                function() {
                    error("Trouble waiting for catalog");
                });
	}, function(data) {
		error("Trouble waiting for catalog");
	});
}

function createTasteProfile() {
	var blocks = getArtistUpdateBlock(), profileName = $('#new-profile-name').val();
	if (blocks.length == 0 || !profileName) {
		info("Please enter artist name to start creating taste profiles...");
	} else {
		en.catalog.create(profileName, function(data){
			var profileID = data.response.id;
			updateTasteProfile(profileID, blocks);
		}, function(data) {
                error("Couldn't create catalog " + catName);
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

function createDynamicPlaylist(catalogID) {
    tinfo("Creating the playlist ...");
    var args = {
        'bucket': [ 'id:rdio-US', 'tracks'], 'limit' : true,
        'type':'catalog-radio',
        'seed_catalog' : catalogID,
        'session_catalog' : catalogID,
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
    en.playlist.nextSong(1, 1,
        function(data) {
            if (data.response.songs.length > 0) {
                playSong(data.response.songs[0]);
            } else {
                info("No more songs to play on this station");
            }
            $("#up-next").append(all);
        },
        function() {
            error("Trouble getting the next track on this station");
        }
    );
}

function playSong(song) {
	var rdioID = getRdioID(song);
    curSong = song;
    R.player.play({
        source: rdioID
    });
    //$("#rp-song-title").text(song.title);
    //$("#rp-artist-name").text(song.artist_name);
    //document.title = song.artist_name;
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
            $("#up-next").text("a surprise ...");
            tinfo("favorited song by " + curSong.artist_name);
        },
        function() {
            terror("Trouble giving feedback");
        }
    );
}

$(document).ready(function(){
	en = new EchoNest(API_KEY);
	$.ajaxSetup( {cache: false});

	R.ready(function() {
            R.player.on("change:playingTrack", function(track) {
                if (track) {
                    var image = track.attributes.icon;
                    $("#rp-album-art").attr('src', image);
                    trackStartTime = now();
                } else {
                    playNextSong();
                }
            });
            R.player.on("change:playState", function(state) {
                if (state == R.player.PLAYSTATE_PAUSED) {
                    $("#rp-pause-play i").removeClass("icon-pause");
                    $("#rp-pause-play i").addClass("icon-play");
                }
                if (state == R.player.PLAYSTATE_PLAYING) {
                    $("#rp-pause-play i").removeClass("icon-play");
                    $("#rp-pause-play i").addClass("icon-pause");
                }
            });
            R.player.on("change:playingSource", function(track) {});
            $("#rp-pause-play").click(function() {
                R.player.togglePause();
            });
            $("#rp-next").click(function() {
                var delta = now() - trackStartTime;
                if (delta < maxTimeForSkip) {
                    skipSong();
                } else {
                    playNextSong();
                }
            });
    });



})