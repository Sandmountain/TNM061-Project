	//Ljuddeklaration
	snd = new Audio("./Audio/song.mp3"); 
	jump = new Audio("./Audio/Jump1.mp3");
	walk = new Audio("./Audio/walk.mp3");
	ugh = new Audio("./Audio/ugh.mp3");
	tGround = new Audio("./Audio/TouchGround.mp3");

	//Ljudarray
	var SFXvol_controll = [jump, walk, ugh, tGround];


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
	var silence = false;

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
		if(e.keyCode =="32")  {
			
			if(silence == false){
				SFXvol_controll[0].play();
					//touchdown och ugh
					setTimeout(function(){ 
						SFXvol_controll[3].play();
				        SFXvol_controll[2].play();
				    }, 1500);  
			}
		}
		if(e.keyCode =="87"){
			if(silence == false){
			SFXvol_controll[1].play();
			}
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

    function SetVolume(val)
    {
        snd.volume = val / 100;
	       	var value = document.getElementById("chosen");
			value.innerHTML = val + "%";
    }

    function SetVolume2(val2)
    {
        SFXvol_controll[0].volume = val2 / 100;
        SFXvol_controll[1].volume = val2 / 100;
        SFXvol_controll[2].volume = val2 / 100;  
        SFXvol_controll[3].volume = val2 / 100;  

			var value2 = document.getElementById("chosen2");
			value2.innerHTML = val2 + "%";		
    }
