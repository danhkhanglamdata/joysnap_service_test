# Custom Gutenberg Block Development

Build custom blocks for the WordPress block editor.

## Block Structure

```
my-block/
├── block.json          # Block metadata
├── index.js            # Block registration
├── edit.js             # Editor component
├── save.js             # Frontend output
├── editor.scss         # Editor styles
├── style.scss          # Frontend styles
└── render.php          # Dynamic render (optional)
```

## block.json

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "myplugin/custom-card",
  "version": "1.0.0",
  "title": "Custom Card",
  "category": "widgets",
  "icon": "card",
  "description": "A custom card block with image and text.",
  "keywords": ["card", "box", "container"],
  "textdomain": "my-plugin",
  "attributes": {
    "title": {
      "type": "string",
      "default": ""
    },
    "content": {
      "type": "string",
      "default": ""
    },
    "mediaId": {
      "type": "number",
      "default": 0
    },
    "mediaUrl": {
      "type": "string",
      "default": ""
    },
    "backgroundColor": {
      "type": "string",
      "default": "#ffffff"
    }
  },
  "supports": {
    "html": false,
    "align": ["wide", "full"],
    "color": {
      "background": true,
      "text": true
    },
    "spacing": {
      "margin": true,
      "padding": true
    }
  },
  "editorScript": "file:./index.js",
  "editorStyle": "file:./editor.css",
  "style": "file:./style.css",
  "render": "file:./render.php"
}
```


## Block Registration (index.js)

```javascript
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save,
});
```

## Edit Component (edit.js)

```javascript
import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    RichText,
    MediaUpload,
    MediaUploadCheck,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    ColorPicker,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const { title, content, mediaId, mediaUrl, backgroundColor } = attributes;
    
    const blockProps = useBlockProps({
        style: { backgroundColor },
    });

    const onSelectMedia = (media) => {
        setAttributes({
            mediaId: media.id,
            mediaUrl: media.url,
        });
    };

    const removeMedia = () => {
        setAttributes({
            mediaId: 0,
            mediaUrl: '',
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Card Settings', 'my-plugin')}>
                    <p>{__('Background Color', 'my-plugin')}</p>
                    <ColorPicker
                        color={backgroundColor}
                        onChange={(color) => setAttributes({ backgroundColor: color })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <MediaUploadCheck>
                    <MediaUpload
                        onSelect={onSelectMedia}
                        allowedTypes={['image']}
                        value={mediaId}
                        render={({ open }) => (
                            <div className="card-media">
                                {mediaUrl ? (
                                    <>
                                        <img src={mediaUrl} alt="" />
                                        <Button onClick={removeMedia} isDestructive>
                                            {__('Remove Image', 'my-plugin')}
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={open} variant="secondary">
                                        {__('Select Image', 'my-plugin')}
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                </MediaUploadCheck>

                <RichText
                    tagName="h3"
                    className="card-title"
                    value={title}
                    onChange={(value) => setAttributes({ title: value })}
                    placeholder={__('Card Title...', 'my-plugin')}
                />

                <RichText
                    tagName="p"
                    className="card-content"
                    value={content}
                    onChange={(value) => setAttributes({ content: value })}
                    placeholder={__('Card content...', 'my-plugin')}
                />
            </div>
        </>
    );
}
```

## Save Component (save.js)

```javascript
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { title, content, mediaUrl, backgroundColor } = attributes;
    
    const blockProps = useBlockProps.save({
        style: { backgroundColor },
    });

    return (
        <div {...blockProps}>
            {mediaUrl && (
                <div className="card-media">
                    <img src={mediaUrl} alt="" />
                </div>
            )}
            <RichText.Content tagName="h3" className="card-title" value={title} />
            <RichText.Content tagName="p" className="card-content" value={content} />
        </div>
    );
}
```

## Dynamic Render (render.php)

```php
<?php
/**
 * Dynamic block render callback
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 */

$title = $attributes['title'] ?? '';
$content = $attributes['content'] ?? '';
$media_url = $attributes['mediaUrl'] ?? '';
$bg_color = $attributes['backgroundColor'] ?? '#ffffff';

$wrapper_attributes = get_block_wrapper_attributes([
    'style' => "background-color: {$bg_color};",
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <?php if ($media_url) : ?>
        <div class="card-media">
            <img src="<?php echo esc_url($media_url); ?>" alt="">
        </div>
    <?php endif; ?>
    
    <?php if ($title) : ?>
        <h3 class="card-title"><?php echo wp_kses_post($title); ?></h3>
    <?php endif; ?>
    
    <?php if ($content) : ?>
        <p class="card-content"><?php echo wp_kses_post($content); ?></p>
    <?php endif; ?>
</div>
```

## Register Block in PHP

```php
// In plugin main file or functions.php
function myplugin_register_blocks(): void {
    register_block_type(__DIR__ . '/blocks/custom-card');
}
add_action('init', 'myplugin_register_blocks');
```

## Build Setup (package.json)

```json
{
  "name": "my-plugin-blocks",
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start",
    "format": "wp-scripts format",
    "lint:js": "wp-scripts lint-js",
    "lint:css": "wp-scripts lint-style"
  },
  "devDependencies": {
    "@wordpress/scripts": "^26.0.0"
  }
}
```

## webpack.config.js (Custom)

```javascript
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
    ...defaultConfig,
    entry: {
        'custom-card': path.resolve(__dirname, 'src/blocks/custom-card/index.js'),
        'another-block': path.resolve(__dirname, 'src/blocks/another-block/index.js'),
    },
};
```

## Common Block Components

```javascript
// InnerBlocks - Nested blocks
import { InnerBlocks } from '@wordpress/block-editor';

// In edit.js
<InnerBlocks
    allowedBlocks={['core/paragraph', 'core/heading']}
    template={[['core/paragraph', { placeholder: 'Add content...' }]]}
/>

// In save.js
<InnerBlocks.Content />
```

```javascript
// BlockControls - Toolbar
import { BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

<BlockControls>
    <AlignmentToolbar
        value={alignment}
        onChange={(value) => setAttributes({ alignment: value })}
    />
</BlockControls>
```

## Resources

- Block Editor Handbook: https://developer.wordpress.org/block-editor/
- @wordpress/scripts: https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/
- Block API Reference: https://developer.wordpress.org/block-editor/reference-guides/block-api/
