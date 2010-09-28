var blinds = ["25/50", "50/100", "75/150", "100/200", "150/300", "200/400", "300/600", "400/800","600/1200","800/1600", "1000/2000", "1500/3000", "2000/4000", 
  "3000/6000", "4000/8000", "6000/12000", "8000/16000", "10000/20000"];

var widget_debug = true;

$(document).ready(function() {
	TourneyManager.initializeView();
	
  //Set up the controls
/*    
  
  $('#nextButton').click(function(){
    nextLevel();
  });
  
  $('#pauseButton').click(function(){
    pauseBlinds();
  });
  
  $(window).keypress(function(event) {
    if(event.keyCode == 27) {
      $('#counter').removeClass('yellowback')
      $('#counter').removeClass('redback')
      clearInterval(tickInterval);
      clearInterval(flashInterval);
      
      $('#controls').slideDown('slow');
      $('#next').slideUp('slow');
      $('#counter').fadeOut();
    }
  });
  
  $('#countLength').keypress(function(event){
    if(event.keyCode == 13) {
      startTimer();
    }
  });
  */
});

TourneyManager = {
	minutes: 29,
	seconds: 59,
	
	tickInterval: null,
	flashInterval: null,
	
	
	
	log: function(message) {
		if(widget_debug) {
			console.log(message);
		}
	},
	
	//**************************************************
	initializeView: function() {
		$("input, textarea, select, button").uniform();
		
		$("#right-controls").hide();
		$("#bottom-controls").hide();
		$("#counter").hide();
		$("#rebuy-update").hide();
		
		for(i=1; i<= 27; i++) {
			$('#players').addOption(i, i);
		}
		$('#players').selectOptions("10", true)
		$.uniform.update('#players');
		
		for(i=0; i<blinds.length; i++) {
			$('#levels').addOption(blinds[i], blinds[i]);
		}
		$('#levels').selectOptions(blinds[0], true);
		$.uniform.update('#levels');
		
		
		$('input.clear').each(function() { 
	    $(this).data('default', $(this).val()) .addClass('inactive') .focus(function() {
	      $(this).removeClass('inactive'); if ($(this).val() == $(this).data('default') || '') {
	      $(this).val('');
	    } })
	      .blur(function() { var default_val = $(this).data('default'); if ($(this).val() == '') {
	      $(this).addClass('inactive'); $(this).val($(this).data('default'));
	    } });
	  });
		
		$("#rebuy").click(function() {
			if(this.checked) {
				$('#rebuy-update').slideDown('slow');
			}
			else {
				$('#rebuy-update').slideUp('slow');
			}
		});
		
		$("#startButton").click(function() {TourneyManager.start(); });
	
	}, //end initializeView()
	
	
	start: function() {		
		$('#setup-controls').slideUp('slow', function(){$('#counter').fadeIn();});
		
		$('#blinds').text(blinds[$('#levels').val()])
	  this.minutes = parseInt($('#countLength').val());
	  this.seconds=59;
	  this.minutes--;
	  
		$('#countval').text(this.minutes+":"+this.seconds)
		
		setTimeout("$('#right-controls').show('slide')", 1300);
		
		this.tickInterval = setInterval("TourneyManager.tick()", 1000);
		
	}, //end start()
	
	tick: function() {
	  this.seconds--;
	  if(this.seconds < 0) {
	    this.minutes--;
	    this.seconds = 59;
	  }

	  if(this.minutes < 0) {
	    clearInterval(this.tickInterval);
	    $('#countval').text("00:00")
	    $('#main').addClass('redback')
	    this.flashInterval = setInterval("TourneyManager.flash()", 450);
	    $('#next').slideDown('slow');
	    $('#levels').val(parseInt($('#levels').val())+1);
			$.uniform.update('#levels')
	  }
	  else {
	    if(this.seconds < 10) {
	      $('#countval').text(this.minutes+":0"+this.seconds)
	    }
	    else {
	      $('#countval').text(this.minutes+":"+this.seconds)
	    }
	  }
	}, //end tick()
	
	flash: function() {
	  if($('#main').hasClass('redback')) {
	    $('#main').removeClass('redback')
	    $('#main').addClass('yellowback')
	  }
	  else {
	    $('#main').removeClass('yellowback')
	    $('#main').addClass('redback')
	  }
	}, //end flash()
	
};

function nextLevel() {
  clearInterval(flashInterval);
  $('#counter').removeClass('yellowback');
  $('#counter').removeClass('redback');
  startTimer();
}

function pauseBlinds() {
  clearInterval(flashInterval);
  $('#counter').removeClass('yellowback')
  $('#counter').removeClass('redback')
  
  $('#controls').slideDown('slow');
  $('#next').slideUp('slow');
  $('#counter').fadeOut();
  
}

 
 

