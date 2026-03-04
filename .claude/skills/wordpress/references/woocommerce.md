# WooCommerce Integration

Extend and customize WooCommerce for e-commerce functionality.

## Product Hooks

```php
// Before/after product
add_action('woocommerce_before_single_product', 'custom_before_product');
add_action('woocommerce_after_single_product', 'custom_after_product');

// Product summary (title, price, add to cart)
add_action('woocommerce_single_product_summary', 'custom_product_info', 25);

// Product tabs
add_filter('woocommerce_product_tabs', function($tabs) {
    $tabs['custom_tab'] = [
        'title'    => __('Custom Tab', 'my-plugin'),
        'priority' => 50,
        'callback' => 'custom_tab_content',
    ];
    unset($tabs['reviews']); // Remove reviews tab
    return $tabs;
});

// Modify price
add_filter('woocommerce_product_get_price', function($price, $product) {
    if (is_user_logged_in()) {
        return $price * 0.9; // 10% discount for logged-in users
    }
    return $price;
}, 10, 2);
```

## Cart Hooks

```php
// Add to cart
add_action('woocommerce_add_to_cart', function($cart_item_key, $product_id, $quantity, $variation_id, $variation, $cart_item_data) {
    // Track add to cart
}, 10, 6);

// Validate add to cart
add_filter('woocommerce_add_to_cart_validation', function($passed, $product_id, $quantity) {
    $product = wc_get_product($product_id);
    if ($product->get_stock_quantity() < $quantity) {
        wc_add_notice(__('Not enough stock', 'my-plugin'), 'error');
        return false;
    }
    return $passed;
}, 10, 3);

// Cart item price
add_filter('woocommerce_cart_item_price', function($price, $cart_item, $cart_item_key) {
    return $price . ' <small>(excl. tax)</small>';
}, 10, 3);

// Cart totals
add_action('woocommerce_cart_calculate_fees', function($cart) {
    if ($cart->subtotal > 100) {
        $cart->add_fee(__('Bulk Discount', 'my-plugin'), -10);
    }
});
```


## Checkout Hooks

```php
// Add custom checkout field
add_action('woocommerce_after_order_notes', function($checkout) {
    woocommerce_form_field('delivery_date', [
        'type'        => 'date',
        'class'       => ['form-row-wide'],
        'label'       => __('Preferred Delivery Date', 'my-plugin'),
        'required'    => true,
    ], $checkout->get_value('delivery_date'));
});

// Validate custom field
add_action('woocommerce_checkout_process', function() {
    if (empty($_POST['delivery_date'])) {
        wc_add_notice(__('Please select a delivery date.', 'my-plugin'), 'error');
    }
});

// Save custom field
add_action('woocommerce_checkout_update_order_meta', function($order_id) {
    if (!empty($_POST['delivery_date'])) {
        update_post_meta($order_id, '_delivery_date', sanitize_text_field($_POST['delivery_date']));
    }
});

// Display in admin
add_action('woocommerce_admin_order_data_after_billing_address', function($order) {
    $date = get_post_meta($order->get_id(), '_delivery_date', true);
    if ($date) {
        echo '<p><strong>' . __('Delivery Date', 'my-plugin') . ':</strong> ' . esc_html($date) . '</p>';
    }
});
```

## Order Hooks

```php
// Order status change
add_action('woocommerce_order_status_completed', function($order_id) {
    $order = wc_get_order($order_id);
    // Send custom notification, update inventory, etc.
});

// After order created
add_action('woocommerce_checkout_order_processed', function($order_id, $posted_data, $order) {
    // Process order
}, 10, 3);

// Thank you page
add_action('woocommerce_thankyou', function($order_id) {
    $order = wc_get_order($order_id);
    echo '<p>Thank you ' . esc_html($order->get_billing_first_name()) . '!</p>';
});

// Order emails
add_filter('woocommerce_email_recipient_new_order', function($recipient, $order) {
    return $recipient . ', manager@example.com';
}, 10, 2);
```

## Custom Product Type

```php
// Register product type
add_action('init', function() {
    class WC_Product_Custom extends WC_Product {
        public function get_type(): string {
            return 'custom';
        }
    }
});

add_filter('product_type_selector', function($types) {
    $types['custom'] = __('Custom Product', 'my-plugin');
    return $types;
});

add_filter('woocommerce_product_class', function($classname, $product_type) {
    if ($product_type === 'custom') {
        return 'WC_Product_Custom';
    }
    return $classname;
}, 10, 2);
```

## Custom Product Data Tab

```php
// Add tab
add_filter('woocommerce_product_data_tabs', function($tabs) {
    $tabs['custom_options'] = [
        'label'    => __('Custom Options', 'my-plugin'),
        'target'   => 'custom_options_data',
        'class'    => ['show_if_simple', 'show_if_variable'],
        'priority' => 21,
    ];
    return $tabs;
});

// Tab content
add_action('woocommerce_product_data_panels', function() {
    global $post;
    ?>
    <div id="custom_options_data" class="panel woocommerce_options_panel">
        <?php
        woocommerce_wp_text_input([
            'id'          => '_custom_field',
            'label'       => __('Custom Field', 'my-plugin'),
            'description' => __('Enter custom value', 'my-plugin'),
            'desc_tip'    => true,
        ]);
        
        woocommerce_wp_checkbox([
            'id'          => '_custom_checkbox',
            'label'       => __('Enable Feature', 'my-plugin'),
        ]);
        ?>
    </div>
    <?php
});

// Save tab data
add_action('woocommerce_process_product_meta', function($post_id) {
    $custom_field = sanitize_text_field($_POST['_custom_field'] ?? '');
    update_post_meta($post_id, '_custom_field', $custom_field);
    
    $checkbox = isset($_POST['_custom_checkbox']) ? 'yes' : 'no';
    update_post_meta($post_id, '_custom_checkbox', $checkbox);
});
```

## Payment Gateway

```php
add_action('plugins_loaded', function() {
    class WC_Gateway_Custom extends WC_Payment_Gateway {
        public function __construct() {
            $this->id                 = 'custom_gateway';
            $this->icon               = '';
            $this->has_fields         = true;
            $this->method_title       = __('Custom Gateway', 'my-plugin');
            $this->method_description = __('Custom payment gateway', 'my-plugin');
            
            $this->init_form_fields();
            $this->init_settings();
            
            $this->title       = $this->get_option('title');
            $this->description = $this->get_option('description');
            $this->enabled     = $this->get_option('enabled');
            
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, [$this, 'process_admin_options']);
        }
        
        public function init_form_fields(): void {
            $this->form_fields = [
                'enabled' => [
                    'title'   => __('Enable/Disable', 'my-plugin'),
                    'type'    => 'checkbox',
                    'label'   => __('Enable Custom Gateway', 'my-plugin'),
                    'default' => 'no',
                ],
                'title' => [
                    'title'       => __('Title', 'my-plugin'),
                    'type'        => 'text',
                    'default'     => __('Custom Payment', 'my-plugin'),
                ],
            ];
        }
        
        public function process_payment($order_id): array {
            $order = wc_get_order($order_id);
            
            // Process payment logic here
            
            $order->payment_complete();
            WC()->cart->empty_cart();
            
            return [
                'result'   => 'success',
                'redirect' => $this->get_return_url($order),
            ];
        }
    }
});

add_filter('woocommerce_payment_gateways', function($gateways) {
    $gateways[] = 'WC_Gateway_Custom';
    return $gateways;
});
```

## REST API Extensions

```php
// Add custom endpoint
add_action('rest_api_init', function() {
    register_rest_route('wc/v3', '/custom-products', [
        'methods'             => 'GET',
        'callback'            => 'get_custom_products',
        'permission_callback' => function() {
            return current_user_can('read');
        },
    ]);
});

// Extend product response
add_filter('woocommerce_rest_prepare_product_object', function($response, $product, $request) {
    $response->data['custom_field'] = get_post_meta($product->get_id(), '_custom_field', true);
    return $response;
}, 10, 3);
```

## Useful Functions

```php
// Get product
$product = wc_get_product($product_id);
$price = $product->get_price();
$name = $product->get_name();
$sku = $product->get_sku();

// Get order
$order = wc_get_order($order_id);
$total = $order->get_total();
$status = $order->get_status();
$items = $order->get_items();

// Cart
WC()->cart->add_to_cart($product_id, $quantity);
WC()->cart->get_cart_contents_count();
WC()->cart->get_cart_total();

// Customer
$customer = WC()->customer;
$email = $customer->get_email();

// Notices
wc_add_notice(__('Success!', 'my-plugin'), 'success');
wc_add_notice(__('Error!', 'my-plugin'), 'error');
```

## Resources

- WooCommerce Docs: https://woocommerce.com/documentation/
- Developer Docs: https://developer.woocommerce.com/
- REST API: https://woocommerce.github.io/woocommerce-rest-api-docs/
