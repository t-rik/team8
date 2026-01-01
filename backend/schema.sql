DROP TABLE IF EXISTS active_projects;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  login TEXT NOT NULL,
  campus_id INTEGER,
  level REAL,
  blackholed_at TEXT,
  image_url TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE active_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  project_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'in_progress', 'searching', 'finished'
  looking_for_match BOOLEAN DEFAULT 1,
  has_team BOOLEAN DEFAULT 0,
  team_id INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_active_projects_user_id ON active_projects(user_id);
CREATE INDEX idx_active_projects_seeking ON active_projects(project_id, looking_for_match);
