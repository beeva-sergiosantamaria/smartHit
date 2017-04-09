
var camera, scene, renderer, JSONface, WomanJSONface, OBJface, mainClock,
controls, mixer, mixerGate, clip, recognition, imageToSend, 
newUserId, htracker, particleGroup, socket, faceDistance, audio, refreshIntervalId,
	trackerActive = true,
	width = window.innerWidth, 
	height = window.innerHeight,
	characterLightsRotateSpeed = 0.06,
	characterSpeedWalk = 1;

var animation;
var action = {};
var actionGate = {};

var scenario = new THREE.Object3D();
scenario.name = 'scenario';
var scenarioLights = new THREE.Object3D();
scenarioLights.name = 'scenarioLights';
var character = new THREE.Object3D();
character.name = 'character';
var characterLights = new THREE.Object3D();
characterLights.name = 'characterLights';

var characterAdvance = false;		

var userFacesArray = []; 

var gravityForce = 10;

var protagonist = {
	name: '',
	id: '',
	timeStamp: ''
};	

var fxSounds = {};
    fxSounds["wind"] = new Audio("sounds/wind.mp3");
    fxSounds["wind"].loop = true;
    fxSounds["wind"].volume = 0.5;

    fxSounds["spray"] = new Audio("sounds/aura.mp3");
    fxSounds["spray"].loop = true;
    fxSounds["spray"].volume = 0.5;

    fxSounds["monster"] = new Audio("sounds/sonidoInquietanteCadenas.mp3");
    fxSounds["monster"].loop = true;
    fxSounds["monster"].volume = 0.1;

    fxSounds["monstAcierto"] = new Audio("sounds/sonidoInquietante.mp3");
    fxSounds["monstAcierto"].loop = true;
    fxSounds["monstAcierto"].volume = 0.4;

    fxSounds["explosion"] = new Audio("sounds/explosion.mp3");
    fxSounds["explosion"].volume = 1;

    fxSounds["laugh"] = new Audio("sounds/laught.mp3");
    fxSounds["laugh"].volume = 1;

var videoInput = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');

//-------status controls ------	

var faceDetectOn = true;
var voiceRecognitionIsNeeded = false;
var functionality = 'welcome'; //'welcome', 'weather', 'game'

//-----------------------------	

var clock = new THREE.Clock();
var lookYou = new THREE.Vector2();

var manager = new THREE.LoadingManager();

var moment = new Date().getHours();
var registerTime = new Date(); 

var randomColors = [
					{ 'colour': 'verde', 'valueRGB': {'r': 0,'g': 255,'b': 0},		'valueHEX': 0x00ff00 },
					{ 'colour': 'rojo',  'valueRGB': {'r': 255,'g': 0,'b': 0},		'valueHEX': 0xff0000 },
					{ 'colour': 'azul',  'valueRGB': {'r': 0,'g': 0,'b': 255},		'valueHEX': 0x0000ff },
					{ 'colour': 'amarillo','valueRGB': {'r': 255,'g': 255,'b': 0},	'valueHEX': 0xffff00 },
					{ 'colour': 'naranja','valueRGB': {'r': 255,'g': 140,'b': 0},	'valueHEX': 0xff8c00 }];

var currentColor = 'white';					

if( moment >= 7 && moment < 14 ) var momentSpeech = 'buenos dias';
else if( moment >= 14 && moment < 20 ) var momentSpeech = 'buenas tardes';
else var momentSpeech = 'buenas noches';

$( document ).ready(function() {
	getUserFaces();
});

function getUserFaces(){
	 $.ajax({
        url: 'http://ec2-52-31-73-229.eu-west-1.compute.amazonaws.com:3000/faces/faceCollection',
        dataType: "jsonp",
        success: function(data) {
        	console.log('datos almacenados ya recogidos!');
        	$.each(data, function(index, element){
        		if( element['timeMoment'] != 'inicial' ) {
	        		var diferencia = (( registerTime ) - ( new Date( element['timeMoment'] ) )) / ( 60 * 60 * 24 * 1000 );
	        		console.log('diferencia: ', diferencia,' - ', element.name);
            		if ( diferencia < 1 ) userFacesArray.push(element);
            		else {
            			/*$.ajax({
						    url: 'http://ec2-52-31-73-229.eu-west-1.compute.amazonaws.com:3000/faces/faceCollection',
						    type: 'DELETE',
						    data: JSON.stringify( { name: element.name } ),
						    success: function(result) {
						        console.log('se ha borrado correctamente'); 
						    }
						});*/
            		}
        		}
        	});
			initRender();
			animate();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function initRender() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true, alpha: true } );
	renderer.sortObjects = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	renderer.setClearColor( 0xffffff, 0 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setViewport( 0,0,width, height );
	renderer.getMaxAnisotropy();

	var container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 10;
	
	scene.add(camera);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.70;
	controls.enableZoom = true;
	controls.target.set( 0, 0, 0 );
	controls.enabled = true;

    ambientLight = new THREE.AmbientLight( 0x33aaff, 0.6 );
    ambientLight.position.set( 0, 0, 0 );
    scene.add(ambientLight);

	window.addEventListener( 'resize', onWindowResize, false );

	initTracker();
	speechRecognitionOn();
}

function initTracker(){
	console.log('inicia init tracker');
	htracker = new headtrackr.Tracker({
		ui: false,
		debug: false
	});
	htracker.init(videoInput, canvasInput);
	htracker.start();

	window.addEventListener( 'headtrackingEvent', function (event) {
	  	if( event.z < 90) {
	  		if( functionality == 'welcome' && trackerActive == true) {
	  			faceFounded();
		    }		
		  	lookYou.x = -( event.x / 27 );
	    	lookYou.y =  -( event.y / 27 )+0.5;
	  	}
	  	else{
	  		if( trackerActive == false ) faceLosed();
	  	}
	}, false);
	window.addEventListener( 'facetrackingEvent', function (event) {
	  	//console.log(event);
	}, false);
}

function faceFounded(){
	console.log('face founded detected');
	trackerActive = false;
	$(".faceVideoStyle").addClass('faceVideoStyleAppear');
	if(faceDetectOn == true) { 
		var dataCaptured = canvasInput.toDataURL("image/png").replace("image/png", "image/octet-stream");
		setTimeout(function(){ faceDetectProcess( dataCaptured ); }, 500); 
	};
}
function faceLosed(){
	trackerActive = true;
	$(".faceVideoStyle").removeClass('faceVideoStyleAppear');
}

function faceDetectProcess( image ) {
	console.log('face detect process!!');
    imageToSend = convertToCognitiveFormat( image );
	$.ajax({
	    type: 'POST',
	    url: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender,facialHair',
	    beforeSend: function (data) {
			data.setRequestHeader("Content-Type", "application/octet-stream");
			data.setRequestHeader("Ocp-Apim-Subscription-Key", microsoftAPIfaceKey );
		},
    	processData: false,
	    contentType: "application/octet-stream",
	    data: imageToSend,
	    success: function (data) {
	    	console.log('datos que devuelve cognitive: ', data);
	    	checkUser( data[0].faceId );
	    }
	})
	.fail(function (x) {
	    console.log("error:"+x.statusText+x.responseText);
	});
};

function checkUser( id ){
	var cont = 0;
	var numUsers = userFacesArray.length;
	if( numUsers > 0 ) {
		$.each( userFacesArray, function(index, element) {
			$.ajax({
			    type: 'POST',
			    url: 'https://westus.api.cognitive.microsoft.com/face/v1.0/verify',
			    beforeSend: function (data) {
					data.setRequestHeader("Content-Type", "application/json");
					data.setRequestHeader("Ocp-Apim-Subscription-Key", microsoftAPIfaceKey );
				},
			    dataType: "json",
			    contentType: "application/json",
			    data: JSON.stringify({ 'faceId1': element.id, 'faceId2': id }),
			    success: function (data) {
			    	if( data.isIdentical == true ) { 
			    		welcomeUser(element.name, element.id);
					}
					else cont += 1;
					if( cont == numUsers ) { 
						registerUser(id); 
					} 
			    }
			})
			.fail(function (x) {
			    cont += 1;
				if(  cont == numUsers ) { 
					registerUser(id); 
				} 
			});
		})
	} 
	else registerUser(id);
};

function welcomeUser(name, id){
	faceDetectOn = false;
	protagonist.name = name;
	protagonist.id = id;
	if( audio == undefined ) speackFace('Conchita',momentSpeech + ', ' + protagonist.name + '. ¿en que puedo ayudarte?');
};

function registerUser(id){
	faceDetectOn = false;
	protagonist.id = id;
	if( audio == undefined ) speackFace('Conchita','creo que no nos conocemos, ¿me puedes decir tu nombre?', 'lol');
};

function speackFace( Avatar, texto, vowel ){

	Avatar = ( Avatar == undefined ) ? 'Conchita' : Avatar;
	texto = ( texto == undefined ) ? 'buenos días, ¿en qué puedo servirte?' : texto;
	audio = 'filled';

	disableVoiceRecognition('before start to speak face');

	$.ajax({
		 type: "POST",
		 url:"https://tz05nf4cld.execute-api.eu-west-1.amazonaws.com/prod/tts",
		 data: JSON.stringify( { voice: Avatar, text: texto} ),
		 contentType: "application/json",
		 success: function(data){
		 	if( functionality == 'welcome' ) $(".faceVideoStyleSpeak").addClass('faceVideoStyleAppearSpeak');
		 	console.log('datos de audio: ', data);
		   	audio = new Audio( data.voice );
        	audio.play();
			audio.addEventListener('ended', function(){
				$(".faceVideoStyleSpeak").removeClass('faceVideoStyleAppearSpeak');
				enableVoiceRecognition('after speak face');
				audio = undefined;
			});
		 }
	})
	 .fail(function(x){
	 	console.log('no funciona la api de text to speech');
	});
};

function speechRecognitionOn(){	
	if (!('webkitSpeechRecognition' in window)) {
	  upgrade();
	} 
	else {
	  recognition = new webkitSpeechRecognition();
	  recognition.continuous = false;
	  recognition.interimResults = false;
	  recognition.lang = "es-ES";

	  recognition.onstart = function() { 
	  	console.log('start recognition');
	  }
	  recognition.onresult = function(event) { 
	        console.log(event.results[event.resultIndex][0].transcript);
	        var nameValue;
	        $.ajax({
				  url: 'https://api.wit.ai/message',
				  data: {
				    'q': event.results[event.resultIndex][0].transcript,
				    'access_token' : 'TSN2P5E7S73TKF7BA5F7Q742FW4R2DAH'
				  },
				  dataType: 'jsonp',
				  method: 'GET',
				  success: function(response) {
				  	if( response.entities.intent ) { 
				  	  	if( response.entities.contact ) nameValue = response.entities.contact[0].value;
				  		if( response.entities.intent[0].value == 'close' ) closeApp();
					  	switch(functionality) {
					  		case 'welcome':
						   		welcomeResponse( response.entities.intent[0].value, nameValue );
						        break;
					  	 	case 'weather':
						   		weatherResponse( response.entities.intent[0].value, nameValue );
						        break;
						    case 'game':
						   		gameResponse( response.entities.intent[0].value, nameValue );
						        break;       
					  	}
					}
				}
		    });
	  }
	  recognition.onend = function() { 
	  	voiceRecognitionIsNeeded ? recognition.start() : console.log('no es nevesario reconocimiento de voz');
	  }
	}
};

function welcomeResponse( intent, value ){
	switch(intent) {
	    case 'tiempo':
	    	functionality = 'weather';
		  	$(".faceVideoStyle").removeClass('faceVideoStyleAppear');
		  	getLocation();
	        break;
	    case 'jugar':
	    	functionality = 'game';
		  	$(".faceVideoStyle").removeClass('faceVideoStyleAppear');
		  	startGame();
	        break;    
	    case 'nombre':
	    	if( protagonist.name == '' ){	
		    	protagonist.name = value;
		    	$.ajax({
				    type: 'POST',
				    url: 'http://ec2-52-31-73-229.eu-west-1.compute.amazonaws.com:3000/faces/faceCollection',
	        		contentType: 'application/json',
				    data: JSON.stringify({'name': protagonist.name, 'id': protagonist.id, 'timeMoment': registerTime }),
				    success: function (data) {
		    			if( audio == undefined ) speackFace('Conchita', 'Intentaré recordarlo. ¿en qué puedo ayudarte?' );
				    }
				})
				.fail(function (x) {
				    console.log("error:"+x.statusText+x.responseText);
				});
	    	}
	        break;    
	    case 'saludo':
	        if( audio == undefined ) speackFace('Conchita', momentSpeech + ' ' + protagonist.name + ', ¿en que puedo ayudarte?.' );
	        turnToHappy();
	        break;
	    case 'desconocido':
	        if( audio == undefined ) speackFace('Conchita', 'lo siento' + protagonist + ', no sabria que responder a eso.' );
	        turnToHungry();
	        break;
	}
};

function weatherResponse(intent, valuie){
	switch(intent) {  
	    case 'home':
	    	functionality = 'welcome';
		  	$(".faceVideoStyle").addClass('faceVideoStyleAppear');
		  	if( audio == undefined ) speackFace('Conchita', '¿deseas algo mas ' + protagonist.name + '?.' );
	    	eraseScena();
	        break;
	}
};

function gameResponse(intent, valuie){
	switch(intent) {  
	    case 'home':
	    	functionality = 'welcome';
	    	stopGame();
	    	setTimeout(function(){	
			  	$(".faceVideoStyle").addClass('faceVideoStyleAppear');
			  	if( audio == undefined ) speackFace('Conchita', '¿deseas algo mas ' + protagonist.name + '?.' );
	    	},5000);
	        break;
	}
};

function closeApp() {
  	$(".faceVideoStyle").removeClass('faceVideoStyleAppear');
  	if( audio == undefined ) speackFace('Conchita', 'hasta la vista, ' + protagonist.name + '.' );
	protagonist.name = '';
	protagonist.id = '';
	eraseScena();
	stopGame();
	htracker.stop();
	functionality = 'close';
	setTimeout( function() {
		trackerActive = true;
		faceDetectOn = true; 
		htracker.start(); 
		faceDetectOn = true; 
		functionality = 'welcome';
		console.log('restart app');
	}, 30000);
}

function disableVoiceRecognition(origin){
	console.log('voice recognition DESACTIVADO a peticion de ', origin)
	voiceRecognitionIsNeeded = false;
	recognition.stop()
}

function enableVoiceRecognition(origin){
	console.log('voice recognition ACTIVADO a peticion de ', origin)
	voiceRecognitionIsNeeded = true;
	recognition.start()
}

function vowelSegmentation(texto){
	$.ajax({
	    type: 'POST',
	    url: 'https://tz05nf4cld.execute-api.eu-west-1.amazonaws.com/prod/vowelsegmentation',
	    data: JSON.stringify( { text: texto }),
	    contentType: "application/json",
	    success: function (data) {
	    	console.log(data);
	    	if( audio == undefined ) speackFace( 'Conchita', texto, data ); 
	    }
	})
	.fail(function (x) {
	    console.log("error");
	});
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherInfo);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function getWeatherInfo(position){	
	$.ajax({
	    url: 'https://api.darksky.net/forecast/'+forecastKey+'/'+position.coords.latitude+','+position.coords.longitude+'?exclude=minutely,daily,alerts,flags,hourly&units=ca&lang=es',
	    dataType: "jsonp",
	    success: function(data) {
	    	console.log('Datos del tiempo: ',data);
	    	composeScena(data.currently);
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        alert('error ' + textStatus + " " + errorThrown);
	    }
	});
}

function composeScena(datos){

	if( datos.cloudCover > 0.1 && datos.cloudCover < 0.3){
		$( ".darkBack" ).append( "<img id='nube1' src='images/weather/new/nobe1jp.png' style='z-index: 996' class='rightComponent animated bounceInDown'></img>" );
		$( ".darkBack" ).append( "<img id='nube2' src='images/weather/new/nobe2jp.png' style='z-index: 995' class='rightComponent animated bounceInDown'></img>" );
	}
	else if( datos.cloudCover >= 0.3 ) {
		$( ".darkBack" ).append( "<img id='borrasca2' src='images/weather/borrasca2.png' style='z-index: 994' class='rightComponent animated bounceInDown'></img>" );
		$( ".darkBack" ).append( "<img id='borrasca1' src='images/weather/borrasca1.png' style='z-index: 995' class='rightComponent animated bounceInDown'></img>" );
	}

	if( momentSpeech == 'buenas noches' ) {
		if(datos.apparentTemperature > 13) { 
			$( ".darkBack" ).append( "<img id='monte1' src='images/weather/new/monte1jp.png' style='z-index: 998' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2' src='images/weather/new/monte2jp.png' style='z-index: 997' class='rightComponent animated bounceInLeft'></img>" );
			$( ".darkBack" ).append( "<img id='arbolOto' src='images/weather/new/arbolPrimjp.png' style='z-index: 999' class='rightComponent animated bounceInUp'></img>" );
			if( audio == undefined ) speackFace('Conchita', 'Parece que hoy hará un día estupendo.' );
		}
		else {
			$( ".darkBack" ).append( "<img id='monte1N' src='images/weather/new/monte1jpNieve.png' style='z-index: 998' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2N' src='images/weather/new/monte2jpnieve.png' style='z-index: 997' class='rightComponent animated bounceInLeft'></img>" );
			$( ".darkBack" ).append( "<img id='arbolOto' src='images/weather/new/arbolInvjp.png' style='z-index: 999' class='rightComponent animated bounceInUp'></img>" );
			if( audio == undefined ) speackFace('Conchita', 'Hoy parece que el día estará fresquito, yo me cogería una rebequita.' );	
		}	
		$( ".darkBack" ).append( "<img id='fondoNoche' src='images/weather/new/fondoNochejp.png' style='z-index: 993' class='rightComponent animated fadeIn'></img>" );
		$( ".darkBack" ).append( "<img id='luna' src='images/weather/new/luna.png' style='z-index: 994' class='rightComponent animated fadeIn'></img>" );
	}
	else{
		if(datos.apparentTemperature > 13) { 
			$( ".darkBack" ).append( "<img id='fondoVerano' src='images/weather/new/fondoVeranojp.png' style='z-index: 993' class='rightComponent animated fadeIn'></img>" );
			$( ".darkBack" ).append( "<img id='monte1' src='images/weather/new/monte1jp.png' style='z-index: 998' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2' src='images/weather/new/monte2jp.png' style='z-index: 997' class='rightComponent animated bounceInLeft'></img>" );
			$( ".darkBack" ).append( "<img id='arbolOto' src='images/weather/new/arbolPrimjp.png' style='z-index: 999' class='rightComponent animated bounceInUp'></img>" );
			if( audio == undefined ) speackFace('Conchita', 'Parece que hoy hará un día estupendo.' );
		}
		else {
			$( ".darkBack" ).append( "<img id='fondoInvierno' src='images/weather/new/fondoInviernojp.png' style='z-index: 993' class='rightComponent animated fadeIn'></img>" );
			$( ".darkBack" ).append( "<img id='monte1N' src='images/weather/new/monte1jpNieve.png' style='z-index: 998' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2N' src='images/weather/new/monte2jpNieve.png' style='z-index: 997' class='rightComponent animated bounceInLeft'></img>" );
			$( ".darkBack" ).append( "<img id='arbolOto' src='images/weather/new/arbolInvjp.png' style='z-index: 999' class='rightComponent animated bounceInUp'></img>" );
			if( audio == undefined ) speackFace('Conchita', 'Hoy parece que el día estará fresquito, yo me cogería una rebequita.' );	
		}
	$( ".darkBack" ).append( "<img id='sol' src='images/weather/new/soljp.png' style='z-index: 994' class='rightComponent animated fadeIn'></img>" );	
	}
	
	if ( datos.apparentTemperature < 2 ) var precipitationType = 'nieve';
	else var precipitationType = 'lluvia'

	if( datos.precipIntensity > 0 ) meteoGen( precipitationType, datos.precipIntensity );
}

function meteoGen(value, intensity) {
	if(value == 'lluvia'){
		var gravity = -100;
		var texttureType = 'gota_1';
		gravityForce = 10;
		var number = intensity * 500;
	}
	else if ( value == 'nieve') { 
		var gravity = -10;
		var texttureType = 'smokeparticle';
		gravityForce = 60;
		var number = intensity * 4000;
	}
	scene.remove(scene.getObjectByName( "meteo" )); 
   	particleGroup = new SPE.Group({
   		texture: {
            value: THREE.ImageUtils.loadTexture('images/weather/new/'+texttureType+'.png')
        }
   	});
   	emitter = new SPE.Emitter({
        type: 1,
        maxAge: {
            value: 0.5
        },
        isStatic: false,
        duration: null,
        direction: 1,
        activeMultiplier: 1,
        position: {
            value: new THREE.Vector3(0, 10, -15),
            spread: new THREE.Vector3( 10, 0, 50 ),
            radius: 40
        },
        acceleration: {
            value: new THREE.Vector3(0, gravity, 0),
            spread: new THREE.Vector3( 10, 0, 10 )
        },
        velocity: {
            value: new THREE.Vector3(0, 0, 0),
            spread: new THREE.Vector3(0,0,0),
            randomise: true   
        },
        color: {
            value: new THREE.Color( 1, 1, 1 )
        },
        size: {
            value: 0.3
        },
        particleCount: number
    });
    particleGroup.addEmitter( emitter );
   	particleGroup.mesh.name = 'meteo';
   	//particleGroup.mesh.renderOrder = 0;
   	scene.add( particleGroup.mesh );
}
function startGame(){
	buildModel();
	buildCharacter();
	addGate();
	//meteoGen('lluvia', 10);
	lightSet( 0xffffaa, { 'x': 1.5, 'y': 1.4, 'z': 2.65 } );
	lightSet( 0xffffaa, { 'x': -2.24, 'y': 2.1, 'z': -7.97 } );
	WebSocketTest();
	$(".mainClock").css("opacity", 1);
    fxSounds["wind"].play();

	setTimeout(function(){
		$("#container").addClass('opacityOn');
		characterAdvance = true;
    	fxSounds["monster"].play();
    	addingMainClock();
	}, 3000);

	refreshIntervalId = setInterval( function(){
		if( characterAdvance == true ) changeLightsColor();
	}, 15000 );
}

function stopGame() {
  	$("#container").removeClass('opacityOn');
  	fxSounds["monster"].pause();
	mainClock.timer._destroyTimer();
  	setTimeout(function(){
  		$(".coverAction").css("opacity", 0);
  		fxSounds["wind"].pause();
	  	scene.remove(scene.getObjectByName('scenario'));
	  	scene.remove(scene.getObjectByName('character'));
	  	scene.remove(scene.getObjectByName('scenarioLights'));
	  	scene.remove(scene.getObjectByName('gate'));
		scenario = new THREE.Object3D();
		scenario.name = 'scenario';
		scenarioLights = new THREE.Object3D();
		scenarioLights.name = 'scenarioLights';
		character = new THREE.Object3D();
		character.name = 'character';
		characterLights = new THREE.Object3D();
		characterLights.name = 'characterLights';
		$('.ClockMensaje').html('');
		$('.ClockMensaje').css('color', '');
		ambientLight.intensity = 0.6;
		characterLightsRotateSpeed = 0.06;
		characterSpeedWalk = 1;
  	}, 6000);
}

function succesGame(){
	characterAdvance = false;
	$(".coverAction").css("opacity", 0.8);
	$('.ClockMensaje').html('Bravo!!, conseguiste salvarle!');
	$(".mainClock").css("opacity", 0);
	ambientLight.intensity = 1;
	action.walk.stop();
	action.convert.play();
	clearInterval(refreshIntervalId);
	var lightChararterChildrens = scene.getObjectByName( "scenarioLights" ).children;
	$.each(lightChararterChildrens, function( index, value ) {
	  	if( value.material )  { value.material.color.setHex( 0xffffff );}
	  	else { value.color.setHex( 0xffffff ); }
	});
	actionGate.open.stop();
	actionGate.close.play();
	setTimeout(function(){
		stopGame();
	}, 15000);
}

function failureGame(){
	characterAdvance = false;
	$(".coverAction").css("opacity", 0.8);
	$('.ClockMensaje').html('Oh no!!, Se ha liberado!');
	$(".mainClock").css("opacity", 0);
	action.walk.stop();
	action.convert.play();
	clearInterval(refreshIntervalId);
	var lightChararterChildrens = scene.getObjectByName( "scenarioLights" ).children;
	$.each(lightChararterChildrens, function( index, value ) {
	  	if( value.material )  { value.material.color.setHex( 0xffffff );}
	  	else { value.color.setHex( 0xffffff ); }
	});
	fxSounds["laugh"].play();
	setTimeout(function(){
		stopGame();
	}, 15000);
}

function eraseScena(){
	$( ".rightComponent" ).remove();
};

function changeLightsColor(){
	var randomColorSelected = randomColors[Math.floor((Math.random() * 5) + 0)];
	currentColor = randomColorSelected.colour;
	console.log( 'random Color Selected: ', currentColor );
	var objects = scene.getObjectByName( "scenarioLights" ).children;
	$.each(objects, function( index, value ) {
	  	if( value.material )  { 
	  		value.material.color.setHex( randomColorSelected.valueHEX );
	  	}
	  	else {
	  		value.color.setHex( randomColorSelected.valueHEX );
	  	}
	});
}

function convertToCognitiveFormat(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

function addingMainClock(){
	mainClock = $('.mainClock').FlipClock(900,{
		countdown: true,
		clockFace: 'MinuteCounter',
		callbacks: {
	    	interval: function() {
	    		var time = this.factory.getTime().time;
	    		if(time == 0) { 
	    			this._destroyTimer();
	    			if( functionality == 'game' ) { 
	    				succesGame();
	    			}
	    		 }
	    	}
	    }
	});
}

function addingClock(timing){
	console.log('añadiendo reloj.');
	$(".addingClock").css("opacity", 1);
	var addingClock = $('.addingClock').FlipClock(timing,{
		countdown: true,
		clockFace: 'MinuteCounter',
		callbacks: {
	    	stop: function() {
				$(".addingClock").css("opacity", 0);
	    		this._destroyTimer();
	    	}
	    }
	});
}

function stopAdvance(timeout){
    fxSounds["spray"].play();
    fxSounds["explosion"].play();
    fxSounds["monster"].pause();
    fxSounds["wind"].pause();
	characterAdvance = false;
	action.walk.stop();
	action.convert.play();
	$(".coverAction").css("opacity", 0.3);
	$(".mainClock").css("opacity", 0.3);
	var objects = scene.getObjectByName( "scenarioLights" ).children;
	var lightChararterChildrens = scene.getObjectByName( "characterLights" ).children;
	$.each(objects, function( index, value ) {
	  	if( value.material )  { value.material.color.setHex( 0x666666 );}
	  	else { value.color.setHex( 0x666666 ); }
	});
	$.each(lightChararterChildrens, function( index, value ) {
		movement( { 'x': 12, 'y': 50, 'z': 12 }, value.scale, 0, 500, TWEEN.Easing.Back.Out );
		if( value.type == "Mesh" ) movement( { 'opacity': 0.5 }, value.material, 0, 500, TWEEN.Easing.Back.Out );
	});
	characterLightsRotateSpeed = 0.3;
	setTimeout(function(){
	    continueCharacterAdvance();
	}, timeout);
}

function continueCharacterAdvance(){
	var lightChararterChildrens = scene.getObjectByName( "characterLights" ).children;
    fxSounds["spray"].pause();
    fxSounds["monster"].play();
    fxSounds["wind"].play();
	action.walk.play();
	action.convert.stop();
  	characterAdvance = true;
	$(".coverAction").css("opacity", 0);
	$(".mainClock").css("opacity", 1);
	characterLightsRotateSpeed = 0.06;
	$.each(lightChararterChildrens, function( index, value ) {
		if( value.type == "Mesh" ) movement( { 'opacity': 0.8 }, value.material, 0, 500, TWEEN.Easing.Back.Out );
		if( value.type == "Sprite" ) movement( { 'x': 3, 'y': 3, 'z': 1 }, value.scale, 0, 500, TWEEN.Easing.Back.Out );
		else movement( { 'x': 1, 'y': 1, 'z': 1 }, value.scale, 0, 500, TWEEN.Easing.Back.Out );
	});
}

function WebSocketTest()
{
	$('fieldset').css('opacity',1);
   	if( socket == undefined ) {
   		socket = io.connect('http://ec2-52-31-73-229.eu-west-1.compute.amazonaws.com:3031/', { 'forceNew': true } );
	   	socket.on('toSmartMirror', function(data){
	   		console.log("se ha conectado: ", data.color, data.weaponValue );
	   	if( functionality == "game" && characterAdvance == true ) {	
		   	if( data.color == currentColor ) {
	    		$('.ClockMensaje').html('La pocima esta haciendo efecto!');
		   		stopAdvance( data.weaponValue * 1000 );
				addingClock( data.weaponValue );
				setTimeout(function(){ $('.ClockMensaje').html('');}, data.weaponValue * 1000 );
		   		}
		   	else if( data.color == 'car1' || data.color == 'car2' ){
		   		console.log('carro lanzado: ', data.color, data.weaponValue );
		   		action.hit.play();
		   		action.walk.stop();
				addCart( data.color );
		   		characterAdvance = false;
		   		$('.ClockMensaje').html('Has colocado un carro en su camino!');
		   		addingClock( data.weaponValue );
		   		setTimeout(function(){ 
		   			$('.ClockMensaje').html('');
		   			console.log(scene.getObjectByName( "car" ));
		   			character.remove( scene.getObjectByName( "car" ) );
			   		action.hit.stop();
			   		action.walk.play();
		   			characterAdvance = true;
		   		}, data.weaponValue * 1000 );
		   	}	
		   	else {
		   		$('.ClockMensaje').css('color', 'red');
		   		$('.ClockMensaje').html('oh no!, la pocima correcta era la '+ currentColor);
		   		fxSounds["laugh"].play();
		   		characterSpeedWalk = 8;
		   		characterLightsRotateSpeed = 0.5;
		   		setTimeout(function(){
		   			$('.ClockMensaje').css('color', '');
		   			$('.ClockMensaje').html('');
		   			characterSpeedWalk = 1;
		   			characterLightsRotateSpeed = 0.06;
		   			}, 6000);
		   		}	
	   		}
	   	})
	}   	
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	setTimeout( function() {
        requestAnimationFrame( animate );

		if( character.position.z < 46.5 && characterAdvance == true ) {
			character.position.z += ( 0.005 * characterSpeedWalk);
			character.position.y -= ( 0.00035 * characterSpeedWalk);
		}

		if( character.position.z > 46 && characterAdvance == true ){
			failureGame();
		}
    }, 1000 / 30 );
    render();
    controls.update(); 
    TWEEN.update();
}

function movement(value, object, delay, duration, easingType){
	//var easingType = TWEEN.Easing.Back.Out;
    var tween = new TWEEN.Tween(object)
    .to(value, duration)
    .easing(easingType)
    .onUpdate(function () {
          })
    .delay(delay)
    .start();
}

function render(){

	var delta = clock.getDelta();

	renderer.render( scene, camera );

	if( characterLights.rotation ) characterLights.rotation.y += characterLightsRotateSpeed;

	if( WomanJSONface != undefined ) {
	} 
	if( particleGroup!=undefined ) { particleGroup.tick( delta/gravityForce ); }

    if( mixer != undefined ) {  mixer.update((delta/2) * characterSpeedWalk ); }
    if( mixerGate != undefined ) {  mixerGate.update( delta ); }
}