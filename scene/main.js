
var camera, scene, renderer, mesh, mouse, controls, controlsdevice, uniforms, numVertices, effect, intersected, centro, design, research, clever, sillas,
	comunicacion, pared, sky, cristaleraFrontal, cristaleraEntrada, cristaleraAgora, banco, plane, particleCube, radicalText, radicalTextNParticles, researchText, researchTextNParticles,
	width = window.innerWidth, 
	height = window.innerHeight;

var clock = new THREE.Clock();
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

var manager = new THREE.LoadingManager();

var planta = new THREE.Object3D();
var interactivos = new THREE.Object3D();

var disperseParticles = { nParticles: 2000, path: 'disperse' }
var particlesActive;
var min = -3, max = 3;

var baseColor = 0xFFFFFF;
var foundColor = 0xFFFFFF;
var intersectCentroColor = 0xffff33;
var intersectResearchColor = 0x33ff33;
var intersectDesignColor = 0x3333ff;

$( document ).ready(function() {
	startLogoAnim();
});

$(document).on("keydown", function (e) {
	if (e.keyCode == '38' ) {
        particlesDisperse( radicalTextNParticles, 'radical');
    }
    else if (e.keyCode == '40') {
    	particlesDisperse( researchTextNParticles, 'research');
    }
    else if (e.keyCode == '37') {
        particlesDisperse( 2000, 'disperse');
    }
    else if (e.keyCode == '39') {
        particlesDisperse( researchTextNParticles, 'research');
    }
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
	container.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera( 60, (width/height), 0.01, 10000000 );
	//camera.position.set( 0, 1.4, 0 );
	//camera.viewport = { x: 0, y: 0, width: width, height: height }
	camera.position.set( -0.5, 1.1, -1.7 );

	if (window.DeviceOrientationEvent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		//console.log('navigator: ', navigator);
        console.log("Oriented device");
        effect = new THREE.StereoEffect(renderer);
        effect.setSize(window.innerWidth, window.innerHeight);
        effect.setEyeSeparation = 0.5;
        controlsdevice = new THREE.DeviceOrientationControls( camera );
        controlsdevice.connect();
        document.onclick = function () {
            //toggleFullscreen();
        };
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

	function onDocumentMouseMove( event ) {

	    event.preventDefault();

	    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}
}

function buildShape(){

	/*var loader = new THREE.FontLoader();
	loader.load( 'scene/fonts/droid_sans_bold.typeface.js', function ( font ) {
		radicalText = new THREE.TextGeometry( 'Radical', {
			font: font,
			size: 0.1,
			height: 0,
			curveSegments: 1,
			/*bevelEnabled: true,
			bevelThickness: 5,
			bevelSize: 2
		});
		researchText = new THREE.TextGeometry( 'Research', {
			font: font,
			size: 0.1,
			height: 0,
			curveSegments: 1,
			/*bevelEnabled: true,
			bevelThickness: 5,
			bevelSize: 2
		});
		var modifier = new THREE.SubdivisionModifier( 1 );
        	modifier.modify( radicalText );
        	modifier.modify( researchText );
        radicalTextNParticles = radicalText.vertices.length;
        researchTextNParticles = researchText.vertices.length;	
        console.log('radicalText: ', radicalText);	
	});

   	var boxGeometry = new THREE.Geometry();
   	for (var p = 0; p < 2000; p++) {
	  var pX = Math.random() * (max - min + 1) + min,
	      pY = Math.random() * (max - min + 1) + min,
	      pZ = Math.random() * (max - min + 1) + min,
	      particle = new THREE.Vector3(pX, pY, pZ);
	  	  boxGeometry.vertices.push(particle);
	} 	
	//var discTexture = THREE.ImageUtils.loadTexture( 'images/disc.png' );
	var particleMaterial = new THREE.ParticleBasicMaterial({ size: 0.02, color: 0x333333, transparency: true, opacity: 0.5 });
	particleCube = new THREE.Points( boxGeometry, particleMaterial );
	particleCube.position.set(0, 0, 0);

	scene.add( particleCube );*/		

	var skyGeometry = new THREE.SphereGeometry( 10, 32, 32 );
	var skyMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/sky2.jpg'), side: THREE.DoubleSide, transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: true  });
	sky = new THREE.Mesh( skyGeometry, skyMaterial );
	sky.renderOrder = 0;
	sky.rotation.y = 1.7;

	scene.add( sky );

	var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				//console.log(percentComplete);
				if(percentComplete == 100) {
					setTimeout( function() {
					
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

				techo = elements.children[10];
				techo.renderOrder = 0;
				techo.name = "techo";

				planta.add(techo);

				banco = elements.children[9];
				banco.renderOrder = 0;
				banco.name = "banco";

				planta.add(banco);

				cristaleraEntrada = elements.children[8];
				cristaleraEntrada.renderOrder = 1;
				cristaleraEntrada.name = "cristaleraEntrada";

				planta.add(cristaleraEntrada);

				pared = elements.children[7];
				pared.renderOrder = 0;
				pared.name = "pared";

				planta.add(pared);

				cristaleraAgora = elements.children[6];
				cristaleraAgora.renderOrder = 1;
				cristaleraAgora.name = "cristaleraAgora";

				planta.add(cristaleraAgora);

				centro = elements.children[5];
				centro.renderOrder = 0;
				centro.name = "centro";

				interactivos.add(centro);

				research = elements.children[4];
				research.renderOrder = 0;
				research.name = "research";

				interactivos.add(research);

				design = elements.children[3];
				design.renderOrder = 0;
				design.name = "design";

				interactivos.add(design);

				comunicacion = elements.children[2];
				comunicacion.renderOrder = 0;
				comunicacion.name = "comunicacion";

				interactivos.add(comunicacion);

				clever = elements.children[1];
				clever.renderOrder = 0;
				clever.name = "clever";

				interactivos.add(clever);

				cristaleraFrontal = elements.children[0];
				cristaleraFrontal.renderOrder = 2;
				cristaleraFrontal.name = "cristaleraFrontal";

				planta.add(cristaleraFrontal);

				/*sillas = elements.children[0];
				sillas.renderOrder = 0;
				sillas.name = "sillas";

				planta.add(sillas);*/

				scene.add(planta);
				scene.add(interactivos);


			}, onProgress, onError );
		});
}

function particlesDisperse( Particles, path){
	/*if( disperseParticles.path != path){ 
   		for (var p = 0; p < disperseParticles.nParticles; p++) {
		  	var pX = Math.random() * (max - min + 1) + min,
			    pY = Math.random() * (max - min + 1) + min,
			    pZ = Math.random() * (max - min + 1) + min;
      		if( disperseParticles.path != 'disperse' ) movement( { x: pX, y: pY, z: pZ }, particleCube.geometry.vertices[p], 0 , 1000 ); 
	      	if( p == disperseParticles.nParticles - 1 && path != 'disperse' ) setTimeout( function(){ reorderParticles( Particles, path ) }, 100 );  
			else if( path == 'disperse' ) disperseParticles = { nParticles: 2000, path: 'disperse'};
	    } 
	}*/
}
	
function reorderParticles( Particles, path){
	/*if(path == 'radical'){
		particleCube.position.set( -2.7, 1, -2.1 );
		particleCube.lookAt( camera.position );
		for( var a = 0; a < Particles; a++ ){
			movement( { x: radicalText.vertices[a].x, y: radicalText.vertices[a].y, z: radicalText.vertices[a].z }, particleCube.geometry.vertices[a], 0.1*a, 1000 );
			if( a == Particles - 1 ) disperseParticles = { nParticles: Particles, path: 'radical'};
		}
	}
	else if(path == 'research'){
		particleCube.position.set( -2.7, 1, 1 );
		particleCube.lookAt( camera.position );
		for( var a = 0; a < Particles; a++ ){
			movement( { x: researchText.vertices[a].x, y: researchText.vertices[a].y, z: researchText.vertices[a].z }, particleCube.geometry.vertices[a], 0.1*a , 1000 );
			if( a == Particles - 1 )disperseParticles = { nParticles: Particles, path: 'research'};
		}
	}*/
}

function explodeGeometry(){
	console.log('explode geometry');
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

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	if (effect) effect.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	requestAnimationFrame( animate );

    TWEEN.update();

	render();

	if(controls) controls.update( clock.getDelta() );
	if(controlsdevice) { controlsdevice.update(); /*console.log('device control: ', controlsdevice.deviceOrientation.gamma);*/ }
}

function render(){

	if(effect) effect.render( scene, camera );
    else renderer.render( scene, camera );

    raycaster.setFromCamera( mouse, camera );
    var intersections = raycaster.intersectObjects( interactivos.children );

    if ( intersections.length > 0 ) {
		if ( intersected != intersections[ 0 ].object ) {
			/*if ( intersected ) intersected.material.color.setHex( baseColor );*/
			intersected = intersections[ 0 ].object;
			/*if( intersected.name == 'centro' ){
				console.log(intersections[ 0 ].object.name); 
				reorderParticles('radical');
				//intersected.material.color.setHex( intersectCentroColor );
				//movement( { x: 0, y: 0, z: 0 }, plane.rotation, 0, 200);
			}
			else if( intersected.name == 'design' ){
				console.log(intersections[ 0 ].object.name); 
				//intersected.material.color.setHex( intersectDesignColor);
			}
			else if( intersected.name == 'research' ){
				console.log(intersections[ 0 ].object.name); 
				reorderParticles('research');
				//intersected.material.color.setHex( intersectResearchColor);
			} */
			document.body.style.cursor = 'pointer';
		}
	}
	else if ( intersected ) {
		reorderParticles('none');
		//movement( { x: 3, y: 0, z: 0 }, plane.rotation, 0, 200);
		//intersected.material.color.setHex( baseColor );
		intersected = null;
		document.body.style.cursor = 'auto';
	}

	sky.rotation.y += 0.0003;

	if( particleCube != undefined ) { particleCube.geometry.verticesNeedUpdate = true; /*particleCube.lookAt( camera.position );*/ }

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

function movement(value, object, delay, duration){
    var tween = new TWEEN.Tween(object).to(
      	 value
    	,duration).easing(TWEEN.Easing.Back.Out).onUpdate(function () {
          }).delay(delay).start();
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

