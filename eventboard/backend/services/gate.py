"""
Gate System — checks whether an attendee session meets the conditions
required to access a specific activity.

gate_config structure:
  {
    "logic": "AND" | "OR",
    "conditions": [
      {"type": "form_filled"},
      {"type": "activity_completed", "activity_id": "<uuid>"},
      {"type": "post_count", "min": 1}
    ]
  }
"""

from __future__ import annotations
from typing import Any


def check_gate(session: dict[str, Any], activity: dict[str, Any], db_get_activity) -> dict[str, Any]:
    """
    Evaluate gate_config conditions for a session.

    Args:
        session: event_sessions row as dict
        activity: event_activities row as dict
        db_get_activity: callable(activity_id) -> activity dict | None

    Returns:
        {"allowed": bool, "missing": list[str]}
    """
    gate = activity.get("gate_config") or {}
    conditions = gate.get("conditions", [])

    if not conditions:
        return {"allowed": True, "missing": []}

    results: list[bool] = []

    for cond in conditions:
        ctype = cond.get("type", "")

        if ctype == "form_filled":
            results.append(bool(session.get("form_filled")))

        elif ctype == "activity_completed":
            target = db_get_activity(cond["activity_id"])
            results.append(target is not None and target.get("status") == "completed")

        elif ctype == "post_count":
            min_posts = cond.get("min", 1)
            results.append(session.get("post_count", 0) >= min_posts)

        else:
            # Unknown condition type → deny by default
            results.append(False)

    logic = gate.get("logic", "AND")
    allowed = all(results) if logic == "AND" else any(results)

    missing = [
        cond.get("type", "unknown")
        for cond, passed in zip(conditions, results)
        if not passed
    ]

    return {"allowed": allowed, "missing": missing}
