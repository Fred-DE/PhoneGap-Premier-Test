var durationTransitionPages;

var lastMessage;

var currentLanguage;
var translations;


function initPremierTest()
{
	languageManager();
}

function loadTranslations()
{
	$.ajax(
	{
		url: "locale/"+ currentLanguage +".json",
		dataType: "json",
		success: function(data)
		{
			// console.log(data);
			translations = data;
		},
		error: function (a, b, c)
		{
			// alert("error");
		},
		complete: function()
		{
			// translate("#window");
			translate("#window");
			
			launchPremierTest();
		}
	});
	
}

function launchPremierTest()
{
	// alert(currentLanguage);
	
	// $("[data-href='geoloc.html']").text("qmldskfjqmlsfj");
	
	$(".app").removeClass("loading");
	
	durationTransitionPages = $(".app").css("transition-duration");
	durationTransitionPages = durationTransitionPages.substring(0, durationTransitionPages.length-1);
	durationTransitionPages *= 1000;
	
	linksManager();
	
	/*$("#tmp").on("touchstart", function()
	{
		$("[data-href='geoloc.html']").text("qmldskfjqmlsfj");
	});*/
	
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
		
		// $(".app").load(link +" .app > *", function(response)
		$(".new-page").load(link +" .app > *", function(response)
		{
			$(".app, .new-page").addClass("transition");
			
			translate(".new-page");
			
			var timerTransitionPages = setTimeout(function()
			{
				clearTimeout(timerTransitionPages);
				
				$(".app:not(.new-page)").addClass("tmp-page");
				$(".app.new-page").removeClass("new-page");
				$(".app.tmp-page").addClass("new-page").removeClass("tmp-page");
				
				
				$(".app, .new-page").removeClass("transition");
				
				changePageManager(link);
				
			}, durationTransitionPages);
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
		
		case "geoloc.html":
			console.log("geoloc");
			initGeolocation();
		break;
		
		case "server.html":
			console.log("server");
			initPhpCall();
		break;
		
		case "socket.html":
			console.log("socket");
			initWebsocket();
		break;
		
		default:
			alert("Not found");
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


function initPhpCall()
{
	// checkConnection();

	$.ajax(
	{
		url: "http://v1847.phpnet.fr/tests/phonegap/premiertest/testcall.php",
		dataType: "json",
		success: function(data)
		{
			if (data.status == "success")
			{
				var result = "";
				for (var i = 0; i < data.data.length; i++)
				{
					result += data.data[i];
				}
				
				$("#server").text(result);
			}
			else
			{
				$("#server").text("Error.");
			}
		},
		error: function (a, b, c)
		{
			console.log(a +" || "+ b +" || "+ c);
			alert(a +" || "+ b +" || "+ c);
			
			$("#server").text("Error: "+ a +" || "+ b +" || "+ c);
		}
	});
}


function checkConnection()
{
	console.log("checkConnection");
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}



function initWebsocket()
{
	var socket = null;
	var host = "ws://v1847.phpnet.fr:9000/tests/websocket2/testwebsock.php";
	
	try
	{
		socket = new WebSocket(host);

		socket.onopen = function(msg)
		{ 
			console.log("Welcome - status "+ this.readyState);
			$("#status").text("Welcome - status "+ this.readyState);
		};
		
		socket.onmessage = function(msg)
		{
			lastMessage = msg.data;
			
			showLastMessage(lastMessage);
		};
		
		socket.onclose = function(msg)
		{ 
			console.log("Disconnected - status "+ this.readyState);
			$("#status").text("Disconnected - status "+ this.readyState);
		};
		
		$("#send").on("touchstart", function()
		{
			socket.send
			(
				JSON.stringify(
				{
					type: "message",
					message: $("input[name='message']").val()
				})
			);
		});
		
		$("#receive").on("touchstart", function()
		{
			showLastMessage(lastMessage);
		});
		
		/*$("#quit").on("touchstart", function()
		{
			if (socket != null)
			{
				// log("Goodbye!");
				socket.close();
				socket = null;
			}
		});*/
	}
	catch (ex)
	{ 
		console.log(ex); 
	}
}

function showLastMessage(message)
{
	console.log(message);
	console.log("Received: "+ message);
	
	
	$("#message").text(message);
}




function languageManager()
{
	try
	{
		navigator.globalization.getPreferredLanguage(onSuccessPreferredLanguage, onErrorPreferredLanguage);
	}
	catch (error)
	{
		currentLanguage = "en";
		
		loadTranslations();
	}
}

function onSuccessPreferredLanguage(language)
{
	currentLanguage = language.value.substring(0, 2);
	
	loadTranslations();
}

function onErrorPreferredLanguage()
{
	currentLanguage = "en";
	
	loadTranslations();
}


function translate(element)
{
	$(element).find("[data-trn]").each(function()
	{
		// console.log($(this).attr("data-trn"));
		// console.log(translations[$(this).attr("data-trn")]);
		// console.log("TRANSLATE");
		// console.log(translations[$(this).attr("data-trn")]);
		
		if (typeof translations != "undefined" && translations.hasOwnProperty($(this).attr("data-trn")))
			$(this).text(translations[$(this).attr("data-trn")]);
		else
			$(this).text($(this).attr("data-trn"));
		
		$(this).css({"transform": "translate3d(0, 0, 0)"}); // Pour être sûr que l'élément s'affichera bien correctement
	});
	
	// document.getElementById("window").style.webkitTransform = 'scale(1)';
	
	/*var n = document.createTextNode(' ');
	$(element).append(n);
	var timerRefresh = setTimeout(function()
	{
		clearTimeout(timerRefresh);
		
		n.parentNode.removeChild(n);
	}, 10000);*/
	
	/*$(element).append('<div id="data-trn-tmp">lala</div>');
	var timerRefresh = setTimeout(function()
	{
		clearTimeout(timerRefresh);
		
		$("#data-trn-tmp").remove();
	}, 10000);*/
}