<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class BDTG_REST_API {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    public function register_routes() {
        register_rest_route( 'bdtg/v1', '/save-thumbnail', array(
            'methods'             => 'POST',
            'callback'            => array( $this, 'handle_save_thumbnail' ),
            'permission_callback' => array( $this, 'check_permissions' ),
        ) );
    }

    public function check_permissions() {
        return current_user_can( 'edit_posts' );
    }

    public function handle_save_thumbnail( WP_REST_Request $request ) {
        $params  = $request->get_json_params();
        $post_id = isset( $params['post_id'] ) ? intval( $params['post_id'] ) : 0;
        $image_data = isset( $params['image'] ) ? $params['image'] : '';

        if ( ! $post_id || empty( $image_data ) ) {
            return new WP_REST_Response( array(
                'success' => false,
                'message' => 'Invalid parameters provided.'
            ), 400 );
        }

        // Validate base64 string safely
        if ( ! preg_match( '/^data:image\/(png|jpeg);base64,/', $image_data ) ) {
            return new WP_REST_Response( array(
                'success' => false,
                'message' => 'Invalid image format.'
            ), 400 );
        }

        // Extract base64 payload
        $image_parts = explode( ';base64,', $image_data );
        if ( count( $image_parts ) < 2 ) {
            return new WP_REST_Response( array(
                'success' => false,
                'message' => 'Corrupted base64 image string.'
            ), 400 );
        }

        $decoded_image = base64_decode( $image_parts[1] );
        if ( false === $decoded_image ) {
            return new WP_REST_Response( array(
                'success' => false,
                'message' => 'Image decode failed.'
            ), 500 );
        }

        $upload_dir = wp_upload_dir();
        if ( ! empty( $upload_dir['error'] ) ) {
            return new WP_REST_Response( array(
                'success' => false,
                'message' => 'Upload directory error: ' . $upload_dir['error']
            ), 500 );
        }

        $filename   = 'bd-thumb-' . $post_id . '-' . time() . '.png';
        $file_path  = trailingslashit( $upload_dir['path'] ) . $filename;

        // Save image to disc
        $saved = file_put_contents( $file_path, $decoded_image );
        if ( false === $saved ) {
            return new WP_REST_Response( array(
                'success' => false,
                'message' => 'Failed to write file to server.'
            ), 500 );
        }

        // Attach to Media Library
        $file_type  = wp_check_filetype( $filename, null );
        $attachment = array(
            'post_mime_type' => $file_type['type'],
            'post_title'     => sanitize_file_name( $filename ),
            'post_content'   => '',
            'post_status'    => 'inherit'
        );

        $attach_id = wp_insert_attachment( $attachment, $file_path, $post_id );
        if ( is_wp_error( $attach_id ) || 0 === $attach_id ) {
            return new WP_REST_Response( array(
                'success' => false,
                'message' => 'Could not attach image to WordPress Media Library.'
            ), 500 );
        }

        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        $attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );
        wp_update_attachment_metadata( $attach_id, $attach_data );

        // Set Post Featured Image
        set_post_thumbnail( $post_id, $attach_id );

        return new WP_REST_Response( array(
            'success'   => true,
            'attach_id' => $attach_id,
            'image_url' => wp_get_attachment_url( $attach_id ),
            'message'   => 'Thumbnail saved and updated successfully!'
        ), 200 );
    }
}
