function initPremierTest()
{
	$(".app").removeClass("loading");
	linksManager();
	
	// $.mobile.phonegapNavigationEnabled = true;
}

// Fonction permettant de changer de page
function linksManager()
{
	$(".app").on("touchstart", "[data-href]", function(event)
	{
		event.preventDefault();
		var link = $(this).attr("data-href");
		
		/*$.ajax(
		{
			url: link,
			type: "GET",
			dataType: "html",
			success: function(data)
			{
				var html = $.parseHTML(data);
				console.log($(html).find(".app").text());
				// console.log($(data).html());
				// console.log($(data).find(".app").length);
				
				if ($(data).find(".app").length == 1)
					$(".app").html($(data).find(".app").html());
				else
					$(".app").html($(data).html());
			},
			error: function(a, b, c)
			{
				alert(a +" || "+ b +" || "+ c);
			}
		});*/
		
		$(".app").load(link +" .app > *", function(response)
		{
			changePageManager(link);
		});
	});
}


// Fonction appelée lorsque l'on change de page. Permet d'appeler une fonction qui sera exécutée au chargement de la page.
function changePageManager(page)
{
	switch (page)
	{
		case "index.html":
			console.log("index");
		break;
		
		case "page.html":
			console.log("page");
			initGeolocation();
		break;
	}
}


// Fonction permettant de récupérer les coordonnées de l'utilisateur.
function initGeolocation()
{
	try
	{
		getAccurateCurrentPosition(onSuccessGeolocation, onErrorGeolocation, onProgressGeolocation, {desiredAccuracy: 20, maxWait: 2000});
	}
	catch (error)
	{
		navigator.geolocation.getCurrentPosition(onSuccessGeolocation, onErrorGeolocation);
	}
}

function onSuccessGeolocation(position)
{
	console.log("onSuccessGeolocation");
	console.log(position);
	// alert(position);
	
	navigator.vibrate(1000);
	
	$("#geolocation").text(position.coords.latitude +", "+ position.coords.longitude);
}

function onErrorGeolocation(error)
{
	alert("onErrorGeolocation");
	console.log(error);
	
	$("#geolocation").text(error);
}

function onProgressGeolocation(progress)
{
	console.log("onProgressGeolocation");
	console.log(progress);
	// alert(progress);
}