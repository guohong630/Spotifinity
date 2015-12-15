var API_KEY = 'R5BY7E9VFAU6GC05T';

var dashLine = '';

var offset = 0;
var limit = 10;

var bioLength = 200;
var query;
var type;

// function test(a, b) {
//   alert(a);
//   alert(b);
// }

function buildArtistBlock(name, url, bio, id, isSpotify) {
  name = name ? name : 'no name';
  bio = bio ? bio : 'No Description.';
  return '<div class=\'artistListBlock\'><p class=\'artistListName\'>' +
          name + '</p><button onclick=\"getArtistDetail(\'' + name + '\', \'' + id + '\', \'' + isSpotify + '\');\" type=\'button\' class=\'btn btn-default btn-no-border artistListPlay\'>' +
          'Play the Artist</button>' + '<div class=\'artistListImage\'>' +
          '<img src=\'' + url + '\' class=\'artistListAvatar\'></div>' +
          '<div class=\'artistListBio\'><p class=\'artistListBioText\'>' +
          bio + '</p></div></div>';
}

function search(query, type, isAppend) {
  if (type == "name") {
  $.ajax({
      type: "GET",
      dataType: "json",
      cache: false,
      url: "https://api.spotify.com/v1/search?q=" + query + "&type=artist&offset=" + offset + "&limit=" + limit,
      success: function(data) {
        console.log(data);
        offset = offset + limit;
        if (!isAppend)
          $('#artistList').html('<h2 class=\'header\'>search result for ' + query + '</h2>');
        data.artists.items.forEach(function(artist, index) {
          console.log(artist);
          var artist_id_spotify = artist.id;
          var image_url = null;
          if (artist.images[2])
            image_url = artist.images[2].url;
          en.artist.biographies(
            "spotify:artist:" + artist_id_spotify,
            function (biodata) {
              var bioarr = biodata.response.biographies;
              var bio_text;
              for (var i = 0; i < bioarr.length; i++) {
                if (bioarr[i].site === "wikipedia") {
                  bio_text = bioarr[i].text;
                }
              };
              if (bioarr[0] && !bio_text) {
                bio_text = bioarr[0].text;
              };
              if (bio_text.length > bioLength)
              bio_text = bio_text.substring(0, bioLength) + '...';
              $('#artistList').append(buildArtistBlock(artist.name, image_url, bio_text, artist.id, true));
            },
            function() {
              error("Trouble waiting for biographies");
              }
          );
        })
      }
  })
} else {
  var args = {
    'start': offset,
    'results': limit,
    'bucket': ['images', 'biographies']
  };
  args[type] = query;
  en.artist.search(args, function(data) {
    if (!isAppend)
      $('#artistList').html('<h2 class=\'header\'>search result for ' + query + '</h2>');
    data.response.artists.forEach(function(artist, index) {
      var name = artist.name;
      var image_url = null;
      var id = artist.id;
      if (artist.images[0])
        image_url = artist.images[0].url;
      var bio = null;
      var artist = data.response.artists[index];
      for (var j in artist.biographies) {
        if (artist.biographies[j].site == "wikipedia") {
          bio = artist.biographies[j].text;
          if (bio.length > bioLength)
          bio = bio.substring(0, bioLength) + '...';
        }
      }
      $('#artistList').append(buildArtistBlock(name, image_url, bio, id, false));
    });
    offset = offset + limit;
  },
  function(err) {
    console.log(err);
  });
  }
}

function searchArtist() {
  offset = 0;
  $('#loadMore').css('display', 'block');
  $('#hotList').css('display', 'none');
  query = $('#searchInput').val();
  var isName = document.getElementById("name_id").checked;
  var isStyle = document.getElementById("style_id").checked;
  var isMood = document.getElementById("mood_id").checked;
  if (isName) {
    type = 'name';
  } else if (isStyle) {
    type = 'style';
  } else if (isMood) {
    type = 'mood';
  }
  search(query, type, false);
}

function loadMore() {
  search(query, type, true); 
}

$(document).ready(function(){
  console.log('Test index ppppage');
  // $('#likeLabel').hide();
  // $('#control').hide();
  // $('#blogs').hide();
  // $('#help').hide();
  // $('.artist-block').hide();
  // $('#star-five').hide();
  $('#hong').hide();
	en = new EchoNest(API_KEY);
	$.ajaxSetup( {cache: false});
  en.artist.hottest(function(data) {
    for (var i = 0; i < 5; i++) {
      var name = data.response.artists[i].name;
      var id = data.response.artists[i].id;
      var bio = null;
      var artist = data.response.artists[i];
      for (var j in artist.biographies) {
        if (artist.biographies[j].site == "wikipedia") {
          bio = artist.biographies[j].text;
          console.log('length is ' + bio.length);
          if (bio.length > bioLength)
          bio = bio.substring(0, bioLength) + '...';
        }
      }
      var image_url = data.response.artists[i].images[0].url;
      $('#hotList').append(buildArtistBlock(name, image_url, bio, id, false));
    }
    
  },
  function(err) {
    console.log(err);
  });

});