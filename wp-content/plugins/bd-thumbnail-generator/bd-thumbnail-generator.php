<?php
/**
 * Plugin Name: Banking Digests Thumbnail Generator
 * Plugin URI:  https://bankingdigests.com
 * Description: Generates custom brand featured images/thumbnails directly inside the WordPress Post Editor.
 * Version:     1.0.0
 * Author:      Banking Digests
 * Text Domain: bd-thumbnail-generator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

define( 'BDTG_VERSION', '1.0.0' );
define( 'BDTG_PATH', plugin_dir_path( __FILE__ ) );
define( 'BDTG_URL', plugin_dir_url( __FILE__ ) );

// Load core plugin classes
require_once BDTG_PATH . 'includes/class-bdtg-admin.php';
require_once BDTG_PATH . 'includes/class-bdtg-rest-api.php';

// Initialize the plugin safely
function bdtg_init_plugin() {
    BDTG_Admin::get_instance();
    BDTG_REST_API::get_instance();
}
add_action( 'plugins_loaded', 'bdtg_init_plugin' );
