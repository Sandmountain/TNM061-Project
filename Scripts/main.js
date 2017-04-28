////*****************////
////   Variabler Def ////
////*****************////

//FPS Detta behlvs byta ut mot tid delta
var fps = 60;

// De viktiga variablerna för kamera osv
var camera, scene, renderer,rendererStats, canvas;
var n = 0;
//Tar in storleken av fönstret
var windowHalfX = window.innerWidth ;
var windowHalfY = window.innerHeight ;

// Mina object som skapas.
var boll, golv, kub;
boll = new THREE.Group();
kub = new THREE.Group();
var Cboll = new THREE.Group();
var cBoll2 = new THREE.Group();

var cBollJump = new THREE.Group();
var cBollJump2 = new THREE.Group();
var cBollJumpPos;
var cBollJumpPos2;

var collision;
//Klass som handskar tangenbordstryck
var keyboard= new THREEx.KeyboardState();

var can_jump = true;
var in_air = false;
var grav = -0.5;



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

//Sätter golv där de ska vara
var flytta_golv = new THREE.Group();
flytta_golv.translateY(17);

//Vrider kameran så att man ser snett uppifrån
var kamera_initial_pos = new THREE.Group();
kamera_initial_pos.rotation.x = -Math.PI/2;
kamera_initial_pos.translateZ(-1)

// Huvudpersonensförflyttning
var person_förflyttning,person_rotationup,person_rotationside, person_jump;
person_förflyttning = new THREE.Group();
person_rotationup = new THREE.Group();
person_rotationside = new THREE.Group();
person_jump = new THREE.Group();

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
	camera.position.z = 500;

	// Här skapar vi våra modeller
	//skapa_boll();
	skapa_golv();
	
	//Skapar scenen
	scene = new THREE.Scene();
	
	
	//stack();

	//Här skapar jag scengrafen
	
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 5, 5, 5 ).normalize();
	scene.add( directionalLight );

	scene.add(golv);
	golv.add(flytta_golv);
	

	scene.add(kub)

	loader.load("./Models/kub.jd",
    function (data)
    {
               var multiMaterial = new THREE.MultiMaterial(data.materials);
               for (var i = 0; i < data.geometries.length; ++i)
               {
	                var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
	                meshes.push(mesh);
	                kub.add(mesh);
					
					
					if(mesh.isGeometry){
						console.log("JaaA");
					}
					boxhelper = new THREE.BoxHelper( mesh, 0xffff00 );
					scene.add(boxhelper);
					
               }
			   
    });

	//scene.add(kamera_initial_pos);
	//kamera_initial_pos.add(boll);
	flytta_golv.add(boll);
	loader.load("./Models/jorden_stilla.jd",
    function (data)
    {
               var multiMaterial = new THREE.MultiMaterial(data.materials);
               for (var i = 0; i < data.geometries.length; ++i)
               {
	                var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
	                meshes.push(mesh);
	                boll.add(mesh);
	               

	              /*  if (mesh.geometry.animations)
	               	{
	                  	
	                  
		                var up = new THREE.AnimationMixer(mesh);
		                mixers.push(up);
		                up.clipAction(mesh.geometry.animations[0]).play();

		                var hoger = new THREE.AnimationMixer(mesh);
		               	mixers.push(hoger);
		                hoger.clipAction(mesh.geometry.animations[1]).play();
	                 
             		}*/
               }
    });
	
	//kamera_initial_pos.add(flytta_golv);
	//flytta_golv.add(golv);

	

	
	boll.add(kamera_initial_pos);
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
	// draw THREE.JS scene
	renderer.render(scene, camera);
	rendererStats.update(renderer);
	// Loopar över draw functionen och sänker fps'n till 60fps
	setTimeout(function() {

	playerobject = new THREE.Box3().setFromObject(boll);
	boxobject = new THREE.Box3().setFromObject(kub);
	

	cBollJump = boll.clone();
	cBollJump2 = boll.clone();
	cBoll = boll.clone();
	cBoll2 = boll.clone();

	//raycaster.setFromCamera( boll, camera );
	//collision = raycaster.intersectObject( kub, true);
	
	
	//collision = playerobject.intersectsBox(boxobject);
   	//console.log(collision);

     
    
    
	
       
        	movement();
    	
      	
        //
      	requestAnimationFrame(draw);
 
        // ... Code for Drawing the Frame ...
        //boll.position.z += speedZ;
        //gravitation
    /*if(boll.position.y > 0){
		boll.position.y -=  0.0982;
		can_jump = false;
	}*/

	
	
	cBollJumpPos = cBollJump.translateY(-10).translateZ(-20).translateX(20).position;
	cBollJumpPos2 = cBollJump2.translateY(-10).translateZ(20).translateX(-20).position;
	console.log('först:');
	console.log(cBollJumpPos);
	console.log('andra:');
	console.log(cBollJumpPos2);

	if(boll.position.y > 10 && !(boxobject.containsPoint(cBollJumpPos)) && !(boxobject.containsPoint(cBollJumpPos2))){
		in_air = true;
		n++;
			
	}
	if(in_air){
		if( boll.position.y <= 10 || boxobject.containsPoint(cBollJumpPos)|| boxobject.containsPoint(cBollJumpPos2)){
			speedY = 0;
			
		}
	}
	if( boll.position.y <= 10 || boxobject.containsPoint(cBollJumpPos) || boxobject.containsPoint(cBollJumpPos2)){
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
	boll.position.y += speedY + grav*(n/2);
	//boll.position.x += speedX;
	


    }, 1000 / fps);


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

function skapa_boll()
{
	var bollgeo = new THREE.SphereGeometry( 0.5, 20, 20 );
	var bollmat = new THREE.MeshBasicMaterial();
	// Texture laddar variabel
	var loaderboll = new THREE.TextureLoader();
	//Laddar texturen och sätter in den på materialet
	loaderboll.load( './Textures/earth.png', function ( texture ) 
	{
		bollmat.map = texture;
		bollmat.needsUpdate = true;
		bollmat.overdraw = 0.5;					
	} );
	// Lägger in geometrin och materialet på vårt object         
	boll = new THREE.Mesh( bollgeo, bollmat);
}

function skapa_golv()
{
	//Skpapar bollen
	var golvgeometry = new THREE.BoxGeometry( 5000, 5, 5000)
	
	//Material till bollen
	var golvmaterial = new THREE.MeshBasicMaterial;
	
	// Texture laddar variabel
	var loadergolv = new THREE.TextureLoader();
	
	//Laddar texturen och sätter in den på materialet
	loadergolv.load( './Textures/golv_texture3.jpg', function ( texture ) 
	{
		golvmaterial.map = texture;
		golvmaterial.needsUpdate = true;
		golvmaterial.overdraw = 0.5;					
	} );
	
	// Lägger in geometrin och materialet på vårt object
	golv = new THREE.Mesh( golvgeometry, golvmaterial );
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
	var moveDistance = 3;//200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI/50; //Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second



	if(keyboard.pressed("left"))
    {	
	//boll.position.x -= 0.1;
	//boll.rotation.y += Math.PI/2;
	//speedX = -0.1;
	boll.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	
	
	}
	if(keyboard.pressed("right"))
    {	
	//boll.position.x += 0.1;
	//boll.rotation.y = -Math.PI/2;
	//speedX = 0.1;
	boll.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);

	
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

	if(!(boxobject.containsPoint(cBoll.translateZ(-20).translateX(15).position)) && !(boxobject.containsPoint(cBoll2.translateZ(-20).translateX(-15).position))){
		
		boll.translateZ( -moveDistance );
	}
		
	
	
	}
	
	if(keyboard.pressed("down"))
    {	
	//dboll.position.z += 0.1;
	//boll.rotation.y = Math.PI;
	//speedZ = 0.1;
	if(!(boxobject.containsPoint(cBoll.translateZ(20).translateX(15).position)) && !(boxobject.containsPoint(cBoll2.translateZ(20).translateX(-15).position))){
	boll.translateZ( moveDistance );
	}
	
	}
	if(keyboard.pressed("QLeft"))
    {	
	if(!(boxobject.containsPoint(cBoll.translateX(-20).translateZ(15).position)) && !(boxobject.containsPoint(cBoll2.translateX(-20).translateZ(-15).position))){
	boll.translateX( -moveDistance );
	}
	
	}

	if(keyboard.pressed("ERigth"))
    {	
	if(!(boxobject.containsPoint(cBoll.translateX(20).translateZ(15).position)) && !(boxobject.containsPoint(cBoll2.translateX(20).translateZ(-15).position))){
	boll.translateX( moveDistance );
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