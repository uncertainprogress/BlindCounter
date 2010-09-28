var blinds = ["25/50", "50/100", "75/150", "100/200", "150/300", "200/400", "300/600", "400/800","600/1200","800/1600", "1000/2000", "1500/3000", "2000/4000", 
  "3000/6000", "4000/8000", "6000/12000", "8000/16000", "10000/20000"];

var widget_debug = true;

var minutes = 30;
var seconds = 59;

var tickInterval = null;
var flashInterval = null;

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
		TourneyManager.log("Start Timer.")
		
		
	}, //end start()
	
};

function startTimer() {
  $('#blinds').text(blinds[$('#levels').val()])
  minutes = parseInt($('#countLength').val());
  seconds=59;
  minutes--;
  $('#countval').text(minutes+":"+seconds)
  
  $('#counter').fadeIn(function(){$('#controls').slideUp('slow');});
  $('#next').slideUp('slow');
  
  tickInterval = setInterval("tick()", 1000);
  
}

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

function tick() {
  seconds--;
  if(seconds < 0) {
    minutes--;
    seconds = 59;
  }
  
  if(minutes < 0) {
    clearInterval(tickInterval);
    $('#countval').text("00:00")
    $('#counter').addClass('redback')
    flashInterval = setInterval("flash()", 450);
    $('#next').slideDown('slow');
    $('#levels').val(parseInt($('#levels').val())+1);
  }
  else {
    if(seconds < 10) {
      $('#countval').text(minutes+":0"+seconds)
    }
    else {
      $('#countval').text(minutes+":"+seconds)
    }
  }
}

function flash() {
  if($('#counter').hasClass('redback')) {
    $('#counter').removeClass('redback')
    $('#counter').addClass('yellowback')
  }
  else {
    $('#counter').removeClass('yellowback')
    $('#counter').addClass('redback')
  }
  
}
 
 

