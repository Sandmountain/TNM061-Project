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
boll = new THREE.Group();

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
flytta_golv.translateY(-50);

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


	scene.add(kamera_initial_pos);
	kamera_initial_pos.add(boll);
	loader.load("./Models/jorden.jd",
    function (data)
    {
               var multiMaterial = new THREE.MultiMaterial(data.materials);
               for (var i = 0; i < data.geometries.length; ++i)
               {
	                var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
	                meshes.push(mesh);
	                boll.add(mesh);
	               

	                if (mesh.geometry.animations)
	               	{
	                  	
	                  
		                var mixer = new THREE.AnimationMixer(mesh);
		                mixers.push(mixer);
		                mixer.clipAction(mesh.geometry.animations[0]).play();

		                //var mixer = new THREE.AnimationMixer(mesh);
		               // mixers.push(mixer);
		                //mixer.clipAction(mesh.geometry.animations).play();
	                 
             		}
               }
    });
	
	kamera_initial_pos.add(flytta_golv);
	flytta_golv.add(golv);

	




	

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

	var delta = clock.getDelta();
   	for (var i = 0; i < mixers.length; ++i){
     mixers[i].update(delta); 
   	}
	

	
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
	var golvgeometry = new THREE.BoxGeometry( 500, 5, 500)
	
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
	boll.position.x -= 5;
	boll.rotation.y = Math.PI/2;
	//speedX = -0.1;
	
	}
	if(keyboard.pressed("right"))
    {	
	boll.position.x += 5;
	boll.rotation.y = -Math.PI/2;
	//speedX = 0.1;
	
	}
	if(keyboard.pressed("up"))
    {	
	boll.position.z -= 5;
	boll.rotation.y = 0;
	//speedZ = -0.1;
	
	}
	
	if(keyboard.pressed("down"))
    {	
	boll.position.z += 5;
	boll.rotation.y = Math.PI;
	//speedZ = 0.1;
	
	}


	if(keyboard.pressed("space"))
    {	
    	if(!(in_air)){
    		speedY = 0.8;

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