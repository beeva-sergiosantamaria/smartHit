
var camera, scene, renderer, mesh, mouse, controls, cylinder, uniforms, numVertices,
	width = window.innerWidth, 
	height = window.innerHeight;

var clock = new THREE.Clock();
var mouse = new THREE.Vector2();

var manager = new THREE.LoadingManager();

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
	camera.position.set( 0, 0, 0.1 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
	controls.dampingFactor = 0.70;
	controls.enableZoom = true;

    ambientLight = new THREE.AmbientLight(0x888888);
    ambientLight.position.set(0,0.6,0);
    scene.add(ambientLight);

	buildShape();

	window.addEventListener( 'resize', onWindowResize, false );

	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5;
	}, false)

	$(document).on("keydown", function (e) {
		console.log(e.keyCode);
		if (e.keyCode == '69' ) {
    		//explodeGeometry();
	    }
    	if (e.keyCode == '38' ) {
    		//explodeGeometry();
	    }
	    else if (e.keyCode == '40') {
	    }
	    else if (e.keyCode == '37') {
	    }
	    else if (e.keyCode == '39') {
	    }
	});
}

function buildShape(){

	var geometry = new THREE.CylinderGeometry( 2.5, 2.5, 3, 32, 1, true );
	var material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('images/ofi.jpg'), side: THREE.DoubleSide, transparent: true,  opacity: 1, color: 0xFFFFFF, depthWrite: false  });

	cylinder = new THREE.Mesh( geometry, material );

	scene.add( cylinder );

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
}
function render(){
	renderer.render(scene,camera);

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

