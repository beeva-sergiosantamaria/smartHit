
var camera, scene, renderer, JSONface, WomanJSONface, OBJface, controls, mixer, womanMixer, clip, audio, recognition, imageToSend, newUserId, htracker, particleGroup,
	width = window.innerWidth, 
	height = window.innerHeight;

var userFacesArray = []; 

var gravityForce = 10;

var protagonist = {
	name: '',
	id: '',
	timeStamp: ''
};	

var videoInput = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');

//-------status controls ------	

var trackerActive = true;
var voiceRecognitionIsNeeded = false;

var functionality = 'welcome'; //'welcome', 'weather', 'game'

//-----------------------------	

var clock = new THREE.Clock();
var lookYou = new THREE.Vector2();
var faceTranslate = new THREE.Vector2();

var manager = new THREE.LoadingManager();

var moment = new Date().getHours();
var registerTime = new Date(); 

//https://github.com/beeva-labs/vowelsegmentation

if( moment >= 7 && moment < 14 ) var momentSpeech = 'buenos dias';
else if( moment >= 14 && moment < 20 ) var momentSpeech = 'buenas tardes';
else var momentSpeech = 'buenas noches';

$( document ).ready(function() {
	//getUserFaces();
	WebSocketTest();
});

function getUserFaces(){
	 $.ajax({
        url: 'http://localhost:3000/faces/faceCollection',
        dataType: "jsonp",
        success: function(data) {
        	console.log( 'datos recibidos: ', data );
        	$.each(data, function(index, element){
        		if( element['timeMoment'] != 'inicial' ) {
	        		var diferencia = (( registerTime ) - ( new Date( element['timeMoment'] ) )) / ( 60 * 60 * 24 * 1000 );
	        		console.log('diferencia: ', diferencia);
            		if ( diferencia < 1 ) userFacesArray.push(element);
        		}
        	})
        	console.log('usuarios no caducados: ', userFacesArray);
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

	camera = new THREE.PerspectiveCamera( 60, (width/height), 0.01, 10000000 );
	//camera.position.set( 0, 1.4, 0 );
	//camera.viewport = { x: 0, y: 0, width: width, height: height }-0.6, y: 1.1, z: -2
	
	scene.add(camera);

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.70;
	controls.enableZoom = true;
	controls.target.set( 0, 0, 0 );
	controls.enabled = true;

    ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
    ambientLight.position.set( 0, 0, 0 );
    scene.add(ambientLight);

	buildShape();

	window.addEventListener( 'resize', onWindowResize, false );
}

function buildShape(){

	womanFaceAnimated();

	initTracker();	

	speechRecognitionOn();
}

function initTracker(){
	//controls.enabled = false;
	htracker = new headtrackr.Tracker({
		ui: false,
		debug: false
	});

	htracker.init(videoInput, canvasInput);
	//htracker.getFOV();
	htracker.start();

	window.addEventListener( 'headtrackingEvent', 
	  function (event) {
	  	lookYou.x = -( event.x / 27 );
    	lookYou.y =  -( event.y / 27 )+0.5;
	}, false);
	
	document.addEventListener('headtrackrStatus', function( faceStatusEvent ){
		if( functionality == 'welcome' ) {	
			if(faceStatusEvent.status == 'found'){
				console.log('datos al inicio: ', functionality, trackerActive);
				canvasInput.getContext('2d').drawImage(videoInput, 0, 0, 320, 240);
			    var dataCaptured = canvasInput.toDataURL("image/png").replace("image/png", "image/octet-stream");
			    //document.getElementById('photo').setAttribute('src', dataCaptured);
			  	movement({ opacity: 1 }, WomanJSONface.material, 0, 1000, TWEEN.Easing.Quartic.Out );
			  	movement({ x: 1 , y: 1, z: 1 }, WomanJSONface.scale, 0, 2000, TWEEN.Easing.Quartic.Out );
				if(trackerActive == true) { setTimeout(function(){ faceDetectProcess( dataCaptured ); }, 500); };
			}
			else {
				movement({ opacity: 0 }, WomanJSONface.material, 0, 1000, TWEEN.Easing.Quartic.Out );
			  	movement({ x: 0.1 , y: 0.1, z: 0.1 }, WomanJSONface.scale, 0, 2000, TWEEN.Easing.Quartic.Out );
			}
		}
	}, true);
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

function faceDetectProcess( image ) {
	console.log('comienza la identificacion.')
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
	    	console.log('datos de la cara: ', data);
	    	checkUser( data[0].faceId );
	    }
	})
	.fail(function (x) {
	    console.log("error:"+x.statusText+x.responseText);
	});
};

function checkUser( id ){
	console.log('llama a check user: ', id);
	var cont = 0;
	var numUsers = userFacesArray.length;
	if( numUsers > 0 ) {
		$.each( userFacesArray, function(index, element) {
			console.log('id para comparar: ', element.id, element.name);
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
			    		console.log('succes!!');
			    		welcomeUser(element.name, element.id);
					}
					else cont += 1;
					if( cont == numUsers ) { 
						console.log('id en fail: ', id);
						registerUser(id); 
					} 
			    }
			})
			.fail(function (x) {
			    cont += 1;
				if(  cont == numUsers ) { 
					console.log('id en fail: ', id);
					registerUser(id); 
				} 
			});
		})
	} 
	else registerUser(id);
}

function speackFace( Avatar, texto, vowel ){

	Avatar = ( Avatar == undefined ) ? 'Conchita' : Avatar;
	texto = ( texto == undefined ) ? 'buenos días, ¿en qué puedo servirte?' : texto;

	disableVoiceRecognition('before start to speak face');

	$.ajax({
		 type: "POST",
		 url:"https://tz05nf4cld.execute-api.eu-west-1.amazonaws.com/prod/tts",
		 data: JSON.stringify( { voice: Avatar, text: texto} ),
		 contentType: "application/json",
		 success: function(data){
		 	console.log('datos de audio: ', data);
		   	audio = new Audio( data.voice );
        	audio.play();
			audio.addEventListener('ended', function(){
				console.log('audio termina');
				enableVoiceRecognition('after speak face');
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
	} else {
	  recognition = new webkitSpeechRecognition();
	  recognition.continuous = true;
	  recognition.interimResults = false;
	  recognition.lang = "es-ES";
	  //recognition.start();

	  recognition.onstart = function() { 
	  	console.log('start recognition'); 
	  	recognizing = true;
    	ignore_onend = false;
	  }
	  recognition.onresult = function(event) { 
	        //speackFace('Conchita', event.results[i][0].transcript );
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
				  	  console.log(response);
				  	  	if( response.entities.contact ) nameValue = response.entities.contact[0].value;
				  		if( response.entities.intent[0].value == 'close' ) closeApp();
					  	switch(functionality) {
					  		case 'welcome':
						   		welcomeResponse( response.entities.intent[0].value, nameValue );
						        break;
					  	 	case 'weather':
						   		weatherResponse( response.entities.intent[0].value, nameValue );
						        break;   
					  	}
				}
		    });
	  }
	  //recognition.onerror = function(event) {  }
	  recognition.onend = function() { 
	  	voiceRecognitionIsNeeded ? recognition.start() : console.log('no es nevesario reconocimiento de voz');
	  }
	}
};

function welcomeResponse( intent, value ){
	trackerActive = false;
	switch(intent) {
	    case 'tiempo':
	    	functionality = 'weather';
	    	console.log('tiempo solicitado');
			movement({ opacity: 0.1 }, WomanJSONface.material, 0, 1000, TWEEN.Easing.Quartic.Out );
		  	movement({ x: 0.1 , y: 0.1, z: 0.1 }, WomanJSONface.scale, 0, 2000, TWEEN.Easing.Quartic.Out );
		  	getLocation();
	        break;
	    case 'nombre':
	    	console.log('nombre solicitado');
	    	protagonist.name = value;
	    	$.ajax({
			    type: 'POST',
			    url: 'http://localhost:3000/faces/faceCollection',
        		contentType: 'application/json',
			    data: JSON.stringify({'name': protagonist.name, 'id': protagonist.id, 'timeMoment': registerTime }),
			    success: function (data) {
			    	console.log(data);
	    			speackFace('Conchita', 'Intentaré recordarlo, máquina. ¿en qué puedo ayudarte?' );
			    }
			})
			.fail(function (x) {
			    console.log("error:"+x.statusText+x.responseText);
			});
	        break;    
	    case 'saludo':
	    	console.log('saludo recibido');
	        speackFace('Conchita', momentSpeech + ' ' + protagonist.name + ', ¿en que puedo ayudarte?.' );
	        turnToHappy();
	        break;
	    case 'desconocido':
	        speackFace('Conchita', 'lo siento' + protagonist + ', no sabria que responder a eso.' );
	        turnToHungry();
	        break;
	}
};

function weatherResponse(intent, valuie){
	switch(intent) {  
	    case 'home':
	    	functionality = 'welcome';
	    	movement({ opacity: 1 }, WomanJSONface.material, 0, 1000, TWEEN.Easing.Quartic.Out );
		  	movement({ x: 1 , y: 1, z: 1 }, WomanJSONface.scale, 0, 2000, TWEEN.Easing.Quartic.Out );
		  	speackFace('Conchita', '¿deseas algo mas, ' + protagonist.name + '?.' );
	    	console.log('salir widget tiempo');
	    	eraseScena();
	        break;
	}
};

function closeApp() {
  	speackFace('Conchita', 'hasta la vista, ' + protagonist.name + '.' );
	movement({ opacity: 0 }, WomanJSONface.material, 0, 1000, TWEEN.Easing.Quartic.Out );
  	movement({ x: 0.1 , y: 0.1, z: 0.1 }, WomanJSONface.scale, 0, 2000, TWEEN.Easing.Quartic.Out );
	protagonist.name = '';
	protagonist.id = '';
	eraseScena();
	htracker.stop();
	functionality = 'welcome';
	setTimeout( function() { htracker.start(); trackerActive = true; }, 20000);
}

function welcomeUser(name, id){
	console.log('is identical');
	protagonist.name = name;
	protagonist.id = id;
	speackFace('Conchita',momentSpeech + ', ' + protagonist.name + '. ¿en que puedo ayudarte?');
}

function registerUser(id){
	console.log('id en register user: ', id );
	protagonist.id = id;
	speackFace('Conchita','creo que no nos conocemos, ¿me puedes decir tu nombre?', 'lol');
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
	    	speackFace( 'Conchita', texto, data ); 
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
	    	console.log(data);
	    	composeScena(data.currently);
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        alert('error ' + textStatus + " " + errorThrown);
	    }
	});
}

function composeScena(datos){
	if( momentSpeech == 'buenas noches' ) {
		if(datos.apparentTemperature > 13) { 
			$( ".darkBack" ).append( "<img id='monte1' src='images/weather/monte1.png' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2' src='images/weather/monte2.png' class='rightComponent animated bounceInLeft'></img>" );
		}
		else {
			$( ".darkBack" ).append( "<img id='monte1N' src='images/weather/monte1Nieve.png' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2N' src='images/weather/monte2nieve.png' class='rightComponent animated bounceInLeft'></img>" );	
		}	
		$( ".darkBack" ).append( "<img id='fondoNoche' src='images/weather/fondoNoche.png' class='rightComponent animated fadeIn'></img>" );
		$( ".darkBack" ).append( "<img id='luna' src='images/weather/luna.png' class='rightComponent animated fadeIn'></img>" );
	}
	else{
		if(datos.apparentTemperature > 13) { 
			$( ".darkBack" ).append( "<img id='fondoVerano' src='images/weather/fondoVerano.png' class='rightComponent animated fadeIn'></img>" );
			$( ".darkBack" ).append( "<img id='monte1' src='images/weather/monte1.png' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2' src='images/weather/monte2.png' class='rightComponent animated bounceInLeft'></img>" );
		}
		else {
			$( ".darkBack" ).append( "<img id='fondoInvierno' src='images/weather/fondoInvierno.png' class='rightComponent animated fadeIn'></img>" );
			$( ".darkBack" ).append( "<img id='monte1N' src='images/weather/monte1Nieve.png' class='rightComponent animated bounceInRight'></img>" );
			$( ".darkBack" ).append( "<img id='monte2N' src='images/weather/monte2nieve.png' class='rightComponent animated bounceInLeft'></img>" );	
		}
	$( ".darkBack" ).append( "<img id='sol' src='images/weather/sol.png' class='rightComponent animated fadeIn'></img>" );	
	}
	if( datos.cloudCover > 0.1 && datos.cloudCover < 0.3){
		$( ".darkBack" ).append( "<img id='nube1' src='images/weather/nube1.png' class='rightComponent animated bounceInDown'></img>" );
		$( ".darkBack" ).append( "<img id='nube2' src='images/weather/nube2.png' class='rightComponent animated bounceInDown'></img>" );
	}
	else if( datos.cloudCover >= 0.3 ) {
		$( ".darkBack" ).append( "<img id='borrasca2' src='images/weather/borrasca2.png' class='rightComponent animated bounceInDown'></img>" );
		$( ".darkBack" ).append( "<img id='borrasca1' src='images/weather/borrasca1.png' class='rightComponent animated bounceInDown'></img>" );
	}
	$( ".darkBack" ).append( "<img id='arbolOto' src='images/weather/arbolOto.png' class='rightComponent animated bounceInUp'></img>" );

	if ( datos.apparentTemperature < 2 ) var precipitationType = 'nieve';
	else var precipitationType = 'lluvia'

	if( datos.precipIntensity > 0 ) meteoGen( precipitationType, datos.precipIntensity );
}

function meteoGen(value, intensity) {
	if(value == 'lluvia'){
		var gravity = -100;
		var texttureType = 'gota_1';
		gravityForce = 30;
		var number = intensity * 500;
	}
	else if ( value == 'nieve') { 
		var gravity = -10;
		var texttureType = 'smokeparticle';
		gravityForce = 60;
		var number = intensity * 4000;
	}
	scene.remove(scene.getObjectByName( "nieve" )); 
   	particleGroup = new SPE.Group({
   		texture: {
            value: THREE.ImageUtils.loadTexture('images/weather/originals/'+texttureType+'.png')
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
            value: new THREE.Vector3(0, 1, 2),
            spread: new THREE.Vector3( 1, 0, 1 ),
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
            value: [ new THREE.Color('white'), new THREE.Color('red') ]
        },
        size: {
            value: 0.1
        },
        particleCount: number
    });
    particleGroup.addEmitter( emitter );
   	particleGroup.mesh.name = 'meteo';
   	//particleGroup.mesh.renderOrder = 0;
   	scene.add( particleGroup.mesh );
}

function eraseScena(){
	$( ".rightComponent" ).remove();
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 / 30 );
    render();
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
	if( WomanJSONface != undefined ) {
	} 
	if(particleGroup!=undefined) { particleGroup.tick( delta/gravityForce ); }
}

$(document).on("keydown", function (e) {
	switch(e.keyCode) {
		case '38': //UP
			break;
		case '40': //DOWN
			break;
		case '37': //LEFT
			break;
		case '39': //RIGHT
			break;
	}
});

$(document).on("keyup", function (e) {			
});
//animationcontrols
		//setTimeout(function(){ sayAplayer.paused = true; }, 10);
		//sayAplayer.loop = THREE.LoopPingPong;
		//sayAplayer.repetitions = 0;
		//setTimeout(function(){ sayAplayer.stop(); }, 1000);  //sayAplayer.stop();
		//sayAplayer.reset();
		//setTimeout(function(){ cejaIzqPlayer.stop(); }, 300);

function WebSocketTest()
{
   var socket = io.connect('https://damp-forest-64170.herokuapp.com:3031/', { 'forceNew': true } );
   socket.on('messages', function(data){
   		console.log(data);
   })

   socket.emit('messagesReturn', { id:1, author: 'sergio sant', libro: 'el arte del lolailo' });
}