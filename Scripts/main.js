/////////////////////////
////*****************////
////   Variabler Def ////
////*****************////
////////////////////////

////*****************////
////   Diverse Var	 ////
////*****************////

//FPS denna sänker renderingsloopens hastighet, därmot kan vi inte göra något mot webläsarens FPS
var fps = 60;

// De viktiga variablerna för kamera osv
var camera,temp_camera, scene, renderer,rendererStats, canvas;

//BYT NAMN!!!!!!
var n = 0;

//Tar in storleken av fönstret
var windowHalfX = window.innerWidth ;
var windowHalfY = window.innerHeight ;

//Klass som handskar tangenbordstryck
var keyboard= new THREEx.KeyboardState();

// Variabel som stoppar renderingsloopen
var stop_game = true;

//Om nyckel är tagen
var key_taken = false;

//Räknar frames som kollar vilken animation som skall köras
var landing_count = 0;
var hopp_count = 0;



////*****************////
////   MODELLERS	 ////
////*****************////

// URL adresser till modellerna, de som har fått egna variabler är sådana object som något händer med.
var Mandeln_url = "./Models/Mandel/animationRotated.JD";
var model_url = ["./Models/Levels/Level_1/doorh.jd","./Models/Levels/Level_1/doorv.jd","./Models/Levels/Level_1/pipe.jd","./Models/Levels/Level_1/barrel1.jd","./Models/Levels/Level_1/barrel2.jd","./Models/Levels/Level_1/barrel3.jd","./Models/Levels/Level_1/barrel4.jd","./Models/Levels/Level_1/barrel5.jd"
,"./Models/Levels/Level_1/fencewall1.jd","./Models/Levels/Level_1/fencewall2.jd","./Models/Levels/Level_1/floor.jd","./Models/Levels/Level_1/kortsida1.jd","./Models/Levels/Level_1/kortsida2.jd","./Models/Levels/Level_1/lada1.jd","./Models/Levels/Level_1/lada2.jd"
,"./Models/Levels/Level_1/lada3.jd","./Models/Levels/Level_1/lada4.jd","./Models/Levels/Level_1/lada5.jd","./Models/Levels/Level_1/lada6.jd","./Models/Levels/Level_1/lada7.jd","./Models/Levels/Level_1/lada8.jd"
,"./Models/Levels/Level_1/lastpall.jd","./Models/Levels/Level_1/lastpall2.jd","./Models/Levels/Level_1/lastpall3.jd","./Models/Levels/Level_1/longsida1.jd","./Models/Levels/Level_1/longsida2.jd"
,"./Models/Levels/Level_1/platta.jd","./Models/Levels/Level_1/fencewall3.jd","./Models/Levels/Level_1/fencewall4.jd","./Models/Levels/Level_1/fencewall6.jd"
,"./Models/Levels/Level_1/trappa1.jd","./Models/Levels/Level_1/trappa2.jd","./Models/Levels/Level_1/trappa3.jd","./Models/Levels/Level_1/trappa4.jd","./Models/Levels/Level_1/trappa5.jd"];
var objectiv_url = "./Models/Levels/Level_1/keyrotated.jd";
var Exit_url = "./Models/Levels/Level_1/Exit.jd";

//Object som skapas
var Mandeln;
var models = [model_url.length];
var Exit;
var objectiv;

//Kollisions variablerna
var boxobject = [model_url.length];
var objectiv_crash;
var Exit_crash;
var Mandeln_crash

//Ljussättning
var ljus;

//	Object som kollar kollisionen
var Cboll = new THREE.Group();
var cBoll2 = new THREE.Group();
var cBoll3 = new THREE.Group();
var cBollJump = new THREE.Group();
var cBollJump2 = new THREE.Group();
var cBollJumpPos;
var cBollJumpPos2;

// Innehåller kollsionsmeshen
var collision;
var collidableMeshList = [model_url.lenght];

// Denna används för att kolla när hoppanimationen ska sluta
var floor_collision;




////*****************////
//// Fysikvariabler	 ////
////*****************////

var can_jump = true;
var in_air = false;
var grav = -0.5;
var speedX = 0;
var speedY = 0;
var speedZ = 0;

var veloY = 0;



////*****************////
////   LjudVaribler	 ////
////*****************////
//Räknar vilken röst inspelning som skall köras
var Audio_Voice_counter = 0;

//ljuddeklaration
var silence = false;
	snd = new Audio("./Audio/song.mp3"); 
	jump = new Audio("./Audio/Jump1.mp3");
	walk = new Audio("./Audio/walk.mp3");
	ugh = new Audio("./Audio/ugh.mp3");
	tGround = new Audio("./Audio/TouchGround.mp3");
	foundKey = new Audio("./Audio/YeyFoundIt.mp3")
	engelbrekt = new Audio("./Audio/DrEngel.mp3")
	findKey = new Audio("./Audio/FindKey.mp3")

//Ljudarray
var SFXvol_controll = [jump, walk, ugh, tGround, foundKey, engelbrekt, findKey];



////*****************////
//// Tansformationer ////
////*****************////

//Vrider kameran så att man ser snett uppifrån
var kamera_initial_pos = new THREE.Group();
kamera_initial_pos.rotation.y = -Math.PI;
kamera_initial_pos.rotation.x = Math.PI/8;


////*****************////
//// Raycaster egen ////
////*****************////

function Raytracer3V()
{
    this.origin =new THREE.Vector3(0,0,0);
    this.destination = new THREE.Vector3(0,0,0);
	this.startdot = new THREE.Vector3(0,0,0);
	this.param = new THREE.Vector3(0,0,0);
	
}
Raytracer3V.prototype.setRaytracer = function(org, dest){
	this.origin = org;
	this.destination = dest;
	this.stardot = this.origin;
	this.param = this.destination-this.origin;
}



/////////////////////////
////*****************////
////   Funktioner	////
////*****************////
////////////////////////

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
	
	//Sätter renderings inställningarna
	render_options();

	//Kopplar en lyssnare till window. Ifall man ändrar storleken på fönstret så kommer den köra "onWindowResize"
	window.addEventListener( 'resize', onWindowResize, false );

	//Lägger in så att det som renderas hamnar i diven
	canvas.appendChild(renderer.domElement);
	
	// Skapar den lilla rutan i vänster hörn
	render_checkbox();
	
	//Skapar scen stacken
	scene = new THREE.Scene();
	
	/*******************************************
	********     Ljussättning    ***************
	*******************************************/
	//ambient ljussättning
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );
	
	// Directional ljus
	var directionalLight = new THREE.DirectionalLight( 0xffeedd,0.1 );
	directionalLight.position.set(0 , 100, 0 ).normalize();
	scene.add( directionalLight );

	/*******************************************
	*************Laddar modellerna**************
	*******************************************/
	// Alla modeller som inte behöver specialkontrolleras
	for(var i = 0; i<model_url.length; ++i){	
		models[i] = new Mloader(model_url[i],false)
		modell_loader(models[i]);
		scene.add(models[i].object);
	}
	//Laddar objektivet
	objectiv = new Mloader(objectiv_url,true)
	modell_loader(objectiv);
	scene.add(objectiv.object);
	
	//Laddar spelaren
	Mandeln = new Mloader(Mandeln_url,true)
	modell_loader(Mandeln);
	scene.add(Mandeln.object);
	Mandeln.object.position.y=10;	
	Mandeln.object.add(kamera_initial_pos);
	kamera_initial_pos.add(camera);
	
	//laddar exit
	Exit = new Mloader(Exit_url,false)
	modell_loader(Exit);
	scene.add(Exit.object);
	Exit.object.visible = false;
	
	
	// funktion som skapar object för kollision
	create_collisionBox();

	//boxar för kollektion, lägger dom så de följer spelaren
	Mandeln.object.add(boxiB);
	//lägger de på rätt plats
	boxiB.translateZ(-40).translateY(80).translateX(5);
	//box fram
	Mandeln.object.add(boxiF);
	boxiF.translateZ(55).translateY(80).translateX(5);
	//box Left
	Mandeln.object.add(boxiL);
	boxiL.translateZ(5).translateY(80).translateX(40);
	//Box Right
	Mandeln.object.add(boxiR);
	boxiR.translateZ(5).translateY(80).translateX(-30);
	//Box ground
	Mandeln.object.add(boxiG);
	boxiG.translateZ(5).translateY(-4).translateX(10);
	//box top
	Mandeln.object.add(boxiT);
	boxiT.translateZ(15).translateY(100).translateX(10);
	
	//boxes för trappan, likadant fast så man vet ifall han ska gå upp för trappa
	//box fram
	Mandeln.object.add(rampBoxiF);
	rampBoxiF.translateZ(40).translateY(33).translateX(5);
	//box bak
	Mandeln.object.add(rampBoxiB);
	rampBoxiB.translateZ(-40).translateY(33).translateX(5);
	//box left
	Mandeln.object.add(rampBoxiL);
	rampBoxiL.translateZ(5).translateY(33).translateX(40);
	//box right
	Mandeln.object.add(rampBoxiR);
	rampBoxiR.translateZ(5).translateY(33).translateX(-30);

	//döljer alla boxar så de inte syns
	boxiL.visible = false;
	boxiR.visible = false;
	boxiB.visible = false;
	boxiF.visible = false;
	boxiG.visible = false;
	boxiT.visible = false;
	rampBoxiF.visible = false;
	rampBoxiB.visible = false;
	rampBoxiL.visible = false;
	rampBoxiR.visible = false;
	
	
}

//renderingsloop
function draw()
{
	// Loopar över draw functionen och sänker fps'n till 60fps
	setTimeout(function() {
		
		if(Audio_Voice_counter == 0){
			setTimeout(function(){ 
				SFXvol_controll[6].play();
				Audio_Voice_counter= 1;   
							
			}, 1500); 
		}
		
		if(Audio_Voice_counter == 1)
		{	
			setTimeout(function(){ 
				SFXvol_controll[5].play();
				Audio_Voice_counter = 2;   
				
			}, 20000);
		}

		// Ritar upp scenen
		renderer.render(scene, camera);
		rendererStats.update(renderer);

		//Skapar kollisionsobjecten
		for(var i=0; i <models.length;++i)
		{
			boxobject[i] = new THREE.Box3().setFromObject(models[i].object);
		}
		objectiv_crash = new THREE.Box3().setFromObject(objectiv.object);
		Mandeln_crash = new THREE.Box3().setFromObject(Mandeln.object);
		
		boxiObjFront = new THREE.Box3().setFromObject(boxiF);
		boxiObjBack = new THREE.Box3().setFromObject(boxiB);
		boxiObjLeft = new THREE.Box3().setFromObject(boxiL);
		boxiObjRight = new THREE.Box3().setFromObject(boxiR);
		boxiObjGround = new THREE.Box3().setFromObject(boxiG);
		boxiObjTop = new THREE.Box3().setFromObject(boxiT);
		boxiObjRampF = new THREE.Box3().setFromObject(rampBoxiF);
		boxiObjRampB = new THREE.Box3().setFromObject(rampBoxiB);
		boxiObjRampL = new THREE.Box3().setFromObject(rampBoxiL);
		boxiObjRampR = new THREE.Box3().setFromObject(rampBoxiR);

		//kollar om den ska ha gravitation
		gravity(boxiObjGround, boxiObjTop);
		
		// Kollar om gubben ska röra sig
		movement();
		
		//Kollar om nyckeln plockas upp
		if(Mandeln_crash.intersectsBox(objectiv_crash))
		{
			objectiv.object.visible= false;
			key_taken = true;
			if(silence == false)
			{
				SFXvol_controll[4].play();
			}
		}
		
		// om nyckel är öppnar den dörrarna och skapar ett nytt object som fixar så banan kan sluta 
		if(key_taken)
		{
			//Öppnar dörrarna 
			if(models[0].object.position.x>-200)
			{
				models[0].object.position.x -= 2;
			}
			if(models[1].object.position.x<200)
			{
				models[1].object.position.x += 2;
			}
			
			//Skapar kollisions blocket så banan kan sluta
			Exit_crash = new THREE.Box3().setFromObject(Exit.object);
			//stoppar spelet
			if(boxiObjBack.intersectsBox(Exit_crash))
			{
				document.location.href = "file:///H:/TNM061/Projekt%200.9/TNM061.project/index.html" ;
				stop_game = false;
			}
		}
		
		//Ifall någon trycker esc så slutar spelet
		if(keyboard.pressed("escape"))
		{
			document.location.href = "file:///H:/TNM061/Projekt%200.9/TNM061.project/index.html" ;
			stop_game = false;
		}
		
		/*// Test till en egen raycaster
		var ray = new Raytracer3V();
		ray.param =camera.lookAt(ray.origin);
		console.log(ray.param);*/
		
		//Kör animationer
		animation_chooser();
		
		//uppdaterar spelet
		if(stop_game) 
		{
			requestAnimationFrame(draw);
		}
		
		//Felloggnings utskrivningar
		//console.log("x: " +Mandeln.object.position.x)
		//console.log("y: " +Mandeln.object.position.y)
		//console.log("z: " +Mandeln.object.position.z)
		
	}, 1000 / fps);
}

function create_collisionBox()
{
	//skapar boxar för kollision
	var boxfB = new THREE.BoxGeometry( 70, 40, 5);
	var boxLR = new THREE.BoxGeometry( 5, 40, 70);
	var boxT = new THREE.CylinderGeometry( 25, 25, 5);
	var boxG = new THREE.CylinderGeometry( 25, 25, 5);
	var rampBoxFB = new THREE.BoxGeometry(70,45,5);
	var rampBoxLR = new THREE.BoxGeometry( 5, 45, 70);
	
	
	
	var golvmaterial = new THREE.MeshBasicMaterial;
	

	
	// Lägger in geometrin och materialet på varje objekt för kollision
	boxiF = new THREE.Mesh( boxfB, golvmaterial );
	boxiR = new THREE.Mesh( boxLR, golvmaterial );
	boxiB = new THREE.Mesh( boxfB, golvmaterial );
	boxiL = new THREE.Mesh( boxLR, golvmaterial );
	boxiT = new THREE.Mesh( boxT, golvmaterial );
	boxiG = new THREE.Mesh( boxG, golvmaterial);
	//kollisionsobjekt för att kunna gå i trappor
	rampBoxiF = new THREE.Mesh(rampBoxFB,new THREE.MeshBasicMaterial({color: 0xff3300}));
	rampBoxiB = new THREE.Mesh(rampBoxFB,new THREE.MeshBasicMaterial({color: 0xff3300}));
	rampBoxiL = new THREE.Mesh(rampBoxLR,new THREE.MeshBasicMaterial({color: 0xff3300}));
	rampBoxiR = new THREE.Mesh(rampBoxLR,new THREE.MeshBasicMaterial({color: 0xff3300}));
}	



function gravity(){
	var bool = Collision(boxiObjGround);
	floor_collision = Collision(boxiObjGround);
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
	if(speed < -12){
		speed = -12;
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

//Handskar om man byter storlek på skärmen "Tog den från labben så den tillhör Stefan"
function onWindowResize() {
				windowHalfX = window.innerWidth ;
				windowHalfY = window.innerHeight ;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

// Ger den lilla rutan i vänster hörn, tagen från THREEx 
function render_checkbox()
{
	rendererStats= new THREEx.RendererStats()
	rendererStats.domElement.style.position	= 'absolute'
	rendererStats.domElement.style.bottom	= '0px'
	document.body.appendChild( rendererStats.domElement )
}


function movement(){

	
	var moveDistance = 20;//200 * delta; // 200 pixels per second
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

		if(!in_air){
    		
			if(Collision(boxiObjBack))
			{
				if(!(Collision(boxiObjRampB))){
					Mandeln.object.translateY(33);
				}
				Mandeln.object.translateZ( -moveDistance );

			}
		}
		else{
			
			if(Collision(boxiObjBack) && Collision(boxiObjRampB))
			{
				Mandeln.object.translateZ( -moveDistance );
			}
		}


	}
	
	if(keyboard.pressed("up"))
    {	
    	if(!in_air){
    		
			if(Collision(boxiObjFront))
			{
				if(!(Collision(boxiObjRampF))){
					Mandeln.object.translateY(33);
				}
				Mandeln.object.translateZ( moveDistance );

			}
		}
		else{
			
			if(Collision(boxiObjFront) && Collision(boxiObjRampF))
			{
				Mandeln.object.translateZ( moveDistance );
			}
		}
		
	}
	if(keyboard.pressed("QLeft"))
    {		
    	if(!in_air){
    		
			if(Collision(boxiObjLeft))
			{
				if(!(Collision(boxiObjRampL))){
					Mandeln.object.translateY(33);
				}
				Mandeln.object.translateX( moveDistance );

			}
		}
		else{
			
			if(Collision(boxiObjLeft) && Collision(boxiObjRampL))
			{
				Mandeln.object.translateX( moveDistance );
			}
		}
	}

	if(keyboard.pressed("ERigth"))
    {	

		if(!in_air){
    		
			if(Collision(boxiObjRight))
			{
				if(!(Collision(boxiObjRampR))){
					Mandeln.object.translateY(33);
				}
				Mandeln.object.translateX( -moveDistance );

			}
		}
		else{
			
			if(Collision(boxiObjRight) && Collision(boxiObjRampR))
			{
				Mandeln.object.translateX( -moveDistance );
			}
		}

	}


	if(keyboard.pressed("space"))
    {	
    	if(!(in_air)){
    		speedY = 25; //5
			if(silence == false)
			{
				SFXvol_controll[0].play();
			}
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



////*****************////
////   Ljudfunktioner ////
////*****************////

	//Skapa bakgrundsmusik
	snd.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
	}, false);
	setTimeout( play_func, 1500 );
		function play_func(){
		snd.play();
		}
	
	
	//ljudeffekter
	window.addEventListener("keydown", checkKeyPressed, false);
	
	function checkKeyPressed(e) {
    	if (e.keyCode == "90") {
    		togglePlay();
    		
    		//använd knapp med <a onClick="togglePlay()">Click here to hear.</a>
		}
		if (e.keyCode == "88") {
					if(silence == true){
						silence = false;
					}else{	
						silence = true;
					} 			
    		//använd knapp med <a onClick="togglePlay()">Click here to hear.</a>
		}	
	}

	//pause backgroundmusic
	function togglePlay() {
        		
  			return snd.paused ? snd.play() : snd.pause();

	};  

	function muteSFX(){
		
		if(silence == true){
				silence = false;
			}else{	
				silence = true;
			}
	}   

////*****************////
////Diverse funktioner ////
////*****************////

