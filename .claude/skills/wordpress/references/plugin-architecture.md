# WordPress Plugin Architecture

Best practices for building maintainable, scalable WordPress plugins.

## Modern Plugin Structure

```
my-plugin/
├── my-plugin.php              # Main plugin file (bootstrap)
├── composer.json              # Dependencies
├── package.json               # JS/CSS build tools
├── readme.txt                 # WordPress.org readme
├── uninstall.php              # Cleanup on uninstall
│
├── includes/                  # PHP classes
│   ├── class-plugin.php       # Main plugin class
│   ├── class-activator.php    # Activation logic
│   ├── class-deactivator.php  # Deactivation logic
│   ├── class-loader.php       # Hook loader
│   ├── class-i18n.php         # Internationalization
│   │
│   ├── admin/                 # Admin-specific
│   │   ├── class-admin.php
│   │   └── class-settings.php
│   │
│   ├── public/                # Frontend-specific
│   │   └── class-public.php
│   │
│   ├── api/                   # REST API
│   │   └── class-rest-controller.php
│   │
│   └── models/                # Data models
│       └── class-model.php
│
├── admin/                     # Admin assets
│   ├── css/
│   ├── js/
│   └── views/                 # Admin templates
│
├── public/                    # Frontend assets
│   ├── css/
│   └── js/
│
├── templates/                 # Template files
├── languages/                 # Translation files
└── tests/                     # PHPUnit tests
```

## Main Plugin Class (Singleton)

```php
<?php
// includes/class-plugin.php

namespace MyPlugin;

class Plugin {
    private static ?Plugin $instance = null;
    private Loader $loader;
    private string $plugin_name;
    private string $version;

    public static function instance(): Plugin {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->plugin_name = 'my-plugin';
        $this->version = MYPLUGIN_VERSION;
        
        $this->load_dependencies();
        $this->set_locale();
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->define_api_hooks();
        
        $this->loader->run();
    }

    private function load_dependencies(): void {
        $this->loader = new Loader();
    }

    private function set_locale(): void {
        $i18n = new I18n();
        $this->loader->add_action('plugins_loaded', $i18n, 'load_textdomain');
    }

    private function define_admin_hooks(): void {
        $admin = new Admin\Admin($this->plugin_name, $this->version);
        
        $this->loader->add_action('admin_enqueue_scripts', $admin, 'enqueue_styles');
        $this->loader->add_action('admin_enqueue_scripts', $admin, 'enqueue_scripts');
        $this->loader->add_action('admin_menu', $admin, 'add_menu_pages');
    }

    private function define_public_hooks(): void {
        $public = new Frontend\PublicFacing($this->plugin_name, $this->version);
        
        $this->loader->add_action('wp_enqueue_scripts', $public, 'enqueue_styles');
        $this->loader->add_action('wp_enqueue_scripts', $public, 'enqueue_scripts');
    }

    private function define_api_hooks(): void {
        $api = new Api\RestController($this->plugin_name, $this->version);
        
        $this->loader->add_action('rest_api_init', $api, 'register_routes');
    }

    public static function activate(): void {
        Activator::activate();
    }

    public static function deactivate(): void {
        Deactivator::deactivate();
    }

    public function get_plugin_name(): string {
        return $this->plugin_name;
    }

    public function get_version(): string {
        return $this->version;
    }
}
```

## Hook Loader

```php
<?php
// includes/class-loader.php

namespace MyPlugin;

class Loader {
    protected array $actions = [];
    protected array $filters = [];

    public function add_action(
        string $hook,
        object $component,
        string $callback,
        int $priority = 10,
        int $accepted_args = 1
    ): void {
        $this->actions = $this->add($this->actions, $hook, $component, $callback, $priority, $accepted_args);
    }

    public function add_filter(
        string $hook,
        object $component,
        string $callback,
        int $priority = 10,
        int $accepted_args = 1
    ): void {
        $this->filters = $this->add($this->filters, $hook, $component, $callback, $priority, $accepted_args);
    }

    private function add(
        array $hooks,
        string $hook,
        object $component,
        string $callback,
        int $priority,
        int $accepted_args
    ): array {
        $hooks[] = [
            'hook'          => $hook,
            'component'     => $component,
            'callback'      => $callback,
            'priority'      => $priority,
            'accepted_args' => $accepted_args,
        ];
        return $hooks;
    }

    public function run(): void {
        foreach ($this->filters as $hook) {
            add_filter(
                $hook['hook'],
                [$hook['component'], $hook['callback']],
                $hook['priority'],
                $hook['accepted_args']
            );
        }

        foreach ($this->actions as $hook) {
            add_action(
                $hook['hook'],
                [$hook['component'], $hook['callback']],
                $hook['priority'],
                $hook['accepted_args']
            );
        }
    }
}
```

## Activation & Deactivation

```php
<?php
// includes/class-activator.php

namespace MyPlugin;

class Activator {
    public static function activate(): void {
        // Create database tables
        self::create_tables();
        
        // Add default options
        add_option('myplugin_version', MYPLUGIN_VERSION);
        add_option('myplugin_settings', self::default_settings());
        
        // Schedule cron events
        if (!wp_next_scheduled('myplugin_daily_event')) {
            wp_schedule_event(time(), 'daily', 'myplugin_daily_event');
        }
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    private static function create_tables(): void {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'myplugin_items';
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            title varchar(255) NOT NULL,
            content longtext,
            status varchar(20) DEFAULT 'draft',
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY user_id (user_id),
            KEY status (status)
        ) $charset_collate;";
        
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    private static function default_settings(): array {
        return [
            'enabled' => true,
            'api_key' => '',
            'items_per_page' => 10,
        ];
    }
}
```

```php
<?php
// includes/class-deactivator.php

namespace MyPlugin;

class Deactivator {
    public static function deactivate(): void {
        // Clear scheduled events
        wp_clear_scheduled_hook('myplugin_daily_event');
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
}
```

## Uninstall

```php
<?php
// uninstall.php

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

global $wpdb;

// Delete options
delete_option('myplugin_version');
delete_option('myplugin_settings');

// Delete user meta
delete_metadata('user', 0, 'myplugin_user_data', '', true);

// Delete custom tables
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}myplugin_items");

// Clear any cached data
wp_cache_flush();
```

## Admin Settings Page

```php
<?php
// includes/admin/class-settings.php

namespace MyPlugin\Admin;

class Settings {
    private string $option_name = 'myplugin_settings';

    public function __construct() {
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function register_settings(): void {
        register_setting(
            'myplugin_settings_group',
            $this->option_name,
            ['sanitize_callback' => [$this, 'sanitize_settings']]
        );

        add_settings_section(
            'myplugin_general_section',
            __('General Settings', 'my-plugin'),
            [$this, 'section_callback'],
            'myplugin-settings'
        );

        add_settings_field(
            'enabled',
            __('Enable Plugin', 'my-plugin'),
            [$this, 'checkbox_field'],
            'myplugin-settings',
            'myplugin_general_section',
            ['field' => 'enabled']
        );

        add_settings_field(
            'api_key',
            __('API Key', 'my-plugin'),
            [$this, 'text_field'],
            'myplugin-settings',
            'myplugin_general_section',
            ['field' => 'api_key', 'type' => 'password']
        );
    }

    public function sanitize_settings(array $input): array {
        $sanitized = [];
        $sanitized['enabled'] = isset($input['enabled']) ? (bool) $input['enabled'] : false;
        $sanitized['api_key'] = sanitize_text_field($input['api_key'] ?? '');
        $sanitized['items_per_page'] = absint($input['items_per_page'] ?? 10);
        return $sanitized;
    }

    public function section_callback(): void {
        echo '<p>' . esc_html__('Configure the plugin settings below.', 'my-plugin') . '</p>';
    }

    public function checkbox_field(array $args): void {
        $options = get_option($this->option_name);
        $checked = $options[$args['field']] ?? false;
        printf(
            '<input type="checkbox" name="%s[%s]" value="1" %s />',
            esc_attr($this->option_name),
            esc_attr($args['field']),
            checked($checked, true, false)
        );
    }

    public function text_field(array $args): void {
        $options = get_option($this->option_name);
        $value = $options[$args['field']] ?? '';
        $type = $args['type'] ?? 'text';
        printf(
            '<input type="%s" name="%s[%s]" value="%s" class="regular-text" />',
            esc_attr($type),
            esc_attr($this->option_name),
            esc_attr($args['field']),
            esc_attr($value)
        );
    }

    public function render_page(): void {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('myplugin_settings_group');
                do_settings_sections('myplugin-settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }
}
```

## Dependency Injection Container (Optional)

```php
<?php
// includes/class-container.php

namespace MyPlugin;

class Container {
    private array $services = [];
    private array $instances = [];

    public function set(string $id, callable $factory): void {
        $this->services[$id] = $factory;
    }

    public function get(string $id): mixed {
        if (!isset($this->instances[$id])) {
            if (!isset($this->services[$id])) {
                throw new \Exception("Service not found: $id");
            }
            $this->instances[$id] = $this->services[$id]($this);
        }
        return $this->instances[$id];
    }

    public function has(string $id): bool {
        return isset($this->services[$id]);
    }
}

// Usage
$container = new Container();
$container->set('settings', fn($c) => new Admin\Settings());
$container->set('api', fn($c) => new Api\RestController($c->get('settings')));
```

## Best Practices

1. **Use namespaces** - Avoid conflicts with other plugins
2. **Singleton for main class** - Single entry point
3. **Separate concerns** - Admin, public, API in different classes
4. **Use Loader pattern** - Centralized hook management
5. **Proper activation/deactivation** - Clean setup and teardown
6. **Uninstall cleanup** - Remove all data when uninstalled
7. **Settings API** - Use WordPress Settings API for options
8. **Autoloading** - Use Composer or custom autoloader
