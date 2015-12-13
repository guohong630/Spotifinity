var artist = {
	"123" : "celia"
}
localStorage.setItem("staredArtist", JSON.stringify(artist));

function showProfile() {
	var retrievedObject = localStorage.getItem("profiles");
	var catalogs = JSON.parse(retrievedObject);
	var side_bar = document.getElementById("side_bar");
	console.log(side_bar)
	for (var key in catalogs){
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
	}
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
	var side_bar = document.getElementById("side_bar2");
	console.log(side_bar)
	for (var key in staredArtist){
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
	}
}
