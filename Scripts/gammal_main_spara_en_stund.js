////*****************////
////   Variabler Def ////
////*****************////

//FPS Detta behlvs byta ut mot tid delta
var fps = 120;

// De viktiga variablerna för kamera osv
var camera, scene, renderer,rendererStats, canvas;
var n = 0;
//Tar in storleken av fönstret
var windowHalfX = window.innerWidth ;
var windowHalfY = window.innerHeight ;

var hiss = false;

//Lista med url till modeller
var player_url = "./Models/Animation .JD";
var model_url = ["./Models/Levels/Level2/golv1.jd","./Models/Levels/Level2/lada1.jd","./Models/Levels/Level2/vagg1.jd","./Models/Levels/Level2/vagg2.jd","./Models/Levels/Level2/vagg3.jd","./Models/Levels/Level2/vagg4.jd"];
var objectiv_url = "./Models/Levels/Level1/key.jd";

//Object som skapas
var player, objectiv;
var models = [model_url.length];

//Kollisions variablerna
var boxobject = [model_url.length];
var objectiv_crash;


// Mina object som skapas.
var Cboll = new THREE.Group();
var cBoll2 = new THREE.Group();
var cBollJump = new THREE.Group();
var cBollJump2 = new THREE.Group();
var cBollJumpPos;
var cBollJumpPos2;

var collision;
var collidableMeshList = [model_url.lenght];
//Klass som handskar tangenbordstryck
var keyboard= new THREEx.KeyboardState();

var can_jump = true;
var in_air = false;
var grav = -0.5;

var still_count = 0;



var speedX = 0;
var speedY = 0;
var speedZ = 0;

var veloY = 0;

//Variable for modell
var meshes = [];
var mixers = [];
var clock = new THREE.Clock; 
var loader = new THREE.JDLoader();
var delta;
var material;


////*****************////
//// Tansformationer ////
////*****************////

//Vrider kameran så att man ser snett uppifrån
var kamera_initial_pos = new THREE.Group();
kamera_initial_pos.rotation.x = -Math.PI/5;
kamera_initial_pos.translateZ(-1)

////*****************////
////   Funktioner!!! ////
////*****************////

//Funktion som startar allt, kallas från html filen
function start()
{
	createscene()
  	draw();
}

//Sätter upp alla modeller och scenen
function createscene()
{	
	// Tar in information från html filen, dvs storleken på diven
	canvas = document.getElementById('canvas');
	
	//Uppsättning av kameran med perspektivmatris och avstånd
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth/window.innerHeight, 0.1, 10000);
	camera.position.z = 700;
	
	//Skapar scenen
	scene = new THREE.Scene();


	//Här skapar jag scengrafen
	var ambient = new THREE.AmbientLight( 0x444444, 1 );
	scene.add( ambient );
	
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 50, 50, 50 ).normalize();
	scene.add( directionalLight );

	//Laddar modellerna
	for(var i = 0; i<model_url.length; ++i){	
		models[i] = new Mloader(model_url[i],false)
		modell_loader(models[i]);
		scene.add(models[i].object);
	}
	//Laddar objektivet
	objectiv = new Mloader(objectiv_url,false)
	modell_loader(objectiv);
	scene.add(objectiv.object);
	
	//Laddar spelaren
	player = new Mloader(player_url,true)
	modell_loader(player);
	scene.add(player.object);
	
	
	player.object.translateY(100);	
	player.object.add(kamera_initial_pos);
	kamera_initial_pos.add(camera);

	

	//Set the rendering settings
	render_options();

	//Kopplar en lyssnare till window. Ifall man ändrar storleken på fönstret så kommer den köra "onWindowResize"
	window.addEventListener( 'resize', onWindowResize, false );

	//Lägger in så att det som renderas hamnar i diven
	canvas.appendChild(renderer.domElement);

	render_checkbox();

}

//rendreringsloopen behövs delas upp!!!!!
function draw()
{
	setTimeout(function() {
	
	// draw THREE.JS scene
	renderer.render(scene, camera);
	rendererStats.update(renderer);
	
	if(keyboard.pressed("up") || keyboard.pressed("down")){
	var delta = clock.getDelta();
		player.mixers[3].update(delta); 
		still_count = 0;
	}else{
		still_count ++;
		if(still_count >=120 && still_count<= 180){
			var delta = clock.getDelta();
			//for (var i = 0; i <  player.mixers.length; ++i)
			player.mixers[1].update(delta);
			if(still_count ===180){
				still_count = 0;
				player.mixers[1].time = 0;
			}
		}
	}
	
    


	// Loopar över draw functionen och sänker fps'n till 60fps
	

	for(var i=0; i <models.length;++i){
		boxobject[i] = new THREE.Box3().setFromObject(models[i].object);
	}
	objectiv_crash = new THREE.Box3().setFromObject(objectiv.object);
	var player_crash = new THREE.Box3().setFromObject(player.object);
	
	//myFunc(boxobject);
	cBollJump = player.object.clone();
	cBollJump2 = player.object.clone();
	cBoll = player.object.clone();
	cBoll2 = player.object.clone();

	movement();
	gravity();
	if(player_crash.intersectsBox(objectiv_crash)){
		objectiv.object.visible= false;
		hiss = true;
	}
	
	if(hiss){
		models[1].object.position.y += 2;
	}
	


    requestAnimationFrame(draw);

    }, 1000 / fps);


}
function gravity(){

	cBollJumpPos = cBollJump.translateY(-25).translateZ(-15).translateX(15).position;
	cBollJumpPos2 = cBollJump2.translateY(-25).translateZ(15).translateX(-15).position;
	/*console.log('först:');
	console.log(cBollJumpPos);
	console.log('andra:');
	console.log(cBollJumpPos2);*/
	
	var bool = false;
	
	for (var i = 0; i < boxobject.length; i++)
	{
		if( boxobject[i].containsPoint(cBollJumpPos)|| boxobject[i].containsPoint(cBollJumpPos2)){
			bool = true;
		
		}

	}
	
	if(!(bool))
		{
			in_air = true;
			n++;
	 }	
	
	if(in_air){
		if( bool){
			speedY = 0;
		
		}
	}
	

	if(bool){
				setTimeout(function() {in_air = false;}, 10);
				//in_air = false;
				n = 0;

	}
	
	
	//console.log(playerobject.intersectsBox(boxobject))

/*	if(boll.position.y > 10 && !(playerobject.intersectsBox(boxobject))){
		in_air = true;
		n++;
			
	}
	if(in_air){
		if( boll.position.y <= 10 || playerobject.intersectsBox(boxobject)){
			speedY = 0;
			
		}
	}
	if( boll.position.y <= 10 || playerobject.intersectsBox(boxobject)){
				setTimeout(function() {in_air = false;}, 10);
				//in_air = false;
				n = 0;

	}*/
	//boll.position.x += speedX;
	//boll.position.z += speedZ;
	player.object.position.y += speedY + grav*(n/2);
	//boll.position.x += speedX;


	
}

//Sätter renderings inställningar
function render_options(){
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0x00000 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
}

//Handksar om man byter storlek på skärmen "Stefans"
function onWindowResize() {
				windowHalfX = window.innerWidth ;
				windowHalfY = window.innerHeight ;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
			}

function render_checkbox()
{
	rendererStats= new THREEx.RendererStats()
	rendererStats.domElement.style.position	= 'absolute'
	rendererStats.domElement.style.bottom	= '0px'
	document.body.appendChild( rendererStats.domElement )
}





function movement(){

	//var delta = clock.getDelta(); // seconds.
	var moveDistance = 10;//200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI/50; //Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

	

	if(keyboard.pressed("left"))
    {	
	//boll.position.x -= 0.1;
	//boll.rotation.y += Math.PI/2;
	//speedX = -0.1;
		player.object.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	
	
	}
	if(keyboard.pressed("right"))
    {	
	//boll.position.x += 0.1;
	//boll.rotation.y = -Math.PI/2;
	//speedX = 0.1;
		player.object.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	}
	if(keyboard.pressed("up"))
    {	
	//boll.position.z -= 0.1;
	//boll.rotation.y = 0;
	//speedZ = -0.1;
	/*console.log('första:');
	console.log(cBoll.translateZ(-20).translateX(15).position);
	console.log('andra:');
	console.log(cBoll2.translateZ(-20).translateX(-15).position);*/
		for(var i =0;i<boxobject.length;++i){
			if(!(boxobject[i].containsPoint(cBoll.translateZ(-20).translateX(15).position)) && !(boxobject[i].containsPoint(cBoll2.translateZ(-20).translateX(-15).position))){
				
				player.object.translateZ( -moveDistance );
			}
		}
		
	
	
	}
	
	if(keyboard.pressed("down"))
    {	
	//dboll.position.z += 0.1;
	//boll.rotation.y = Math.PI;
	//speedZ = 0.1;
		for(var i =0;i<boxobject.length;++i){	
			if(!(boxobject[i].containsPoint(cBoll.translateZ(20).translateX(15).position)) && !(boxobject[i].containsPoint(cBoll2.translateZ(20).translateX(-15).position))){
			player.object.translateZ( moveDistance );
			}
		}
	}
	if(keyboard.pressed("QLeft"))
    {	
		for(var i =0;i<boxobject.length;++i){
			if(!(boxobject[i].containsPoint(cBoll.translateX(-20).translateZ(15).position)) && !(boxobject[i].containsPoint(cBoll2.translateX(-20).translateZ(-15).position))){
			player.object.translateX( -moveDistance );
		}
	}
	
	}

	if(keyboard.pressed("ERigth"))
    {	
		for(var i =0;i<boxobject.length;++i)
		{
			if(!(boxobject[i].containsPoint(cBoll.translateX(20).translateZ(15).position)) && !(boxobject[i].containsPoint(cBoll2.translateX(20).translateZ(-15).position))){
			player.object.translateX( moveDistance );
		}
	}
	}

	if(keyboard.pressed("space"))
    {	
    	if(!(in_air)){
    		speedY = 10; //5
			

    	}
	}



/*
addEventListener("keydown", function(event) {
    if (event.keyCode == 32){
    	if(!(in_air)){
    		speedY = 0.3;
    	}
     		
    }
     
  });
*/

}

modell_loader = function(object)
{	
	loader.load(object.url,function (data)
	{
		
		var multiMaterial = new THREE.MultiMaterial(data.materials);
		for (var i = 0; i < data.geometries.length; ++i)
		{
			var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
			object.meshes.push(mesh);
			object.object.add(mesh);
			
			if(object.animation)
			{
				if (mesh.geometry.animations)
                  {
					  
                     var mixer = new THREE.AnimationMixer(mesh);
                     object.mixers[0]= mixer;
                     mixer.clipAction(mesh.geometry.animations[0]).play();
					 
					 var mixer1 = new THREE.AnimationMixer(mesh);
                     object.mixers[1]= mixer1;
                     mixer1.clipAction(mesh.geometry.animations[1]).play();
					 
					 var mixer2 = new THREE.AnimationMixer(mesh);
                     object.mixers[2]= mixer2;
                     mixer2.clipAction(mesh.geometry.animations[2]).play();
					 
					 var mixer3 = new THREE.AnimationMixer(mesh);
                     object.mixers[3]= mixer3;
                     mixer3.clipAction(mesh.geometry.animations[3]).play();
					 
					 
					 
                  }
			}
		}
	});
	
} 