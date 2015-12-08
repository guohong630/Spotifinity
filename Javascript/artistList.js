var API_KEY = 'R5BY7E9VFAU6GC05T';

$(document).ready(function(){
	en = new EchoNest(API_KEY);
	$.ajaxSetup( {cache: false});

  en.artist.searchByName('adele', function(data) {
    console.log(data);
  }, function(err) {
    console.log(err);
  })
   //  $.ajax({
   //    type: "GET",
   //    dataType: "json",
   //    cache: false,
   //    url: "https://api.spotify.com/v1/artists/"+artist_id_spotify,
   //    success: function(data) {
   //    	console.log(data);
   //      var artist_name = data.name;
   //      var image_url = data.images[2].url;
   //      document.getElementById('artist-name').innerHTML = artist_name;
   //      $('#artist-image').html('<img src="' +image_url+'" class="artist-avatar">');
   //    }
  	// });

});