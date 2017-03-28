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
var boll, golv;

//Klass som handskar tangenbordstryck
var keyboard= new THREEx.KeyboardState();

var can_jump = true;
var in_air = false;
var grav = -0.5;



var speedX = 0;
var speedY = 0;
var speedZ = 0;

var veloY = 0;
////*****************////
//// Tansformationer ////
////*****************////

//Sätter golv där de ska vara
var flytta_golv = new THREE.Group();
flytta_golv.translateY(-1);

//Vrider kameran så att man ser snett uppifrån
var kamera_initial_pos = new THREE.Group();
kamera_initial_pos.rotation.x = Math.PI/4;
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
	camera.position.z = 10;

	// Här skapar vi våra modeller
	skapa_boll();
	skapa_golv();
	
	//Skapar scenen
	scene = new THREE.Scene();

	//Här skapar jag scengrafen
	stack();

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
       

        if(keyboard.pressed("left")||keyboard.pressed("right")||keyboard.pressed("up")||keyboard.pressed("down") || keyboard.pressed("space"))
    	{	
        	movement();
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
	if(boll.position.y > 0){
		in_air = true;
		n++;
			
	}
	if(in_air){
		if( boll.position.y <= 0){
			speedY = 0;
		}
	}
	if( boll.position.y <= 0){
				setTimeout(function() {in_air = false;}, 100);
				
				n = 0;
	}

	//boll.position.x += speedX;
	//boll.position.z += speedZ;
	boll.position.y += speedY + grav*(n/30);
	//boll.position.x += speedX;
	console.log(grav);


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
	var golvgeometry = new THREE.BoxGeometry( 10, 0.5, 10)
	
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

function stack()
{
	//Först roterar vi allt för vi vill ha en vy snett uppifrån
	scene.add(kamera_initial_pos);

	//Flyttar och lägger till golvet
	kamera_initial_pos.add(flytta_golv);
	flytta_golv.add(golv);

	//Lägger till tangentrörelserna och bollen
	kamera_initial_pos.add(person_förflyttning);
	person_förflyttning.add(person_rotationside);
	person_rotationside.add(person_rotationup);
	person_rotationup.add(boll);
}

function render_checkbox()
{
	rendererStats= new THREEx.RendererStats()
	rendererStats.domElement.style.position	= 'absolute'
	rendererStats.domElement.style.bottom	= '0px'
	document.body.appendChild( rendererStats.domElement )
}





function movement(){
/*
addEventListener("keydown", function(event) {
    switch(event.keyCode){
    	case 87: //upp
    		speedZ = -0.1;
    	break;
    	case 83: //down
    		speedZ = 0.1;
    	break;
    	case 65: //left
    		speedX = -0.1;
    	break;
    	case 68: //right
    		speedX = 0.1;
    	break;
    	case 32: //space
    		speedY =  0.2;
    	break;



    }
     
  });
  addEventListener("keyup", function(event) {
    switch(event.keyCode){
    	case 87: //upp
    		speedZ = 0;
    	break;
    	case 83: //down
    		speedZ = 0;
    	break;
    	case 65: //left
    		speedX = 0;
    	break;
    	case 68: //right
    		speedX = 0;
    	break;
    	case 32: //space
    		speedY =  -0.1;
    	break;
     }
  });*/



	if(keyboard.pressed("left"))
    {	
	boll.position.x -= 0.1;
	boll.rotation.y = Math.PI/2;
	//speedX = -0.1;
	
	}
	if(keyboard.pressed("right"))
    {	
	boll.position.x += 0.1;
	boll.rotation.y = -Math.PI/2;
	//speedX = 0.1;
	
	}
	if(keyboard.pressed("up"))
    {	
	boll.position.z -= 0.1;
	boll.rotation.y = 0;
	//speedZ = -0.1;
	
	}
	
	if(keyboard.pressed("down"))
    {	
	boll.position.z += 0.1;
	boll.rotation.y = Math.PI;
	//speedZ = 0.1;
	
	}


	if(keyboard.pressed("space"))
    {	
    	if(!(in_air)){
    		speedY = 0.3;

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