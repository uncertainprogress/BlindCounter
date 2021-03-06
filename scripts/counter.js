var blinds = ["25/50", "50/100", "75/150", "100/200", "150/300", "200/400", "300/600", "400/800","600/1200","800/1600", "1000/2000", "1500/3000", "2000/4000", 
  "3000/6000", "4000/8000", "6000/12000", "8000/16000", "10000/20000"];

var audio = ["audio/imperialmarch.mp3", "audio/redalert.mp3", "audio/tiefighter.mp3", "audio/airraid.mp3"];

var widget_debug = false;

$(document).ready(function() {
	TourneyManager.initializeView();
	
  //Set up the controls   
  $(window).keypress(function(event) {
    if(event.keyCode == 27) {
      TourneyManager.nextLevel();
			$('#nextBlindDialog').dialog('close'); }
	});
/*  
  $('#countLength').keypress(function(event){
    if(event.keyCode == 13) {
      startTimer();
    }
  });
  */
});

TourneyManager = {
	
	running: false,
	
	minutes: 29,
	seconds: 59,
	
	tickLength: 1000,
	flashLength: 450,
	
	tickInterval: null,
	flashInterval: null,
	
	totalPlayers: 10,
	numPlayers: 10,
	stackSize: 10000,
	rebuy: false,
	rebuys: 0,
	rebuyAmount: 5,
	rebuyStack: 5000,
	buyIn: 10,
	prizePool: 100,
	totalChips: 100000,
	
	payIncrement: 5,
	
	first: 0,
	second: 0,
	third: 15,
	fourth: 15,
	
	
	//**************************************************
	
	log: function(message) {
		if(widget_debug) {
			console.log(message);
		}
	},
	
	//**************************************************
	initializeView: function() {
		$("input, textarea, select, button").uniform();
		
		$("#right-controls").hide();
		$("#counter").hide();
		$("#rebuy-update").hide();
		$("#option-controls").hide();
		
		for(i=1; i<= 27; i++) {
			$('#players').addOption(i, i);
			$('#players2').addOption(i, i);
		}
		$('#players').selectOptions("10", true)
		$.uniform.update('#players');
		
		for(i=0; i<blinds.length; i++) {
			$('#levels').addOption(blinds[i], blinds[i]);
			$('#levels2').addOption(blinds[i], blinds[i]);
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
		
		$("#startButton").click(function() {TourneyManager.startPlay(); });
		$('#eliminate').click(function(){TourneyManager.eliminatePlayer();});
		//$('#options').click(function(){TourneyManager.toggleOptions();});
		$('#play').click(function(){TourneyManager.continuePlay();});
		$('#pause').click(function(){TourneyManager.pausePlay();});
		$('#stop').click(function(){TourneyManager.stopPlay();});
		$('#fixBlinds').click(function(){TourneyManager.fixBlinds();});
		$('#fixLevels').click(function(){TourneyManager.fixLevels();});
		$('#fixPlayers').click(function(){TourneyManager.fixPlayers();});
		$('#info').click(function(){TourneyManager.tourneyInfo();});
		
		//set up the dialogs		
		$('#fixBlindsDialog').dialog({
			autoOpen: false,
			closeOnEscape: true,
	    draggable: false,
	    resizable: false,
			position: "center",
	    height:200,
	    width:250,
	    modal:true,
	    title: "Update Blind Level",
			buttons: { "Ok": function(){ TourneyManager.updateBlinds(); $(this).dialog('close'); }, "Cancel": function(){$(this).dialog('close');}},
	   });
	
		$('#fixTimeDialog').dialog({
			autoOpen: false,
			closeOnEscape: true,
	    draggable: false,
	    resizable: false,
			position: "center",
	    height:200,
	    width:250,
	    modal:true,
	    title: "Update Level Length",
			buttons: { "Ok": function(){ TourneyManager.updateLevels(); $(this).dialog('close'); }, "Cancel": function(){$(this).dialog('close');}},
	   });
	
		$('#fixPlayersDialog').dialog({
			autoOpen: false,
			closeOnEscape: true,
	    draggable: false,
	    resizable: false,
			position: "center",
	    height:200,
	    width:250,
	    modal:true,
	    title: "Update Player Count",
			buttons: { "Ok": function(){ TourneyManager.updatePlayers(); $(this).dialog('close'); }, "Cancel": function(){$(this).dialog('close');}},
	   });
		
		$('#rebuyDialog').dialog({
			autoOpen: false,
			closeOnEscape: true,
	    draggable: false,
	    resizable: false,
			position: "center",
	    height:100,
	    width:200,
	    modal:true,
	    title: "Rebuy?",
			buttons: { "Yes": function(){ 
				TourneyManager.rebuyPlayer();
				TourneyManager.updateDisplay();
				$(this).dialog('close'); }, "No": function(){ $(this).dialog('close');}},
	   });
	
		$('#infoDialog').dialog({
			autoOpen: false,
			closeOnEscape: true,
	    draggable: false,
	    resizable: false,
			position: "center",
	    height:350,
	    width:450,
	    modal:true,
	    title: "Tournament Information",
			buttons: { "Ok": function(){ $(this).dialog('close'); }},
	   });
	
		$('#nextBlindDialog').dialog({
			autoOpen: false,
			closeOnEscape: false,
	    draggable: false,
	    resizable: false,
			position: "center",
	    height:200,
	    width:200,
	    modal:false,
	    title: "Next Blind Level",
			buttons: { "Next": function(){ 
				TourneyManager.nextLevel();
				$(this).dialog('close'); }},
	   });
		
	}, //end initializeView()
	
	//**************************************************
	startPlay: function() {		
		//log all the starting values
		$('#levels2').selectOptions($('#levels').val(), true);
		$('#players2').selectOptions($('#players').val(), true);
		$.uniform.update('#levels2');
		$.uniform.update('#players2');
		
		this.totalPlayers = parseInt($('#players').val());
		this.numPlayers = this.totalPlayers;
		try { this.stackSize = parseInt($('#startStack').val()); }
		catch(e) {this.stackSize = 10000;}
		try { this.buyIn = parseInt($('#buyIn').val()); }
		catch(e) {this.buyIn = 10;}
		
		if($('#rebuy').is(':checked')) {
			this.rebuy = true;
		}
		if(this.rebuy){
			try { this.rebuyStack = parseInt($('#rebuyStack').val()); }
			catch(e) {this.rebuyStack = 5000;}
			try { this.rebuyAmount = parseInt($('#rebuyAmount').val()); }
			catch(e) {this.rebuyAmount = 5;}
		}
		
		this.totalChips = this.totalPlayers*this.stackSize;
		this.prizePool = this.totalPlayers*this.buyIn;
		
		this.startTimer();
		
		$('#setup-controls').slideUp('slow', function(){$('#counter').fadeIn();});
		
		setTimeout("$('#right-controls').show('slide', {direction: 'right'})", 1000);		
		
		this.updateDisplay();
	}, //end start()
	
	//**************************************************
	startTimer: function() {
	  if(TourneyManager.running) { return; }
  	TourneyManager.running = true;
		
		try{this.minutes = parseInt($('#countLength').val());}
		catch(e) {this.minutes = 30;}
	  this.seconds=59;
	  this.minutes--;
		if(widget_debug) {
			this.seconds =10;
			this.minutes = 0;
		}
 		
		$('#countval').text(this.minutes+":"+this.seconds)
		
		this.tickInterval = setInterval("TourneyManager.tick()", this.tickLength);
		
		//preload the audio
		niftyplayer('niftyPlayer').load(audio[Math.floor(Math.random()*audio.length)]);
		
		this.updateDisplay();
	},
	
	//**************************************************
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
	    this.flashInterval = setInterval("TourneyManager.flash()", this.flashLength);
			$('#levels').selectOptions($('#levels option:selected').next().text(), true);
			$.uniform.update('#levels')
			$('#nextBlindDialog').dialog('open')
			
			niftyplayer('niftyPlayer').play();
			TourneyManager.running = false;
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
	
	//**************************************************
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
	
	//**************************************************
	clearFlash: function() {
		$('#main').removeClass('redback');
		$('#main').removeClass('yellowback');
		clearInterval(this.flashInterval);
	},
	
	//**************************************************
	nextLevel: function() {
		this.clearFlash();
		this.startTimer();
	},
	
	//**************************************************
	eliminatePlayer: function() {
		this.numPlayers--;
		if(this.rebuy) {
			$('#rebuyDialog').dialog('open');
		}
		this.updateDisplay();
	},
	
	//**************************************************
	toggleOptions: function() {
		if($('#option-controls').is(":visible")) {
			$('#option-controls').hide("slide", {direction: 'right'});
		}
		else {
			$('#option-controls').show("slide", {direction: 'right'});
		}
		
	},
	
	//**************************************************
	continuePlay: function() {
	  if(TourneyManager.running) { return; }
  	TourneyManager.running = true;
		this.tickInterval = setInterval("TourneyManager.tick()", this.tickLength);
		//this.toggleOptions();
	},
	
	//**************************************************
	pausePlay: function() {
	  TourneyManager.running = false;
		clearInterval(this.tickInterval);
		this.clearFlash();
	},
	
	//**************************************************
	stopPlay: function() {
	  TourneyManager.running = false;
		clearInterval(this.tickInterval);
		this.clearFlash();
	},
	
	//**************************************************
	fixBlinds: function() {
		$('#fixBlindsDialog').dialog('open');
	},
	
	//**************************************************
	updateBlinds: function() {
		$('#levels').selectOptions($('#levels2').val(), true);
		$.uniform.update('#levels');
		this.updateDisplay()
	},
	
	//**************************************************
	fixLevels: function() {
		this.pausePlay();
		$("#fixTimeDialog").dialog('open');
	},
	
	//**************************************************
	updateLevels: function() {
		try {
			this.minutes = parseInt($('#countLength2').val());
			this.seconds = 0;
			$("#countLength").val(this.minutes); 
			this.continuePlay();
		}
		catch(e) {}
	},
	
	//**************************************************
	fixPlayers: function() {
		
	},
	
	//**************************************************
	updatePlayers: function() {
		
	},
	
	//**************************************************
	tourneyInfo: function() {
		$('#infoDialog').dialog('open')
	},
	
	//**************************************************
	rebuyPlayer: function() {
		this.numPlayers++;
		this.totalChips += this.rebuyStack;
		this.prizePool += this.rebuyAmount;
	},
	
	//**************************************************
	updateDisplay: function() {
		
		$('#blinds').text($('#levels').val());
		
		$('#numPlayers').text(this.numPlayers + " Players");
		var avr = Math.floor(this.totalChips/this.numPlayers);
		
		var blinds = $('#levels').val();
		blinds = blinds.split('/');
		round = parseInt(blinds[0]) + parseInt(blinds[1]);
		
		$('#avrStack').text("Avg Stack:" + avr);		
		$('#avrM').text("Avg M: " + (avr/round).toFixed(2));
		
		$('#playersLeft').text(this.numPlayers + " of " + this.totalPlayers + " Remaining");
		$('#totalChips').text(this.totalChips + " Chips in Play");
		$('#prizePool').text("$" + this.prizePool + " Total Pool");
		
		var payouts = new Array();
		var initalPool = this.totalPlayers*this.buyIn;
		var rebuyPool = this.rebuys*this.rebuyAmount;
		
		if(this.totalPlayers > 10) { //15%, 20%, 25%, 40%
			payouts[3] = 15
			payouts[2] = 20
			payouts[1] = 25
			payouts[0] = 40
		}
		else { //20%, 30%, 50%
			payouts[2] = 15
			payouts[1] = 25
			payouts[0] = 50
		}
		$('#payouts').text("$" + payouts.join(", $"));
		
	},

};

function nextLevel() {
  clearInterval(flashInterval);
  $('#counter').removeClass('yellowback');
  $('#counter').removeClass('redback');

	niftyplayer('niftyPlayer').stop();

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

 
 

