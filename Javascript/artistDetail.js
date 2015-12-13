var artist_id = 'spotify:artist:5l8VQNuIg0turYE1VtM9zV';
var artist_id_spotify_test = '5l8VQNuIg0turYE1VtM9zV';
var artist_id_spotify = 'AR7J9AP1187FB5BD64';
var liked = false;
var artist_name="adele";
var API_KEY = 'R5BY7E9VFAU6GC05T';

var artist = {
	"123" : "celia",
	"234" : "weixin"
}


localStorage.setItem("staredArtist", JSON.stringify(artist));

var catalogs = {
	CAERBWP1518E24EDE3: 'British Pop Profile',
	whgedjwe: 'wedewd'
};

function getSource(url) {
	var path = url.split('/');
	return path[2]	;
}

// $(document).ready(
// 	getArtistDetail(artist_id_spotify_test);
// );

// $(document).ready(function() 
function getArtistDetail(name, artist_id_spotify) {	
	console.log('test integrate', artist_id_spotify);
	$('#searchBox').hide();
	$('#artistList').hide();
	$('#hotList').hide();
	$('#likeLabel').show();
  	$('#control').show();
  	$('#blogs').show();
  	$('#help').show();
  	$('.artist-block').show();
  	$('#star-five').show();
	en = new EchoNest(API_KEY);
	$.ajaxSetup( {cache: false});

	$.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "https://api.spotify.com/v1/search?q="+name+"&type=artist",
      success: function(data) {
      	console.log('artists name', data);
      	artist_id_spotify = data.artists.items[0].id;
      	var image_url = data.artists.items[0].images[2].url;
        document.getElementById('artist-name').innerHTML = name;
        $('#artist-image').html('<img src="' +image_url+'" class="artist-avatar">');
        $.ajax({
	      type: "GET",
	      dataType: "json",
	      cache: false,
	      url: "https://api.spotify.com/v1/artists/"+artist_id_spotify+"/top-tracks?country=US",
	      success: function(data) {
	 		console.log('top-tracks', data);
	 		var trackArr = data.tracks;
	 		var songs_uri = 'spotify:trackset:PREFEREDTITLE:';
	 		for (var i = 0; i < 4 && i < trackArr.length; i++) {
	 			var uri = trackArr[i].uri.split(':')[2];
	 			if (i === 0) {
	 				songs_uri = songs_uri + uri; 
	 			} else {
	 				songs_uri = songs_uri +','+ uri;
	 			}
	 		}

	 		$('#playerButton').html(
	 			'<iframe src="https://embed.spotify.com/?uri='
	 			+songs_uri
	 			+'" frameborder="0" width="250px" height="80px" allowtransparency="true"></iframe>'
	 			// +'<div id="follower">'
	 			// +'<iframe src="https://embed.spotify.com/follow/1/?uri=spotify:artist:'
	    //   		+artist_id_spotify
	    //   		+'&size=detail&theme=light" width="300" height="56" scrolling="no" frameborder="0"' 
	    //   		+'style="border:none; overflow:hidden;" allowtransparency="true"></iframe></div>'  
	 		);
	      }
	  	});
      }
  	});

   //  $.ajax({
   //    type: "GET",
   //    dataType: "json",
   //    cache: false,
   //    url: "https://api.spotify.com/v1/artists/"+artist_id_spotify,
   //    success: function(data) {
   //    	console.log('artists', data);
   //    	current_artist_name = artist_name;
   //      var artist_name = data.name;
   //      var image_url = data.images[2].url;
   //      document.getElementById('artist-name').innerHTML = artist_name;
   //      $('#artist-image').html('<img src="' +image_url+'" class="artist-avatar">');
   //    }
  	// });
	console.log('artist_id_spotify', artist_id_spotify);
	
	
	artist_id = artist_id_spotify;

	searchBlogs(artist_id);

	searchBiographies(artist_id);
    
	searchNews(artist_id);

	displayLikeStar(name, artist_id_spotify);

	$('[data-toggle="popover"]').popover(); 

	$('body').on('click', function (e) {
        if ($(e.target).data('toggle') !== 'popover'
            && $(e.target).parents('[data-toggle="popover"]').length === 0
            && $(e.target).parents('.popover.in').length === 0) { 
            $('[data-toggle="popover"]').popover('hide');
        }
    });
}
// );

function searchBlogs (artist_id) {
	 en.artist.blogs(
	 	artist_id, 
	 	function(data) {
      		console.log('blogs',data);
	      	var blogarr = data.response.blogs;
	      	for (var i = 0; i < 4; i++) {
	      		$('#blog' + i).html(
	      			'<td><p class="blog-title">' +blogarr[i].name+'</p></td>' +
	      			'<td><a class="blog-link" target="_blank" href="'+blogarr[i].url+'">'+'Read More'+'</a></td>'
	      		);
	      		$('#blog_list').append('<tr id="blog' + (i + 1) +'"></tr>');
	      	}
      	}, 
      	function() {
			error("Trouble waiting for blogs");
	  	}
	 );
}

function searchBiographies (artist_id) {
	en.artist.biographies(
		artist_id,
		function (data) {
			console.log('bio', data);
			var bioarr = data.response.biographies;
			var bio_text;
			var bio_url;
			for (var i = 0; i < bioarr.length; i++) {
				if (bioarr[i].site === "wikipedia") {
					bio_text = bioarr[i].text;
					bio_url = bioarr[i].url;
				}
			}
			if (!bio_text) {
				bio_text = bioarr[0].text;
				bio_url = bioarr[0].url;
			}
			$('#artist-bio').html(
				'<p class="bio-text"> '+bio_text + '</p>'+
				'<p class="ellipsis">...</p>'+
				'<a id="bio-link" target="_blank" href="'+bio_url+'">'+'Read More'+'</a>'
			);
		},
		function() {
			error("Trouble waiting for biographies");
	  	}
	);
}

function searchNews(artist_id) {
	en.artist.news(
	 	artist_id, 
	 	function(data) {
	      	console.log('news',data);
	      	var news = data.response.news;
	      	$('news-section').empty();
	      	for (var i = 0; i < 9; i++) {
	      		var title = news[i].name;
	      		var summary = news[i].summary;
	      		var news_url = news[i].url;
	      		var source = getSource(news_url);
	      		$('.news-section').append('<div class="news-block" id="news'+i+'">'); 
	      		$('#news'+i).html( 
	            	'<p class="news-title">' +title+ '</p>'+
	            	'<p class="news-summary">' +summary+ '</p>' +
	            	'<a class="news-link" target="_blank" href="' + news_url+'">' + source+ '</a>' 
	            );
	      	}
      	}, 
      	function() {
			error("Trouble waiting for blogs");
	  	}
	 );
}

function displayLikeStar(name, artist_id_spotify) {
	if (liked) {
		console.log('liked');
		$('#star-five').html('<img src="images/1449708334_star.png" onclick="changeLikeState(\'' + artist_id_spotify + '\', \'' + name + '\')">');
	} else {
		console.log('unliked');
		$('#star-five').html('<img src="images/emptyStar1.png" onclick="changeLikeState(\'' + artist_id_spotify + '\', \'' + name + '\')">');
	}
}

function changeLikeState(artist_id, name) {
	console.log(name, artist_id, liked);
	if (liked) {
		var starredArtists = JSON.parse(localStorage.getItem("staredArtist"));
		for (var artist in starredArtists) {
			console.log(artist);
			if (artist === artist_id) {
				delete starredArtists[artist];
			}
		}
		localStorage.setItem("staredArtist", JSON.stringify(starredArtists));
		console.log(localStorage.getItem("staredArtist"));
	} else {
		var starredArtists = JSON.parse(localStorage.getItem("staredArtist"));
		console.log(starredArtists);
		starredArtists[artist_id] = name;
		localStorage.setItem("staredArtist", JSON.stringify(starredArtists));
		console.log(localStorage.getItem("staredArtist"));
	}
	liked = !liked;
	console.log('after change',liked);
	displayLikeStar(name, artist_id_spotify);
	showArtist();
}

function searchSimilarArtists() {
	console.log('searchSimilarArtists');
}

function AddToProfile() {
	$('#profileList').empty();
	for (var cata in catalogs) {
		$('#profileList').append('<div class="radio"><label><input type="radio" name="optradio" value="'+ cata+'">'+catalogs[cata]+'</label></div>');
	}
}

function AddToNew(){
	console.log('AddToNew');
}

function addToCatalog(){
	var selected_value = $('input[name=optradio]:checked').val();
	updateTasteProfileInArtistPage(selected_value, current_artist_name);
}


