var API_KEY = 'R5BY7E9VFAU6GC05T';

var dashLine = '';

var offset = 0;
var limit = 10;

var query;
var type;

function buildArtistBlock(name, url, bio) {
  name = name ? name : 'no name';
  bio = bio ? bio : 'no description';
  return '<div class=\'artistListBlock\'><p class=\'artistListName\'>' +
          name + '</p><button onclick=\'alert(\'hello\');\' type=\'button\' class=\'btn btn-default artistListPlay\'>' +
          'play the artist</button>' + '<div class=\'artistListImage\'>' +
          '<img src=\'' + url + '\' class=\'artistListAvatar\'></div>' +
          '<div class=\'artistListBio\'><p class=\'artistListBioText\'>' +
          bio + '</p></div></div>';
}

function search(query, type, isAppend) {
  var args = {
    'start': offset,
    'results': limit,
    'bucket': ['images', 'biographies']
  };
  args[type] = query;
  en.artist.search(args, function(data) {
    if (!isAppend)
      $('#artistList').html('<h1>search result for ' + query + '</h1>');
    data.response.artists.forEach(function(artist, index) {
      var name = artist.name;
      var image_url = null;
      var bio = null;
      if (artist.images[0])
        image_url = artist.images[0].url;
      if (artist.biographies[0])
        bio = artist.biographies[0].text.substring(0, 200);
      $('#artistList').append(buildArtistBlock(name, image_url, bio));
    });
    offset = offset + limit;

  },
  function(err) {
    console.log(err);
  });
}

function searchArtist() {
  offset = 0;
  $('#loadMore').css('display', 'block');
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
	en = new EchoNest(API_KEY);
	$.ajaxSetup( {cache: false});
  en.artist.hottest(function(data) {
    for (var i = 0; i < 5; i++) {
      var name = data.response.artists[i].name;
      var bio = data.response.artists[i].biographies[0].text.substring(0, 200);
      var image_url = data.response.artists[i].images[0].url;
      $('#hotList').append(buildArtistBlock(name, image_url, bio));
    }
    
  },
  function(err) {
    console.log(err);
  });

});