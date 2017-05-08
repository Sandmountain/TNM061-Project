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



