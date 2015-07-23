<?php
class wpt_player_shortcode {
	static $add_script;
	static function wpt_player_init () {
		add_shortcode('tplayer', array(__CLASS__, 'wpt_player_func'));
		add_shortcode('tplaylist', array(__CLASS__, 'wpt_player_playlist_func'));
		add_shortcode('tsong', array(__CLASS__, 'wpt_player_song_func'));
		add_action('init', array(__CLASS__, 'wpt_player_register_script'));
		add_action('wp_footer', array(__CLASS__, 'wpt_player_print_script_style'));
		remove_filter( 'the_content', 'wpautop' );
		add_filter( 'the_content', 'wpautop' , 12);
	}
  
	static function wpt_player_song_func( $atts, $content ) {
		self::$add_script = true;
		extract(shortcode_atts(array(
			"url" => '',
			"cover" => '',
		), $atts));
		$wpt_player_str=do_shortcode($content);
		$wpt_player_findme= '–';
		$wpt_player_arr = explode($wpt_player_findme, $wpt_player_str);
		$wpt_player_option=get_option('wpt_player_option');
		if ($wpt_player_option['dwn']){
			$wpt_player_dwn='<a href="'.$url.'" class="fa fa-arrow-down" title="Download" target="a_blank"></a>';
		} else {
			$wpt_player_dwn='';
		}
		$wpt_player_output='<li t_cover="'.$cover.'" t_artist="'.$wpt_player_arr[0].'" t_name="'.$wpt_player_arr[1].'"><span>'.$wpt_player_str.'</span>'.$wpt_player_dwn.'<audio preload="none"><source src="'.$url.'" type="audio/mp3"/></audio></li>';
		return $wpt_player_output;
	}
	
	static function wpt_player_playlist_func( $atts, $content ) {
		self::$add_script = true;
		$wpt_player_show=($atts["show"]=='true') ? 'display: block;' : 'display: none;';
		if ($atts["show"]=='true'){
			$wpt_player_pls_btn='<input type="hidden" id="pls_btn" value="true">';
		} else {
			$wpt_player_pls_btn='<input type="hidden" id="pls_btn" value="false">';
		}
		$wpt_player_output= '<div id="playlist" style="'.$wpt_player_show.'"><ul>'.do_shortcode($content).'</ul></div></div>'.$wpt_player_pls_btn;
		return $wpt_player_output;
		
	}
	
	static function wpt_player_func( $atts, $content=null ) {
		self::$add_script = true;
		$wpt_player_option=get_option('wpt_player_option');
		if ($wpt_player_option['autstr']){
			$wpt_player_autstr='<input type="hidden" id="autstr" value="true">';
		} else {
			$wpt_player_autstr='<input type="hidden" id="autstr" value="false">';
		}
		return '<div id="tplayer" style="display: none;"><div id="t_wrapper"><div id="t_cover"><img src="'.plugins_url("../assets/images/logo.png", __FILE__).'"></div><div id="t_top"><div id="t_title_info"><span class="artist"></span><span class="title"></span></div></div><div id="t_middle"><div id="play"></div><div id="pause" class="hidden"></div><div id="t_progress"><div id="trackInfo"><div id="error"></div><div id="current">00:00</div><div id="duration">00:00</div></div></div><div id="prev"></div><div id="repickPl"></div><div id="next"></div></div><div id="t_bottom"><div id="range"><div id="val"></div><div id="vol"></div><div id="rangeVal"></div></div><div id="t_pls_show" class="noselectpls"></div></div></div>'.do_shortcode($content).$wpt_player_autstr;
	}

	static function wpt_player_register_script() {
		wp_register_script(
			'wpt_player_script',
			plugins_url('../assets/js/wpt_player_js.js', __FILE__),
			array('jquery','jquery-ui-slider')
		);
	}
	 
	static function wpt_player_print_script_style () {
		if ( !self::$add_script ) return;
			wp_print_scripts('wpt_player_script');
			wp_enqueue_style( 'wpt_player_style', plugins_url('../assets/css/wpt_player_style.css', __FILE__)); 
		}
}
?>