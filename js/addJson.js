$.getJSON(restoJson, function(data){ 
    $.each(data, function(index){
        //traitement marker sur GoogleMaps
        //toString car API réclame un string
        var nbMarker = (indiceResto+1).toString();
        var markerPosition = {lat: this.lat, lng: this.long};
        addMarker(markerPosition, nbMarker);
        var somRatings = 0;
		//Traitement du nombre + moyenne d'étoiles  + ajout des commentaires dans un array 
        $.each(this.ratings, function(){ 
            somRatings = this.stars + somRatings; 
            tabComment.push(this.comment);
        });
        //Calcul de la moyenne
        var moyRatings = somRatings/this.ratings.length;
        sommeAvis = this.ratings.length;
        moyenneResto = moyRatings;
		addResto(this);
		//array remis à 0 pour le resto suivant
        tabComment = [];

		//traitement de la cuisine pour n'avoir qu'une seule fois la spécialité dans le select
        /*if (cuisine.indexOf(this.speciality) == -1) {
            cuisine.push(this.speciality);
        }*/
	});
	//ajout de la spécialité dans le filtre cuisine html
    /*for (i = 0; i< cuisine.length ; i++) {
        $("<option/>").val(cuisine[i]).text(cuisine[i]).appendTo($("#cuisineSel"));
    }*/
});
