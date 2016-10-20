
var camera, scene, renderer, mesh, mouse, controls, controlsdevice, cylinder, uniforms, numVertices, effect, intersected, centro, design, research, plane, sombras,
	width = window.innerWidth, 
	height = window.innerHeight;

var clock = new THREE.Clock();
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();

var manager = new THREE.LoadingManager();

var mesas = new THREE.Object3D();

var baseColor = 0xFFFFFF;
var foundColor = 0xFFFFFF;
var intersectCentroColor = 0xffff33;
var intersectResearchColor = 0x33ff33;
var intersectDesignColor = 0x3333ff;

$( document ).ready(function() {
	startLogoAnim();
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
	camera.position.set( -1.5, 1.1, -1.5 );

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

	var geometry = new THREE.SphereGeometry( 10, 32, 32 );
	var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/sky2.jpg'), side: THREE.DoubleSide, transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: true  });
	cylinder = new THREE.Mesh( geometry, material );
	cylinder.renderOrder = 0;
	cylinder.rotation.y = 1.7;

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
		mtlLoader.setPath( 'models/vrLabsModel/' );
		mtlLoader.load( 'planta6.mtl', function( materials ) {
			materials.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( materials );
			objLoader.setPath( 'models/vrLabsModel/' );	
			objLoader.load( 'planta6.obj', function ( elements ) {

				scene.add(elements);

				/*console.log(elements);

				centro = elements.children[0];
				centro.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('models/vrLabsModel/mesaTexture.jpg'), transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: false  });
				centro.name = "pared";

				scene.add(centro);*/

				/*centro = elements.children[0];
				centro.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('models/vrLabsModel/mesaTexture.jpg'), transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: false  });
				centro.name = "banco";

				scene.add(centro);*/

				/*centro = elements.children[10];
				centro.material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('models/vrLabsModel/mesaTexture.jpg'), transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: false  });
				centro.name = "banco";

				scene.add(centro);*/

				/*research = elements.children[2];
				research.material = new THREE.MeshLambertMaterial({ transparent: true,  opacity: 1, color: 0xFFFFFF });
				research.name = "research";
				research.position.x = 2.25;
				research.position.z = -1.5;
				research.position.y = -0.05;
				research.rotation.y = -0.2;

				mesas.add(research);

				design = elements.children[1];
				design.material = new THREE.MeshLambertMaterial({ transparent: true,  opacity: 1, color: 0xFFFFFF });
				design.name = "centro";
				design.position.x = 2.25;
				design.position.z = -1.5;
				design.position.y = -0.05;
				design.rotation.y = -0.2;

				mesas.add(design);

				sombras = elements.children[0];
				sombras.material = new THREE.MeshLambertMaterial({ transparent: true, side: THREE.DoubleSide,  opacity: 0.5, color: 0x333333 });
				sombras.name = "sombras";
				sombras.position.x = 2.25;
				sombras.position.z = -1.5;
				sombras.position.y = -0.05;
				sombras.rotation.y = -0.2;

				mesas.add(sombras);*/

			}, onProgress, onError );
		});
	mesas.renderOrder = 2;	
	scene.add(mesas);

	/*var planeGetometry = new THREE.PlaneGeometry( 0.8, 2.4, 1 );
	var planeMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/woman1.png'), transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: false  });
	plane = new THREE.Mesh( planeGetometry, planeMaterial );
	plane.position.set( 3.2, -0.8, -4.5 );
	plane.renderOrder = 1;
	plane.rotation.x = 3;
	plane.name = 'toy';
	scene.add( plane );*/

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
		if ( intersected != intersections[ 0 ].object ) {
			console.log(intersections[ 0 ].object.name); 
			if ( intersected ) intersected.material.color.setHex( baseColor );
			intersected = intersections[ 0 ].object;
			if( intersected.name == 'centro' ){
				intersected.material.color.setHex( intersectCentroColor );
				movement( { x: 0, y: 0, z: 0 }, plane.rotation, 0, 200);
			}
			else if( intersected.name == 'design' ){
				intersected.material.color.setHex( intersectDesignColor);
			}
			else if( intersected.name == 'research' ){
				intersected.material.color.setHex( intersectResearchColor);
			}
		}
		document.body.style.cursor = 'pointer';
	}
	else if ( intersected ) {
		movement( { x: 3, y: 0, z: 0 }, plane.rotation, 0, 200);
		intersected.material.color.setHex( baseColor );
		intersected = null;
		document.body.style.cursor = 'auto';
	}

	cylinder.rotation.y += 0.0001;

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
	console.log('entra movement');
    var tween = new TWEEN.Tween(object).to(
      	 value
    	,duration).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
          }).delay(delay).start();
}

