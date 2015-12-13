var addedProfile = {
	"123" : "celia"
}
localStorage.setItem("addedProfile", JSON.stringify(addedProfile));

var catalogs = {
	"123" : "celia",
	"234" : "weixin"
}

localStorage.setItem("profiles", JSON.stringify(catalogs));


var addedArtist = {
	"123" : "celia"
}

localStorage.setItem("addedArtist", JSON.stringify(addedArtist));

var artist = {
	"123" : "celia",
	"234" : "weixin"
}

localStorage.setItem("staredArtist", JSON.stringify(artist));



function showProfile() {
	var retrievedObject = localStorage.getItem("profiles");
	var catalogs = JSON.parse(retrievedObject);
	var addedObject = localStorage.getItem("addedProfile");
	var addedCatalogs = JSON.parse(addedObject);
	var side_bar = document.getElementById("side_bar");

	console.log(side_bar)
	for (var key in catalogs){
		if (addedCatalogs[key] == null){
			console.log(key)
			var li = document.createElement("li");
			li.setAttribute("id", "list_profile_" + key);
			var profile = catalogs[key];
			a = document.createElement('a');
			a.setAttribute('id', key + "_unique_number");
			a.href = "javascript:showTasteProfile(" + key + ", " + profile +")";
			a.innerHTML = profile;
			li.appendChild(a);
			side_bar.appendChild(li);
			addedCatalogs[key] = profile;
		}
	}
	localStorage.setItem("addedProfile", JSON.stringify(addedCatalogs));
	updateDistance();
}

function updateDistance() {
	var groupHeight = $("#side_bar").height();
	console.log(document.getElementById('side_bar2'))
	$("#side_bar2").css("margin-top", 20 + groupHeight);
}

function showArtist(){
	var retrievedObject = localStorage.getItem("staredArtist");
	var staredArtist = JSON.parse(retrievedObject);
	var addedObject = localStorage.getItem("addedArtist");
	var addedArtist = JSON.parse(addedObject);

	var side_bar = document.getElementById("side_bar2");
	console.log(side_bar)
	for (var key in staredArtist){
		if (addedArtist[key] == null) {
			console.log(key) 
			var li = document.createElement("li");
			li.setAttribute("id", "list_artist_" + key);
			var artist = staredArtist[key];
			a = document.createElement('a');
			a.setAttribute('id', key + "_unique_number");
			a.href = "javascript:showStaredArtisit(" + key + ", " + artist +")";
			a.innerHTML = artist;
			li.appendChild(a);
			side_bar.appendChild(li);
			addedArtist[key] = artist;
		}
	}
	localStorage.setItem("addedArtist", JSON.stringify(addedArtist));
}
