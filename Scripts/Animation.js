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
			
		
		}else if(floor_collision){
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
			if(silence == false){
				
				SFXvol_controll[3].play();
				SFXvol_controll[2].play();
			}
		}
	//Kollar om mandeln rör sig
	}else if((keyboard.pressed("up") || keyboard.pressed("down")) ){
		// Öppnar  nya mixers
		Mandeln.mixers[5].clipAction(Mandeln.meshes[0].geometry.animations[5]).play();
		Mandeln.mixers[5].update(Mandeln.meshes[0].geometry.animations[5].duration/10);
		if(silence == false)
			{
				SFXvol_controll[1].play();
			}
		
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
	for (var i = 0; i < objectiv.mixers.length; ++i)
		objectiv.mixers[0].update(objectiv.meshes[0].geometry.animations[0].duration/200);	
}