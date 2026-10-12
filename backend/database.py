
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "eventpilot.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_db():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                event_type TEXT NOT NULL,
                event_date TEXT NOT NULL,
                venue TEXT NOT NULL,
                registration_target INTEGER NOT NULL DEFAULT 0,
                current_registrations INTEGER NOT NULL DEFAULT 0,
                sponsorship_target REAL NOT NULL DEFAULT 0,
                current_sponsorship REAL NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)

        connection.execute("""
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                owner TEXT NOT NULL,
                priority TEXT NOT NULL DEFAULT 'medium',
                due_date TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id)
                    REFERENCES events(id)
                    ON DELETE CASCADE
            )
        """)


def row_to_dict(row):
    if row is None:
        return None

    return dict(row)
