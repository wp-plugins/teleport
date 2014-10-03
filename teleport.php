<?php
	/*
	Plugin Name: Teleport
	Plugin URI: http://wordpress.org/extend/plugins/teleport/
	Description: Teleport is all about getting around WordPress quickly! It uses keyboard shortcuts to get you to the most important places with just two taps. The intuitive teleporter is arranged exactly like the keyboard shortcuts - the e, d, s, a, and q keys make a 'u' shape around the w key. This matches the layout the teleporter. <strong>To get started:</strong> 1) Activate the plugin. 2) Go to your homepage. 3) Once the page has finished loading, press "w". This will activate the teleporter. To learn more about the teleporter, read the plugin documentation.
	Version: 1.2.4
	Author: Stephen Coley, Douglas Karr
	Author URI: http://dknewmedia.com

	Copyright 2014 DK New Media  (email : info@dknewmedia.com)

	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License, version 2, as 
	published by the Free Software Foundation.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
	*/

	// Register Teleports resources
	function teleport_init() {
		if (!is_admin()) {
			wp_register_script('teleport_script', get_bloginfo('url') . "/wp-content/plugins/teleport/js/script.js", "jquery");
			wp_register_script('teleport_effects', get_bloginfo('url') . "/wp-content/plugins/teleport/js/jquery.ui.effects.min.js", "jquery");
		}
	}	

	// Injects Teleporters resources into the header
	// Determines if there's a front page
	// Localize script.js to pass it some data and namespace it as Teleport
	function teleport_head() {
		if (!is_admin()) {
			global $wp_query;
			$front_id = 0;
			echo "<link rel='stylesheet' href='" . get_bloginfo('url') . "/wp-content/plugins/teleport/css/style.css' />";
			if(is_front_page()) {
				$type = "page";
				$front_id = get_option('page_on_front');
			} else if(is_page()) {
				$type = "page";
			} else {
				$type = "post";
			}
			wp_enqueue_script('jquery');
			wp_enqueue_script('teleport_effects');
			wp_enqueue_script('teleport_script');
			wp_localize_script(
				'teleport_script',
				'Teleport',
				array(
					'ajaxurl' => admin_url('admin-ajax.php'),
					'postid' => $wp_query->post->ID,
					'type' => $type,
					'front_id' => $front_id
				)
			);
		}
	}

	// Determines if link requires a login redirect
	function teleport_url($url) {
		if(!is_user_logged_in()) {
			return wp_login_url($url);
		} else {
			return $url;
		}
	}

	// This ajax handler gets appended to the body tag.
	// This puts the Teleport markup on the site.
	// Links are formatted here as well.
	function teleport_ajax() {
		// Gather needed variables
		$postid = $_POST['postid'];
		$cururl = $_POST['cururl'];
		$type = $_POST['type'];
		$front_id = $_POST['front_id'];
		$is_admin = $_POST['admin'];
		teleport_teleporter($postid, $cururl, $type, $front_id, $is_admin);
		die();
	}

	function teleport_teleporter($postid, $cururl, $type, $front_id, $is_admin) {
		// If no home page is set...
		if($front_id == 0) {
			// Edit posts
			$edit = get_bloginfo('wpurl') . "/wp-admin/post.php?post=" . $postid . "&action=edit";
		// If a home page is set
		} else {
			// Edit page
			$edit = get_bloginfo('wpurl') . "/wp-admin/post.php?post=" . $front_id . "&action=edit";
		}
		$archive = get_bloginfo('wpurl') . "/wp-admin/edit.php?post_type=" . get_post_type($postid);
		// If the user is logged in, show the full Teleporter
		if(is_user_logged_in()) {
			$logger = wp_logout_url($cururl);
		} else {
			$logger = wp_login_url();
		}
		
		if($is_admin) {
			$set_option = "teleport_admin_warp";
			$get_option = "teleport_site_warp";
		} else {
			$set_option = "teleport_site_warp";
			$get_option = "teleport_admin_warp";
		}
		$warp = get_option($get_option);
		if($warp == FALSE) {
			$warp = "";
		}
		if($url = get_option($set_option)) {
			update_option($set_option, $cururl);
		} else {
			add_option($set_option, $cururl);
		}
		
echo '<div id="teleport">
	<div id="teleport_overlay"></div>
	<div id="teleporter">
	<div id="teleport_icon_teleporter" class="teleport_front teleport_face" data-warp="' . $warp . '"></div>
		 <div id="teleport_dknewmedia" class="teleport_back teleport_face" data-url="http://dknewmedia.com"></div>
	</div>
	<div id="teleport_first" class="teleport_button">
		<div id="teleport_icon_first" class="teleport_icon" data-url="' . teleport_url(get_bloginfo('wpurl') . '/wp-admin/options-general.php') . '" title="Settings"></div>
	</div>
	<div id="teleport_second" class="teleport_button">
	<div id="teleport_icon_second" class="teleport_icon" data-url="' . teleport_url(get_bloginfo('wpurl') . '/wp-admin/index.php') . '" title="Dashboard"></div>
	</div>
	<div id="teleport_third" class="teleport_button">
		<div id="teleport_icon_third" class="teleport_icon" data-url="' . teleport_url($edit) . '" title="Edit"></div>
	</div>
	<div id="teleport_fourth" class="teleport_button">
		<div id="teleport_icon_fourth" class="teleport_icon" data-url="' . $logger . '" title="Log in/out"></div>
	</div>
	<div id="teleport_fifth" class="teleport_button">
		<div id="teleport_icon_fifth" class="teleport_icon" data-url="' . teleport_url($archive) . '" title="Archive"></div>
	</div>
</div>';
	}

	function teleport_set_warp() {
		$warp_url = $_POST['url'];
		$warp_type = $_POST['type'];
		$option = "teleport_" . $warp_type . "_url";
		if($warp_type == "site" || $warp_type == "admin") {
			if($url = get_option($option)) {
				add_option($option, $warp_url);
			} else {
				update_option($option, $warp_url);
			}
		}
		die();
	}

	// Hook it up
	add_action('init', 'teleport_init');
	add_action('admin_init', 'teleport_init');
	add_action('wp_head', 'teleport_head');
	add_action('admin_init', 'teleport_head');
	add_action('wp_ajax_teleport', 'teleport_ajax');
	add_action('wp_ajax_nopriv_teleport', 'teleport_ajax');
?>
