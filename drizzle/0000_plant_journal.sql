CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY NOT NULL,
  class_code TEXT NOT NULL,
  student_name TEXT NOT NULL,
  plant_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  target_date TEXT,
  growing_location TEXT DEFAULT '' NOT NULL,
  supplies TEXT DEFAULT '' NOT NULL,
  season_note TEXT DEFAULT '' NOT NULL,
  environment_note TEXT DEFAULT '' NOT NULL,
  commitment TEXT DEFAULT '' NOT NULL,
  harvest_use TEXT DEFAULT '' NOT NULL,
  problems TEXT DEFAULT '' NOT NULL,
  reflection TEXT DEFAULT '' NOT NULL,
  next_time TEXT DEFAULT '' NOT NULL,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS observations (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  observed_at TEXT NOT NULL,
  weather TEXT DEFAULT '' NOT NULL,
  title TEXT NOT NULL,
  note TEXT NOT NULL,
  changes TEXT DEFAULT '' NOT NULL,
  height_cm REAL,
  leaf_count INTEGER,
  photo_key TEXT,
  photo_name TEXT,
  photo_type TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_class_student
ON projects(class_code, student_name, updated_at);

CREATE INDEX IF NOT EXISTS idx_observations_project_date
ON observations(project_id, observed_at, created_at);

PRAGMA optimize;
