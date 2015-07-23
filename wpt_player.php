<?php
/*
Plugin Name: tPlayer HTML5 audio player (with playlist)
Description: Want visitors of your website hear your music or share your musical tastes? tPlayer – ideal for this, easy to install, minimum settings, most important formats supports, shoutcast and icecast support.
Plugin URI: http://codecanyon.net/item/tplayer-v13-html5-audio-player-with-playlist/8296578
Version: 1.0.1
Author: Derick Wire
Author URI: http://codecanyon.net/user/mmetrodw
Domain Path: /languages/

	Copyright 2015  Derick Wire  (email: artgure@gmail.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

include 'includes/shortcodes.php';

/* Подключаем переводы */
add_action('init', 'wpt_player_load_translation_file');
 
function wpt_player_load_translation_file() {
    $plugin_path = plugin_basename( dirname( __FILE__ ) .'/languages/' );
    load_plugin_textdomain( 'wpt_player', '', $plugin_path );
}

/*добавление таблиц и записей*/
register_activation_hook(__FILE__, 'wpt_player_set_options');
register_deactivation_hook(__FILE__, 'wpt_player_unset_options');

function wpt_player_set_options(){
	$wpt_player_default = array(
        'dwn'=>'false',
        'autstr'=>'false',
        'bg_player'=>'#fff',
        'txt_color_player'=>'#555',
        'btn_color_player'=>'#555',
        'btn_active_color_player'=>'#3ec3d5',
        'bg_bar_color_player'=>'#555',
        'progress_bar_color_player'=>'#3ec3d5',
        'pls_bg_player'=>'#3ec3d5',
        'pls_txt_color_player'=>'#fff',
    );
    add_option('wpt_player_option', $wpt_player_default);
}

function wpt_player_unset_options(){
    /*очищаем бд*/
    delete_option('wpt_player_option');
}

// активируем шорт код
wpt_player_shortcode::wpt_player_init();

// добавление кнопки в редактор
function wpt_player_add_mce_button() {
	// проверяем права пользователя - может ли он редактировать посты и страницы
	if ( !current_user_can( 'edit_posts' ) && !current_user_can( 'edit_pages' ) ) {
		return; // если не может, то и кнопка ему не понадобится, в этом случае выходим из функции
	}
	// проверяем, включен ли визуальный редактор у пользователя в настройках (если нет, то и кнопку подключать незачем)
	if ( 'true' == get_user_option( 'rich_editing' ) ) {
		add_filter( 'mce_external_plugins', 'wpt_player_add_mce_button_js' );
		add_filter( 'mce_buttons', 'true_register_tplayer_button' );
	}
}
add_action('admin_head', 'wpt_player_add_mce_button');
 
// В этом функции указываем ссылку на JavaScript-файл кнопки
function wpt_player_add_mce_button_js( $plugin_array ) {
	$plugin_array['wpt_player_button'] = plugins_url("/assets/js/wpt_player_button.js",__FILE__); // true_mce_button - идентификатор кнопки
	return $plugin_array;
}
 
// Регистрируем кнопку в редакторе
function true_register_tplayer_button($wpt_player_button) {
	array_push( $wpt_player_button, 'wpt_player_button' ); // true_mce_button - идентификатор кнопки
	return $wpt_player_button;
}
function wpt_player_button_styles_with_the_lot()  
{  
    // Register the style like this for a plugin:  
    wp_register_style( 'wpt_player_button_button_style', plugins_url( '/assets/css/wpt_player_button_style.css', __FILE__ ), array(), 'all' );  
    
}  
add_action( 'admin_init', 'wpt_player_button_styles_with_the_lot' );

// создаем настройки
function wpt_player_default_settings_page(){
	add_menu_page( __('tPlayer', 'wpt_player'), __('tPlayer', 'wpt_player'), 'edit_posts', 'wpt_player_settings', 'wpt_player_settings', 'dashicons-format-audio' );
}

add_action( 'admin_menu', 'wpt_player_default_settings_page' );
add_action( 'admin_menu', 'wpt_player_settings_page' );

function wpt_player_settings_page() {
    $wpt_player_settings_page_hook_suffix = add_submenu_page( 'wpt_player_settings', // The parent page of this submenu
                        __('tPlayer Settings', 'wpt_player'), // The submenu title
                        __('tPlayer Settings', 'wpt_player'), // The screen title
						'edit_posts', // The capability required for access to this submenu
						'wpt_player_settings', // The slug to use in the URL of the screen
						'wpt_player_settings' // The function to call to display the screen
	);
}

add_action( 'admin_menu', 'wpt_player_code_generator' );

function wpt_player_code_generator() {
    $wpt_player_suffix = add_submenu_page( 'wpt_player_settings', // The parent page of this submenu
                        __('Playlist Generator', 'wpt_player'), // The submenu title
                        __('Playlist Generator', 'wpt_player'), // The screen title
						'edit_posts', // The capability required for access to this submenu
						'wpt_player_code_generator_page', // The slug to use in the URL of the screen
						'wpt_player_code_generator_page' // The function to call to display the screen
	);
	add_action('admin_print_scripts-'.$wpt_player_suffix,'wpt_player_code_generator_page_admin_scripts');
}


function wpt_player_code_generator_page_admin_scripts() {
/*
	* Эта функция будет вызвана только на странице плагина, подключаем наш скрипт
*/
	wp_enqueue_script('wpt_player_code_generator_js');
}
	
/* Подключаем Iris Color Picker 
----------------------------------------------------------------- */
function wpt_player_add_admin_iris_scripts( $hook ){
	// подключаем IRIS
	wp_enqueue_script( 'wp-color-picker' );
	wp_enqueue_style( 'wp-color-picker' );
	wp_enqueue_style('wpt_player_button_button_style'); 
	// подключаем свой файл скрипта
	wp_enqueue_script('wpt_player_settings_script', plugins_url( '/assets/js/wpt_player_settings_script.js', __FILE__ ), array('wp-color-picker','jquery'), false, 1 );
}

add_action( 'admin_enqueue_scripts', 'wpt_player_add_admin_iris_scripts' );

add_action( 'admin_init', 'wpt_player_init');

function wpt_player_init(){
	wp_register_script('wpt_player_code_generator_js', plugins_url('/assets/js/wpt_player_code_generator.js', __FILE__),array('jquery'));
	register_setting( 'wpt_player_option', 'wpt_player_option' );
	include 'includes/color_save.php';
	$fp = fopen(plugin_dir_path( __FILE__ ).'assets/css/wpt_player_custom_css.css', 'w');
	// записываем в файл текст
	fwrite($fp, $wpt_player_custom_css);
	// закрываем
	fclose($fp);
}

// Страница настроек
function wpt_player_settings(){
?>
	<div class="wrap">
		<h2><?php echo get_admin_page_title() ?> <a class="wpt_player_tooltips" href="https://www.youtube.com/watch?v=3T0HDVWR63M&feature=youtu.be&t=46s" target="_blank">?<span><?php _e('Click to see tutorial on YouTube', 'wpt_player'); ?></span></a></h2>
			
		<form method="post" action="options.php">
			<?php settings_fields('wpt_player_option'); ?>
			<?php $wpt_player_option = get_option('wpt_player_option');?>
			<table class="form-table">
				<tbody>
					<tr>
						<th scope="row"><?php _e('Default Player Options:', 'wpt_player'); ?></th>
						<td>
							<fieldset>
								<legend class="screen-reader-text"><span><?php _e('Default Player Options:', 'wpt_player'); ?></span></legend>
								<label for="dwn"><input name="wpt_player_option[dwn]" type="checkbox" id="dwn" <?php if (isset($wpt_player_option['dwn'])){echo $wpt_player_option['dwn']=="on" ? 'checked':'';}?>><?php _e('Enable Downloading', 'wpt_player'); ?></label><br>
								<label for="autstr"><input name="wpt_player_option[autstr]" type="checkbox" id="autstr" <?php if (isset($wpt_player_option['autstr'])){echo $wpt_player_option['autstr']=="on" ? 'checked':'';}?>><?php _e('Enable Autostart', 'wpt_player'); ?></label><br>
							</fieldset>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Background Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[bg_player]" id="bg_player" type="text" value="<?php echo $wpt_player_option['bg_player']; ?>" /><br>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Text Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[txt_color_player]" id="txt_color_player" type="text" value="<?php echo $wpt_player_option['txt_color_player']; ?>" />
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Button Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[btn_color_player]" id="btn_color_player" type="text" value="<?php echo $wpt_player_option['btn_color_player']; ?>" />
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Active Button Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[btn_active_color_player]" id="btn_active_color_player" type="text" value="<?php echo $wpt_player_option['btn_active_color_player']; ?>" />
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Bar Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[bg_bar_color_player]" id="bg_bar_color_player" type="text" value="<?php echo $wpt_player_option['bg_bar_color_player']; ?>" />
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Progress Bar Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[progress_bar_color_player]" id="progress_bar_color_player" type="text" value="<?php echo $wpt_player_option['progress_bar_color_player']; ?>" />
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Playlist Background Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[pls_bg_player]" id="pls_bg_player" type="text" value="<?php echo $wpt_player_option['pls_bg_player']; ?>" />
						</td>
					</tr>
					<tr>
						<th scope="row"><?php _e('Playlist Text Color tPlayer:', 'wpt_player'); ?></th>
						<td>
							<input class="iris_color" name="wpt_player_option[pls_txt_color_player]" id="pls_txt_color_player" type="text" value="<?php echo $wpt_player_option['pls_txt_color_player']; ?>" />
						</td>
					</tr>
				</tbody>
			</table>
			
			<hr>
			<div id="wptp_preview">
				<div class="wptp_wrapper">
					<div class="wptp_cover"></div>
					<div class="wptp_title">Arist Name - Song Title</div>
					<div class="wptp_middle">
						<div class="wptp_btn_hover"></div>
						<div class="wptp_bar"><div class="wptp_progress"></div></div>
						<div class="wptp_btn"></div>
						<div class="wptp_btn"></div>
						<div class="wptp_btn"></div>
					</div>
				</div>
				<div class="wptp_pls">
					Arist Name - Song Title
				</div>
			</div>
			<?php submit_button();?>
		</form>
	</div>
<?php  
}
function wpt_player_enqueue_media() {
	if (!did_action('wp_enqueue_media')) {
		wp_enqueue_media();
	}
}

add_action( 'admin_enqueue_scripts', 'wpt_player_enqueue_media' );
// Генератор кода
function wpt_player_code_generator_page(){
?>
	<div class="wrap">
		<h2><?php echo get_admin_page_title() ?> <a class="wpt_player_tooltips" href="https://www.youtube.com/watch?v=3T0HDVWR63M&feature=youtu.be&t=96" target="_blank">?<span><?php _e('Click to see tutorial on YouTube', 'wpt_player'); ?></span></a></h2>
		<p><a href="#" id="wpt_player_add_item"><?php _e('Add another song', 'wpt_player'); ?></a></p>
		<p><label for="wpt_player_pls"><input name="wpt_player_pls" type="checkbox" id="wpt_player_pls" class="wpt_player_change"><?php _e('Show Playlist', 'wpt_player'); ?></label></p>
		<ul id="wpt_player_list">
			<li data-id="1">
				<input type="text" class="regular-text artst_nm_sng wpt_player_change" id="artst_nm_sng_1" placeholder="Artist Name">
				<input type="text" class="regular-text ttl_sng wpt_player_change" id="ttl_sng_1" placeholder="Song Title">
				<input type="button" name="wpt_player_browse_song" class="button wpt_player_browse_song" value="<?php _e('Select Song','wpt_player');?>">
				<input type="hidden" name="sng_1_url" id="sng_1_url" class="sng_url wpt_player_change" value="">
				<input type="button" name="wpt_player_browse_cover" class="button wpt_player_browse_cover" value="<?php _e('Select Cover','wpt_player');?>">
				<input type="hidden" name="sng_1_cvr" id="sng_1_cvr" class="cvr_url wpt_player_change" value="">
				<div class="icon">
					<i class="fa fa-link"><div><?php _e('Please select song', 'wpt_player'); ?></div></i>
					<i class="fa fa-file-image-o"><div><?php _e('Please select cover', 'wpt_player'); ?></div></i>
				</div>
			</li>
		</ul>
	
		<h2><?php _e('Copy this code into your post', 'wpt_player'); ?></h2>
		<div id="wpt_player_code_wrapper" class="animated">
			
		</div>
	</div>
	<?php
}
?>