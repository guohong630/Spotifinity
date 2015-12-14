// localStorage.setItem("profiles", JSON.stringify(catalogs));


// var addedArtist = {
// 	// "123" : "celia",
// 	// "234" : "weixin",
// 	// "AR7J9AP1187FB5BD64":"Adele"
// }

// localStorage.setItem("addedArtist", JSON.stringify(addedArtist));

// var artist = {
// 	"123" : "celia",
// 	"234" : "weixin"
// }

// localStorage.setItem("staredArtist", JSON.stringify(artist));

var catalogs = {};


function showProfile() {
	$('#create-tp-button').click(createTasteProfile);
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
			a.setAttribute('class', "list_link");
			a.href = "javascript:showTasteProfile('" + key + "', '" + profile +"')";
			a.innerHTML = profile;
			li.appendChild(a);
			side_bar.appendChild(li);
			addedCatalogs[key] = profile;
		}
	}
	for (var key in addedCatalogs){
		if (catalogs[key] == null){
			var element = document.getElementById("list_artist_" + key);
			if (element != null){
				element.parentNode.removeChild(element);
				delete addedCatalogs[key];
			}
		}
	}

	localStorage.setItem("addedProfile", JSON.stringify(addedCatalogs));
	localStorage.setItem("profiles", JSON.stringify(catalogs));
	updateDistance();
}

function updateDistance() {
	var groupHeight = $("#side_bar").height();
	$("#side_bar2").css("margin-top", 20 + groupHeight);
}

function showArtist(){
	var retrievedObject = localStorage.getItem("staredArtist");
	var staredArtist = JSON.parse(retrievedObject);
	var addedObject = localStorage.getItem("addedArtist");
	var addedArtist = JSON.parse(addedObject);

	var side_bar = document.getElementById("side_bar2");
	for (var key in staredArtist){
		if (addedArtist[key] == null) {
			var li = document.createElement("li");
			li.setAttribute("id", "list_artist_" + key);
			var artist = staredArtist[key];
			a = document.createElement('a');
			a.setAttribute('id', key + "_unique_number");
			a.setAttribute('class', "list_link");
			a.href = "javascript:showStaredArtisit(" + key + ", " + artist +")";
			a.innerHTML = artist;
			li.appendChild(a);
			side_bar.appendChild(li);
			addedArtist[key] = artist;
		}
	}

	for (var key in addedArtist){
		if (staredArtist[key] == null){
			console.log("list_artist_" + key)
			var element = document.getElementById("list_artist_" + key);
			console.log(element)
			if (element != null){
				element.parentNode.removeChild(element);
				delete addedArtist[key];
			}
		}
	}
	localStorage.setItem("staredArtist", JSON.stringify(staredArtist));
	localStorage.setItem("addedArtist", JSON.stringify(addedArtist));
	console.log("added artist: " + localStorage.getItem("addedArtist"))
	console.log("stared artist: " + localStorage.getItem("staredArtist"))
}
