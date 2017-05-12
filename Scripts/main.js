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
var Mandeln_url = "./Models/Mandel/animationRotated.JD";
//var model_url = ["./Models/Levels/Level2/golv1.jd","./Models/Levels/Level2/lada1.jd","./Models/Levels/Level2/vagg1.jd","./Models/Levels/Level2/vagg2.jd","./Models/Levels/Level2/vagg3.jd","./Models/Levels/Level2/vagg4.jd"];
var model_url = ["./Models/Levels/Level_1/doorh.jd","./Models/Levels/Level_1/doorv.jd","./Models/Levels/Level_1/barrel1.jd","./Models/Levels/Level_1/barrel2.jd","./Models/Levels/Level_1/barrel3.jd","./Models/Levels/Level_1/barrel4.jd","./Models/Levels/Level_1/barrel5.jd"
,"./Models/Levels/Level_1/fencewall1.jd","./Models/Levels/Level_1/fencewall2.jd","./Models/Levels/Level_1/floor.jd","./Models/Levels/Level_1/kortsida1.jd","./Models/Levels/Level_1/kortsida2.jd","./Models/Levels/Level_1/lada1.jd","./Models/Levels/Level_1/lada2.jd"
,"./Models/Levels/Level_1/lada3.jd","./Models/Levels/Level_1/lada4.jd","./Models/Levels/Level_1/lada5.jd","./Models/Levels/Level_1/lada6.jd","./Models/Levels/Level_1/lada7.jd","./Models/Levels/Level_1/lada8.jd"
,"./Models/Levels/Level_1/lastpall.jd","./Models/Levels/Level_1/lastpall2.jd","./Models/Levels/Level_1/lastpall3.jd","./Models/Levels/Level_1/lastpall4.jd","./Models/Levels/Level_1/longsida1.jd","./Models/Levels/Level_1/longsida2.jd","./Models/Levels/Level_1/pipe.jd"
,"./Models/Levels/Level_1/platta.jd","./Models/Levels/Level_1/fencewall3.jd","./Models/Levels/Level_1/fencewall4.jd","./Models/Levels/Level_1/fencewall6.jd"];
var objectiv_url = "./Models/Levels/Level_1/key.jd";
var Exit_url = "./Models/Levels/Level_1/Exit.jd";

//Object som skapas
var Mandeln;
var models = [model_url.length];
var Exit;


//Kollisions variablerna
var boxobject = [model_url.length];
var objectiv_crash;
var Exit_crash;
var stop = true;

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

var golv_collision;

var speedX = 0;
var speedY = 0;
var speedZ = 0;

var veloY = 0;

//Flyttar box
var hiss = false;

//Räknar frames som gubben står stilla
var landing_count = 0;
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
var rotera = new THREE.Group();
//Vrider kameran så att man ser snett uppifrån
rotera.rotation.x = Math.PI;

var kamera_initial_pos = new THREE.Group();
//Vrider kameran så att man ser snett uppifrån
kamera_initial_pos.rotation.y = -Math.PI;
kamera_initial_pos.rotation.x = Math.PI/8;
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
	Mandeln = new Mloader(Mandeln_url,true)
	modell_loader(Mandeln);
	scene.add(Mandeln.object);
	Mandeln.object.translateY(10);	
	Mandeln.object.add(kamera_initial_pos);
	kamera_initial_pos.add(camera);
	
	//laddar exit
	Exit = new Mloader(Exit_url,false)
	modell_loader(Exit);
	scene.add(Exit.object);
	Exit.object.visible = false;
	
	create_collisionBox()
	Mandeln.object.add(boxiF);
	boxiF.translateZ(-40).translateY(50).translateX(5);
	//box bak
	Mandeln.object.add(boxiB);
	boxiB.translateZ(55).translateY(50).translateX(5);
	//box Right
	Mandeln.object.add(boxiL);
	boxiL.translateZ(5).translateY(50).translateX(40);
	//Box LEft
	Mandeln.object.add(boxiR);
	boxiR.translateZ(5).translateY(50).translateX(-30);
	//Box ground
	Mandeln.object.add(boxiG);
	boxiG.translateZ(5).translateY(-2).translateX(10);
	//box top
	Mandeln.object.add(boxiT);
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
	boxiR = new THREE.Mesh( boxLR, golvmaterial );
	boxiB = new THREE.Mesh( boxfB, golvmaterial );
	boxiL = new THREE.Mesh( boxLR, golvmaterial );
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
	var Mandeln_crash = new THREE.Box3().setFromObject(Mandeln.object);
	
	boxiObjFront = new THREE.Box3().setFromObject(boxiF);
	boxiObjBack = new THREE.Box3().setFromObject(boxiB);
	boxiObjLeft = new THREE.Box3().setFromObject(boxiL);
	boxiObjRight = new THREE.Box3().setFromObject(boxiR);
	boxiObjGround = new THREE.Box3().setFromObject(boxiG);
	boxiObjTop = new THREE.Box3().setFromObject(boxiT);

	//myFunc(boxobject);
	cBollJump = Mandeln.object.clone();
	cBollJump2 = Mandeln.object.clone();
	cBoll = Mandeln.object.clone();
	cBoll2 = Mandeln.object.clone();
	cBoll3 = Mandeln.object.clone();
	
    gravity(boxiObjGround, boxiObjTop);
	movement();
	if(Mandeln_crash.intersectsBox(objectiv_crash)){
		objectiv.object.visible= false;
		hiss = true;
	}
	
	if(hiss){
		
		if(models[0].object.position.x>-200){
			models[0].object.position.x -= 2;
		}
		if(models[1].object.position.x<200){
			models[1].object.position.x += 2;
		}
		Exit.object.visible = true;
		
		Exit_crash = new THREE.Box3().setFromObject(Exit.object);
		console.log(Mandeln.object.position.z)
		if(boxiObjBack.intersectsBox(Exit_crash)){
			document.location.href = "file:///H:/TNM061/Projekt%200.9/TNM061.project/index.html" ;
			stop = false;
		}
	}
	if(keyboard.pressed("escape")){
		document.location.href = "file:///H:/TNM061/Projekt%200.9/TNM061.project/index.html" ;
		stop = false;
	}
    console.log(golv_collision);
	if(stop)  	
		requestAnimationFrame(draw);
	
	console.log("x: " +Mandeln.object.position.x)
	console.log("y: " +Mandeln.object.position.y)
	console.log("z: " +Mandeln.object.position.z)
    }, 1000 / fps);


}
function gravity(){
	var bool = Collision(boxiObjGround);
	golv_collision = Collision(boxiObjGround);
	if(bool)
	{
		in_air = true;
		if(n<150)
		{
			n++;
		}
	}	
	
	if(in_air){
		if(!(Collision(boxiObjTop)))
		{
			speedY=0;
			n+=5;
		}
		if( !bool)
		{
			speedY = 0;
		}
	}
	
	if(!bool)
	{
		setTimeout(function() {in_air = false;}, 10);
		//in_air = false;
		n = 0;
	}

	var speed = speedY + grav*(n*3);
	if(speed < -15){
		speed = -15;
	}

	Mandeln.object.position.y += speed;
	


	
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

	
	var moveDistance = 18;//200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI/50; //Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

	if(keyboard.pressed("left"))
    {	
		Mandeln.object.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	}
	if(keyboard.pressed("right"))
    {	
		Mandeln.object.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	}
	if(keyboard.pressed("down"))
    {	
		if(Collision(boxiObjFront))
		{	
			Mandeln.object.translateZ( -moveDistance );
		}

	}
	
	if(keyboard.pressed("up"))
    {	
		if(Collision(boxiObjBack))
		{
			Mandeln.object.translateZ( moveDistance );
		}	
	}
	if(keyboard.pressed("ERigth"))
    {		
		if(Collision(boxiObjLeft))
		{
			Mandeln.object.translateX( moveDistance );
		}
	}

	if(keyboard.pressed("QLeft"))
    {	
		if(Collision(boxiObjRight))
		{
			Mandeln.object.translateX( -moveDistance );
		}
	}

	if(keyboard.pressed("space"))
    {	
    	if(!(in_air)){
    		speedY = 24; //5
    	}
	}
}

function Collision(obj){
	for (var i = 0; i < boxobject.length; i++)
	{
		if(boxobject[i].intersectsBox(obj))
		{	
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
                     //mixer2.clipAction(mesh.geometry.animations[2]).play();
					 
					 var mixer3 = new THREE.AnimationMixer(mesh);
                     object.mixers[3]= mixer3;
                     mixer3.clipAction(mesh.geometry.animations[3]).play();
					 
					 var mixer4 = new THREE.AnimationMixer(mesh);
                     object.mixers[4]= mixer4;
                    // mixer4.clipAction(mesh.geometry.animations[4]).play();
					 
					 var mixer5 = new THREE.AnimationMixer(mesh);
                     object.mixers[5]= mixer5;
                     mixer5.clipAction(mesh.geometry.animations[5]).play();
					 
					 var mixer6 = new THREE.AnimationMixer(mesh);
                     object.mixers[6]= mixer6;
                     //mixer6.clipAction(mesh.geometry.animations[6]).play();
                  }
			}
		}
	});
	
} 


animation_chooser = function(){
	// If sats som kollar vilken knapp som är tryckt och därefter startar och stänger av animationer därefter
	// Hoppanimationen ligger först då den ska gå över alla andra animationer
	if(keyboard.pressed("space") || hopp_count !=0){
		
		//Ser om det är dags att byta till nästa hopp animation, den långa variabeln är hur lång animationen är i sek
		if(hopp_count<Mandeln.meshes[0].geometry.animations[0].duration){
			//Startar hopp animation 1/3
			Mandeln.mixers[0].clipAction(Mandeln.meshes[0].geometry.animations[0]).play();
			//Uppdaterar mixern
			Mandeln.mixers[0].update(Mandeln.meshes[0].geometry.animations[0].duration/8);	
			hopp_count+=Mandeln.meshes[0].geometry.animations[0].duration/8;
		
		}else if(golv_collision){
			//Startar nästa mixer
			Mandeln.mixers[1].clipAction(Mandeln.meshes[0].geometry.animations[1]).play();
			//Uppdaterar nästa mixer
			Mandeln.mixers[1].update(Mandeln.meshes[0].geometry.animations[1].duration/10);	
			
		}else{
			//Stänger av alla mixers och nollställer variablerna
			Mandeln.mixers[2].clipAction(Mandeln.meshes[0].geometry.animations[2]).stop();
			Mandeln.mixers[1].clipAction(Mandeln.meshes[0].geometry.animations[1]).stop();
			Mandeln.mixers[0].clipAction(Mandeln.meshes[0].geometry.animations[0]).stop();
			hopp_count = 0;
			landing_count =0;
		}
	//Kollar om mandeln rör sig
	}else if((keyboard.pressed("up") || keyboard.pressed("down")) ){
		// Öppnar  nya mixers
		Mandeln.mixers[5].clipAction(Mandeln.meshes[0].geometry.animations[5]).play();
		Mandeln.mixers[5].update(Mandeln.meshes[0].geometry.animations[5].duration/10);
		
	}else{
		//Kör stilla animationen
		var fuck_javascript = 1;
		for (var i = 0; i < Mandeln.mixers.length; ++i){
			Mandeln.mixers[3].update(Mandeln.meshes[0].geometry.animations[3].duration/80 *fuck_javascript);
			fuck_javascript = 0;
		}
		//Stänger av gång animationen
		for (var i = 0; i < Mandeln.mixers.length-5; ++i){
			Mandeln.mixers[5].clipAction(Mandeln.meshes[0].geometry.animations[5]).stop();
		}
	}
}






