jQuery(document).ready(function($){
	
	myOptions = {
		// you can declare a default color here,
		// or in the data-default-color attribute on the input
		defaultColor: false,
		// a callback to fire whenever the color changes to a valid color
		change: function(event, ui){
			bg_player=$('#bg_player').val();
			txt_color_player=$('#txt_color_player').val();
			btn_color_player=$('#btn_color_player').val();
			btn_active_color_player=$('#btn_active_color_player').val();
			bg_bar_color_player=$('#bg_bar_color_player').val();
			progress_bar_color_player=$('#progress_bar_color_player').val();
			pls_bg_player=$('#pls_bg_player').val();
			pls_txt_color_player=$('#pls_txt_color_player').val();
			$('.wptp_wrapper').css('background',bg_player);
			$('.wptp_title').css('color',txt_color_player);
			$('.wptp_btn').css('background',btn_color_player);
			$('.wptp_btn_hover').css('background',btn_active_color_player);
			$('.wptp_bar').css('background',bg_bar_color_player);
			$('.wptp_progress').css('background',progress_bar_color_player);
			$('.wptp_pls').css({'background': pls_bg_player , 'color' : pls_txt_color_player});
		},
		// a callback to fire when the input is emptied or an invalid color
		clear: function() {},
		// hide the color picker controls on load
		hide: true,
		// show a group of common colors beneath the square
		// or, supply an array of colors to customize further
		palettes: true
	};
	
	$('.iris_color').wpColorPicker(myOptions);
	
});