////*****************////
////   Variabler Def ////
////*****************////

//FPS Detta behlvs byta ut mot tid delta
var fps = 60;

// De viktiga variablerna för kamera osv
var camera, scene, renderer,rendererStats, canvas, loadermod;

//Models loaders urls
var urls;
//Tar in storleken av fönstret
var windowHalfX = window.innerWidth ;
var windowHalfY = window.innerHeight ;

// Mina object som skapas.
var boll, golv;
var modell = new THREE.Object3D();
//Klass som handskar tangenbordstryck
var keyboard= new THREEx.KeyboardState();


////*****************////
//// Tansformationer ////
////*****************////

//Sätter golv där de ska vara
var flytta_golv = new THREE.Group();
flytta_golv.translateY(-15);

//Vrider kameran så att man ser snett uppifrån
var kamera_initial_pos = new THREE.Group();
kamera_initial_pos.rotation.x = Math.PI/4;

// Huvudpersonensförflyttning
var person_förflyttning,person_rotationup,person_rotationside;
person_förflyttning = new THREE.Group();
person_rotationup = new THREE.Group();
person_rotationside = new THREE.Group();
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
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 2000);
	camera.position.z = 500;

	// Här skapar vi våra modeller
	skapa_golv();

	
	
	//Skapar scenen
	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x444444 );
				scene.add( ambient );

				var directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 1 ).normalize();
				scene.add( directionalLight );

	var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};
	var onError = function ( xhr ) { };

	
	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( './Models/' );
	mtlLoader.load( 'Sphere.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( './Models/' );
		objLoader.load( 'Sphere.obj', function ( object ) {
		modell.add(object);
		

		}, onProgress, onError );
	});

	
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
	
	//camera.lookAt( scene.position );
	renderer.render(scene, camera);
	rendererStats.update(renderer);
	// Loopar över draw functionen och sänker fps'n till 60fps
	setTimeout(function() {
       

        if(keyboard.pressed("left")||keyboard.pressed("right")||keyboard.pressed("up")||keyboard.pressed("down"))
    	{	
        	movement();
    	}
      	
        //
      	requestAnimationFrame(draw);
 
        // ... Code for Drawing the Frame ...
 
    }, 1000 / fps);
}


//Sätter renderings inställningar
function render_options(){
	renderer = new THREE.WebGLRenderer(canvas);
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

function skapa_golv()
{
	//Skpapar bollen
	var golvgeometry = new THREE.BoxGeometry( 400, 0.5, 400)
	
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

	kamera_initial_pos.add(modell);

	//Lägger till tangentrörelserna och bollen
	//kamera_initial_pos.add(object);
}

function render_checkbox()
{
	rendererStats= new THREEx.RendererStats()
	rendererStats.domElement.style.position	= 'absolute'
	rendererStats.domElement.style.bottom	= '0px'
	document.body.appendChild( rendererStats.domElement )
}

function movement(){

	if(keyboard.pressed("left"))
    {	
		modell.position.x -=  2;
	}
	if(keyboard.pressed("right"))
    {	
	modell.position.x +=  2;
	}
	if(keyboard.pressed("up"))
    {	
	modell.position.z -=  2;
	}
	if(keyboard.pressed("down"))
    {	
	modell.position.z +=  2;
	}
}

