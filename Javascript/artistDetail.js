var artist_id = 'spotify:artist:5l8VQNuIg0turYE1VtM9zV';
var artist_id_spotify = '5l8VQNuIg0turYE1VtM9zV';

var API_KEY = 'R5BY7E9VFAU6GC05T';

function getSource(url) {
	var path = url.split('/');
	return path[2]	;
}

$(document).ready(function(){
	en = new EchoNest(API_KEY);
	$.ajaxSetup( {cache: false});

    $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "https://api.spotify.com/v1/artists/"+artist_id_spotify,
      success: function(data) {
      	console.log(data);
        var artist_name = data.name;
        var image_url = data.images[2].url;
        document.getElementById('artist-name').innerHTML = artist_name;
        $('#artist-image').html('<img src="' +image_url+'" class="artist-avatar">');
      }
  	});


	$.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "https://api.spotify.com/v1/artists/"+artist_id_spotify+"/top-tracks?country=US",
      success: function(data) {
      	console.log('test trakc',data);

      }
  	});

	searchBlogs(artist_id);

	searchBiographies(artist_id);
    
	searchNews(artist_id);

});

function searchBlogs (artist_id) {
	 en.artist.blogs(
	 	artist_id, 
	 	function(data) {
      		console.log(data);
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
			console.log(data);
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
	      	console.log(data);
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



function searchSimilarArtists() {
	console.log('searchSimilarArtists');
}

function AddToProfile() {
	console.log('AddToProfile');
}

function AddToNew(){
	console.log('AddToNew');
}


