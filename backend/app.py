
from datetime import date
from flask import Flask, jsonify, request
from flask_cors import CORS

from database import get_connection, init_db, row_to_dict
from recommendations import get_recommendations

app = Flask(__name__)
CORS(app)

init_db()


def get_event(event_id):
    with get_connection() as connection:
        row = connection.execute(
            "SELECT * FROM events WHERE id = ?",
            (event_id,)
        ).fetchone()

    return row_to_dict(row)


def get_event_tasks(event_id):
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM tasks WHERE event_id = ? ORDER BY id DESC",
            (event_id,)
        ).fetchall()

    return [row_to_dict(row) for row in rows]


@app.get("/api/health")
def health():
    return jsonify({
        "app": "EventPilot",
        "status": "running"
    })


@app.post("/api/events")
def create_event():
    data = request.get_json(silent=True) or {}

    required = [
        "name", "event_type", "event_date", "venue"
    ]

    missing = [
        field for field in required
        if not str(data.get(field, "")).strip()
    ]

    if missing:
        return jsonify({
            "error": "Required fields are missing",
            "fields": missing
        }), 400

    try:
        target = int(data.get("registration_target", 0))
        current = int(data.get("current_registrations", 0))
        sponsor_target = float(data.get("sponsorship_target", 0))
        sponsor_current = float(data.get("current_sponsorship", 0))
    except (ValueError, TypeError):
        return jsonify({
            "error": "Registration values must be integers and sponsorship values must be numbers."
        }), 400

    if min(target, current, sponsor_target, sponsor_current) < 0:
        return jsonify({"error": "Values cannot be negative"}), 400

    try:
        date.fromisoformat(data["event_date"])
    except ValueError:
        return jsonify({
            "error": "event_date must use YYYY-MM-DD format"
        }), 400

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO events (
                name, event_type, event_date, venue,
                registration_target, current_registrations,
                sponsorship_target, current_sponsorship
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["name"].strip(),
                data["event_type"].strip(),
                data["event_date"],
                data["venue"].strip(),
                target,
                current,
                sponsor_target,
                sponsor_current
            )
        )

        event_id = cursor.lastrowid

    return jsonify({
        "message": "Event created successfully",
        "event": get_event(event_id)
    }), 201


@app.get("/api/events")
def list_events():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM events ORDER BY id DESC"
        ).fetchall()

    return jsonify({
        "events": [row_to_dict(row) for row in rows]
    })


@app.get("/api/events/<int:event_id>")
def event_details(event_id):
    event = get_event(event_id)

    if event is None:
        return jsonify({"error": "Event not found"}), 404

    return jsonify({"event": event})


@app.post("/api/events/<int:event_id>/tasks")
def create_task(event_id):
    event = get_event(event_id)

    if event is None:
        return jsonify({"error": "Event not found"}), 404

    data = request.get_json(silent=True) or {}

    required = ["title", "owner", "due_date"]
    missing = [
        field for field in required
        if not str(data.get(field, "")).strip()
    ]

    if missing:
        return jsonify({
            "error": "Required fields are missing",
            "fields": missing
        }), 400

    priority = data.get("priority", "medium").lower()

    if priority not in ["low", "medium", "high"]:
        return jsonify({
            "error": "Priority must be low, medium or high"
        }), 400

    try:
        date.fromisoformat(data["due_date"])
    except ValueError:
        return jsonify({
            "error": "due_date must use YYYY-MM-DD format"
        }), 400

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO tasks (
                event_id, title, description, owner,
                priority, due_date, status
            )
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
            """,
            (
                event_id,
                data["title"].strip(),
                data.get("description", "").strip(),
                data["owner"].strip(),
                priority,
                data["due_date"]
            )
        )

        task_id = cursor.lastrowid

        row = connection.execute(
            "SELECT * FROM tasks WHERE id = ?",
            (task_id,)
        ).fetchone()

    return jsonify({
        "message": "Task created successfully",
        "task": row_to_dict(row)
    }), 201


@app.get("/api/events/<int:event_id>/tasks")
def list_tasks(event_id):
    if get_event(event_id) is None:
        return jsonify({"error": "Event not found"}), 404

    return jsonify({
        "tasks": get_event_tasks(event_id)
    })


@app.patch("/api/tasks/<int:task_id>")
def update_task(task_id):
    data = request.get_json(silent=True) or {}

    allowed = {"title", "description", "owner", "priority", "due_date", "status"}
    unknown = set(data.keys()) - allowed

    if unknown:
        return jsonify({
            "error": "Unsupported fields",
            "fields": sorted(unknown)
        }), 400

    if not data:
        return jsonify({"error": "No fields provided"}), 400

    with get_connection() as connection:
        existing = connection.execute(
            "SELECT * FROM tasks WHERE id = ?",
            (task_id,)
        ).fetchone()

        if existing is None:
            return jsonify({"error": "Task not found"}), 404

        if "priority" in data and data["priority"] not in [
            "low", "medium", "high"
        ]:
            return jsonify({"error": "Invalid priority"}), 400

        if "status" in data and data["status"] not in [
            "pending", "in_progress", "completed"
        ]:
            return jsonify({"error": "Invalid status"}), 400

        if "due_date" in data:
            try:
                date.fromisoformat(data["due_date"])
            except (ValueError, TypeError):
                return jsonify({
                    "error": "due_date must use YYYY-MM-DD format"
                }), 400

        updates = ", ".join(f"{key} = ?" for key in data)
        values = list(data.values()) + [task_id]

        connection.execute(
            f"UPDATE tasks SET {updates} WHERE id = ?",
            values
        )

        row = connection.execute(
            "SELECT * FROM tasks WHERE id = ?",
            (task_id,)
        ).fetchone()

    return jsonify({
        "message": "Task updated successfully",
        "task": row_to_dict(row)
    })


@app.get("/api/dashboard")
def dashboard():
    event_id = request.args.get("event_id", type=int)

    with get_connection() as connection:
        if event_id is None:
            event_row = connection.execute(
                "SELECT * FROM events ORDER BY id DESC LIMIT 1"
            ).fetchone()
        else:
            event_row = connection.execute(
                "SELECT * FROM events WHERE id = ?",
                (event_id,)
            ).fetchone()

        if event_row is None:
            return jsonify({
                "error": "No event found. Create an event first."
            }), 404

        event = row_to_dict(event_row)

        task_rows = connection.execute(
            "SELECT * FROM tasks WHERE event_id = ?",
            (event["id"],)
        ).fetchall()

        tasks = [row_to_dict(row) for row in task_rows]

    total_tasks = len(tasks)
    completed = sum(
        task["status"] == "completed" for task in tasks
    )
    in_progress = sum(
        task["status"] == "in_progress" for task in tasks
    )
    pending = sum(
        task["status"] == "pending" for task in tasks
    )

    target = event["registration_target"]
    current = event["current_registrations"]
    sponsor_target = event["sponsorship_target"]
    sponsor_current = event["current_sponsorship"]

    registration_progress = (
        round(current / target * 100, 2) if target > 0 else 0
    )

    sponsorship_progress = (
        round(sponsor_current / sponsor_target * 100, 2)
        if sponsor_target > 0 else 0
    )

    recommendations = get_recommendations(event, tasks)

    return jsonify({
        "event": event,
        "metrics": {
            "registration_progress": registration_progress,
            "registration_gap": max(target - current, 0),
            "sponsorship_progress": sponsorship_progress,
            "total_tasks": total_tasks,
            "completed_tasks": completed,
            "in_progress_tasks": in_progress,
            "pending_tasks": pending
        },
        "alerts": recommendations,
        "recommendations": recommendations,
        "recent_tasks": sorted(
            tasks,
            key=lambda task: task["id"],
            reverse=True
        )[:5]
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
