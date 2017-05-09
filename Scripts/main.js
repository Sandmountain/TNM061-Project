////*****************////
////   Variabler Def ////
////*****************////

//FPS Detta behlvs byta ut mot tid delta
var fps = 60;
var A_speed = 4;

// De viktiga variablerna för kamera osv
var camera, scene, renderer,rendererStats, canvas;
var n = 0;
//Tar in storleken av fönstret
var windowHalfX = window.innerWidth ;
var windowHalfY = window.innerHeight ;

//Lista med url till modeller
var player_url = "./Models/Mandel/Animation.JD";
var model_url = ["./Models/Levels/Level2/golv1.jd","./Models/Levels/Level2/lada1.jd","./Models/Levels/Level2/vagg1.jd","./Models/Levels/Level2/vagg2.jd","./Models/Levels/Level2/vagg3.jd","./Models/Levels/Level2/vagg4.jd"];
var objectiv_url = "./Models/Levels/Level1/key.jd";

//Object som skapas
var player;
var models = [model_url.length];

//Kollisions variablerna
var boxobject = [model_url.length];
var objectiv_crash;

// Mina object som skapas.
var Cboll = new THREE.Group();
var cBoll2 = new THREE.Group();
var cBoll3 = new THREE.Group();
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



var speedX = 0;
var speedY = 0;
var speedZ = 0;

var veloY = 0;

//Flyttar box
var hiss = false;

//Räknar frames som gubben står stilla
var still_count = 0;
var hopp_count = 0;

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
kamera_initial_pos.rotation.x = -Math.PI/8;
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
	camera.position.z = 800;
	
	
	//Skapar scenen
	scene = new THREE.Scene();
	
	//Här skapar jag scengrafen
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );
	
	
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set(0 , 100, 0 ).normalize();
	scene.add( directionalLight );

	
	/*******************************************
	*************Laddar modellerna**************
	*******************************************/
	//Object
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

	create_collisionBox()
	player.object.add(boxiF);
	boxiF.translateZ(-40).translateY(50).translateX(5);
	//box bak
	player.object.add(boxiB);
	boxiB.translateZ(55).translateY(50).translateX(5);
	//box Right
	player.object.add(boxiR);
	boxiR.translateZ(5).translateY(50).translateX(40);
	//Box LEft
	player.object.add(boxiL);
	boxiL.translateZ(5).translateY(50).translateX(-30);
	//Box ground
	player.object.add(boxiG);
	boxiG.translateZ(5).translateY(-2).translateX(10);
	//box top
	player.object.add(boxiT);
	boxiT.translateZ(15).translateY(100).translateX(10);
	
	boxiL.visible = false;
	boxiR.visible = false;
	boxiB.visible = false;
	boxiF.visible = false;
	boxiG.visible = false;
	boxiT.visible = false;
	

	//Set the rendering settings
	render_options();

	//Kopplar en lyssnare till window. Ifall man ändrar storleken på fönstret så kommer den köra "onWindowResize"
	window.addEventListener( 'resize', onWindowResize, false );

	//Lägger in så att det som renderas hamnar i diven
	canvas.appendChild(renderer.domElement);

	render_checkbox();

}
function create_collisionBox()
{
	//Skpapar bollen
	var boxfB = new THREE.BoxGeometry( 70, 80, 5);
	var boxLR = new THREE.BoxGeometry( 5, 80, 70);
	var boxT = new THREE.CylinderGeometry( 35, 35, 5);
	var boxG = new THREE.CylinderGeometry( 25, 25, 5,20);
	
	
	//Material till bollen
	var golvmaterial = new THREE.MeshBasicMaterial;
	
	// Texture laddar variabel
	
	
	
	// Lägger in geometrin och materialet på vårt object
	boxiF = new THREE.Mesh( boxfB, golvmaterial );
	boxiL = new THREE.Mesh( boxLR, golvmaterial );
	boxiB = new THREE.Mesh( boxfB, golvmaterial );
	boxiR = new THREE.Mesh( boxLR, golvmaterial );
	boxiT = new THREE.Mesh( boxT, golvmaterial );
	boxiG = new THREE.Mesh( boxG, golvmaterial);

}	


//renderingsloop
function draw()
{
	// Loopar över draw functionen och sänker fps'n till 60fps
	setTimeout(function() {
	// draw THREE.JS scene
	renderer.render(scene, camera);
	rendererStats.update(renderer);

	//Kör animationer
	animation_chooser();
	
	//Skapar kollisionsobjecten
	for(var i=0; i <models.length;++i){
		boxobject[i] = new THREE.Box3().setFromObject(models[i].object);
	}
	objectiv_crash = new THREE.Box3().setFromObject(objectiv.object);
	var player_crash = new THREE.Box3().setFromObject(player.object);
	
	boxiObjFront = new THREE.Box3().setFromObject(boxiF);
	boxiObjBack = new THREE.Box3().setFromObject(boxiB);
	boxiObjLeft = new THREE.Box3().setFromObject(boxiL);
	boxiObjRight = new THREE.Box3().setFromObject(boxiR);
	boxiObjGround = new THREE.Box3().setFromObject(boxiG);
	boxiObjTop = new THREE.Box3().setFromObject(boxiT);

	//myFunc(boxobject);
	cBollJump = player.object.clone();
	cBollJump2 = player.object.clone();
	cBoll = player.object.clone();
	cBoll2 = player.object.clone();
	cBoll3 = player.object.clone();

	//raycaster.setFromCamera( boll, camera );
	//collision = raycaster.intersectObject( kub, true);
	
	
	//collision = playerobject.intersectsBox(boxobject);
   	//console.log(collision);

    
	
    gravity(boxiObjGround, boxiObjTop);
	movement();
	if(player_crash.intersectsBox(objectiv_crash)){
		objectiv.object.visible= false;
		hiss = true;
	}
	
	if(hiss){
		models[1].object.position.y += 2;
	}
      	
        //
    requestAnimationFrame(draw);
 
        // ... Code for Drawing the Frame ...
        //boll.position.z += speedZ;
        //gravitation
    /*if(boll.position.y > 0){
		boll.position.y -=  0.0982;
		can_jump = false;
	}*/

	
	

	
    }, 1000 / fps);


}
function gravity(){
	
	
	var bool = Collision(boxiObjGround);
	
	if(bool)
		{
			in_air = true;
			n++;
	 }	
	
	if(in_air){
		if(!(Collision(boxiObjTop))){
			speedY=0;
			n+=5;
		}
		if( !bool){
			
			speedY = 0;
		
		}
	}
	

	if(!bool){
				setTimeout(function() {in_air = false;}, 10);

				//in_air = false;
				n = 0;

	}

	player.object.position.y += speedY + grav*(n);
	


	
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

			if(Collision(boxiObjFront)){
				
				player.object.translateZ( -moveDistance );
			}
		
		
	
	
	}
	
	if(keyboard.pressed("down"))
    {	
	//dboll.position.z += 0.1;
	//boll.rotation.y = Math.PI;
	//speedZ = 0.1;
		
			if(Collision(boxiObjBack)){
			player.object.translateZ( moveDistance );
			}
		
	}
	if(keyboard.pressed("QLeft"))
    {	
		
			if(Collision(boxiObjLeft)){
			player.object.translateX( -moveDistance );
		
	}
	
	}

	if(keyboard.pressed("ERigth"))
    {	
		
			if(Collision(boxiObjRight)){
			player.object.translateX( moveDistance );
		}
	
	}

	if(keyboard.pressed("space"))
    {	
    	if(!(in_air)){
    		speedY = 12; //5
			

    	}
	}

}

function Collision(obj){


	for (var i = 0; i < boxobject.length; i++)
	{
		if(boxobject[i].intersectsBox(obj)){	
				return false;
			
			}

	}
	
	return true;



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
					 
					 var mixer4 = new THREE.AnimationMixer(mesh);
                     object.mixers[4]= mixer4;
                     mixer4.clipAction(mesh.geometry.animations[4]).play();
					 
					 var mixer5 = new THREE.AnimationMixer(mesh);
                     object.mixers[5]= mixer5;
                     mixer5.clipAction(mesh.geometry.animations[5]).play();
					 
					 var mixer6 = new THREE.AnimationMixer(mesh);
                     object.mixers[6]= mixer6;
                     mixer6.clipAction(mesh.geometry.animations[6]).play();
					 
					;
					 
					 
					 
                  }
			}
		}
	});
	
} 


animation_chooser = function(){
	var fuck_javascript = 1;
	if(keyboard.pressed("space") || hopp_count !=0){
	
		player.mixers[0].clipAction(player.meshes[0].geometry.animations[0]).play();
		
		
		if(hopp_count<=1.05/2){
			for (var i = 0; i < player.mixers.length; ++i){
				player.mixers[0].update(1/60*fuck_javascript*A_speed*2);	
				fuck_javascript = 0;
			}
			hopp_count+=1/60*A_speed;
		}else if(hopp_count<=3){
			for (var i = 0; i < player.mixers.length; ++i)
				player.mixers[0].clipAction(player.meshes[0].geometry.animations[0]).stop();
			
			player.mixers[1].clipAction(player.meshes[0].geometry.animations[1]).play();
			for (var i = 0; i < player.mixers.length; ++i){
				player.mixers[1].update(1/60*fuck_javascript*A_speed);	
				fuck_javascript = 0;
			}
			hopp_count+=1/60*A_speed;
			
			
		}else if(hopp_count >3 && hopp_count<3.5){
				for (var i = 0; i < player.mixers.length; ++i)
					player.mixers[1].clipAction(player.meshes[0].geometry.animations[1]).stop();
				player.mixers[2].clipAction(player.meshes[0].geometry.animations[2]).play();
				for (var i = 0; i < player.mixers.length; ++i){
					player.mixers[2].update(1/60*fuck_javascript*A_speed);	
					fuck_javascript = 0;
				}
				hopp_count+=1/60*A_speed;
		}else{
			for (var i = 0; i < player.mixers.length; ++i)
					player.mixers[2].clipAction(player.meshes[0].geometry.animations[2]).stop();
			hopp_count = 0;
		}
	}else if((keyboard.pressed("up") || keyboard.pressed("down")) ){
		player.mixers[5].clipAction(player.meshes[0].geometry.animations[5]).play();
		if((keyboard.pressed("up") || keyboard.pressed("down")) ){
			for(var i = 0; i < player.mixers.length; ++i){
				player.mixers[5].update(1/60*A_speed*fuck_javascript);
				fuck_javascript = 0;
			}
			still_count += 1/60*A_speed;
		}
	}else{
		var fuck_javascript = 1;
		for (var i = 0; i < player.mixers.length; ++i){
			player.mixers[3].update(1/60*fuck_javascript*A_speed);
			fuck_javascript = 0;
		}
		for (var i = 0; i < player.mixers.length; ++i){
			player.mixers[5].clipAction(player.meshes[0].geometry.animations[5]).stop();
		}
	}
	
}






