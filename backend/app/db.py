import sqlite3
from pathlib import Path
from app.config import settings


def get_connection(db_path: str | None = None) -> sqlite3.Connection:
    path = db_path or settings.database_path
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path, timeout=5.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db(db_path: str | None = None) -> None:
    """Initialize SQLite schema. Never stores user replies or transcripts."""
    with get_connection(db_path) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                language TEXT NOT NULL DEFAULT 'en',
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS progress_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                scenario_id TEXT NOT NULL,
                outcome TEXT NOT NULL,
                safe_count INTEGER NOT NULL DEFAULT 0,
                risky_count INTEGER NOT NULL DEFAULT 0,
                compromised_count INTEGER NOT NULL DEFAULT 0,
                completed_at TEXT NOT NULL,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_progress_session
                ON progress_events(session_id, completed_at);
            """
        )
