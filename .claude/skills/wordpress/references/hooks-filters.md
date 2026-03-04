# WordPress Hooks & Filters

Complete guide to WordPress action and filter hooks.

## Actions vs Filters

| Type | Purpose | Return | Example |
|------|---------|--------|---------|
| Action | Do something | void | `do_action('init')` |
| Filter | Modify data | modified value | `apply_filters('the_content', $content)` |

## Action Hooks

### Adding Actions

```php
// Basic action
add_action('init', 'my_init_function');

// With priority (default: 10, lower = earlier)
add_action('init', 'my_early_function', 5);
add_action('init', 'my_late_function', 20);

// With accepted arguments
add_action('save_post', 'my_save_post', 10, 3);

function my_save_post(int $post_id, WP_Post $post, bool $update): void {
    if ($update) {
        // Post was updated
    }
}

// Class method
add_action('init', [$this, 'init_method']);
add_action('init', [__CLASS__, 'static_method']);

// Anonymous function
add_action('init', function() {
    // Do something
});
```

### Removing Actions

```php
// Remove action
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');

// Remove with priority (must match)
remove_action('init', 'my_function', 10);

// Remove class method
remove_action('init', [$instance, 'method'], 10);
```

### Creating Custom Actions

```php
// Define action point
do_action('myplugin_before_process', $data);

// Process...

do_action('myplugin_after_process', $data, $result);

// With reference (modify in place)
do_action_ref_array('myplugin_modify', [&$data]);
```


## Filter Hooks

### Adding Filters

```php
// Basic filter
add_filter('the_content', 'my_modify_content');

function my_modify_content(string $content): string {
    return $content . '<p>Added content</p>';
}

// With priority and arguments
add_filter('the_title', 'my_modify_title', 10, 2);

function my_modify_title(string $title, int $post_id): string {
    if ($post_id === 123) {
        return 'Custom: ' . $title;
    }
    return $title;
}

// Return early (short-circuit)
add_filter('pre_get_posts', function($query) {
    if ($query->is_main_query() && $query->is_home()) {
        $query->set('posts_per_page', 5);
    }
    return $query;
});
```

### Removing Filters

```php
remove_filter('the_content', 'wpautop');
remove_filter('the_excerpt', 'wpautop');
```

### Creating Custom Filters

```php
// Define filter point
$value = apply_filters('myplugin_value', $default_value);

// With context
$output = apply_filters('myplugin_output', $output, $context, $args);

// Usage by other developers
add_filter('myplugin_value', function($value) {
    return $value * 2;
});
```

## Essential Hooks Reference

### Initialization Hooks (Order)

```php
// 1. muplugins_loaded - After MU plugins loaded
// 2. plugins_loaded - After all plugins loaded
// 3. setup_theme - Before theme loaded
// 4. after_setup_theme - After theme loaded
// 5. init - WordPress fully initialized
// 6. wp_loaded - After WordPress, plugins, themes loaded
// 7. admin_init - Admin area initialized (admin only)
```

### Content Hooks

```php
// Post content
add_filter('the_content', 'modify_content');
add_filter('the_excerpt', 'modify_excerpt');
add_filter('the_title', 'modify_title', 10, 2);

// Post saving
add_action('save_post', 'on_save_post', 10, 3);
add_action('wp_insert_post', 'on_insert_post', 10, 3);
add_action('before_delete_post', 'on_before_delete');
add_action('deleted_post', 'on_deleted_post');

// Post status transitions
add_action('draft_to_publish', 'on_publish');
add_action('transition_post_status', 'on_status_change', 10, 3);
```

### Query Hooks

```php
// Modify main query
add_action('pre_get_posts', function(WP_Query $query) {
    if (!is_admin() && $query->is_main_query()) {
        if ($query->is_search()) {
            $query->set('post_type', ['post', 'page', 'product']);
        }
    }
});

// Modify SQL
add_filter('posts_where', 'custom_where');
add_filter('posts_join', 'custom_join');
add_filter('posts_orderby', 'custom_orderby');
```

### User Hooks

```php
// User registration/login
add_action('user_register', 'on_user_register');
add_action('wp_login', 'on_user_login', 10, 2);
add_action('wp_logout', 'on_user_logout');

// Profile update
add_action('profile_update', 'on_profile_update', 10, 2);
add_action('edit_user_profile', 'add_profile_fields');
add_action('edit_user_profile_update', 'save_profile_fields');
```

### Admin Hooks

```php
// Admin menu
add_action('admin_menu', 'add_admin_menu');
add_action('admin_bar_menu', 'customize_admin_bar', 100);

// Admin notices
add_action('admin_notices', 'show_admin_notice');

// Screen options
add_filter('screen_options_show_screen', '__return_true');

// Admin columns
add_filter('manage_posts_columns', 'add_custom_columns');
add_action('manage_posts_custom_column', 'render_custom_column', 10, 2);
```

### Frontend Hooks

```php
// Head section
add_action('wp_head', 'add_to_head');
add_action('wp_footer', 'add_to_footer');

// Enqueue assets
add_action('wp_enqueue_scripts', 'enqueue_frontend_assets');
add_action('admin_enqueue_scripts', 'enqueue_admin_assets');

// Body class
add_filter('body_class', function($classes) {
    $classes[] = 'my-custom-class';
    return $classes;
});
```

### REST API Hooks

```php
// Register routes
add_action('rest_api_init', 'register_rest_routes');

// Modify response
add_filter('rest_prepare_post', 'modify_post_response', 10, 3);

// Authentication
add_filter('rest_authentication_errors', 'custom_rest_auth');
```

### WooCommerce Hooks (Common)

```php
// Product
add_action('woocommerce_before_single_product', 'before_product');
add_action('woocommerce_after_single_product', 'after_product');
add_filter('woocommerce_product_get_price', 'modify_price', 10, 2);

// Cart
add_action('woocommerce_add_to_cart', 'on_add_to_cart', 10, 6);
add_filter('woocommerce_cart_item_price', 'modify_cart_price', 10, 3);

// Checkout
add_action('woocommerce_checkout_process', 'validate_checkout');
add_action('woocommerce_checkout_order_processed', 'after_order', 10, 3);

// Order
add_action('woocommerce_order_status_completed', 'on_order_complete');
add_action('woocommerce_thankyou', 'custom_thankyou_page');
```

## Hook Debugging

```php
// List all hooks
global $wp_filter;
print_r(array_keys($wp_filter));

// Check if hook has callbacks
if (has_action('init')) {
    // Has callbacks
}

// Debug specific hook
add_action('all', function($tag) {
    if (strpos($tag, 'save_post') !== false) {
        error_log("Hook fired: $tag");
    }
});

// Query Monitor plugin - Best for debugging hooks
```

## Best Practices

1. **Use appropriate priority** - Default is 10, adjust as needed
2. **Always return in filters** - Filters must return a value
3. **Check context** - Use `is_admin()`, `is_main_query()`, etc.
4. **Namespace your hooks** - Prefix custom hooks with plugin name
5. **Document hooks** - PHPDoc for custom hooks
6. **Remove hooks properly** - Match priority and callback exactly
