var womanSayAnimation, womanSayUAnimation, womanLeftEyeHappynimation, womanRightEyeHappynimation, womanHappyMouthLeftnimation, womanHappyMounthRightnimation, womanCloseLeftEyenimation, womanCloseRightEyenimation,
womanHappyMouthnimation, womanOpenLeftEyenimation, womanOpenRightEyenimation, womanCejaLeftUpnimation, womanCejaRightUpnimation, womanCejaLeftDownnimation, womanCejaRightDownnimation, womanSadMounthnimation;

var womanSayAplayer, womanSayUplayer, womanLeftEyeHappyplayer, womanRightEyeHappyplayer, womanHappyMouthLeftplayer, womanHappyMounthRightplayer, womanCloseLeftEyeplayer, womanCloseRightEyeplayer,
womanHappyMouthplayer, womanOpenLeftEyeplayer, womanOpenRightEyeplayer, womanCejaLeftUpplayer, womanCejaRightUpplayer, womanCejaLeftDownplayer, womanCejaRightDownplayer, womanSadMounthplayer;

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
		womanSayUAnimation = THREE.AnimationClip.CreateFromMorphTargetSequence( 'u', sayU, 15, false );
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
		womanSayUplayer = womanMixer.clipAction( womanSayUAnimation ).setDuration( 0.5 );
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

function stopMounthAnimations(){
	womanSayAplayer.stop();
	womanSayUplayer.stop();
}

function stopAllAnims(){
	console.log('llama a stop anims');
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