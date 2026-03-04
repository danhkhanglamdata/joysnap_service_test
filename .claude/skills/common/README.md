# Common Skill Utilities

Shared utilities used across multiple skills.

## API Key Helper

`api_key_helper.py` provides Nebius AI configuration from environment variables.

### Setup

Add to `~/.zshrc`:

```bash
# Nebius AI
export NEBIUS_API_KEY='your-api-key'

# Optional - Override default models
export NEBIUS_VISION_MODEL='Qwen/Qwen2.5-VL-72B-Instruct'
export NEBIUS_IMAGE_MODEL='black-forest-labs/flux-dev'
```

### Nebius AI Models

| Task | Model | URL |
|------|-------|-----|
| Vision (image2text) | `Qwen/Qwen2.5-VL-72B-Instruct` | https://tokenfactory.nebius.com/?modality=image2text |
| Image Generation (text2image) | `black-forest-labs/flux-dev` | https://tokenfactory.nebius.com/?modality=text2image |

### Usage

```python
import sys
from pathlib import Path

common_dir = Path(__file__).parent.parent.parent / 'common'
sys.path.insert(0, str(common_dir))

from api_key_helper import get_client

# Get OpenAI-compatible client
client_info = get_client()
client = client_info['client']
config = client_info['config']

# Vision task
response = client.chat.completions.create(
    model=config['vision_model'],
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Describe this image"},
            {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}}
        ]
    }]
)

# Image generation
response = client.images.generate(
    model=config['image_gen_model'],
    prompt="A beautiful sunset",
    n=1,
    size="1024x1024"
)
```
