/*var scene = document.getElementById('scene');
var parallax = new Parallax(scene, {
  calibrateX: false,
  calibrateY: true,
  invertX: false,
  invertY: true,
  limitX: false,
  limitY: 10,
  scalarX: 8,
  scalarY: 2,
  frictionX: 0.2,
  frictionY: 0.8
});*/

/*$(document).ready(function() {
    $('#svgMap').each(function(){
        var img         = $(this);
        var image_uri   = img.attr('src');
        $.get(image_uri, function(data) {
        	console.log(data.getElementById('rusia'));
            var svg = $(data).find('svg');
            svg.removeAttr('xmlns:a');
            img.replaceWith(svg);
        	$('#rusia').css("fill","red");
        }, 'xml');
    });
});*/

//animationcontrols
//setTimeout(function(){ sayAplayer.paused = true; }, 10);
//sayAplayer.loop = THREE.LoopPingPong;
//sayAplayer.repetitions = 0;
//setTimeout(function(){ sayAplayer.stop(); }, 1000);  //sayAplayer.stop();
//sayAplayer.reset();
//setTimeout(function(){ cejaIzqPlayer.stop(); }, 300);

/*$(document).on("keydown", function (e) {
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
});*/

/*<fieldset>
  <input type="checkbox" id="stark">
  <label for="stark">Stark</label>
  <input type="checkbox" id="lannister">
  <label for="lannister">Lannister</label>
  <input type="checkbox" id="baratheon">
  <label for="baratheon">Baratheon</label>
</fieldset>
<ul id="scene">
  <li class="layer" data-depth="0.00"><img style="width: 110%;height: 30%" src="images/weather/fondoNoche.png"></li>
  <li class="layer" data-depth="0.10"><img style="width: 110%;height: 30%" src="images/weather/monte1.png"></li>
  <li class="layer" data-depth="0.20"><img style="width: 110%;height: 30%" src="images/weather/monte2.png"></li>
  <li class="layer" data-depth="0.60"><img style="width: 110%;height: 30%" src="images/weather/borrasca2.png"></li>
  <li class="layer" data-depth="0.40"><img style="width: 110%;height: 30%" src="images/weather/borrasca1.png"></li>
  <li class="layer" data-depth="0.80"><img style="width: 110%;height: 30%" src="images/weather/arbolOto.png"></li>
</ul>*/

//<img class="svg mapStyle" id="svgMap" src="images/europe.svg" alt="europe map">

/*var womanSayAnimation, womanSayUAnimation, womanLeftEyeHappynimation, womanRightEyeHappynimation, womanHappyMouthLeftnimation, womanHappyMounthRightnimation, womanCloseLeftEyenimation, womanCloseRightEyenimation,
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
*/