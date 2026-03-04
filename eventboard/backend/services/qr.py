"""QR Code generation service."""

import base64
import io

import qrcode
from qrcode.image.pure import PyPNGImage

from backend.config import get_settings


def generate_qr_base64(event_id: str) -> str:
    """Generate a QR code PNG (base64-encoded) pointing to the attendee entry URL."""
    settings = get_settings()
    url = f"{settings.app_url}/e/{event_id}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(image_factory=PyPNGImage)

    buffer = io.BytesIO()
    img.save(buffer)
    buffer.seek(0)

    encoded = base64.b64encode(buffer.read()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"


def get_event_url(event_id: str) -> str:
    """Return the attendee entry URL for an event."""
    settings = get_settings()
    return f"{settings.app_url}/e/{event_id}"
