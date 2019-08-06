var map;
var geocoder;
var service;
//Initialisation de la map avec géolocalisation
function initMap() {
	map = new google.maps.Map(document.getElementById('mapSide'), {
		zoom: 15,
		center: defaultPosition,
		//génération d'un style spécifique pour la map, stocké dans util.js;
		styles: styleNight,
		disableDoubleClickZoom: true
	});
	//Geocoder = API pour retrouver les latLng à partir d'une adresse. Utilisée pour gérer l'adresse de l'ajout d'avis
	geocoder = new google.maps.Geocoder();
	service = new google.maps.places.PlacesService(map);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map.setCenter(pos);
			var marker = new google.maps.Marker({
				position: pos,
				map: map,
				title: 'Vous êtes ici',
				icon: iconPos
			});
		}, function () {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Gestion erreur si navigateur ne supporte pas la navigation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		var infoWindow = new google.maps.InfoWindow({ map: map });
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ?
			"Erreur : Le service de navigation a échoué." :
			"Erreur : Votre navigateur ne supporte pas la géolocalisation.");
	}
};

//Création d'un array markers pour simplifier l'ajout
var markers = new Array();

function addMarker(markerPosition, title) {
	var marker = new google.maps.Marker({
		position: markerPosition,
		title: title,
		map: map,
		icon: iconMarker
	});
	marker.addListener("click", function() {
		map.setCenter(marker.getPosition());
		$("#heading"+title+" button:first-child").click();
	})
	markers.push(marker);
};

