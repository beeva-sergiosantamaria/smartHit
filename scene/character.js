
function buildModel(){
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) { };
	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( 'models/' );
	mtlLoader.load( 'bridge2.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( 'models/' );
		objLoader.load( 'bridge2.obj', function ( object ) {
			object.rotation.x = 0.07;
			object.position.set( 0, -3.5, -6 );
			object.receiveShadow = true;
			object.castShadow = true;
			scenario.add( object );
		}, onProgress, onError );
	});
	scene.add(scenario);
}
function addCart( name ){
	if ( name == 'car1' ) var objectToBuild = 'cart2W';
	else var objectToBuild = 'cart4W';

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) { };
	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( 'models/' );
	mtlLoader.load( objectToBuild + '.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( 'models/' );
		objLoader.load( objectToBuild + '.obj', function ( object ) {
			object.rotation.x = 0.07;
			object.position.set( 0, 17, -38.5 );
			object.receiveShadow = true;
			object.castShadow = true;
			object.name = 'car';
			character.add( object );
		   	movement( { 'x': 0, 'y': 2, 'z': -36.6 }, object.position, 0, 2000, TWEEN.Easing.Bounce.Out );
		}, onProgress, onError );
	});
}

function buildCharacter(){
	var loader = new THREE.JSONLoader();
	loader.load('models/muppedAnim2.json', function (geometry, materials) {
	    materials.forEach(function (material) {
	      material.skinning = true;
	    });
	    var bodyMesh = new THREE.SkinnedMesh(
	      geometry,
	      new THREE.MeshFaceMaterial(materials)
	    );

	    mixer = new THREE.AnimationMixer(bodyMesh);

	    action.convert = mixer.clipAction(geometry.animations[ 0 ]);
	    action.convertInit = mixer.clipAction(geometry.animations[ 1 ]);
	    action.hit = mixer.clipAction(geometry.animations[ 2 ]);
	    action.stand = mixer.clipAction(geometry.animations[ 3 ]);
	    action.walk = mixer.clipAction(geometry.animations[ 4 ]);

	    action.convert.setEffectiveWeight(1);
	    action.convertInit.setEffectiveWeight(1);
	    action.stand.setEffectiveWeight(1);
	    action.hit.setEffectiveWeight(1);
	    action.walk.setEffectiveWeight(1);

	    action.stand.setLoop(THREE.LoopOnce, 0);
	    action.stand.clampWhenFinished = true;

	    action.convert.enabled = true;
	    action.convertInit.enabled = true;
	    action.hit.enabled = true;
	    action.stand.enabled = true;
	    action.walk.enabled = true;

	    bodyMesh.position.set( 0, 3.2, -39.5 );

		character.add(bodyMesh);

	    action.walk.play();
	  });

		addCharacterLights(0xff6666, { 'x': 2, 'y': 0, 'z': 0 });
		addCharacterLights(0x9999ff, { 'x': -2, 'y': 0, 'z': 0 });
		addCharacterLights(0x66ff66, { 'x': 0, 'y': 0, 'z': 2 });
		addCharacterLights(0xffff66, { 'x': 0, 'y': 0, 'z': -2 });

		scene.add(character);
}

function addCharacterLights(colour, positioned){

	var light = new THREE.PointLight( colour, 1, 10, 2);
	light.position.set( positioned.x, positioned.y, positioned.z );
	characterLights.add( light );

	var textureGlass = new THREE.TextureLoader().load( "images/particles/Static/Glows/Flare1.png" );
	var spriteMaterialGlass = new THREE.SpriteMaterial({ map: textureGlass, color: colour, transparent : true, opacity: 0.5 } );
	var spriteGlass = new THREE.Sprite( spriteMaterialGlass );
	    spriteGlass.scale.set(3,3,1);
	    spriteGlass.position.set( positioned.x, positioned.y, positioned.z );
	characterLights.add( spriteGlass );

	var geometry = new THREE.SphereGeometry( 0.05, 16, 16 );
	var material = new THREE.MeshBasicMaterial( {
		color: colour,
		transparent: true,
		opacity: 0.8
	} );

	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set( positioned.x, positioned.y, positioned.z );
	characterLights.add( sphere );

	characterLights.position.set( 0, 4, -38.7 );

	character.add(characterLights);
}

function lightSet(colour, positioned){ 

    var geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
	var material = new THREE.MeshBasicMaterial( {
		color: colour,
		transparent: true,
		opacity: 0.5
	} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set( positioned.x, positioned.y, positioned.z );
	scenarioLights.add( sphere );

	var geometryTarget = new THREE.SphereGeometry( 0.1, 2, 2 );
	var materialTarget = new THREE.MeshBasicMaterial( {
		color: colour,
		transparent: true,
		opacity: 0
	} );
	var sphereTarget = new THREE.Mesh( geometryTarget, materialTarget );
	sphereTarget.position.set( positioned.x, -1.5, positioned.z );
	scenarioLights.add( sphereTarget );

	var textureGlass = new THREE.TextureLoader().load( "images/particles/Static/Glows/Flare7.png" );
	var spriteMaterialGlass = new THREE.SpriteMaterial({ map: textureGlass, color: colour, transparent : true, opacity: 0.5 } );
	var spriteGlass = new THREE.Sprite( spriteMaterialGlass );
	    spriteGlass.scale.set(2,2,1);
	    spriteGlass.position.set( positioned.x, positioned.y, positioned.z + 0.2 );
	scenarioLights.add( spriteGlass );

    var spotLight = new THREE.SpotLight( colour, 2, 50, 1, 0.3, 1 );
	spotLight.position.set( positioned.x, positioned.y, positioned.z );
	spotLight.target = sphereTarget;
	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;

	scenarioLights.add( spotLight );

    scene.add(scenarioLights);
}

function addGate(){
	var loader = new THREE.JSONLoader();
	loader.load('models/gates.json', function (geometry, materials) {
	    materials.forEach(function (material) {
	      material.skinning = true;
	    });
	    var gateMesh = new THREE.SkinnedMesh(
	      geometry,
	      new THREE.MeshFaceMaterial(materials)
	    );

	    mixerGate = new THREE.AnimationMixer(gateMesh);

	    actionGate.close = mixerGate.clipAction(geometry.animations[ 0 ]);
	    actionGate.init = mixerGate.clipAction(geometry.animations[ 1 ]);
	    actionGate.open = mixerGate.clipAction(geometry.animations[ 2 ]);

	    actionGate.close.setEffectiveWeight(1);
	    actionGate.init.setEffectiveWeight(1);
	    actionGate.open.setEffectiveWeight(1);

	    actionGate.open.setLoop(THREE.LoopOnce, 0);
	    actionGate.open.clampWhenFinished = true;
	    actionGate.close.setLoop(THREE.LoopOnce, 0);
	    actionGate.close.clampWhenFinished = true;

	    actionGate.close.enabled = true;
	    actionGate.init.enabled = true;
	    actionGate.open.enabled = true;

	    gateMesh.rotation.x = 0.07;
	    gateMesh.position.set( 0, -3.5, -6 );

	    gateMesh.name = 'gate';

		scene.add(gateMesh);

		setTimeout(function(){ actionGate.open.play(); }, 3000 );	    
	  });
}