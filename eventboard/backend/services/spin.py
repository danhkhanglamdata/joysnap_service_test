"""
Lucky Spin service — server-side random prize selection.

Prizes config structure:
  [
    {"id": "p1", "label": "Voucher 500k", "prob": 0.05, "qty": 5},
    {"id": "p2", "label": "Voucher 200k", "prob": 0.15, "qty": 20},
    {"id": "p3", "label": "Thử lại",      "prob": 0.80, "qty": 999}
  ]

Server decides the result — client animation is purely cosmetic.
"""

from __future__ import annotations

import random
from typing import Any


def select_prize(prizes: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Randomly select a prize based on probability weights.

    Normalizes probabilities so they sum to 1.0.
    Returns the selected prize dict.
    """
    if not prizes:
        return {"id": "none", "label": "Không có giải thưởng"}

    weights = [max(0.0, p.get("prob", 0.0)) for p in prizes]
    total = sum(weights)

    if total == 0:
        # All probabilities are 0 → uniform distribution
        return random.choice(prizes)

    normalized = [w / total for w in weights]
    result = random.choices(prizes, weights=normalized, k=1)[0]
    return {"id": result.get("id", ""), "label": result.get("label", "Giải thưởng")}
