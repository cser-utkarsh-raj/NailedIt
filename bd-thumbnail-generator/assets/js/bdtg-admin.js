jQuery(document).ready(function($) {
    var canvasElement = document.getElementById('bdtg-canvas');
    if (!canvasElement) return;

    // Safety check for Fabric.js
    if (typeof fabric === 'undefined') {
        $('#bdtg-status').css('color', '#dc2626').text('Error: Canvas rendering engine failed to load.');
        return;
    }

    var canvas = new fabric.Canvas('bdtg-canvas');
    var customBgImageObj = null;

    // Get current post title dynamically from Gutenberg or Classic Editor
    function getLiveTitle() {
        var title = '';
        // Block Editor (Gutenberg)
        if (window.wp && wp.data && wp.data.select && wp.data.select('core/editor')) {
            title = wp.data.select('core/editor').getEditedPostAttribute('title');
        }
        // Classic Editor fallback
        if (!title) {
            title = $('#title').val();
        }
        return title && title.trim() !== '' ? title : bdtgSettings.postTitle;
    }

    function getLiveCategory() {
        var override = $('#bdtg-category-override').val();
        if (override && override.trim() !== '') {
            return override.trim().toUpperCase();
        }
        return (bdtgSettings.category || 'BANKING & FINANCE').toUpperCase();
    }

    function getLiveSubtitle() {
        var sub = $('#bdtg-subtitle').val();
        return sub ? sub.trim() : '';
    }

    function drawCanvas() {
        try {
            canvas.clear();

            var style = $('#bdtg-bg-style').val() || 'navy';
            var iconMotif = $('#bdtg-icon-motif').val() || 'bank';
            var ratio = $('#bdtg-aspect-ratio').val() || 'og';

            var width = 1200;
            var height = 630;
            if (ratio === 'youtube') {
                width = 1280;
                height = 720;
            } else if (ratio === 'square') {
                width = 1080;
                height = 1080;
            }

            canvas.setWidth(width);
            canvas.setHeight(height);

            // Theme Color Configs
            var primaryColor, secondaryColor, accentColor, glowColor, badgeBg, badgeText;

            if (style === 'rbi') {
                // RBI Regulatory Circular (Maroon & Gold)
                primaryColor = '#4c0519';
                secondaryColor = '#1c030a';
                accentColor = '#f59e0b';
                glowColor = 'rgba(245, 158, 11, 0.15)';
                badgeBg = '#d97706';
                badgeText = '#ffffff';
            } else if (style === 'emerald') {
                // Emerald Growth & MSME Schemes
                primaryColor = '#064e3b';
                secondaryColor = '#022c22';
                accentColor = '#10b981';
                glowColor = 'rgba(16, 185, 129, 0.18)';
                badgeBg = '#10b981';
                badgeText = '#ffffff';
            } else if (style === 'digital') {
                // Digital Banking & Fintech (Indigo & Cyan)
                primaryColor = '#0f172a';
                secondaryColor = '#020617';
                accentColor = '#06b6d4';
                glowColor = 'rgba(6, 182, 212, 0.2)';
                badgeBg = '#0284c7';
                badgeText = '#ffffff';
            } else if (style === 'dark') {
                // Executive Dark
                primaryColor = '#18181b';
                secondaryColor = '#09090b';
                accentColor = '#e2e8f0';
                glowColor = 'rgba(255, 255, 255, 0.1)';
                badgeBg = '#334155';
                badgeText = '#ffffff';
            } else {
                // Default Authentic Banking Navy & Amber Gold
                primaryColor = '#0b1528';
                secondaryColor = '#162238';
                accentColor = '#f59e0b';
                glowColor = 'rgba(245, 158, 11, 0.15)';
                badgeBg = '#d97706';
                badgeText = '#ffffff';
            }

            // 1. Render Gradient Background
            var bgGradient = new fabric.Gradient({
                type: 'linear',
                coords: { x1: 0, y1: 0, x2: width, y2: height },
                colorStops: [
                    { offset: 0, color: primaryColor },
                    { offset: 0.6, color: secondaryColor },
                    { offset: 1, color: '#050b14' }
                ]
            });

            var bgRect = new fabric.Rect({
                left: 0,
                top: 0,
                width: width,
                height: height,
                fill: bgGradient,
                selectable: false
            });
            canvas.add(bgRect);

            // 2. Geometric Architectural Watermark Grid
            var gridColor = 'rgba(255, 255, 255, 0.03)';
            for (var gx = 50; gx < width; gx += 70) {
                canvas.add(new fabric.Line([gx, 0, gx, height], {
                    stroke: gridColor,
                    strokeWidth: 1,
                    selectable: false
                }));
            }
            for (var gy = 50; gy < height; gy += 70) {
                canvas.add(new fabric.Line([0, gy, width, gy], {
                    stroke: gridColor,
                    strokeWidth: 1,
                    selectable: false
                }));
            }

            // 3. User Custom Background Overlay (if provided)
            if (customBgImageObj) {
                customBgImageObj.set({
                    scaleX: width / customBgImageObj.width,
                    scaleY: height / customBgImageObj.height,
                    opacity: 0.35,
                    selectable: false
                });
                canvas.add(customBgImageObj);
            }

            // 4. Left Highlight Accent Bar
            var accentBar = new fabric.Rect({
                left: 70,
                top: 75,
                width: 8,
                height: height - 150,
                fill: accentColor,
                rx: 4,
                ry: 4,
                selectable: false
            });
            canvas.add(accentBar);

            // 5. Header: Banking Digests Emblem & Site URL Watermark
            var headerEmblem = new fabric.Circle({
                left: 100,
                top: 70,
                radius: 18,
                fill: accentColor,
                selectable: false
            });
            canvas.add(headerEmblem);

            var headerEmblemText = new fabric.Text('BD', {
                left: 107,
                top: 77,
                fontSize: 15,
                fontWeight: '900',
                fill: '#0f172a',
                fontFamily: 'sans-serif',
                selectable: false
            });
            canvas.add(headerEmblemText);

            var brandTitle = new fabric.Text(bdtgSettings.brandName || 'BANKING DIGESTS', {
                left: 145,
                top: 75,
                fontSize: 22,
                fontWeight: 'bold',
                fill: '#ffffff',
                fontFamily: 'sans-serif',
                letterSpacing: 2,
                selectable: false
            });
            canvas.add(brandTitle);

            var brandTagline = new fabric.Text('KNOWLEDGE & INSIGHTS FOR BANKERS', {
                left: 147,
                top: 102,
                fontSize: 10,
                fontWeight: '600',
                fill: '#94a3b8',
                fontFamily: 'sans-serif',
                letterSpacing: 1.5,
                selectable: false
            });
            canvas.add(brandTagline);

            // 6. Category Pill Badge
            var currentCategory = getLiveCategory();
            var catText = new fabric.Text(currentCategory, {
                fontSize: 16,
                fill: badgeText,
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                left: 116,
                top: 147,
                selectable: false
            });

            var catPill = new fabric.Rect({
                left: 100,
                top: 140,
                width: catText.width + 32,
                height: 34,
                fill: badgeBg,
                rx: 6,
                ry: 6,
                selectable: false
            });
            canvas.add(catPill);
            canvas.add(catText);

            // 7. Post Title (Auto-wrapped, crisp typography)
            var currentTitle = getLiveTitle();
            var titleBox = new fabric.Textbox(currentTitle, {
                left: 100,
                top: 200,
                width: width - 240,
                fontSize: ratio === 'square' ? 56 : 48,
                fontWeight: 'bold',
                fill: '#ffffff',
                fontFamily: 'sans-serif',
                lineHeight: 1.25,
                selectable: true
            });
            canvas.add(titleBox);

            // 8. Optional Subtitle / Bullet Line
            var currentSubtitle = getLiveSubtitle();
            if (currentSubtitle) {
                var subtitleBox = new fabric.Textbox(currentSubtitle, {
                    left: 100,
                    top: 200 + (titleBox.height || 140) + 20,
                    width: width - 260,
                    fontSize: 24,
                    fontWeight: '500',
                    fill: accentColor,
                    fontFamily: 'sans-serif',
                    selectable: true
                });
                canvas.add(subtitleBox);
            }

            // 9. Topic Motif / Decorative Icon Badge (Top Right)
            var motifSymbols = {
                bank: '🏛️',
                rupee: '₹',
                shield: '🛡️',
                chart: '📈',
                chip: '⚡',
                doc: '📋'
            };
            var motifChar = motifSymbols[iconMotif] || '🏛️';

            var motifCircle = new fabric.Circle({
                left: width - 130,
                top: 65,
                radius: 40,
                fill: 'rgba(255, 255, 255, 0.06)',
                stroke: 'rgba(255, 255, 255, 0.15)',
                strokeWidth: 2,
                selectable: false
            });
            canvas.add(motifCircle);

            var motifText = new fabric.Text(motifChar, {
                left: width - 112,
                top: 78,
                fontSize: 34,
                fontFamily: 'sans-serif',
                fill: accentColor,
                selectable: false
            });
            canvas.add(motifText);

            // 10. Official Website URL Stamp (Bottom Right / Footer)
            var footerLine = new fabric.Line([100, height - 70, width - 100, height - 70], {
                stroke: 'rgba(255, 255, 255, 0.12)',
                strokeWidth: 1,
                selectable: false
            });
            canvas.add(footerLine);

            var siteStamp = new fabric.Text((bdtgSettings.siteUrl || 'www.bankingdigests.com').toLowerCase(), {
                left: width - 360,
                top: height - 54,
                fontSize: 18,
                fontWeight: 'bold',
                fill: accentColor,
                fontFamily: 'sans-serif',
                selectable: false
            });
            canvas.add(siteStamp);

            var copyrightStamp = new fabric.Text('OFFICIAL BANKING STUDY & DIGEST COMPENDIUM', {
                left: 100,
                top: height - 52,
                fontSize: 13,
                fontWeight: '600',
                fill: '#64748b',
                fontFamily: 'sans-serif',
                letterSpacing: 1.5,
                selectable: false
            });
            canvas.add(copyrightStamp);

            canvas.renderAll();
        } catch (err) {
            console.error('Thumbnail Generation error:', err);
            $('#bdtg-status').css('color', '#dc2626').text('Error rendering canvas layout.');
        }
    }

    // Initial Render
    drawCanvas();

    // Event Listeners for Live Preview
    $('#bdtg-bg-style, #bdtg-icon-motif, #bdtg-aspect-ratio').on('change', drawCanvas);
    $('#bdtg-category-override, #bdtg-subtitle').on('input', drawCanvas);
    $('#bdtg-refresh-btn').on('click', drawCanvas);

    // Gutenberg / Classic Editor live title change observer
    if (window.wp && wp.data && wp.data.subscribe) {
        wp.data.subscribe(function() {
            var newTitle = getLiveTitle();
            if (newTitle !== bdtgSettings.postTitle) {
                bdtgSettings.postTitle = newTitle;
                drawCanvas();
            }
        });
    }

    // Handle Custom Template Upload Safely
    $('#bdtg-custom-bg').on('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function(f) {
            var data = f.target.result;
            fabric.Image.fromURL(data, function(img) {
                customBgImageObj = img;
                drawCanvas();
            });
        };
        reader.readAsDataURL(file);
    });

    // Save and Attach to WordPress Featured Image
    $('#bdtg-save-btn').on('click', function() {
        var $btn = $(this);
        var $status = $('#bdtg-status');

        $btn.prop('disabled', true);
        $status.css('color', '#2563eb').text('Generating 1200x630 banner & saving to media library...');

        drawCanvas();

        try {
            var dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1.0
            });

            $.ajax({
                url: bdtgSettings.restUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    post_id: bdtgSettings.postId,
                    image: dataURL
                }),
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', bdtgSettings.nonce);
                },
                success: function(response) {
                    $btn.prop('disabled', false);
                    if (response && response.success) {
                        $status.css('color', '#059669').text(response.message || 'Thumbnail updated successfully!');
                        
                        // Update Gutenberg UI Featured Image frame dynamically
                        if (window.wp && wp.data && wp.data.dispatch && wp.data.dispatch('core/editor')) {
                            wp.data.dispatch('core/editor').editPost({ featured_media: response.attach_id });
                        }
                    } else {
                        $status.css('color', '#dc2626').text(response.message || 'Failed to update thumbnail.');
                    }
                },
                error: function(xhr) {
                    $btn.prop('disabled', false);
                    var errMsg = 'Error saving thumbnail.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errMsg = xhr.responseJSON.message;
                    }
                    $status.css('color', '#dc2626').text(errMsg);
                }
            });
        } catch (e) {
            $btn.prop('disabled', false);
            $status.css('color', '#dc2626').text('Error preparing canvas image.');
        }
    });
});
