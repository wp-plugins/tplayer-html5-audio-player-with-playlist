var autostart=jQuery('#autstr').val();
var Pl = 0;
var styleChange = {pause:{}, play:{}, plsbutton:{}, retickPlayList:{}};

styleChange.play.change = function(){
		jQuery('#play').addClass('hidden');
		jQuery('#pause').removeClass('hidden');
};

styleChange.pause.change = function(){
		jQuery('#pause').addClass('hidden');
		jQuery('#play').removeClass('hidden');
};

styleChange.plsbutton.change = function(){
		jQuery('#t_pls_show').addClass('selectpls');
		jQuery('#t_pls_show').removeClass('noselectpls');
};
	
styleChange.plsbutton.recovery = function(){
		jQuery('#t_pls_show').addClass('noselectpls');
		jQuery('#t_pls_show').removeClass('selectpls');
};
	
styleChange.retickPlayList.change = function(){
		jQuery('#repickPl').addClass('selectrepeatpls');
};
	
styleChange.retickPlayList.recovery = function(){
		jQuery('#repickPl').removeClass('selectrepeatpls');
};
	
function btnClass(){
	show=jQuery('#pls_btn').val();
	if (show=='true'){
		styleChange.plsbutton.change();
		Pl = 1;
	} else {
		styleChange.plsbutton.recovery();
		Pl = 0;
	}
}

jQuery(window).load(function() {
	jQuery('#tplayer').delay(500).slideDown(500);
});

jQuery(document).ready(function($){
	btnClass();
	
	wptp_sceenWidth=$(document).width();
	wptp_wrapperWidth=$('#tplayer').parent().width();
	
	if(wptp_sceenWidth>640 && wptp_wrapperWidth<640){
		$('#t_wrapper').css('height', '400px');
		$('#t_cover').css({'height':'200px','width':'100%','float':'none'});
		$('#t_cover>img').css({'height':'auto','width':'100%'});
		$('#t_top').css({'padding':'25px 25px 0 25px','height':'55px'});
		$('#t_middle').css({'margin':'25px 20px 0px 20px','height':'60px'});
		$('#t_bottom').css({'margin':'0 20px','height':'60px'});
		$('#prev').css({'margin-left':'20px'});
		$('#range').css({'bottom':'25px'});
		$('#t_progress').css({'position':'absolute', 'margin':'40px 0','width':'100%','height':'20px','float':'left'});
		$('#play').css({'margin-left':'-webkit-calc(50% - 70px)', 'margin-left':'-moz-calc(50% - 70px)', 'margin-left':'-mos-calc(50% - 70px)', 'margin-left':'-o-calc(50% - 70px)', 'margin-left':'calc(50% - 70px)'});
		$('#pause').css({'margin-left':'-webkit-calc(50% - 70px)', 'margin-left':'-moz-calc(50% - 70px)', 'margin-left':'-mos-calc(50% - 70px)', 'margin-left':'-o-calc(50% - 70px)', 'margin-left':'calc(50% - 70px)'});
	}

	function initAudio(elem) {
        var title = elem.attr('t_name');
        var cover = elem.attr('t_cover');
        var artist = elem.attr('t_artist');
		
        $('.title').text(' - ' + title);
        $('.artist').text(artist);
        $('#t_cover>img').attr('src',cover);
	}

	var dur, durM, val, mus, elem, prog;		
	var repickPl = 0;
		first = $('#playlist>ul>li').first();
		last = $('#playlist>ul>li').last();
		
	if(autostart=="true"){
		$('#t_title_info').animate({top: "-1.25em",opacity: "hide"}, 0);
		mus = $('audio:first');
		mus[0].play();
		styleChange.play.change();
		initAudio($(first));
	}
			
			
	$('#playlist ul li').click(function(){
		$('#t_title_info').animate({top: "-1.5em",opacity: "hide"}, 0);
		initAudio($(this));
		$('#error').text('');
		styleChange.play.change();
		if(mus){
			mus[0].pause();
			mus[0].currentTime = 0;
			$('li').removeClass('active');
		}
		mus = $(this).find("audio");
		$(this).addClass('active');
		mus[0].play();
	});
			
	$('#t_progress').slider({
		value: 0,
		orientation: "horizontal",
		range: "min",
		animate: true,
		step: 1
	});
			
	$('audio').on("timeupdate", function() {
		if(mus){
			mus[0].volume = val/100;
		}
		d = this.duration;
		c = this.currentTime;
		curM = Math.floor(c/60);
		curS = Math.round(c - curM*60);
		if (curM<10){
			curM='0'+curM;
		}
		if (curS<10){
			curS='0'+curS;
		}
		$('#current').text(curM + ':' + curS);
		$('#t_progress').slider({
			max: d,
			min: 0,
			value: c
		});
	});
				
	$('audio').on("playing", function () {
		dur = this.duration;
		durM = Math.floor(dur/60);
		if (durM<10){
			durM='0'+durM;
		}
		durS=Math.round((dur - Math.floor(dur/60))/10);
		if (durS<10){
			durS='0'+durS;
		}
		durVal =  durM+ ':' +durS ;
					
        $('#duration').text(durVal);
		$(this).parent("li").addClass('active');
		$('#t_title_info').animate({top: "0em",opacity: "show"}, 500);	
    });
			
	$('audio').on("ended", function(){
		mus = $(this).parent('li').next('li').first();
		mus = mus.children('audio');
		$(this).parent("li").addClass('active');
		var next = $('li.active').next();
		$('li').removeClass('active');
		if(mus[0]){
			initAudio(next);
			mus[0].play();
		}else{
			if(repickPl == 1){
				mus = $('audio:first');
				mus[0].play();
				initAudio($(first));
			} else{
				$('#error').text('End of the Playlist!');
				styleChange.pause.change();
				mus = null;
			}
		}
	});

	//play button
	$('#play').click(function(){
		if(mus){
			mus[0].play();
			styleChange.play.change();
			$('#error').text('');
		} else {
			$('#t_title_info').animate({top: "-1.25em",opacity: "hide"}, 0);
			mus = $('audio:first');
			mus[0].play();
			styleChange.play.change();
			initAudio($(first));
		}
	}); 
			
	// pause button
	$('#pause').click(function() {
		if(mus){
			mus[0].pause();
			styleChange.pause.change();
		} else {
			$('#error').text('Please at first, select track in playlistist.');
		}
				
	});
			
	//next button
	$('#next').click(function(){
		mus[0].pause();
		mus[0].currentTime = 0;
		mus = mus.parent('li').next('li').first();
		mus = mus.children('audio');
		var next = $('li.active').next();
		$('#t_title_info').animate({top: "-1.25em",opacity: "hide"}, 0);
		$('li').removeClass('active');
		if(mus[0]){
			initAudio(next);
			mus[0].play();
		}else{
			if(repickPl == 1){
				mus = $('audio:first');
				mus[0].play();
				initAudio($(first));
			}else{
				$('#error').text('The end of the playlist!');
				$('#t_cover>img').attr('src','wp-content/plugins/tplayer/assets/images/logo.png');
				mus = null;
				styleChange.pause.change();
			}
		}
	});
				
	//prev button
	$('#prev').click(function(){
		mus[0].pause();
		mus[0].currentTime = 0;
		mus = mus.parent('li').prev('li').last();
		mus = mus.children('audio');
		var prev = $('li.active').prev();
		$('li').removeClass('active');
		$('#t_title_info').animate({top: "-1.25em",opacity: "hide"}, 0);
		if(mus[0]){
			initAudio(prev);
			mus[0].play();
		}else{
			if(repickPl == 1){
				mus = $('audio:last');
				mus[0].play();
				initAudio($(last));
			}else{
				$('#error').text('The start of the playlist!');
				styleChange.pause.change();
				mus = null;
			}
		}
	});

	//repeat playlist btn
	$('#repickPl').click(function(){
		if(repickPl == 0){
			styleChange.retickPlayList.change();
			repickPl = 1;
		}else{
			styleChange.retickPlayList.recovery();
			repickPl = 0;
			}
	});

	//volume
	$('#rangeVal').slider({
		value: 60,
		orientation: "horizontal",
		range: "min",
		animate: true,
		step: 1
	});
		
	// volume text
	val = $('#rangeVal').slider("value");
	$('#val').text(val);
	var tooltip = $('#val');
	tooltip.hide();
	
	$('#rangeVal').slider({
		start: function( event, ui ) {
			tooltip.fadeIn('fast');
		},
		stop: function(event,ui) {
			tooltip.fadeOut('fast');
		},
		slide: function( event, ui ) {
			val = ui.value;
			marginL=11/100;
			tooltip.css('left', val-28-marginL*val).text(ui.value);
			$('#val').text(val);
			$('.ui-slider-handle').css('margin-left', '-'+marginL*val+'px');
			if(mus){
				mus[0].volume = val/100;
			} else {
				$('#error').text('Please select track');
			}
		}
	});
				
	// progress
	$('#t_progress').slider({
		start: function( event, ui ) {
			mus[0].pause();
		},
		stop: function( event, ui ) {
			prog = ui.value;
			mus[0].currentTime = prog;
			mus[0].play();
			styleChange.play.change();
		},
		slide: function( event, ui ) {
			prog = ui.value;
			mus[0].currentTime = prog;
		}
	});
			
	//playlist button
	$('#t_pls_show').click(function(){
		if (Pl == 0) {
			styleChange.plsbutton.change();
			Pl = 1;
		} else {
			styleChange.plsbutton.recovery();
			Pl = 0;
		}
		$('#playlist').slideToggle();
	});

});