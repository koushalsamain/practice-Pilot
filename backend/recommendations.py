
from datetime import date


def get_recommendations(event, tasks):
    recommendations = []

    target = event["registration_target"]
    current = event["current_registrations"]

    if target > 0:
        gap = max(target - current, 0)
        progress = (current / target) * 100

        if gap > 0:
            if event["event_date"] < date.today().isoformat():
                priority = "high"
                reason = "The event date has passed and the target was not reached."
            else:
                priority = "high" if progress < 50 else "medium"
                reason = f"{gap} registrations are still needed to reach the target."

            recommendations.append({
                "type": "registration_gap",
                "title": "Improve event registrations",
                "reason": reason,
                "suggested_action": (
                    "Review outreach, contact interested participants, "
                    "and check registration conversion."
                ),
                "priority": priority
            })

    today = date.today().isoformat()

    for task in tasks:
        if task["status"] != "completed" and task["due_date"] < today:
            recommendations.append({
                "type": "overdue_task",
                "title": f"Overdue task: {task['title']}",
                "reason": f"Task deadline was {task['due_date']}.",
                "suggested_action": (
                    "Contact the task owner, review the blocker, "
                    "and agree on a revised deadline."
                ),
                "priority": "high"
            })

    for task in tasks:
        if task["status"] != "completed" and task["priority"] == "high":
            recommendations.append({
                "type": "high_priority_task",
                "title": f"Review task: {task['title']}",
                "reason": f"Current task status is {task['status']}.",
                "suggested_action": (
                    "Check progress with the assigned owner "
                    "and resolve blockers."
                ),
                "priority": "high"
            })

    return recommendations
