//Listeners sur les déplacements de la carte
map.addListener("bounds_changed", function () {
	refreshMarkers();
});
map.addListener("dragend", function () {
	position = map.getCenter();
	addRestaurantPlace(position);
});

//update le statut des markers en fonction du nombre d'étoiles sélectionnées, de la cuisine, et de la zone affichée sur la carte
function refreshMarkers() {
	var tmp = $("#rate").val();
	var min = tmp.substring(0, 1);
	var max = tmp.substring(4, 5);
	//var selectValue = $("#cuisineSel").val();

	for (i = 0; i < markers.length; i++) {
		if (map.getBounds().contains(markers[i].getPosition())) {
			var rating = $("#rating" + markers[i].title).val();
			//var special = $("#cuisine" + markers[i].title).text();
			if ((rating < min || rating > max) /*|| (selectValue !== "allCuisine" && selectValue !== special)*/) {
				markers[i].setVisible(false);
				$(".accordeon:nth-child(" + (i + 1) + ")").addClass("d-none");
			} else {
				markers[i].setVisible(true);
				$(".accordeon:nth-child(" + (i + 1) + ")").removeClass("d-none");
			}
		} else {
			markers[i].setVisible(false);
			$(".accordeon:nth-child(" + (i + 1) + ")").addClass("d-none");
		}
	}
}

//Listener sur un double click pour ajouter les restaurants;
map.addListener("dblclick", function (event) {
	$('#addRestoModal form').unbind('submit').submit();
//Appel de l'API geocode pour remplir automatiquement l'adresse
	geocoder.geocode({ 'location': event.latLng }, function (results, status) {
		if (status === 'OK') {
			if (results[0]) {
				$('#restoAdresse').val(results[0].formatted_address);
			} else {
				window.alert("Pas de résultat");
			}
		} else {
			window.alert("Geocoder a échoué à cause de : " + status);
		}
	});
	$("#addRestoModal").modal("show");
	$("#addRestoModal form").submit(function () {
		//Récupération des données du modal remplis par l'utilisateur
		var nameTemp = $("#restoName").val();
		var adresseTemp = $("#restoAdresse").val();
		//var typeTemp = $("#restoType").val();
		var comTemp = $("#restoCom").val();
		var rateTemp = $("#restoRate").val();

		markerPosition = geocoder.geocode({ "address": adresseTemp }, function (results, status) {
			if (status == 'OK') {
				map.setCenter(results[0].geometry.location);
				//ajout du marker du nouveau restaurant
				addMarker(results[0].geometry.location, (indiceResto + 1).toString());
				sommeAvis = 1;
				tabComment = [comTemp];
				moyenneResto = rateTemp;
				//On passe en paramètres de la fonction addRestaurant() les données du modal + geocoder pour lat et long
				addResto({
					restaurantName: nameTemp,
					lat: results[0].geometry.location.lat(),
					long: results[0].geometry.location.lng(),
					//speciality: typeTemp,
					address: adresseTemp
				});
				//Si le type de cuisine n'existe pas, on le crée dans le sélecteur cuisine
				/*if (cuisine.indexOf(typeTemp) == -1) {
					cuisine.push(typeTemp);
					$("<option/>").val(cuisine[cuisine.length - 1]).text(cuisine[cuisine.length - 1]).appendTo($("#cuisineSel"))
				}*/
				//Activation du popover;
				$('[data-toggle="popover"]').popover();
				//Clear des champs du modal
				$("#restoName").val("");
				$("#restoAdresse").val("");
				//$("#restoType").val("");
				$("#restoCom").val("");
				$("#restoRate").val("");
			} else {
				alert("Geocode a échoué à cause de : " + status);
			}
		});
		$("#addRestoModal").modal("hide");
	});
});

//Appel à l'API Google Place
function addRestaurantPlace(position){
    var request = {
        location: position,
        radius:'1000',
        types: ['restaurant']
    };
    function callback(results, status){
        if(status == google.maps.places.PlacesServiceStatus.OK){
            $.each(results,function(){
				var placeID = {placeId: this.place_id};
				//getDetails permet de récupérer les données des restaurants trouvés
                service.getDetails(placeID, function(results, status){
                    if (status == google.maps.places.PlacesServiceStatus.OK){
                        var position = results.geometry.location; 
                        var doesItExist = false;
                        $.each(markers, function(index){
                            if(this.getPosition().equals(position)){
                                doesItExist = true;
                            }
                            if(((index+1) === markers.length) && (doesItExist === false)){
                                addRestoSearchPlace(position, results)
                            }
                        });
                    }
                });
            });
        }
    };
    service.nearbySearch(request, callback);
}