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
		a.setAttribute('id', key + "unique_number");
		a.href = "javascript:showTasteProfile(" + key + ", " + catalogs[key] +")";
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
	
}