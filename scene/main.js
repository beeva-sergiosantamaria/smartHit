
var camera, crosshair, loadcrosshair, scene, renderer, mesh, mouse, controls, controlsdevice, uniforms, group, numVertices, effect, intersected, intersectedScreens, intersectedTravel, sky, plane, particleCube, radicalText,
 radicalTextNParticles, researchText, researchTextNParticles, interval,
	width = window.innerWidth, 
	height = window.innerHeight;

var videoMP4, videoOgg, video, videoTexture;	

var centro, design, research, clever, sillas, comunicacion, pared, cristaleraFrontal, cristaleraEntrada, cristaleraAgora, banco, teles, pantalla1, pantalla2, pantalla3, pantalla4;	

var tweenCircleIn, tweenCircleOut, tweenLettersIn, tweenLettersOut;

var clock = new THREE.Clock();
var mouse = new THREE.Vector2();
var raycasterMesas = new THREE.Raycaster();
var raycasterTravel = new THREE.Raycaster();
var raycasterScreens = new THREE.Raycaster();

var manager = new THREE.LoadingManager();

var planta = new THREE.Object3D();
	planta.name = "estructura";
var interactivos = new THREE.Object3D();
	interactivos.name = "mesasInteractivas";
var screensGroup = new THREE.Object3D();
	screensGroup.name = "screens";
var letrasRadical = new THREE.Object3D();
	letrasRadical.name = 'lerasRadical';
var letrasResearch = new THREE.Object3D();
	letrasRadical.name = 'letrasResearch';
var letrasDesign = new THREE.Object3D();
	letrasRadical.name = 'letrasDesign';
var travelPoints = new THREE.Object3D();
	travelPoints.name = 'travelPoints';

var delayTriger	= 3000;
var activeLetters;

var numeroParticulas = 2000;
var disperseParticles = { nParticles: numeroParticulas, path: 'disperse' };
var min = -3, max = 3;
var verticesArray = [];
var particlesAnimation = true;

var baseColor = 0xFFFFFF;
var foundColor = 0xFFFFFF;
var intersectCentroColor = 0xffff33;
var intersectResearchColor = 0x33ff33;
var intersectDesignColor = 0x3333ff;

$( document ).ready(function() {
	//startLogoAnim();
	$('#container').addClass('displayOn');
	$('#logoBox').css('display', 'none');
	$('#fireWorks').css('display', 'none');
	initRender();
	animate();
});

$(document).on("keydown", function (e) {
	if (e.keyCode == '38' ) {
        if( particleCube != undefined ) particlesDisperse( radicalTextNParticles, 'radical');
        removeLetters3D();
        setTimeout( function(){  moveLetters3d(letrasRadical); }, 100 );  
       
    }
    else if (e.keyCode == '40') {
    	if( particleCube != undefined ) particlesDisperse( researchTextNParticles, 'research');
    	removeLetters3D();
    	setTimeout( function(){  moveLetters3d(letrasResearch); }, 100 );  
    }
    else if (e.keyCode == '37') {
        if( particleCube != undefined ) particlesDisperse( 2000, 'disperse');
        removeLetters3D();
    }
    else if (e.keyCode == '39') {
        if( particleCube != undefined ) particlesDisperse( researchTextNParticles, 'research');
        removeLetters3D();
        setTimeout( function(){  moveLetters3d(letrasDesign); }, 100 );  
    }
});

function initRender() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true, alpha: true } );
	renderer.sortObjects = false;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	renderer.setClearColor( 0xffffff, 0 );
	//renderer.shadowMap.enabled = true;
	//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setViewport( 0,0,width, height );
	renderer.getMaxAnisotropy();

	var container = document.getElementById('container');
	container.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 60, (width/height), 0.01, 10000000 );
	//camera.position.set( 0, 1.4, 0 );
	//camera.viewport = { x: 0, y: 0, width: width, height: height }
	camera.position.set( -2, 1.1, 3 );

	scene.add(camera);


	if (window.DeviceOrientationEvent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		console.log('navigator: ', navigator);
        console.log("Oriented device");
        effect = new THREE.StereoEffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);
        effect.setEyeSeparation = 0.5;
        controlsdevice = new THREE.DeviceOrientationControls( camera, true );
        controlsdevice.connect();
		crosshair = new THREE.Mesh(
			new THREE.RingGeometry( 0.01, 0.02, 32 ),
			new THREE.MeshBasicMaterial( {
				color: 0x444444,
			} )
		);
		crosshair.position.z = - 2;
		camera.add( crosshair );
		loadcrosshair = new THREE.Mesh(
			new THREE.RingGeometry( 0.009, 0.025, 32, 1, 0, 6.3 ),
			new THREE.MeshBasicMaterial( {
				color: 0xcccc00,
			} )
		);
		loadcrosshair.position.z = - 1.95;
		camera.add( loadcrosshair );
    }

    else {
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enableDamping = true;
		controls.dampingFactor = 0.70;
		controls.enableZoom = true;
    }

    ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.position.set(0,0.6,0);
    scene.add(ambientLight);

	buildShape();

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

	function onDocumentMouseMove( event ) {

	    //event.preventDefault();

	    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		
	}
}

function buildShape(){

	//addParticleSystem();

	//addSpritesLetters(['r','a1', 'd', 'i', 'c', 'a2', 'l']);

	var skyGeometry = new THREE.SphereGeometry( 10, 32, 32 );
	var skyMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/sky2.jpg'), side: THREE.DoubleSide, transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: true  });
	sky = new THREE.Mesh( skyGeometry, skyMaterial );
	sky.renderOrder = 0;
	sky.rotation.y = 1.7;
	sky.name = "sky";

	addModel();
}

function particlesDisperse( Particles, path ){
	if( disperseParticles.path != path && particleCube != undefined ){ 
  		if( path != 'disperse') reorderParticles( disperseParticles.nParticles, 'disperse' );
      	setTimeout( function(){ reorderParticles( Particles, path ) }, 100 );  
	}
}
	
function reorderParticles( Particles, path ){
	if(path == 'radical'){
		if( !particlesAnimation ) { 
			particleCube.position.set( -2.7, 1, -2.1 );
			particleCube.lookAt( camera.position );
			particleCube.geometry.vertices = radicalText.vertices; 
			disperseParticles = { nParticles: Particles, path: 'radical'}; 
		}
		else if( particlesAnimation ){
			movement( { x: -2.7, y: 1, z: -2.1 }, particleCube.position, 0 , 500, TWEEN.Easing.Back.Out );
			setTimeout( function(){ particleCube.lookAt( camera.position ); }, 100 );  
			for( var a = 0; a < Particles; a++ ){
				movement( { x: radicalText.vertices[a].x, y: radicalText.vertices[a].y, z: radicalText.vertices[a].z }, particleCube.geometry.vertices[a], 0.1*a, 1000, TWEEN.Easing.Back.Out );
				if( a == Particles - 1 ) disperseParticles = { nParticles: Particles, path: 'radical'};
			}
		}
	}
	else if(path == 'research'){
		if( !particlesAnimation ) { 
			particleCube.position.set( -2.7, 1, 1 );
			particleCube.lookAt( camera.position );
			particleCube.geometry.vertices = researchText.vertices; 
			disperseParticles = { nParticles: Particles, path: 'research'}; 
		}
		else if(particlesAnimation){
			movement( { x: -2.7, y: 1, z: 1 }, particleCube.position, 0 , 500, TWEEN.Easing.Back.Out );
			setTimeout( function(){ particleCube.lookAt( camera.position ); }, 100 );  
			for( var a = 0; a < Particles; a++ ){
				movement( { x: researchText.vertices[a].x, y: researchText.vertices[a].y, z: researchText.vertices[a].z }, particleCube.geometry.vertices[a], 0.1*a , 1000, TWEEN.Easing.Back.Out );
				if( a == Particles - 1 ) disperseParticles = { nParticles: Particles, path: 'research'};
			}
		}
	}
	else if(path == 'disperse'){
		if( !particlesAnimation ) { 
			particleCube.position.set( 0, 0, 0 );
			particleCube.geometry.vertices = verticesArray; 
			disperseParticles = { nParticles: numeroParticulas, path: 'disperse'}; 
		}
		else if( particlesAnimation ){
			movement( { x: 0, y: 0, z: 0 }, particleCube.position, 0 , 500, TWEEN.Easing.Back.Out );
			setTimeout( function(){ particleCube.lookAt( camera.position ); }, 100 );  
			for( var a = 0; a < Particles; a++ ){
				movement( { x: verticesArray[a].x, y: verticesArray[a].y, z: verticesArray[a].z }, particleCube.geometry.vertices[a], 0.1*a , 1000, TWEEN.Easing.Back.Out );
				if( a == Particles - 1 ) disperseParticles = { nParticles: numeroParticulas, path: 'disperse'};
			}
		}
	}
}

function moveLetters3d(object){
	activeLetters = object;
	for ( var a = 0; a < object.children.length; a++ ){
			//movement( { y: 0 }, object.children[a].position, 100 * a , 600, TWEEN.Easing.Back.Out );
			tweenLettersIn = new TWEEN.Tween(object.children[a].position).to({ y: 0 }, 600).easing(TWEEN.Easing.Back.Out).onUpdate(function () {}).delay( 100 * a).start();
	}
	object.lookAt( camera.position );
}

function removeLetters3D(){
	for ( var a = 0; a < 12; a++ ){
			if( tweenLettersIn != undefined ) tweenLettersIn.stop();
			//if( activeLetters != undefined ) tweenLettersOut = new TWEEN.Tween(activeLetters.children[a].position).to({ y: -1 }, 200).easing(TWEEN.Easing.Quartic.Out).onUpdate(function () {}).delay( 50 * a).start();
			if( letrasRadical.children[a] ) new TWEEN.Tween(letrasRadical.children[a].position).to({ y: -1.5 }, 200).easing(TWEEN.Easing.Quartic.Out).onUpdate(function () {}).delay( 50 * a).start();
			if( letrasDesign.children[a] ) new TWEEN.Tween(letrasDesign.children[a].position).to({ y: -1.5 }, 200).easing(TWEEN.Easing.Quartic.Out).onUpdate(function () {}).delay( 50 * a).start();
			if( letrasResearch.children[a] ) new TWEEN.Tween(letrasResearch.children[a].position).to({ y: -1.5 }, 200).easing(TWEEN.Easing.Quartic.Out).onUpdate(function () {}).delay( 50 * a).start();
	}
	//clearInterval(interval);
}

function addModel(){

	var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				//console.log(percentComplete);
				if(percentComplete == 100) {
					console.log('model loaded!!');
					setTimeout( function() {
						addLetters3D(['R','a', 'd', 'i', 'c', 'a', 'l'], { x: -2.7, y: 1, z: -1.7 }, letrasRadical);
						addLetters3D(['R','e', 's', 'e', 'a', 'r', 'c', 'h'], { x: -2.7, y: 1, z: 1 }, letrasResearch);
						addLetters3D(['D','e', 's', 'i', 'g', 'n' ], { x: -2.7, y: 1, z: 3 }, letrasDesign);

						addScreens();

						addTravelPoints();
						scene.add( sky );
					}, 1000 );
				}
			}
		};
		var onError = function ( xhr ) {
	};

	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( 'models/vrLabsModel/' );
		mtlLoader.load( 'planta6.mtl', function( materials ) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( 'models/vrLabsModel/' );	
			objLoader.load( 'planta6.obj', function ( elements ) {

				//scene.add(elements);

				console.log(elements);

				techo = elements.children[12];
				techo.renderOrder = 0;
				techo.name = "techo";

				planta.add(techo);

				banco = elements.children[11];
				banco.renderOrder = 0;
				banco.name = "banco";

				planta.add(banco);

				cristaleraEntrada = elements.children[10];
				cristaleraEntrada.renderOrder = 1;
				cristaleraEntrada.name = "cristaleraEntrada";

				planta.add(cristaleraEntrada);

				pared = elements.children[9];
				pared.renderOrder = 0;
				pared.name = "pared";

				planta.add(pared);

				cristaleraAgora = elements.children[8];
				cristaleraAgora.renderOrder = 1;
				cristaleraAgora.name = "cristaleraAgora";

				planta.add(cristaleraAgora);

				centro = elements.children[7];
				centro.renderOrder = 0;
				centro.name = "centro";

				interactivos.add(centro);

				research = elements.children[6];
				research.renderOrder = 0;
				research.name = "research";

				interactivos.add(research);

				design = elements.children[5];
				design.renderOrder = 0;
				design.name = "design";

				interactivos.add(design);

				comunicacion = elements.children[4];
				comunicacion.renderOrder = 0;
				comunicacion.name = "comunicacion";

				interactivos.add(comunicacion);

				clever = elements.children[3];
				clever.renderOrder = 0;
				clever.name = "clever";

				interactivos.add(clever);

				cristaleraFrontal = elements.children[2];
				cristaleraFrontal.renderOrder = 2;
				cristaleraFrontal.name = "cristaleraFrontal";

				planta.add(cristaleraFrontal);

				sillas = elements.children[1];
				sillas.renderOrder = 0;
				sillas.name = "sillas";

				planta.add(sillas);

				teles = elements.children[0];
				teles.renderOrder = 0;
				teles.name = "teles";

				planta.add(teles);

				scene.add(planta);
				scene.add(interactivos);


			}, onProgress, onError );
		});
}

function addLetters3D(lettersArray, position, object){

	var loader = new THREE.FontLoader();
	loader.load( 'scene/fonts/droid_sans_bold.typeface.js', function ( font ) {
		for( var a= 0; a < lettersArray.length; a++ ){
			var radicalTextModel = new THREE.TextGeometry( lettersArray[a], {
				font: font,
				size: 0.1,
				height: 0.01,
				curveSegments: 3,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: 0.01
			});
	        var materialFront = new THREE.MeshBasicMaterial( { color: 0xffdd44 } );
			var materialSide = new THREE.MeshBasicMaterial( { color: 0x333333 } );
			var materialArray = [ materialFront, materialSide ];
			var textMaterial = new THREE.MeshFaceMaterial(materialArray);
			var radicalTextMesh = new THREE.Mesh( radicalTextModel, textMaterial );
			radicalTextMesh.position.x = 0.1 * a;
			radicalTextMesh.position.y = -2;
			radicalTextModel.computeBoundingBox();
			object.add(radicalTextMesh);	
		}
	});

	object.position.set( position.x, position.y, position.z );
	object.lookAt( camera.position );
	object.name = 'letras3D';
	scene.add(object);
}

function addParticleSystem(){

	var loader = new THREE.FontLoader();
	loader.load( 'scene/fonts/droid_sans_bold.typeface.js', function ( font ) {
		radicalText = new THREE.TextGeometry( 'Radical', {
			font: font,
			size: 0.1,
			height: 0,
			curveSegments: 1
		});
		researchText = new THREE.TextGeometry( 'Research', {
			font: font,
			size: 0.1,
			height: 0,
			curveSegments: 1
		});
		var modifier = new THREE.SubdivisionModifier( 1 );
        	modifier.modify( radicalText );
        	modifier.modify( researchText );
        radicalTextNParticles = radicalText.vertices.length;
        researchTextNParticles = researchText.vertices.length;
	});

   	var boxGeometry = new THREE.Geometry();
   	for (var p = 0; p < numeroParticulas; p++) {
	  var pX = Math.random() * (max - min + 1) + min,
	      pY = Math.random() * (max - min + 1) + min,
	      pZ = Math.random() * (max - min + 1) + min,
	      particle = new THREE.Vector3(pX, pY, pZ);
	      verticesArray.push({ x: pX, y: pY, z: pZ });
	  	  boxGeometry.vertices.push(particle);
	} 
	//var discTexture = THREE.ImageUtils.loadTexture( 'images/disc.png' );
	var particleMaterial = new THREE.ParticleBasicMaterial({ size: 0.02, color: 0x333333, transparency: true, opacity: 0.5 });
	particleCube = new THREE.Points( boxGeometry, particleMaterial );
	particleCube.position.set(0, 0, 0);
	scene.add( particleCube );
}

function addSpritesLetters(lettersArray){

	for( var a= 0; a< lettersArray.length; a++ ){
		var map = new THREE.TextureLoader().load( "images/letters/"+ lettersArray[a] +".png" );
	    var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
	    var sprite = new THREE.Sprite( material );
	    sprite.position.x = 0.08 * a;
	    sprite.position.z = -3;
	    sprite.scale.set( 0.1, 0.1, 0.1 );
	    camera.add( sprite );
	}
}

function addScreens(){

	videoMP4 = document.createElement('video').canPlayType('video/mp4') !== '' ? true : false;
	videoOgg = document.createElement('video').canPlayType('video/ogg') !== '' ? true : false;

	if( videoMP4 ){
		var url	= 'videos/sintel.mp4';
		console.log('play mp4');
	}
	else if( videoOgg ){
		var url	= 'videos/sintel.ogv';
		console.log('play ogg');
	}
	else alert('cant play mp4 or ogv')

	videoTexture= new THREEx.VideoTexture(url);
	video = videoTexture.video;

	var geometry = new THREE.PlaneGeometry( 0.4, 0.25, 1, 1 );
	var material = new THREE.MeshBasicMaterial({ map	: videoTexture.texture, overdraw: true, side:THREE.DoubleSide });
	var mesh	= new THREE.Mesh( geometry, material );
	mesh.position.set( -0.225 , 1.13 , 0.74 );
	mesh.rotateY( -Math.PI/2 );
	mesh.name = 'screen1';

	var mesh2 = new THREE.Mesh( geometry, material );
	mesh2.position.set( -0.225 , 1.13 , 4.15 );
	mesh2.rotateY( -Math.PI/2 );
	mesh2.name = 'screen2';

	screensGroup.add( mesh );
	screensGroup.add( mesh2 );

	scene.add(screensGroup);
}

function addTravelPoints(){

	var locationPoints = [{ x: -2, y: 1.4, z: 5 }, { x: -2, y: 1.4, z: 1 }, { x: -2, y: 1.4, z: -2 }];

	for ( var a = 0; a < locationPoints.length; a++ ){
		var geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		var material = new THREE.MeshBasicMaterial( {color: 0xcccc00} );
		var cube = new THREE.Mesh( geometry, material );
		cube.position.set( locationPoints[a].x , locationPoints[a].y, locationPoints[a].z );
		cube.name = "travelPoints"+a;
		travelPoints.add( cube );
		scene.add( travelPoints );
	}
}

function explodeGeometry(){
	for( var a = 0; a < numVertices; a+=3 ){
		var number =  Math.random() * (1 - 4) + 1;
		//cylinder.geometry.vertices[ a ].multiplyScalar( 0.3 );
		//cylinder.geometry.vertices[ a+1 ].multiplyScalar( 0.3 );
		//cylinder.geometry.vertices[ a+2 ].multiplyScalar( 0.3 );
		cylinder.geometry.vertices[ a ].z += 0.1;
		cylinder.geometry.vertices[ a+1 ].z += 0.1;
		cylinder.geometry.vertices[ a+2 ].z += 0.1;
		//cylinder.geometry.vertices[ THREE.Math.randInt( 0, cylinder.geometry.vertices.length ) ].multiplyScalar( 1.01 );
		cylinder.geometry.verticesNeedUpdate = true; // important
	}
}

function onDocumentMouseDown( e ) {
 /* e.preventDefault();
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( screensGroup.children );
   if ( intersects.length > 0 ) {
		if ( intersected != intersects[ 0 ].object ) {
			intersected = intersects[ 0 ].object;
			if( intersected.name == "screen1" ) clickOnELement(intersected);
			console.log('inters ', intersected);
			//if( video != undefined ) video.play();
		}
	}
	else if ( intersected ) {
		intersected = null;
	}*/
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	if ( effect != undefined ) effect.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	requestAnimationFrame( animate );

    TWEEN.update();

	render();

	if(controls) controls.update( clock.getDelta() );
	if(controlsdevice) { 
		controlsdevice.update(); 
		/*console.log('device control: ', controlsdevice.deviceOrientation.gamma);*/ 
	}
}

function render(){

	if(effect) { effect.render( scene, camera ); }
	else { renderer.render( scene, camera ); }

	sky.rotation.y += 0.0003;

	if( particleCube != undefined ) { particleCube.geometry.verticesNeedUpdate = true; /*particleCube.lookAt( camera.position );*/ }

	if( videoTexture != undefined ) videoTexture.update();

	//------------ MESAS INTERSECT -----------------------------

    raycasterMesas.setFromCamera( mouse, camera );
	var intersections = raycasterMesas.intersectObjects( interactivos.children );

	if ( intersections.length > 0 ) {
		if ( intersected != intersections[ 0 ].object ) {
			intersected = intersections[ 0 ].object;
			if( intersected.name == 'centro' ){
				loadingCircle();
				console.log(intersections[ 0 ].object.name); 
				if( particleCube != undefined ) particlesDisperse( radicalTextNParticles, 'radical');
				if( letrasRadical.children.length > 0 ){
					removeLetters3D();
	        		setTimeout( function(){  moveLetters3d(letrasRadical); }, 100 );  
				}
				document.body.style.cursor = 'pointer';
			}
			else if( intersected.name == 'design' ){
				loadingCircle();
				if( particleCube != undefined ) console.log(intersections[ 0 ].object.name); 
				if( letrasDesign.children.length > 0 ){
					removeLetters3D();
	        		setTimeout( function(){  moveLetters3d(letrasDesign); }, 100 );  
				}
				document.body.style.cursor = 'pointer';
			}
			else if( intersected.name == 'research' ){
				loadingCircle();
				console.log(intersections[ 0 ].object.name); 
				if( particleCube != undefined ) particlesDisperse( researchTextNParticles, 'research');
				if( letrasResearch.children.length > 0 ){
					removeLetters3D();
	        		setTimeout( function(){  moveLetters3d(letrasResearch); }, 100 );  
				}
				document.body.style.cursor = 'pointer';
			} 
		}
	}
	else if ( intersected ) {
		console.log('es null : ',intersected.name); 
		if( particleCube != undefined ) particlesDisperse( 2000, 'disperse');
		//video.play();
		removeLetters3D(); 
		LoadingReset();
		intersected = null;
		document.body.style.cursor = 'auto';
	}

   //-------- SCREENS INTERSECT -----------	

   raycasterScreens.setFromCamera( mouse, camera );
   var intersectsScreen = raycasterScreens.intersectObjects( screensGroup.children );
   if ( intersectsScreen.length > 0 ) {
		if ( intersectedScreens != intersectsScreen[ 0 ].object ) {
   			loadingCircle();
			intersectedScreens = intersectsScreen[ 0 ].object;
			//if( intersectedScreens.name == "screen1" ) clickOnELement(intersectedScreens);
			console.log('inters ', intersectedScreens);
			//if( video != undefined ) video.play();
		}
		document.body.style.cursor = 'pointer';
	}
	else if ( intersectedScreens ) {
		LoadingReset();
		intersectedScreens = null;
		document.body.style.cursor = 'auto';
	}

	//--------------- TRAVEL POINTS INTERSECT ------------------

    raycasterTravel.setFromCamera( mouse, camera );
    var intersectTravel = raycasterTravel.intersectObjects( travelPoints.children );
    if ( intersectTravel.length > 0 ) {
		if ( intersectedTravel != intersectTravel[ 0 ].object ) {
			loadingCircle();
			intersectedTravel = intersectTravel[ 0 ].object;
			console.log(intersectedTravel);
			movement({ x: intersectedTravel.position.x, y: 1.1, z: intersectedTravel.position.z }, camera.position, delayTriger, 5000, TWEEN.Easing.Quartic.Out );
			//loadcrosshair.scale.set( 0.01, 0.01 ,0.01 );
		}
		document.body.style.cursor = 'pointer';
	}
	else if ( intersectedTravel ) {
		intersectedTravel = null;
		LoadingReset();
		document.body.style.cursor = 'auto';
	}

	//-----------------------------------------------------------------------		

	/*if(cylinder != undefined ){
		for( var a = 0; a < numVertices; a+=3 ){
			var number =  Math.random()+1;
			cylinder.geometry.vertices[ a ].multiplyScalar( number );
			cylinder.geometry.vertices[ a+1 ].multiplyScalar( number );
			cylinder.geometry.vertices[ a+2 ].multiplyScalar( number );
			//cylinder.geometry.vertices[ THREE.Math.randInt( 0, cylinder.geometry.vertices.length ) ].multiplyScalar( 1.01 );
			cylinder.geometry.verticesNeedUpdate = true; // important
		}
	}*/
}

function loadingCircle(){
	if( loadcrosshair != undefined ) { 
		tweenCircleIn = new TWEEN.Tween(loadcrosshair.scale).to({ x: 0.01, y: 0.01, z: 0.01 }, delayTriger).easing(TWEEN.Easing.Quartic.In).onUpdate(function () {}).delay(0).start();
	}
}

function LoadingReset(){
	if( loadcrosshair != undefined ) { 
		tweenCircleIn.stop();
		tweenCircleOut = new TWEEN.Tween(loadcrosshair.scale).to({ x: 1, y: 1, z: 1 }, 200).easing(TWEEN.Easing.Quartic.In).onUpdate(function () {}).delay(0).start(); 
	};
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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}
function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + 
    "Longitude: " + position.coords.longitude); 
}

//getLocation();

