# Block Theme Development (Full Site Editing)

Modern WordPress theme development using blocks and theme.json.

## theme.json Configuration

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "appearanceTools": true,
    "color": {
      "palette": [
        { "slug": "primary", "color": "#0073aa", "name": "Primary" },
        { "slug": "secondary", "color": "#23282d", "name": "Secondary" },
        { "slug": "accent", "color": "#00a0d2", "name": "Accent" }
      ],
      "gradients": [
        {
          "slug": "primary-to-accent",
          "gradient": "linear-gradient(135deg, #0073aa 0%, #00a0d2 100%)",
          "name": "Primary to Accent"
        }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          "slug": "system",
          "name": "System"
        },
        {
          "fontFamily": "'Inter', sans-serif",
          "slug": "inter",
          "name": "Inter",
          "fontFace": [
            {
              "fontFamily": "Inter",
              "fontWeight": "400 700",
              "fontStyle": "normal",
              "src": ["file:./assets/fonts/inter.woff2"]
            }
          ]
        }
      ],
      "fontSizes": [
        { "slug": "small", "size": "0.875rem", "name": "Small" },
        { "slug": "medium", "size": "1rem", "name": "Medium" },
        { "slug": "large", "size": "1.25rem", "name": "Large" },
        { "slug": "x-large", "size": "2rem", "name": "Extra Large" }
      ]
    },
    "spacing": {
      "units": ["px", "em", "rem", "%", "vw", "vh"],
      "spacingSizes": [
        { "slug": "10", "size": "0.5rem", "name": "1" },
        { "slug": "20", "size": "1rem", "name": "2" },
        { "slug": "30", "size": "1.5rem", "name": "3" },
        { "slug": "40", "size": "2rem", "name": "4" },
        { "slug": "50", "size": "3rem", "name": "5" }
      ]
    },
    "layout": {
      "contentSize": "800px",
      "wideSize": "1200px"
    }
  },
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--white)",
      "text": "var(--wp--preset--color--secondary)"
    },
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--system)",
      "fontSize": "var(--wp--preset--font-size--medium)",
      "lineHeight": "1.6"
    },
    "elements": {
      "link": {
        "color": { "text": "var(--wp--preset--color--primary)" },
        ":hover": { "color": { "text": "var(--wp--preset--color--accent)" } }
      },
      "h1": { "typography": { "fontSize": "2.5rem", "fontWeight": "700" } },
      "h2": { "typography": { "fontSize": "2rem", "fontWeight": "600" } },
      "button": {
        "color": {
          "background": "var(--wp--preset--color--primary)",
          "text": "#ffffff"
        },
        "border": { "radius": "4px" }
      }
    },
    "blocks": {
      "core/navigation": {
        "typography": { "fontSize": "var(--wp--preset--font-size--small)" }
      },
      "core/post-title": {
        "typography": { "fontSize": "var(--wp--preset--font-size--x-large)" }
      }
    }
  },
  "templateParts": [
    { "name": "header", "title": "Header", "area": "header" },
    { "name": "footer", "title": "Footer", "area": "footer" }
  ],
  "customTemplates": [
    { "name": "blank", "title": "Blank", "postTypes": ["page", "post"] },
    { "name": "full-width", "title": "Full Width", "postTypes": ["page"] }
  ]
}
```

## Block Templates

### templates/index.html
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
  <!-- wp:query {"queryId":1,"query":{"perPage":10,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} -->
  <div class="wp-block-query">
    <!-- wp:post-template -->
      <!-- wp:post-featured-image {"isLink":true} /-->
      <!-- wp:post-title {"isLink":true} /-->
      <!-- wp:post-excerpt /-->
      <!-- wp:post-date /-->
    <!-- /wp:post-template -->
    
    <!-- wp:query-pagination -->
      <!-- wp:query-pagination-previous /-->
      <!-- wp:query-pagination-numbers /-->
      <!-- wp:query-pagination-next /-->
    <!-- /wp:query-pagination -->
  </div>
  <!-- /wp:query -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

### templates/single.html
```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
<main class="wp-block-group">
  <!-- wp:post-featured-image /-->
  <!-- wp:post-title {"level":1} /-->
  
  <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
  <div class="wp-block-group">
    <!-- wp:post-date /-->
    <!-- wp:post-author {"showAvatar":false} /-->
    <!-- wp:post-terms {"term":"category"} /-->
  </div>
  <!-- /wp:group -->
  
  <!-- wp:post-content {"layout":{"type":"constrained"}} /-->
  
  <!-- wp:post-terms {"term":"post_tag"} /-->
  
  <!-- wp:comments -->
    <!-- wp:comments-title /-->
    <!-- wp:comment-template -->
      <!-- wp:comment-author-name /-->
      <!-- wp:comment-date /-->
      <!-- wp:comment-content /-->
      <!-- wp:comment-reply-link /-->
    <!-- /wp:comment-template -->
    <!-- wp:comments-pagination /-->
    <!-- wp:post-comments-form /-->
  <!-- /wp:comments -->
</main>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->
```

## Template Parts

### parts/header.html
```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|20"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:group {"layout":{"type":"flex","justifyContent":"space-between"}} -->
  <div class="wp-block-group">
    <!-- wp:site-logo {"width":120} /-->
    <!-- wp:site-title /-->
    
    <!-- wp:navigation {"ref":123,"layout":{"type":"flex","justifyContent":"right"}} /-->
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->
```

### parts/footer.html
```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"backgroundColor":"secondary","textColor":"white","layout":{"type":"constrained"}} -->
<div class="wp-block-group">
  <!-- wp:columns -->
  <div class="wp-block-columns">
    <!-- wp:column -->
    <div class="wp-block-column">
      <!-- wp:site-title /-->
      <!-- wp:paragraph -->
      <p>Your site description here.</p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:column -->
    
    <!-- wp:column -->
    <div class="wp-block-column">
      <!-- wp:heading {"level":3} -->
      <h3>Quick Links</h3>
      <!-- /wp:heading -->
      <!-- wp:navigation {"layout":{"type":"flex","orientation":"vertical"}} /-->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
  
  <!-- wp:paragraph {"align":"center","fontSize":"small"} -->
  <p class="has-text-align-center has-small-font-size">© 2024 Your Site. All rights reserved.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
```

## Block Patterns

### patterns/hero.php
```php
<?php
/**
 * Title: Hero Section
 * Slug: mytheme/hero
 * Categories: featured
 * Keywords: hero, banner, header
 */
?>
<!-- wp:cover {"url":"<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/hero.jpg","dimRatio":50,"overlayColor":"secondary","minHeight":500,"align":"full"} -->
<div class="wp-block-cover alignfull" style="min-height:500px">
  <span aria-hidden="true" class="wp-block-cover__background has-secondary-background-color has-background-dim-50 has-background-dim"></span>
  <div class="wp-block-cover__inner-container">
    <!-- wp:heading {"textAlign":"center","level":1,"textColor":"white"} -->
    <h1 class="has-text-align-center has-white-color has-text-color"><?php esc_html_e('Welcome to Our Site', 'mytheme'); ?></h1>
    <!-- /wp:heading -->
    
    <!-- wp:paragraph {"align":"center","textColor":"white"} -->
    <p class="has-text-align-center has-white-color has-text-color"><?php esc_html_e('Your compelling tagline goes here.', 'mytheme'); ?></p>
    <!-- /wp:paragraph -->
    
    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
      <!-- wp:button -->
      <div class="wp-block-button"><a class="wp-block-button__link wp-element-button"><?php esc_html_e('Get Started', 'mytheme'); ?></a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
  </div>
</div>
<!-- /wp:cover -->
```

## Register Block Patterns

```php
// functions.php
function mytheme_register_patterns(): void {
    register_block_pattern_category('mytheme', [
        'label' => __('My Theme', 'mytheme'),
    ]);
}
add_action('init', 'mytheme_register_patterns');
```

## Block Styles

```php
// Register custom block styles
function mytheme_register_block_styles(): void {
    register_block_style('core/button', [
        'name'  => 'outline',
        'label' => __('Outline', 'mytheme'),
    ]);
    
    register_block_style('core/image', [
        'name'  => 'rounded',
        'label' => __('Rounded', 'mytheme'),
    ]);
}
add_action('init', 'mytheme_register_block_styles');
```

## Resources

- Block Theme Handbook: https://developer.wordpress.org/themes/block-themes/
- theme.json Reference: https://developer.wordpress.org/themes/global-settings-and-styles/
- Block Patterns: https://developer.wordpress.org/themes/features/block-patterns/
