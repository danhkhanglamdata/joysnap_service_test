---
name: wordpress
description: WordPress theme and plugin development - custom themes, block themes, Gutenberg blocks, plugin architecture, hooks/filters, REST API, WooCommerce integration. Use when building WordPress sites, themes, plugins, or customizing WordPress functionality.
---

# WordPress Development Skill

Comprehensive skill for WordPress theme and plugin development.

## Version

WordPress 6.7.x (December 2024)

## Quick Start

```bash
# Local development with wp-cli
wp core download
wp config create --dbname=mydb --dbuser=root --dbpass=password
wp core install --url=localhost:8000 --title="My Site" --admin_user=admin --admin_password=admin --admin_email=admin@example.com

# Start local server
wp server --port=8000
```

## Core Stack

- **PHP 8.0+**: Modern PHP with type hints
- **WordPress 6.x**: Block editor (Gutenberg), Full Site Editing
- **MySQL/MariaDB**: Database
- **wp-cli**: Command-line interface

## Sub-Skills

- `theme-development/SKILL.md` - Classic & Block themes
- `plugin-development/SKILL.md` - Plugin architecture, hooks, APIs

## References

### Theme Development
- `references/theme-classic.md` - Classic theme structure
- `references/theme-block.md` - Block theme & Full Site Editing
- `references/theme-customizer.md` - Theme customization API

### Plugin Development
- `references/plugin-architecture.md` - Plugin structure, activation
- `references/hooks-filters.md` - Actions & Filters system
- `references/rest-api.md` - Custom REST endpoints
- `references/gutenberg-blocks.md` - Custom block development

### Advanced
- `references/woocommerce.md` - E-commerce integration
- `references/security.md` - Security best practices
- `references/performance.md` - Optimization techniques

## Theme Development

### Classic Theme Structure
```
theme-name/
├── style.css           # Theme metadata + styles
├── functions.php       # Theme setup, hooks
├── index.php           # Main template
├── header.php          # Header template
├── footer.php          # Footer template
├── single.php          # Single post
├── page.php            # Single page
├── archive.php         # Archive pages
├── sidebar.php         # Sidebar
├── 404.php             # 404 page
└── assets/
    ├── css/
    ├── js/
    └── images/
```

### Block Theme Structure (FSE)
```
theme-name/
├── style.css
├── functions.php
├── theme.json          # Global styles & settings
├── templates/          # Block templates
│   ├── index.html
│   ├── single.html
│   └── page.html
├── parts/              # Template parts
│   ├── header.html
│   └── footer.html
└── patterns/           # Block patterns
    └── hero.php
```

### style.css Header
```css
/*
Theme Name: My Theme
Theme URI: https://example.com/theme
Author: Your Name
Author URI: https://example.com
Description: A custom WordPress theme
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 8.0
License: GPL v2 or later
Text Domain: my-theme
*/
```

### functions.php Setup
```php
<?php
/**
 * Theme setup and configuration
 */

if (!defined('ABSPATH')) exit;

define('THEME_VERSION', '1.0.0');

/**
 * Theme setup
 */
function mytheme_setup(): void {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'gallery', 'caption']);
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');
    
    // Register menus
    register_nav_menus([
        'primary' => __('Primary Menu', 'my-theme'),
        'footer'  => __('Footer Menu', 'my-theme'),
    ]);
}
add_action('after_setup_theme', 'mytheme_setup');

/**
 * Enqueue scripts and styles
 */
function mytheme_scripts(): void {
    wp_enqueue_style('mytheme-style', get_stylesheet_uri(), [], THEME_VERSION);
    wp_enqueue_script('mytheme-script', get_template_directory_uri() . '/assets/js/main.js', [], THEME_VERSION, true);
}
add_action('wp_enqueue_scripts', 'mytheme_scripts');
```

## Plugin Development

### Plugin Structure
```
plugin-name/
├── plugin-name.php     # Main plugin file
├── includes/
│   ├── class-plugin.php
│   ├── class-admin.php
│   └── class-public.php
├── admin/
│   ├── css/
│   ├── js/
│   └── views/
├── public/
│   ├── css/
│   └── js/
├── languages/
├── templates/
└── readme.txt
```

### Main Plugin File
```php
<?php
/**
 * Plugin Name: My Plugin
 * Plugin URI: https://example.com/plugin
 * Description: A custom WordPress plugin
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * Text Domain: my-plugin
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) exit;

define('MYPLUGIN_VERSION', '1.0.0');
define('MYPLUGIN_PATH', plugin_dir_path(__FILE__));
define('MYPLUGIN_URL', plugin_dir_url(__FILE__));

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'MyPlugin\\';
    $base_dir = MYPLUGIN_PATH . 'includes/';
    
    if (strpos($class, $prefix) !== 0) return;
    
    $relative_class = substr($class, strlen($prefix));
    $file = $base_dir . 'class-' . strtolower(str_replace('\\', '-', $relative_class)) . '.php';
    
    if (file_exists($file)) require $file;
});

// Initialize plugin
add_action('plugins_loaded', function() {
    MyPlugin\Plugin::instance();
});

// Activation/Deactivation hooks
register_activation_hook(__FILE__, [MyPlugin\Plugin::class, 'activate']);
register_deactivation_hook(__FILE__, [MyPlugin\Plugin::class, 'deactivate']);
```

## Hooks & Filters

### Actions (do something)
```php
// Add action
add_action('init', 'my_custom_init', 10);
add_action('wp_enqueue_scripts', 'my_enqueue_scripts');
add_action('save_post', 'my_save_post', 10, 3);

// Custom action
do_action('my_custom_action', $arg1, $arg2);
```

### Filters (modify data)
```php
// Add filter
add_filter('the_content', 'my_modify_content');
add_filter('the_title', 'my_modify_title', 10, 2);

// Custom filter
$value = apply_filters('my_custom_filter', $value, $context);
```

### Common Hooks
| Hook | Type | Description |
|------|------|-------------|
| `init` | Action | WordPress initialized |
| `wp_enqueue_scripts` | Action | Enqueue frontend assets |
| `admin_enqueue_scripts` | Action | Enqueue admin assets |
| `save_post` | Action | Post saved |
| `the_content` | Filter | Modify post content |
| `the_title` | Filter | Modify post title |
| `wp_nav_menu_items` | Filter | Modify menu items |

## REST API

### Register Custom Endpoint
```php
add_action('rest_api_init', function() {
    register_rest_route('myplugin/v1', '/items', [
        'methods'  => 'GET',
        'callback' => 'get_items_callback',
        'permission_callback' => '__return_true',
    ]);
    
    register_rest_route('myplugin/v1', '/items/(?P<id>\d+)', [
        'methods'  => 'GET',
        'callback' => 'get_item_callback',
        'permission_callback' => '__return_true',
        'args' => [
            'id' => [
                'validate_callback' => fn($param) => is_numeric($param),
            ],
        ],
    ]);
});

function get_items_callback(WP_REST_Request $request): WP_REST_Response {
    $items = get_posts(['post_type' => 'my_cpt']);
    return new WP_REST_Response($items, 200);
}
```

## Custom Post Types

```php
add_action('init', function() {
    register_post_type('portfolio', [
        'labels' => [
            'name' => __('Portfolio', 'my-theme'),
            'singular_name' => __('Project', 'my-theme'),
        ],
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true, // Enable Gutenberg
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-portfolio',
        'rewrite' => ['slug' => 'portfolio'],
    ]);
});
```

## Custom Taxonomies

```php
add_action('init', function() {
    register_taxonomy('project_type', 'portfolio', [
        'labels' => [
            'name' => __('Project Types', 'my-theme'),
            'singular_name' => __('Project Type', 'my-theme'),
        ],
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'project-type'],
    ]);
});
```

## Best Practices

1. **Security**: Always sanitize input, escape output, use nonces
2. **Performance**: Minimize database queries, use transients for caching
3. **Internationalization**: Use `__()`, `_e()`, `esc_html__()` for strings
4. **Coding Standards**: Follow WordPress Coding Standards
5. **Hooks over modifications**: Never modify core files
6. **Child themes**: Use child themes for customizations

## Security Essentials

```php
// Sanitize input
$title = sanitize_text_field($_POST['title']);
$email = sanitize_email($_POST['email']);
$html = wp_kses_post($_POST['content']);

// Escape output
echo esc_html($title);
echo esc_attr($attribute);
echo esc_url($url);
echo wp_kses_post($html);

// Nonce verification
wp_nonce_field('my_action', 'my_nonce');

if (!wp_verify_nonce($_POST['my_nonce'], 'my_action')) {
    wp_die('Security check failed');
}

// Capability check
if (!current_user_can('edit_posts')) {
    wp_die('Unauthorized');
}
```

## Resources

- Developer Docs: https://developer.wordpress.org
- Theme Handbook: https://developer.wordpress.org/themes
- Plugin Handbook: https://developer.wordpress.org/plugins
- REST API: https://developer.wordpress.org/rest-api
- Block Editor: https://developer.wordpress.org/block-editor
- WP-CLI: https://wp-cli.org
