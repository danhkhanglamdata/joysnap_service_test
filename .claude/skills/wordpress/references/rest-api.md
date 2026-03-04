# WordPress REST API

Build custom REST endpoints and extend the WordPress API.

## Register Custom Endpoints

```php
add_action('rest_api_init', function() {
    // GET /wp-json/myplugin/v1/items
    register_rest_route('myplugin/v1', '/items', [
        'methods'             => WP_REST_Server::READABLE, // GET
        'callback'            => 'get_items',
        'permission_callback' => '__return_true',
    ]);

    // POST /wp-json/myplugin/v1/items
    register_rest_route('myplugin/v1', '/items', [
        'methods'             => WP_REST_Server::CREATABLE, // POST
        'callback'            => 'create_item',
        'permission_callback' => 'can_manage_items',
        'args'                => get_item_schema(),
    ]);

    // GET/PUT/DELETE /wp-json/myplugin/v1/items/123
    register_rest_route('myplugin/v1', '/items/(?P<id>\d+)', [
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'get_item',
            'permission_callback' => '__return_true',
        ],
        [
            'methods'             => WP_REST_Server::EDITABLE, // PUT, PATCH
            'callback'            => 'update_item',
            'permission_callback' => 'can_manage_items',
        ],
        [
            'methods'             => WP_REST_Server::DELETABLE, // DELETE
            'callback'            => 'delete_item',
            'permission_callback' => 'can_manage_items',
        ],
    ]);
});
```

## Callback Functions

```php
function get_items(WP_REST_Request $request): WP_REST_Response {
    $per_page = $request->get_param('per_page') ?? 10;
    $page = $request->get_param('page') ?? 1;
    
    $items = get_posts([
        'post_type'      => 'my_cpt',
        'posts_per_page' => $per_page,
        'paged'          => $page,
    ]);
    
    $data = array_map(fn($item) => prepare_item($item), $items);
    
    return new WP_REST_Response($data, 200);
}


function get_item(WP_REST_Request $request): WP_REST_Response|WP_Error {
    $id = (int) $request->get_param('id');
    $post = get_post($id);
    
    if (!$post || $post->post_type !== 'my_cpt') {
        return new WP_Error(
            'not_found',
            __('Item not found', 'my-plugin'),
            ['status' => 404]
        );
    }
    
    return new WP_REST_Response(prepare_item($post), 200);
}

function create_item(WP_REST_Request $request): WP_REST_Response|WP_Error {
    $title = sanitize_text_field($request->get_param('title'));
    $content = wp_kses_post($request->get_param('content'));
    
    $post_id = wp_insert_post([
        'post_type'    => 'my_cpt',
        'post_title'   => $title,
        'post_content' => $content,
        'post_status'  => 'publish',
    ], true);
    
    if (is_wp_error($post_id)) {
        return $post_id;
    }
    
    return new WP_REST_Response(prepare_item(get_post($post_id)), 201);
}

function prepare_item(WP_Post $post): array {
    return [
        'id'      => $post->ID,
        'title'   => $post->post_title,
        'content' => $post->post_content,
        'date'    => $post->post_date,
        'link'    => get_permalink($post->ID),
    ];
}
```

## Permission Callbacks

```php
function can_manage_items(): bool|WP_Error {
    if (!is_user_logged_in()) {
        return new WP_Error(
            'rest_not_logged_in',
            __('You must be logged in.', 'my-plugin'),
            ['status' => 401]
        );
    }
    
    if (!current_user_can('edit_posts')) {
        return new WP_Error(
            'rest_forbidden',
            __('You do not have permission.', 'my-plugin'),
            ['status' => 403]
        );
    }
    
    return true;
}

// Nonce-based authentication (for logged-in users)
function check_nonce(WP_REST_Request $request): bool {
    $nonce = $request->get_header('X-WP-Nonce');
    return wp_verify_nonce($nonce, 'wp_rest');
}
```

## Argument Validation

```php
function get_item_schema(): array {
    return [
        'title' => [
            'required'          => true,
            'type'              => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'validate_callback' => function($value) {
                return !empty($value);
            },
        ],
        'content' => [
            'required'          => false,
            'type'              => 'string',
            'default'           => '',
            'sanitize_callback' => 'wp_kses_post',
        ],
        'status' => [
            'required' => false,
            'type'     => 'string',
            'default'  => 'publish',
            'enum'     => ['publish', 'draft', 'pending'],
        ],
    ];
}
```

## REST Controller Class

```php
<?php
namespace MyPlugin\Api;

class Items_Controller extends \WP_REST_Controller {
    protected $namespace = 'myplugin/v1';
    protected $rest_base = 'items';

    public function register_routes(): void {
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_items'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
                'args'                => $this->get_collection_params(),
            ],
            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_item'],
                'permission_callback' => [$this, 'create_item_permissions_check'],
                'args'                => $this->get_endpoint_args_for_item_schema(\WP_REST_Server::CREATABLE),
            ],
            'schema' => [$this, 'get_public_item_schema'],
        ]);
    }

    public function get_items(\WP_REST_Request $request): \WP_REST_Response {
        // Implementation
    }

    public function get_items_permissions_check(\WP_REST_Request $request): bool {
        return true;
    }

    public function get_item_schema(): array {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'item',
            'type'       => 'object',
            'properties' => [
                'id' => [
                    'description' => __('Unique identifier.', 'my-plugin'),
                    'type'        => 'integer',
                    'readonly'    => true,
                ],
                'title' => [
                    'description' => __('Item title.', 'my-plugin'),
                    'type'        => 'string',
                    'required'    => true,
                ],
            ],
        ];
    }
}
```

## Extend Existing Endpoints

```php
// Add custom field to posts
add_action('rest_api_init', function() {
    register_rest_field('post', 'custom_field', [
        'get_callback' => function($post) {
            return get_post_meta($post['id'], 'custom_field', true);
        },
        'update_callback' => function($value, $post) {
            update_post_meta($post->ID, 'custom_field', sanitize_text_field($value));
        },
        'schema' => [
            'type'        => 'string',
            'description' => 'Custom field value',
        ],
    ]);
});

// Modify response
add_filter('rest_prepare_post', function($response, $post, $request) {
    $response->data['reading_time'] = calculate_reading_time($post->post_content);
    return $response;
}, 10, 3);
```

## JavaScript Client

```javascript
// Using wp.apiFetch (WordPress)
wp.apiFetch({ path: '/myplugin/v1/items' })
    .then(items => console.log(items));

wp.apiFetch({
    path: '/myplugin/v1/items',
    method: 'POST',
    data: { title: 'New Item', content: 'Content here' },
}).then(item => console.log(item));

// Using fetch with nonce
fetch('/wp-json/myplugin/v1/items', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': wpApiSettings.nonce,
    },
    body: JSON.stringify({ title: 'New Item' }),
});
```

## Resources

- REST API Handbook: https://developer.wordpress.org/rest-api/
- Extending REST API: https://developer.wordpress.org/rest-api/extending-the-rest-api/
