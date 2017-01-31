
var camera, scene, renderer, JSONface, WomanJSONface, OBJface, controls, mixer, womanMixer, clip, audio, recognition, protagonist,
	width = window.innerWidth, 
	height = window.innerHeight;

var womanSayAnimation, womanLeftEyeHappynimation, womanRightEyeHappynimation, womanHappyMouthLeftnimation, womanHappyMounthRightnimation, womanCloseLeftEyenimation, womanCloseRightEyenimation,
womanHappyMouthnimation, womanOpenLeftEyenimation, womanOpenRightEyenimation, womanCejaLeftUpnimation, womanCejaRightUpnimation, womanCejaLeftDownnimation, womanCejaRightDownnimation, womanSadMounthnimation;

var womanSayAplayer, womanLeftEyeHappyplayer, womanRightEyeHappyplayer, womanHappyMouthLeftplayer, womanHappyMounthRightplayer, womanCloseLeftEyeplayer, womanCloseRightEyeplayer,
womanHappyMouthplayer, womanOpenLeftEyeplayer, womanOpenRightEyeplayer, womanCejaLeftUpplayer, womanCejaRightUpplayer, womanCejaLeftDownplayer, womanCejaRightDownplayer, womanSadMounthplayer;

var trackerActive = false;	

var clock = new THREE.Clock();
var lookYou = new THREE.Vector2();
var faceTranslate = new THREE.Vector2();

var manager = new THREE.LoadingManager();

var moment = new Date().getHours();

if( moment >= 7 && moment < 14 ) var momentSpeech = 'buenos dias';
else if( moment >= 14 && moment < 20 ) var momentSpeech = 'buenas tardes';
else if( moment >= 20 && moment < 7 ) var momentSpeech = 'buenas noches';

$( document ).ready(function() {
	initRender();
	animate();

	$.ajax({
	    type: 'POST',
	    url: 'https://tz05nf4cld.execute-api.eu-west-1.amazonaws.com/prod/vowelsegmentation',
	    data: JSON.stringify( { text: 'hola sergio' }),
	    contentType: "application/json",
	    success: function (data) {
	    	console.log(data);
	    }
	})
	.fail(function (x) {
	    console.log("error");
	});
});

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

    ambientLight = new THREE.AmbientLight( 0xffffff, 0 );
    ambientLight.position.set( 0, 0, 0 );
    scene.add(ambientLight);

	buildShape();

	window.addEventListener( 'resize', onWindowResize, false );
}

function buildShape(){

	womanFaceAnimated();

	initTracker();	
}

function womanFaceAnimated(){
	var light = new THREE.PointLight( 0xffffff, 1, 100 );
	light.position.set( -2, 1, 1.5);
	scene.add( light );

	var loader = new THREE.JSONLoader();
	loader.load( 'models/womanFaceBoneLess.json', function ( geometry ) {
		WomanJSONface = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
			color: 0xffffff,
			transparent: true,
			opacity: 0,
			morphTargets: true
		} ), false );

		womanMixer = new THREE.AnimationMixer( WomanJSONface );

		womanSayAnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'a', sayA, 15, false );
		womanLeftEyeHappynimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'leftEyeHappy', leftEyeHappy, 15, false );
		womanRightEyeHappynimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'rightEyeHappy', rightEyeHappy, 15, false );
		womanHappyMouthLeftnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'happyMouthLeft', happyMouthLeft, 15, false );
		womanHappyMounthRightnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'happyMounthRight', happyMounthRight, 15, false );
		womanCloseLeftEyenimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'closeLeftEye', closeLeftEye, 15, false );
		womanCloseRightEyenimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'closeRightEye', closeRightEye, 15, false );
		womanHappyMouthnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'HappyMouth', HappyMouth, 15, false );
		womanOpenLeftEyenimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'openLeftEye', openLeftEye, 15, false );
		womanOpenRightEyenimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'openRightEye', openRightEye, 15, false );
		womanCejaLeftUpnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'cejaLeftUp', cejaLeftUp, 15, false );
		womanCejaRightUpnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'cejaRightUp', cejaRightUp, 15, false );
		womanCejaLeftDownnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'cejaLeftDown', cejaLeftDown, 15, false );
		womanCejaRightDownnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'cejaRightDown', cejaRightDown, 15, false );
		womanSadMounthnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'sadMounth', sadMounth, 15, false );

		womanSayAplayer = womanMixer.clipAction( womanSayAnimation ).setDuration( 0.5 );
		womanLeftEyeHappyplayer = womanMixer.clipAction( womanLeftEyeHappynimation ).setDuration( 0.5 );
		womanRightEyeHappyplayer = womanMixer.clipAction( womanRightEyeHappynimation ).setDuration( 0.5 );
		womanHappyMouthLeftplayer = womanMixer.clipAction( womanHappyMouthLeftnimation ).setDuration( 0.5 );
		womanHappyMounthRightplayer = womanMixer.clipAction( womanHappyMounthRightnimation ).setDuration( 0.5 );
		womanCloseLeftEyeplayer = womanMixer.clipAction( womanCloseLeftEyenimation ).setDuration( 0.5 );
		womanCloseRightEyeplayer = womanMixer.clipAction( womanCloseRightEyenimation ).setDuration( 0.5 );
		womanHappyMouthplayer = womanMixer.clipAction( womanHappyMouthnimation ).setDuration( 0.5 );
		womanOpenLeftEyeplayer = womanMixer.clipAction( womanOpenLeftEyenimation ).setDuration( 0.5 );
		womanOpenRightEyeplayer = womanMixer.clipAction( womanOpenRightEyenimation ).setDuration( 0.5 );
		womanCejaLeftUpplayer = womanMixer.clipAction( womanCejaLeftUpnimation ).setDuration( 0.5 );
		womanCejaRightUpplayer = womanMixer.clipAction( womanCejaRightUpnimation ).setDuration( 0.5 );
		womanCejaLeftDownplayer = womanMixer.clipAction( womanCejaLeftDownnimation ).setDuration( 0.5 );
		womanCejaRightDownplayer = womanMixer.clipAction( womanCejaRightDownnimation ).setDuration( 0.5 );
		womanSadMounthplayer = womanMixer.clipAction( womanSadMounthnimation ).setDuration( 0.5 );

		WomanJSONface.rotation.x = -1.5;
		WomanJSONface.position.set( 0, 0, 0 );
		WomanJSONface.scale.set( 0.1, 0.1, 0.1 );
		scene.add( WomanJSONface );
	});
	camera.position.set( 0, 0, 2.5 );
}

function initTracker(){

	trackerActive = true;
	controls.enabled = false;

	var videoInput = document.getElementById('inputVideo');
	var canvasInput = document.getElementById('inputCanvas');

	var htracker = new headtrackr.Tracker({
		ui: false,
		debug: canvasInput
	});

	htracker.init(videoInput, canvasInput);
	//htracker.getFOV();
	htracker.start();

	window.addEventListener( 'headtrackingEvent', 
	  function (event) {
	  	lookYou.x = -( event.x / 27 );
    	lookYou.y =  -( event.y / 27 )+0.5;
	  	//if( event.Z > 80 && event.z <100 ){
	    	//faceTranslate.x = event.x / 25000;
	  	//}
	}, false);

	document.addEventListener('headtrackrStatus', function( faceStatusEvent ){

		if(faceStatusEvent.status == 'found'){

			canvasInput.getContext('2d').drawImage(videoInput, 0, 0, 320, 240);
		    var dataCaptured = canvasInput.toDataURL("image/png").replace("image/png", "image/octet-stream");
		    document.getElementById('photo').setAttribute('src', dataCaptured);

		  	movement({ opacity: 1 }, WomanJSONface.material, 0, 1000, TWEEN.Easing.Quartic.Out );
		  	movement({ x: 1 , y: 1, z: 1 }, WomanJSONface.scale, 0, 2000, TWEEN.Easing.Quartic.Out );
			setTimeout(function(){ faceDetectProcess( dataCaptured ); }, 500); 
		}
		else {
			movement({ opacity: 0 }, WomanJSONface.material, 0, 1000, TWEEN.Easing.Quartic.Out );
		  	movement({ x: 0.1 , y: 0.1, z: 0.1 }, WomanJSONface.scale, 0, 2000, TWEEN.Easing.Quartic.Out );
		}
	}, true);
}

/**
 * Petición a Microsoft Cognitive Services para detectar una imagen (Detect)
 * @param {String} imageToSend
 * @returns {String}
 */
function faceDetectImage ( imageToSend ) {
  var IdCara = "-";
  var promise = new Promise(function (resolve, reject) {
    jQuery.ajax({
        type: 'POST',
        url: 'https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=true&returnFaceAttributes=age,gender,facialHair',
        beforeSend: function (data) {
        data.setRequestHeader("Content-Type", "application/octet-stream");
        data.setRequestHeader("Ocp-Apim-Subscription-Key", microsoftAPIfaceKey );
      },
        processData: false,
        contentType: "application/octet-stream",
        data: imageToSend,
        success: function (data) {
          //console.log( data[0].faceId );
          IdCara = data[0].faceId;
          resolve(IdCara);
        }
    })
    .fail(function (x) {
      // console.log("error:"+x.statusText+x.responseText);
      reject(new Error("error:"+x.statusText+x.responseText));
    });
  });
  return promise;
}

/**
 * Obtiene los datos de una imagen a partir de una url una vez cargada (asíncrona).
 * @see https://davidwalsh.name/convert-image-data-uri-javascript
 * 
 * @param {String} url
 * @returns {Blob}
 */
function getDataUri(url ) {
  var image = new Image();

  var promise = new Promise(function (resolve, reject) {
    image.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
      canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
      canvas.getContext('2d').drawImage(this, 0, 0);
      // Get raw image data
      //callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));
      // ... or get as Data URI
      resolve(canvas.toDataURL('image/png'));
    };

    if (!image) {
      reject(new Error('No existe la imagen'));
    }
  });

  image.src = url;
  return promise;
}

/**
 * Comvierte a Blob la info RAW de una imagen
 * @param {String} dataURL
 * @returns {Blob}
 */
function makeblob(dataURL) {
  var BASE64_MARKER = ';base64,';
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
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

/**
 * Proceso de detección de detección de un usuario entre las imágenes guardadas
 * @param {String} image
 * @returns {undefined}
 */
function faceDetectProcess( image ) {
	speechRecognitionOn(); 
  // Obtenemos el FaceId de la imagen tomada con la WEBCAM.
  var imageToSend = makeblob ( image );
  var PromesaCamFaceId = faceDetectImage(imageToSend);

  
  // Obtenemos los FaceId de las imágenes almacenadas en la carpeta images
  // Recorremos la carpeta de imágenes
  var url = window.location.href;
  var lastSlashPos = url.lastIndexOf("/");
  var dir = url.substring(0, lastSlashPos);
  dir = dir + "/images/";
  var ext = "png";

  // Accedemos a la url de la carpeta de imágenes (pagina autogenerada por apache), 
  // obtenemos los enlaces de las imagenes y sacamos su info
  jQuery.ajax({url: dir}).then(function (html) {
    // Creamos un elemento DOM temporal
    var document = jQuery(html);
    var promesas = [];
    
    // Por cada imagen PNG encontrada, hacemos la petición
    document.find("a[href$='."+ext+"']").each(function () {
      var imageUrl = dir + jQuery(this).attr('href');
      promesas.push(
        getDataUri(imageUrl)
      );
    });
    
    Promise.all(promesas).then(function(values) {
      // console.log(values);
      var CamFaceId = "-";
      PromesaCamFaceId.then(function(resCamFaceId){
        var CamFaceId = resCamFaceId;
        checkUser( CamFaceId, values );
      });
    });
  });
};

/**
 * Compara dos caras en Microsoft Cognitive Services (verify) 
 * @param {String} faceId
 * @param {Array} dataImgUsers
 * @returns {undefined}
 */
function checkUser( faceId, dataImgUsers ) {
  var par = JSON.stringify({});
  var faceIdUser = "";
  var dataImgUser = "";
  var promesas = [];
  
  for (i = 0; i < dataImgUsers.length; i++) {
    dataImgUser = dataImgUsers[i];
    // faceIdUser = faceDetectImage(makeblob ( dataImgUser ));
    promesas.push(faceDetectImage( makeblob(dataImgUser) ));
  }
    
  Promise.all(promesas).then(function(faceIdUsers) {
    for (i = 0; i < faceIdUsers.length; i++) {
      faceIdUser = faceIdUsers[i];
      par = JSON.stringify({ 'faceId1': faceId, 'faceId2': faceIdUser });
      // console.log(par);

      if (faceIdUser !== "-") {
        $.ajax({
            type: 'POST',
            url: 'https://api.projectoxford.ai/face/v1.0/verify',
            beforeSend: function (data) {
            data.setRequestHeader("Content-Type", "application/json");
            data.setRequestHeader("Ocp-Apim-Subscription-Key", microsoftAPIfaceKey );
          },
            dataType: "json",
            contentType: "application/json",
            data: par,
            success: function (data) {
              if( data.isIdentical === true ) {
                alert('Wellcome again!');
                // console.log('is identical');
                //console.log(data);
                // protagonist = element.name;
                // speackFace( 'Conchita', momentSpeech + ' ' + protagonist ); 
                // turnToHappy();
              }
            }
        })
        .fail(function (x) {
          // console.log("error:"+x.statusText+x.responseText);
        });
      }
    }
  });
}

function speackFace( Avatar, texto ){

	Avatar = ( Avatar == undefined ) ? 'Conchita' : Avatar;
	texto = ( texto == undefined ) ? 'buenos dias, ¿en qué puedo servirte?' : texto;

	if( recognition != undefined ) recognition.stop();

	$.ajax({
		 type: "POST",
		 url:"https://tz05nf4cld.execute-api.eu-west-1.amazonaws.com/prod/tts",
		 data: JSON.stringify( { voice: Avatar, text: texto} ),
		 contentType: "application/json",
		 success: function(data){
		 	if( WomanJSONface != undefined )  { setTimeout( womanSayAplayer.play(), 600); }; 
		   	audio = new Audio( data.voice );
        	audio.play();
			audio.addEventListener('ended', function(){
				if( WomanJSONface != undefined ){
				    womanSayAplayer.stop();
				    recognition.start();
				    setTimeout( function(){ stopAllAnims() }, 2000 );
				}
			});
		 }
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

	  recognition.onstart = function() { console.log('start recognition'); }
	  recognition.onresult = function(event) { 
	  		console.log(event);
	  		for (var i = event.resultIndex; i < event.results.length; ++i) {
		      if (event.results[i].isFinal) {
		        console.log( event.results[i][0].transcript );
		        //speackFace('Conchita', event.results[i][0].transcript );
		        $.ajax({
					  url: 'https://api.wit.ai/message',
					  data: {
					    'q': event.results[i][0].transcript,
					    'access_token' : 'F4IPOEOCHUODLBE72Y6SULOEX5KYHHVV'
					  },
					  dataType: 'jsonp',
					  method: 'GET',
					  success: function(response) {
					      console.log("success!", response.outcomes[0].intent);
					      faceResponse( response.outcomes[0].intent );
					  }
				});
		      } else {
		        console.log( event.results[i][0].transcript );
		      }
		    }
	  }
	  recognition.onerror = function(event) {  }
	  recognition.onend = function() {  console.log('stop recognition'); recognition.start(); }
	}  
};

function faceResponse( intent ){
	console.log( intent )
	switch(intent) {
	    case 'tiempo':
	        speackFace('Conchita', 'lo siento' + protagonist + ', ahora mismo no puedo mirar por la ventana.' );
	        turnToIronic();
	        break;
	    case 'hola':
	        speackFace('Conchita', momentSpeech + ' ' + protagonist + ', ¿en que puedo ayudarte?.' );
	        turnToHappy();
	        break;3
	    case 'calendario':
	        speackFace('Conchita', 'lo siento' + protagonist + ', todavia te lo estoy organizando.' );
	        turnToIronic();
	        break;
	    case 'desconocido':
	        speackFace('Conchita', 'lo siento' + protagonist + ', no sabria que responder a eso.' );
	        turnToHungry();
	        break;
	}
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

function turnToHappy(){
	console.log('call turn to happy');
	womanHappyMouthplayer.play();
	womanCejaLeftUpplayer.play();
	womanCejaRightUpplayer.play();
	setTimeout(function(){ 
		womanHappyMouthplayer.paused = true; 
		womanCejaLeftUpplayer.paused = true; 
		womanCejaRightUpplayer.paused = true; 
	}, 100);
}

function turnToSad(){
	womanSadMounthplayer.play();
	womanCejaLeftDownplayer.play();
	womanCejaRightDownplayer.play();
	setTimeout(function(){ 
		womanSadMounthplayer.paused = true; 
		womanCejaLeftDownplayer.paused = true; 
		womanCejaRightDownplayer.paused = true; 
	}, 100);
}

function turnToIronic(){
	womanCejaRightUpplayer.play();
	womanHappyMouthLeftplayer.play();
	setTimeout(function(){ 
		womanCejaRightUpplayer.paused = true; 
		womanHappyMouthLeftplayer.paused = true;  
	}, 100);
}

function turnToHungry(){
	cejaIzqDwPlayer.play();
	cejaDchaDwPlayer.play();
	sayOplayer.play();
	setTimeout(function(){ 
		cejaIzqDwPlayer.paused = true; 
		cejaDchaDwPlayer.paused = true; 
		sayOplayer.paused = true;  
	}, 100);

}

function stopAllAnims(){
	console.log('llama a stop anims');
	womanSayAplayer.stop();
	/*sayEplayer.stop();
	sayOplayer.stop();
	sayIplayer.stop();*/
	womanLeftEyeHappyplayer.stop();
	womanRightEyeHappyplayer.stop();
	womanHappyMouthLeftplayer.stop();
	womanHappyMounthRightplayer.stop();
	womanCloseLeftEyeplayer.stop();
	womanCloseRightEyeplayer.stop();
	womanHappyMouthplayer.stop();
	womanOpenLeftEyeplayer.stop();
	womanOpenRightEyeplayer.stop();
	womanCejaLeftUpplayer.stop();
	womanCejaRightUpplayer.stop();
	womanCejaLeftDownplayer.stop();
	womanCejaRightDownplayer.stop();
	womanSadMounthplayer.stop();
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
	renderer.render( scene, camera );
	if( WomanJSONface != undefined && trackerActive == true) {
		//WomanJSONface.lookAt( new THREE.Vector3( lookYou.x, -5, lookYou.y ) );
		//WomanJSONface.lookAt( new THREE.Vector3( -5, 0, 0 ) );
		//WomanJSONface.position.x = faceTranslate.x*200;
	} 
	if ( womanMixer ) {
		var delta = clock.getDelta();
		womanMixer.update( delta );
	}
}

$(document).on("keydown", function (e) {
	if( WomanJSONface != undefined ){
		if (e.keyCode == '38') { // UP
			turnToHappy();
	    }
	    else if (e.keyCode == '40') { // DOWN
	    	turnToSad();
	    }
	    else if (e.keyCode == '37') { // LEFT
	    	/*cejaIzqUpPlayer.play();
			setTimeout(function(){ cejaIzqUpPlayer.paused = true; }, 100);*/
	    }
	    else if (e.keyCode == '39') { // RIGHT
	    	/*cejaDchaUpPlayer.play();
			setTimeout(function(){ cejaDchaUpPlayer.paused = true; }, 100);*/
		}
	    else if (e.keyCode == '65') { // A
	    	/*sayAplayer.play();
			setTimeout(function(){ sayAplayer.paused = true; }, 100);*/
		}	
	    else if (e.keyCode == '69') { // E
	    	/*sayEplayer.play();
			setTimeout(function(){ sayEplayer.paused = true; }, 100);*/
		}		
	    else if (e.keyCode == '79') { // O
	    	/*sayOplayer.play();
			setTimeout(function(){ sayOplayer.paused = true; }, 100);*/
		}			
	    else if (e.keyCode == '73') { // I
	    	/*sayIplayer.play();
			setTimeout(function(){ sayIplayer.paused = true; }, 100);*/
		}	
	}
});

$(document).on("keyup", function (e) {
	if( WomanJSONface != undefined ){ stopAllAnims(); }				
});



//animationcontrols
		//setTimeout(function(){ sayAplayer.paused = true; }, 10);
		//sayAplayer.loop = THREE.LoopPingPong;
		//sayAplayer.repetitions = 0;
		//setTimeout(function(){ sayAplayer.stop(); }, 1000);  //sayAplayer.stop();
		//sayAplayer.reset();
		//setTimeout(function(){ cejaIzqPlayer.stop(); }, 300);


