var catalogs = {
	"123" : "celia",
	"234" : "weixin"
}


// Check browser support
// if (typeof(Storage) !== "undefined") {
//     // Store
//     localStorage.setItem("lastname", "Smith");
//     // Retrieve
//     console.log(localStorage.getItem("lastname"))
//     document.getElementById("result").innerHTML = localStorage.getItem("lastname");
// } else {
//     document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
// }


function showProfile() {
	var side_bar = document.getElementById("side_bar");
	console.log(side_bar)
	for (var key in catalogs){
		console.log(key)
		var li = document.createElement("li");
		li.setAttribute("id", "list_profile_" + key);
		var profile = catalogs[key];
		a = document.createElement('a');
		a.setAttribute('id', key + "unique_number");
		a.innerHTML = profile;
		li.appendChild(a);
		side_bar.appendChild(li);
	}
	updateDistance();

	// var side_bar = document.getElementById("side_bar");
	// var li = document.createElement("li");
	// li.setAttribute("id", "list_profile");
	// a = document.createElement('a');
	// a.setAttribute('id', profile + "unique_number");
	// a.href = "javascript:showone(" + profile + "unique_number" + ")"; // Insted of calling setAttribute 
	// a.innerHTML = profile // <a>INNER_TEXT</a>
	// li.appendChild(a);
	// side_bar.appendChild(li);
	// updateDistance();
}

function showone(parameter) {
	console.log(parameter)
	editGroup(parameter.id.replace("unique_number", ""));
	makeTable();
	removeDuplicate = [];
	showOneGroup(parameter.id.replace("unique_number", ""));
}

function updateDistance() {
	var groupHeight = $("#side_bar").height();
	console.log(document.getElementById('side_bar2'))
	$("#side_bar2").css("margin-top", 20 + groupHeight);
}

function showArtist(){
	
}