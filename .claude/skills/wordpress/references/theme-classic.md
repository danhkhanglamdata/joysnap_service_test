# Classic Theme Development

Traditional WordPress theme development with PHP templates.

## Template Hierarchy

```
WordPress loads templates in this order (first match wins):

Single Post:     single-{post-type}-{slug}.php → single-{post-type}.php → single.php → singular.php → index.php
Page:            page-{slug}.php → page-{id}.php → page.php → singular.php → index.php
Category:        category-{slug}.php → category-{id}.php → category.php → archive.php → index.php
Tag:             tag-{slug}.php → tag-{id}.php → tag.php → archive.php → index.php
Custom Taxonomy: taxonomy-{taxonomy}-{term}.php → taxonomy-{taxonomy}.php → taxonomy.php → archive.php → index.php
Author:          author-{nicename}.php → author-{id}.php → author.php → archive.php → index.php
Date:            date.php → archive.php → index.php
Archive:         archive-{post-type}.php → archive.php → index.php
Search:          search.php → index.php
404:             404.php → index.php
Home:            front-page.php → home.php → index.php
```

## Essential Template Tags

```php
<!-- Header -->
<?php get_header(); ?>
<?php get_header('custom'); ?> <!-- header-custom.php -->

<!-- Footer -->
<?php get_footer(); ?>

<!-- Sidebar -->
<?php get_sidebar(); ?>
<?php get_sidebar('left'); ?> <!-- sidebar-left.php -->

<!-- Template Parts -->
<?php get_template_part('template-parts/content'); ?>
<?php get_template_part('template-parts/content', 'single'); ?> <!-- content-single.php -->
<?php get_template_part('template-parts/content', get_post_type()); ?>

<!-- Search Form -->
<?php get_search_form(); ?>
```


## The Loop

```php
<?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <?php if (has_post_thumbnail()) : ?>
                <div class="post-thumbnail">
                    <?php the_post_thumbnail('large'); ?>
                </div>
            <?php endif; ?>
            
            <header class="entry-header">
                <?php the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '">', '</a></h2>'); ?>
                
                <div class="entry-meta">
                    <span class="posted-on"><?php echo get_the_date(); ?></span>
                    <span class="byline"><?php the_author_posts_link(); ?></span>
                    <span class="cat-links"><?php the_category(', '); ?></span>
                </div>
            </header>
            
            <div class="entry-content">
                <?php
                if (is_singular()) {
                    the_content();
                } else {
                    the_excerpt();
                }
                ?>
            </div>
            
            <?php if (is_singular()) : ?>
                <footer class="entry-footer">
                    <?php the_tags('<span class="tags">', ', ', '</span>'); ?>
                </footer>
            <?php endif; ?>
        </article>
    <?php endwhile; ?>
    
    <?php the_posts_pagination([
        'prev_text' => '&laquo; Previous',
        'next_text' => 'Next &raquo;',
    ]); ?>
    
<?php else : ?>
    <p><?php esc_html_e('No posts found.', 'mytheme'); ?></p>
<?php endif; ?>
```

## functions.php Setup

```php
<?php
/**
 * Theme Functions
 */

if (!defined('ABSPATH')) exit;

define('THEME_VERSION', wp_get_theme()->get('Version'));
define('THEME_DIR', get_template_directory());
define('THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function mytheme_setup(): void {
    // Translation support
    load_theme_textdomain('mytheme', THEME_DIR . '/languages');
    
    // Theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('automatic-feed-links');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('editor-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('wp-block-styles');
    
    // Custom logo
    add_theme_support('custom-logo', [
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    
    // Custom header
    add_theme_support('custom-header', [
        'default-image' => '',
        'width'         => 1920,
        'height'        => 500,
        'flex-height'   => true,
        'flex-width'    => true,
    ]);
    
    // Custom background
    add_theme_support('custom-background', [
        'default-color' => 'ffffff',
    ]);
    
    // Image sizes
    add_image_size('mytheme-featured', 1200, 600, true);
    add_image_size('mytheme-thumbnail', 400, 300, true);
    
    // Navigation menus
    register_nav_menus([
        'primary' => __('Primary Menu', 'mytheme'),
        'footer'  => __('Footer Menu', 'mytheme'),
        'social'  => __('Social Links', 'mytheme'),
    ]);
}
add_action('after_setup_theme', 'mytheme_setup');

/**
 * Register Sidebars
 */
function mytheme_widgets_init(): void {
    register_sidebar([
        'name'          => __('Main Sidebar', 'mytheme'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here.', 'mytheme'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ]);
    
    register_sidebar([
        'name'          => __('Footer Widget Area', 'mytheme'),
        'id'            => 'footer-1',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ]);
}
add_action('widgets_init', 'mytheme_widgets_init');

/**
 * Enqueue Scripts and Styles
 */
function mytheme_scripts(): void {
    // Styles
    wp_enqueue_style('mytheme-style', get_stylesheet_uri(), [], THEME_VERSION);
    wp_enqueue_style('mytheme-main', THEME_URI . '/assets/css/main.css', [], THEME_VERSION);
    
    // Scripts
    wp_enqueue_script('mytheme-navigation', THEME_URI . '/assets/js/navigation.js', [], THEME_VERSION, true);
    wp_enqueue_script('mytheme-main', THEME_URI . '/assets/js/main.js', ['jquery'], THEME_VERSION, true);
    
    // Localize script
    wp_localize_script('mytheme-main', 'mythemeData', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('mytheme_nonce'),
    ]);
    
    // Comment reply script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'mytheme_scripts');

/**
 * Admin Scripts
 */
function mytheme_admin_scripts(): void {
    wp_enqueue_style('mytheme-admin', THEME_URI . '/assets/css/admin.css', [], THEME_VERSION);
}
add_action('admin_enqueue_scripts', 'mytheme_admin_scripts');
```

## Navigation Menu

```php
<!-- In header.php -->
<nav id="site-navigation" class="main-navigation">
    <?php
    wp_nav_menu([
        'theme_location' => 'primary',
        'menu_id'        => 'primary-menu',
        'menu_class'     => 'nav-menu',
        'container'      => false,
        'depth'          => 2,
        'fallback_cb'    => false,
    ]);
    ?>
</nav>

<!-- Custom Walker for Bootstrap -->
<?php
class Bootstrap_Nav_Walker extends Walker_Nav_Menu {
    public function start_lvl(&$output, $depth = 0, $args = null): void {
        $output .= '<ul class="dropdown-menu">';
    }
    
    public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0): void {
        $classes = implode(' ', $item->classes);
        $has_children = in_array('menu-item-has-children', $item->classes);
        
        $output .= '<li class="nav-item ' . ($has_children ? 'dropdown' : '') . '">';
        
        $atts = [
            'href'  => $item->url,
            'class' => 'nav-link' . ($has_children ? ' dropdown-toggle' : ''),
        ];
        
        if ($has_children) {
            $atts['data-bs-toggle'] = 'dropdown';
        }
        
        $attributes = '';
        foreach ($atts as $attr => $value) {
            $attributes .= ' ' . $attr . '="' . esc_attr($value) . '"';
        }
        
        $output .= '<a' . $attributes . '>' . esc_html($item->title) . '</a>';
    }
}
?>
```

## Comments Template

```php
<!-- comments.php -->
<?php
if (post_password_required()) {
    return;
}
?>

<div id="comments" class="comments-area">
    <?php if (have_comments()) : ?>
        <h2 class="comments-title">
            <?php
            printf(
                _nx('One comment', '%1$s comments', get_comments_number(), 'comments title', 'mytheme'),
                number_format_i18n(get_comments_number())
            );
            ?>
        </h2>
        
        <ol class="comment-list">
            <?php
            wp_list_comments([
                'style'       => 'ol',
                'short_ping'  => true,
                'avatar_size' => 60,
            ]);
            ?>
        </ol>
        
        <?php the_comments_pagination(); ?>
    <?php endif; ?>
    
    <?php
    comment_form([
        'title_reply'        => __('Leave a Comment', 'mytheme'),
        'label_submit'       => __('Post Comment', 'mytheme'),
        'comment_notes_after' => '',
    ]);
    ?>
</div>
```

## Custom Page Templates

```php
<?php
/**
 * Template Name: Full Width
 * Template Post Type: page, post
 */

get_header();
?>

<main id="primary" class="site-main full-width">
    <?php
    while (have_posts()) :
        the_post();
        get_template_part('template-parts/content', 'page');
    endwhile;
    ?>
</main>

<?php
get_footer();
```

## Customizer API

```php
function mytheme_customize_register(WP_Customize_Manager $wp_customize): void {
    // Add section
    $wp_customize->add_section('mytheme_options', [
        'title'    => __('Theme Options', 'mytheme'),
        'priority' => 30,
    ]);
    
    // Add setting
    $wp_customize->add_setting('mytheme_accent_color', [
        'default'           => '#0073aa',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'postMessage',
    ]);
    
    // Add control
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'mytheme_accent_color', [
        'label'   => __('Accent Color', 'mytheme'),
        'section' => 'mytheme_options',
    ]));
    
    // Selective refresh
    $wp_customize->selective_refresh->add_partial('blogname', [
        'selector'        => '.site-title a',
        'render_callback' => fn() => bloginfo('name'),
    ]);
}
add_action('customize_register', 'mytheme_customize_register');

// Output custom CSS
function mytheme_customizer_css(): void {
    $accent = get_theme_mod('mytheme_accent_color', '#0073aa');
    ?>
    <style>
        a, .accent-color { color: <?php echo esc_attr($accent); ?>; }
        .button, .btn { background-color: <?php echo esc_attr($accent); ?>; }
    </style>
    <?php
}
add_action('wp_head', 'mytheme_customizer_css');
```

## Resources

- Theme Handbook: https://developer.wordpress.org/themes/
- Template Hierarchy: https://developer.wordpress.org/themes/basics/template-hierarchy/
- Theme Functions: https://developer.wordpress.org/themes/basics/theme-functions/
