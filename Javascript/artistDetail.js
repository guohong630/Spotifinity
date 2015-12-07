var artist_id = '5l8VQNuIg0turYE1VtM9zV';
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
      url: "https://api.spotify.com/v1/artists/"+artist_id,
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
      url:"http://developer.echonest.com/api/v4/artist/blogs?api_key="+API_KEY+"&id=spotify:artist:"+artist_id,
      success: searchblogs(data),
  	});

  	$.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url:"http://developer.echonest.com/api/v4/artist/biographies?api_key="+API_KEY+"&id=spotify:artist:"+artist_id,
      success: 

  	});
    


    $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url:"http://developer.echonest.com/api/v4/artist/news?api_key="+API_KEY+"&id=spotify:artist:"+artist_id+"&format=json",
      success: function(data) {
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
      }
  	});

    // '<div class="row media-titl<p class="username">'+username+
    //          '</p> <button class="btn btn-default addToGroup" onclick="addToGroup(this)" value="'+username+'">Add to Group</button> <p class="create-time">'
    //          +datetime+'</p> </div><div class="row media-image"  align="center"><img src="'+ 
    //          image_url+'" padding-top="70px" class="image"></div><div class="row media-legend" align="center"><p class="likes"> Likes '+
    //          likes+'</p> <a target="_blank" href="'+permulink+'" class="btn btn-default media-see-btn">See it on instagram</a> <br> <p class="caption">' +caption+" "+ tags+'</p> </div>')

 //    en.artist.images(artist_id, function(data) {
	// 	console.log(data);
	// }, function(data) {
	// 	error("Trouble waiting for images");
	// });


});

function searchblogs (data) {
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
	$('#artist-bio').html('<p class="bio-text"> '+bio_text + '</p>'+
		'<p class="ellipsis">...</p>'+
		'<a id="bio-link" target="_blank" href="'+bio_url+'">'+'Read More'+'</a>'
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


