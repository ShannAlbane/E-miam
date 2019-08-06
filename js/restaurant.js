//Créer un nouveau collapse card dans la liste des restaurants
function addResto(thatResto) {
	//incrémentation de l'id des restaurants
	var i = indiceResto;
	indiceResto++;
	//On crée toutes les balises qui sont demandées par le collapse de Bootstrap
	var accordeon = $("<div/>").addClass("accordeon col-lg-4").attr("id", "heading" + indiceResto).appendTo($(".accordion"));
	var accorHead = $("<h2/>").addClass("mb-0").appendTo(accordeon);
	//On insère dans buttonHead ce qui va être visible dans la liste et rendre l'ensemble clickable
	var buttonHead = $("<button/>").addClass("btn btn-link").attr("type", "button").attr("data-toggle", "collapse").attr("data-target", "#collapse" + indiceResto).attr("aria-expanded", "true").attr("aria-controls", "collapse" + thatResto.restaurantName).appendTo(accorHead);
	var photo = $("<div/>").addClass("col-lg-4").appendTo(buttonHead);
	$("<img />").attr("alt", "Street View de " + indiceResto).attr("src", "https://maps.googleapis.com/maps/api/streetview?size=100x100&location=" + thatResto.lat + "," + thatResto.long + "&heading=-13&fov=90&pitch=1&key=AIzaSyB48K7MnLGjHOLRg8YlZVgGg2kIj2zNrXU").appendTo(photo);
	$("<div/>").text(thatResto.restaurantName).appendTo(buttonHead);
	$("<div/>").addClass("restoRatings").appendTo(buttonHead);
	//rateYo est l'API pour gérer les étoiles et le rating
	$(".restoRatings").rateYo({
		starWidth: "20px",
		readOnly: true,
		rating: moyenneResto
	});
	$("<div/>").addClass("totalResto").text("(" + tabComment.length + " avis)").appendTo(buttonHead);

	//Body du collapse, on y intègre toutes les infos restantes + les deux buttons pour gérer les avis
	var divContenu = $("<div/>").attr("id", "collapse" + indiceResto).attr("aria-labelledby", "heading" + indiceResto).attr("data-parent", "#accordionExample").addClass("col-lg-12 collapse").insertAfter(accorHead);
	var contenu = $("<div/>").attr("class", "card-body").appendTo(divContenu);
	//$("<div/>").addClass("speciality").attr("id", "cuisine" + indiceResto).text(thatResto.speciality).appendTo(contenu);
	$("<div/>").text(thatResto.address).appendTo(contenu);
	$("<input/>").attr("type", "hidden").attr("id", "rating" + indiceResto).val(moyenneResto).appendTo(contenu);
	$("<button/>").addClass("btn btn-lg btn-danger affComment").attr("type", "button").attr("data-toggle", "popover").attr("data-html", "true").attr("data-trigger", "focus").attr("data-content", " - " + tabComment.join(sepaComment)).text("Voir les avis").appendTo(contenu);
	$("<button/>").addClass("btn btn-primary").attr("id", indiceResto).attr("onClick", "$('#restoId').val(" + indiceResto + ");").attr("type", "button").attr("data-toggle", "modal").attr("data-target", "#saisieAvis").text("Ajouter un avis").appendTo(contenu);
	$('[data-toggle="popover"]').popover();

	accordeon.on('show.bs.collapse', function() {
		markers[i].setIcon(iconSelMarker);
	});

	accordeon.on('hide.bs.collapse', function() {
		markers[i].setIcon(iconMarker);
	});
};

//traite les données récupérées par l'API Google Place
function addRestoSearchPlace(position, results) {
	var restaurantName = results.name;
	var address = (results.formatted_address).slice(0, -8);
	var lat = results.geometry.location.lat();
	var long = results.geometry.location.lng();
	moyenneResto = results.rating;
	var nbMarker = (indiceResto + 1).toString();
	//Ajout le marker sur la Google Map
	addMarker(results.geometry.location, (indiceResto + 1).toString());
	//traite les commentaires et les insère dans le tableau
	if ($.type(results.reviews) === "array") {
		tabComment = [];
		$.each(results.reviews, function () {
			var comment = this.text;
			tabComment.push(comment);
		});
	};
	//Ajoute le resto dans la liste
	addResto({
		restaurantName,
		lat,
		long,
		//speciality: "typeTemp",
		address
	});
	refreshMarkers();
};
//on set les infos du slider, qui permet de filtrer sur le nombre d'étoiles
$("#slider-range").slider({
	range: true,
	min: 0,
	max: 5,
	values: [0, 5],
	slide: function (event, ui) {
		$("#rate").val(ui.values[0] + " à " + ui.values[1]);
		refreshMarkers();
	}
});
$("#rate").val($("#slider-range").slider("values", 0) +
	" à " + $("#slider-range").slider("values", 1));

function addComment() {
	//Récupération des valeurs
	var restoId = $("#restoId").val();
	var insertAvis = $("#messageComment").val();
	var insertNote = Number($("#addRatings").val());
	var temp = $("#heading"+ restoId+" .affComment").attr("data-content");
	var tabCommentTemp = temp.substring(3).split(sepaComment);
	tabCommentTemp.push(insertAvis);
	$("#heading"+ restoId+" .affComment").attr("data-content"," - " +tabCommentTemp.join(sepaComment));

	$("#heading"+ restoId+" .totalResto").text("(" + tabCommentTemp.length + " avis)");

	var moyTemp = Number($("#rating"+restoId).val());
	var calculMoy = (moyTemp * (tabCommentTemp.length - 1) + insertNote) / tabCommentTemp.length;
	$("#heading"+ restoId+" .restoRatings").rateYo("rating", calculMoy);
	$("#rating" + restoId).val(calculMoy);
	//Vider le textarea;
	$("#messageComment").val("");
	$("#addRatings").val("");	
};

