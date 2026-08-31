<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class BDTG_Admin {

    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
        add_action( 'add_meta_boxes', array( $this, 'add_thumbnail_meta_box' ) );
    }

    public function enqueue_admin_assets( $hook ) {
        // Only load script on Post Editing screens
        if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
            return;
        }

        $screen = get_current_screen();
        if ( ! $screen || 'post' !== $screen->post_type ) {
            return;
        }

        // Fabric.js for HTML5 Canvas manipulation
        wp_enqueue_script(
            'fabric-js',
            'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js',
            array(),
            '5.3.1',
            true
        );

        // Plugin Stylesheet
        wp_enqueue_style(
            'bdtg-admin-style',
            BDTG_URL . 'assets/css/bdtg-admin.css',
            array(),
            BDTG_VERSION
        );

        // Plugin Admin Script
        wp_enqueue_script(
            'bdtg-admin-script',
            BDTG_URL . 'assets/js/bdtg-admin.js',
            array( 'jquery', 'fabric-js' ),
            BDTG_VERSION,
            true
        );

        global $post;
        $post_id = ( $post && isset( $post->ID ) ) ? $post->ID : 0;
        $post_title = ( $post && ! empty( $post->post_title ) ) ? esc_html( $post->post_title ) : 'Banking Digests Sample Title';
        
        $categories = get_the_category( $post_id );
        $category_name = ( ! empty( $categories ) && isset( $categories[0]->name ) ) ? strtoupper( $categories[0]->name ) : 'RBI CIRCULARS & GUIDELINES';

        wp_localize_script( 'bdtg-admin-script', 'bdtgSettings', array(
            'restUrl'   => esc_url_raw( rest_url( 'bdtg/v1/save-thumbnail' ) ),
            'nonce'     => wp_create_nonce( 'wp_rest' ),
            'postId'    => $post_id,
            'postTitle' => $post_title,
            'category'  => $category_name,
            'brandName' => 'BANKING DIGESTS',
            'siteUrl'   => 'www.bankingdigests.com'
        ) );
    }

    public function add_thumbnail_meta_box() {
        add_meta_box(
            'bdtg_thumbnail_generator_box',
            __( 'Banking Digests Thumbnail Generator', 'bd-thumbnail-generator' ),
            array( $this, 'render_meta_box' ),
            'post',
            'side',
            'high'
        );
    }

    public function render_meta_box( $post ) {
        ?>
        <div id="bdtg-wrapper">
            <p class="bdtg-description">Generate authentic Banking Digests branded post thumbnails directly:</p>
            
            <div class="bdtg-field">
                <label for="bdtg-bg-style">Digest Theme / Template:</label>
                <select id="bdtg-bg-style">
                    <option value="navy">Banking Navy & Gold (Default)</option>
                    <option value="rbi">RBI Circular Gazette (Maroon & Amber)</option>
                    <option value="emerald">Emerald Growth & MSME (Forest & Mint)</option>
                    <option value="digital">Digital Banking & Fintech (Cyber Cyan)</option>
                    <option value="dark">Dark Executive Finance</option>
                </select>
            </div>

            <div class="bdtg-field" style="margin-top: 8px;">
                <label for="bdtg-category-override">Category Badge Label:</label>
                <input type="text" id="bdtg-category-override" placeholder="e.g. RBI CIRCULARS, MSME POLICY, DIGITAL BANKING" value="" />
            </div>

            <div class="bdtg-field" style="margin-top: 8px;">
                <label for="bdtg-subtitle">Subtitle / Key Highlight (Optional):</label>
                <input type="text" id="bdtg-subtitle" placeholder="e.g. Operational Guidelines & Case Analysis" value="" />
            </div>

            <div class="bdtg-field" style="margin-top: 8px;">
                <label for="bdtg-icon-motif">Topic Emblem / Icon:</label>
                <select id="bdtg-icon-motif">
                    <option value="bank">🏛️ Central Bank Columns</option>
                    <option value="rupee">₹ Indian Rupee & Finance</option>
                    <option value="shield">🛡️ Regulatory Compliance</option>
                    <option value="chart">📈 Market & Credit Growth</option>
                    <option value="chip">⚡ Digital & Fintech</option>
                    <option value="doc">📋 Official Circular / Gazette</option>
                </select>
            </div>

            <div class="bdtg-field" style="margin-top: 8px;">
                <label for="bdtg-aspect-ratio">Image Dimensions:</label>
                <select id="bdtg-aspect-ratio">
                    <option value="og">1200 × 630 (Featured / Social OG)</option>
                    <option value="youtube">1280 × 720 (16:9 Video & Banner)</option>
                    <option value="square">1080 × 1080 (Square Social Post)</option>
                </select>
            </div>

            <div class="bdtg-field" style="margin-top: 8px;">
                <label for="bdtg-custom-bg">Upload Custom Background Template (Optional):</label>
                <input type="file" id="bdtg-custom-bg" accept="image/*" style="width:100%; font-size:11px;" />
            </div>

            <div class="bdtg-canvas-container" style="margin-top:12px;">
                <canvas id="bdtg-canvas" width="1200" height="630"></canvas>
            </div>

            <div class="bdtg-actions">
                <button type="button" class="button button-secondary" id="bdtg-refresh-btn">
                    Refresh Preview
                </button>
                <button type="button" class="button button-primary" id="bdtg-save-btn">
                    Set as Featured Image
                </button>
            </div>

            <div id="bdtg-status" class="bdtg-status-message"></div>
        </div>
        <?php
    }
}
