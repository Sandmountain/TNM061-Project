function showMenu() {
 
	var y = document.getElementById('menu-button');
	var x = document.getElementById('game-menu');
    var z = document.getElementById('canvas')

	if (x.style.display != 'block') {
    	x.style.display = 'none';
    	y.style.backgroundImage = 'url(./img/menu-button-new.png)';
   	 

	}
    
	if (x.style.display == 'none') {
    	x.style.display = 'block';
    	y.style.backgroundImage = 'url(./img/Close-menu-button.png)';
   	 
   	 
   	 
	} else {
    	x.style.display = 'none';
    	y.style.backgroundImage = 'url(./img/menu-button-new.png)';
	}
    
    
   	 


}
//Ifall någon trycker esc så slutar spelet
keyMenu = function() {


	var y = document.getElementById('menu-button');
	var x = document.getElementById('game-menu');

    if (x.style.display != 'block') {
   	 
   	 x.style.display = 'none';
    	y.style.backgroundImage = 'url(./img/menu-button-new.png)';
    }
    
	if (x.style.display == 'none') {
    	setTimeout(function() {
        	x.style.display = 'block';
        	y.style.backgroundImage = 'url(./img/Close-menu-button.png)';

    	}, 100);


	} else {

    	setTimeout(function() {
        	x.style.display = 'none';
        	y.style.backgroundImage = 'url(./img/menu-button-new.png)';

    	}, 100);


	}

}
