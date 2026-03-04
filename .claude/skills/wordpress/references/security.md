# WordPress Security Best Practices

Essential security patterns for WordPress development.

## Input Sanitization

```php
// Text fields
$title = sanitize_text_field($_POST['title']);
$textarea = sanitize_textarea_field($_POST['description']);

// Email
$email = sanitize_email($_POST['email']);

// URL
$url = esc_url_raw($_POST['url']);

// Filename
$file = sanitize_file_name($_POST['filename']);

// HTML content (allow safe tags)
$html = wp_kses_post($_POST['content']);

// Custom allowed tags
$allowed = [
    'a' => ['href' => [], 'title' => []],
    'br' => [],
    'em' => [],
    'strong' => [],
];
$safe_html = wp_kses($_POST['content'], $allowed);

// Integer
$id = absint($_POST['id']);
$number = intval($_POST['number']);

// Array of integers
$ids = array_map('absint', $_POST['ids'] ?? []);

// Key (lowercase alphanumeric, dashes, underscores)
$key = sanitize_key($_POST['key']);
```

## Output Escaping

```php
// HTML content
echo esc_html($user_input);

// HTML attributes
echo '<input value="' . esc_attr($value) . '">';

// URLs
echo '<a href="' . esc_url($url) . '">Link</a>';

// JavaScript
echo '<script>var data = ' . esc_js($data) . ';</script>';

// Textarea content
echo '<textarea>' . esc_textarea($content) . '</textarea>';

// Allow HTML (already sanitized)
echo wp_kses_post($safe_html);
```


## Nonce Verification

```php
// Create nonce field in form
wp_nonce_field('my_action', 'my_nonce');

// Create nonce URL
$url = wp_nonce_url($url, 'my_action', 'my_nonce');

// Create nonce value
$nonce = wp_create_nonce('my_action');

// Verify nonce
if (!isset($_POST['my_nonce']) || !wp_verify_nonce($_POST['my_nonce'], 'my_action')) {
    wp_die(__('Security check failed', 'my-plugin'));
}

// AJAX nonce verification
add_action('wp_ajax_my_action', function() {
    check_ajax_referer('my_ajax_nonce', 'nonce');
    // Process request
    wp_send_json_success(['message' => 'Success']);
});

// Localize script with nonce
wp_localize_script('my-script', 'myPlugin', [
    'ajaxUrl' => admin_url('admin-ajax.php'),
    'nonce'   => wp_create_nonce('my_ajax_nonce'),
]);
```

## Capability Checks

```php
// Check user capability
if (!current_user_can('manage_options')) {
    wp_die(__('Unauthorized access', 'my-plugin'));
}

// Check specific post
if (!current_user_can('edit_post', $post_id)) {
    wp_die(__('You cannot edit this post', 'my-plugin'));
}

// Common capabilities
// manage_options - Admin settings
// edit_posts - Create/edit own posts
// edit_others_posts - Edit others' posts
// publish_posts - Publish posts
// delete_posts - Delete own posts
// upload_files - Upload media
// edit_users - Edit user profiles

// Custom capability
function myplugin_add_caps(): void {
    $role = get_role('administrator');
    $role->add_cap('manage_my_plugin');
}
register_activation_hook(__FILE__, 'myplugin_add_caps');
```

## SQL Injection Prevention

```php
global $wpdb;

// NEVER do this
$results = $wpdb->get_results("SELECT * FROM {$wpdb->posts} WHERE ID = $_GET[id]");

// Use prepare() for parameterized queries
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE ID = %d AND post_type = %s",
        $id,
        'post'
    )
);

// Placeholders
// %d - integer
// %f - float
// %s - string

// IN clause
$ids = [1, 2, 3];
$placeholders = implode(',', array_fill(0, count($ids), '%d'));
$query = $wpdb->prepare(
    "SELECT * FROM {$wpdb->posts} WHERE ID IN ($placeholders)",
    ...$ids
);

// LIKE queries
$search = '%' . $wpdb->esc_like($search_term) . '%';
$results = $wpdb->get_results(
    $wpdb->prepare(
        "SELECT * FROM {$wpdb->posts} WHERE post_title LIKE %s",
        $search
    )
);
```

## File Upload Security

```php
function handle_file_upload(): array|WP_Error {
    if (!function_exists('wp_handle_upload')) {
        require_once ABSPATH . 'wp-admin/includes/file.php';
    }

    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'file_upload')) {
        return new WP_Error('invalid_nonce', 'Security check failed');
    }

    // Check capability
    if (!current_user_can('upload_files')) {
        return new WP_Error('no_permission', 'You cannot upload files');
    }

    // Allowed file types
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (!in_array($_FILES['file']['type'], $allowed_types)) {
        return new WP_Error('invalid_type', 'File type not allowed');
    }

    // Max file size (5MB)
    $max_size = 5 * 1024 * 1024;
    if ($_FILES['file']['size'] > $max_size) {
        return new WP_Error('too_large', 'File too large');
    }

    $upload_overrides = [
        'test_form' => false,
        'mimes'     => [
            'jpg|jpeg' => 'image/jpeg',
            'png'      => 'image/png',
            'gif'      => 'image/gif',
            'pdf'      => 'application/pdf',
        ],
    ];

    $uploaded = wp_handle_upload($_FILES['file'], $upload_overrides);

    if (isset($uploaded['error'])) {
        return new WP_Error('upload_error', $uploaded['error']);
    }

    return $uploaded;
}
```

## CSRF Protection

```php
// Admin form with CSRF protection
function render_admin_form(): void {
    ?>
    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('my_form_action', 'my_form_nonce'); ?>
        <input type="hidden" name="action" value="my_form_handler">
        <!-- Form fields -->
        <?php submit_button(); ?>
    </form>
    <?php
}

// Handle form submission
add_action('admin_post_my_form_handler', function() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['my_form_nonce'], 'my_form_action')) {
        wp_die('Invalid nonce');
    }

    // Verify capability
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }

    // Process form...
    
    // Redirect back
    wp_safe_redirect(wp_get_referer());
    exit;
});
```

## Security Headers

```php
// Add security headers
add_action('send_headers', function() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
});

// Content Security Policy (careful with this)
add_action('send_headers', function() {
    header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline';");
});
```

## Security Checklist

1. **Always sanitize input** - Use appropriate sanitize_* functions
2. **Always escape output** - Use esc_html, esc_attr, esc_url
3. **Verify nonces** - For all form submissions and AJAX
4. **Check capabilities** - Before any privileged action
5. **Use prepared statements** - Never concatenate SQL
6. **Validate file uploads** - Check type, size, use wp_handle_upload
7. **Prefix everything** - Functions, classes, options, meta keys
8. **Keep WordPress updated** - Core, themes, plugins
9. **Use HTTPS** - Force SSL in production
10. **Audit regularly** - Review code for vulnerabilities
