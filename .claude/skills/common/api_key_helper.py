#!/usr/bin/env python3
"""
Common API Key Helper for Nebius AI Skills

Reads API keys from environment variables (set in ~/.zshrc).

Nebius Token Factory:
- Vision: https://tokenfactory.nebius.com/?modality=image2text
- Image Gen: https://tokenfactory.nebius.com/?modality=text2image
"""

import os
import sys
from typing import Optional, Dict, Any


def get_api_key() -> Optional[str]:
    """Get NEBIUS_API_KEY from environment variable."""
    return os.getenv('NEBIUS_API_KEY')


def get_nebius_config() -> Dict[str, Any]:
    """
    Get Nebius AI configuration from environment variables.

    Returns:
        Dictionary with Nebius configuration
    """
    return {
        'api_key': get_api_key(),
        'vision_model': os.getenv('NEBIUS_VISION_MODEL', 'Qwen/Qwen2.5-VL-72B-Instruct'),
        'image_gen_model': os.getenv('NEBIUS_IMAGE_MODEL', 'black-forest-labs/flux-dev'),
        'base_url': os.getenv('NEBIUS_BASE_URL', 'https://api.studio.nebius.com/v1')
    }


def get_api_key_or_exit() -> str:
    """Get API key or exit with helpful error message."""
    api_key = get_api_key()

    if not api_key:
        print("\n❌ Error: NEBIUS_API_KEY not found!", file=sys.stderr)
        print("\n📋 Add to your ~/.zshrc:", file=sys.stderr)
        print("   export NEBIUS_API_KEY='your-api-key'", file=sys.stderr)
        print("\n🔑 Get your API key at: https://studio.nebius.com/", file=sys.stderr)
        print("\n📚 Available models:", file=sys.stderr)
        print("   Vision: https://tokenfactory.nebius.com/?modality=image2text", file=sys.stderr)
        print("   Image Gen: https://tokenfactory.nebius.com/?modality=text2image", file=sys.stderr)
        sys.exit(1)

    return api_key


def get_client():
    """
    Get Nebius AI client (OpenAI-compatible).

    Returns:
        Dictionary with client info and configuration
    """
    config = get_nebius_config()
    api_key = get_api_key_or_exit()

    try:
        from openai import OpenAI
        
        client = OpenAI(
            api_key=api_key,
            base_url=config['base_url']
        )

        return {
            'type': 'nebius',
            'client': client,
            'config': config
        }
    except ImportError:
        print("\n❌ Error: openai package not installed!", file=sys.stderr)
        print("   Install with: uv add openai", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    api_key = get_api_key_or_exit()
    print(f"✓ Found API key: {api_key[:8]}..." + "*" * (len(api_key) - 8))

    config = get_nebius_config()
    print(f"\n✓ Nebius AI Configuration:")
    print(f"  Vision Model: {config['vision_model']}")
    print(f"  Image Gen Model: {config['image_gen_model']}")
