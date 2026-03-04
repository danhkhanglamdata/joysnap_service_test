"""
Playlist / Workflow Engine.

Checks whether the next activity in the playlist should auto-start
based on its trigger_type and trigger_config.

Trigger types:
  - manual          → Organizer explicitly starts it (no auto logic)
  - auto_after_prev → Starts when the previous activity is completed
  - condition_met   → Starts when a metric condition is satisfied
"""

from __future__ import annotations
from typing import Any


def should_auto_start(
    activity: dict[str, Any],
    all_activities: list[dict[str, Any]],
    energy_pct: float | None = None,
) -> bool:
    """
    Determine if an activity should auto-start based on its trigger configuration.

    Args:
        activity: The activity to evaluate
        all_activities: All activities for the event (sorted by position)
        energy_pct: Current energy bar percentage (0-100)

    Returns:
        True if the activity should be activated automatically
    """
    trigger_type = activity.get("trigger_type", "manual")

    if trigger_type == "manual":
        return False

    if trigger_type == "auto_after_prev":
        my_position = activity.get("position", 0)
        # Find the activity with position = my_position - 1
        prev = next(
            (a for a in all_activities if a.get("position") == my_position - 1),
            None,
        )
        return prev is not None and prev.get("status") == "completed"

    if trigger_type == "condition_met":
        trigger_config = activity.get("trigger_config") or {}
        metric = trigger_config.get("metric")
        op = trigger_config.get("op", ">=")
        value = trigger_config.get("value", 100)

        if metric == "pct" and energy_pct is not None:
            return _evaluate(energy_pct, op, value)

    return False


def _evaluate(actual: float, op: str, threshold: float) -> bool:
    ops = {
        ">=": actual >= threshold,
        ">": actual > threshold,
        "<=": actual <= threshold,
        "<": actual < threshold,
        "==": actual == threshold,
    }
    return ops.get(op, False)
