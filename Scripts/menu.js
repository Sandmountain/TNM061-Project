function showMenu()
{
	var y = document.getElementById('menu-button');
	var x = document.getElementById('game-menu');
	
	if(x.style.display === 'none')
	{
		x.style.display = 'block';
		y.style.backgroundImage = 'url(./img/Close-menu-button.png)';
	
	}
	else{
		x.style.display = 'none';
		y.style.backgroundImage = 'url(./img/menu-button-new.png)';
		
	}

}

