// Detta är vår fil för inladdning av modeller
//Det mesta arbetet göra av filen JDLoader som vi har tagit från http://www.cgdev.net/json/download.php

var loader = new THREE.JDLoader();


function Mloader(url_in, animation_in)
{
    this.url =url_in ;
    this.animation = animation_in;
	this.object = new THREE.Group();
	this.mixers = [];
	this.meshes = []; 
	
}



// Laddar objectet, texturen och animationen
modell_loader = function(object)
{	
	//En json laddare från http://www.cgdev.net/json/download.php
	loader.load(object.url,function (data)
	{
		//Läser in material
		var multiMaterial = new THREE.MultiMaterial(data.materials);
		if(object.url == "./Models/Levels/Level_1/floor.jd" || object.url == "./Models/Levels/Level_1/pipe.jd" || object.url == "./Models/Levels/Level_1/fencewall1.jd")
		{
			console.log(multiMaterial.materials[0]);
			//multiMaterial.materials[0].transparent = true;
			//multiMaterial.materials[0].opacity = 0.7;
			multiMaterial.materials[0].map.wrapS = multiMaterial.materials[0].map.wrapT = THREE.RepeatWrapping;
			multiMaterial.materials[0].map.repeat.set(2,2);
		}
		if(object.url == "./Models/Levels/Level_1/fencewall1.jd" || object.url == "./Models/Levels/Level_1/fencewall2.jd" || object.url == "./Models/Levels/Level_1/fencewall3.jd" || object.url == "./Models/Levels/Level_1/fencewall4.jd" || object.url == "./Models/Levels/Level_1/fencewall5.jd" || object.url == "./Models/Levels/Level_1/fencewall6.jd")
		{
			console.log(multiMaterial.materials[0]);
			//multiMaterial.materials[0].transparent = true;
			//multiMaterial.materials[0].opacity = 0.7;
			multiMaterial.materials[0].map.wrapS = multiMaterial.materials[0].map.wrapT = THREE.RepeatWrapping;
			multiMaterial.materials[0].map.repeat.set(10,10);
		}
		
		for (var i = 0; i < data.geometries.length; ++i)
		{
			var mesh = new THREE.SkinnedMesh(data.geometries[i], multiMaterial);
			object.meshes.push(mesh);
			object.object.add(mesh);
			
			//Lägger till animationer
			if(object.animation)
			{
				if (mesh.geometry.animations)
                  {
					var mixer = []
					for(var l = 0; l< mesh.geometry.animations.length; ++l)
					{
						mixer[l] = new THREE.AnimationMixer(mesh);
					} 
					for(var k = 0; k< mesh.geometry.animations.length; ++k)
					{
						object.mixers[k]= mixer[k];
						mixer[k].clipAction(mesh.geometry.animations[k]).play();
					}	
                  }
			}
		}
	});
} 
