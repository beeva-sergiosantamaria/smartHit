
var camera, scene, renderer, mesh, mouse, controls, controlsdevice, cylinder, uniforms, numVertices, effect, intersected, mesa,
	width = window.innerWidth, 
	height = window.innerHeight;

var clock = new THREE.Clock();
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

var manager = new THREE.LoadingManager();

var mesas = new THREE.Object3D();

var baseColor = 0xFFFFFF;
var foundColor = 0xFFFFFF;
var intersectColor = 0xffff33;

$( document ).ready(function() {
	startLogoAnim();
});

function initRender() {


	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true, alpha: true } );
	//renderer.sortObjects = false;
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
	camera.viewport = { x: 0, y: 0, width: width, height: height }
	camera.position.set( 0, 0, 0.1 );

	if (window.DeviceOrientationEvent && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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

    ambientLight = new THREE.AmbientLight(0x888888);
    ambientLight.position.set(0,0.6,0);
    scene.add(ambientLight);

	buildShape();

	scene.add(mesas);

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	function onDocumentMouseMove( event ) {

	    event.preventDefault();

	    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}
}

function buildShape(){

	var geometry = new THREE.CylinderGeometry( 5.5, 5.5, 6.5, 32, 1, true );
	var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/ofi.jpg'), side: THREE.DoubleSide, transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: true  });

	cylinder = new THREE.Mesh( geometry, material );

	scene.add( cylinder );

	var onProgress = function ( xhr ) {
			if ( xhr.lengthComputable ) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log(percentComplete);
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
		mtlLoader.setPath( 'models/' );
		mtlLoader.load( 'mesa.mtl', function( materials ) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( 'models/' );	
			objLoader.load( 'mesa.obj', function ( elements ) {

				console.log(elements);

				mesa = elements.children[0];
				mesa.material = new THREE.MeshLambertMaterial({ transparent: true,  opacity: 1, color: 0xFFFFFF });
				mesa.name = "mesaCentro";
				mesa.position.x = 2.25;
				mesa.position.z = -1.5;
				mesa.position.y = -0.05;
				mesa.rotation.y = -0.2;

				mesas.add(mesa);

			}, onProgress, onError );
		});

	/*var geometry = new THREE.CylinderGeometry( 2.5, 1, 2, 64, 1, true );
	var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/centro.png'), side: THREE.DoubleSide, transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: false  });

	cylinder = new THREE.Mesh( geometry, material );

	scene.add( cylinder );

	var geometry = new THREE.CylinderGeometry( 2.5, 1, 2, 64, 1, true );
	var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/research.png'), side: THREE.DoubleSide, transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: false  });

	cylinder = new THREE.Mesh( geometry, material );

	scene.add( cylinder );*/
	
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

function movement(value, object, delay, duration){
    var tween = new TWEEN.Tween(object).to(
      	 value
    	,duration).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
          }).delay(delay).start();
}

function animate() {

	requestAnimationFrame( animate );

    TWEEN.update();

	render();

	if(controls) controls.update( clock.getDelta() );
	if(controlsdevice) { controlsdevice.update(); console.log('device control: ', controlsdevice.deviceOrientation.gamma); }
}
function render(){

	if(effect) effect.render( scene, camera );
    else renderer.render( scene, camera );

    raycaster.setFromCamera( mouse, camera );
    var intersections = raycaster.intersectObjects( mesas.children );

    if ( intersections.length > 0 ) {
    	console.log('ontersections on');
		if ( intersected != intersections[ 0 ].object ) {
			if ( intersected ) intersected.material.color.setHex( baseColor );
			intersected = intersections[ 0 ].object;
			intersected.material.color.setHex( intersectColor );
		}
		document.body.style.cursor = 'pointer';
	}
	else if ( intersected ) {
    	console.log('ontersections off');
		intersected.material.color.setHex( baseColor );
		intersected = null;
		document.body.style.cursor = 'auto';
	}

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

