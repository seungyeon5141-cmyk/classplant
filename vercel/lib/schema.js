// Postgres version of drizzle/0000~0004 (same tables and columns as the D1 schema).
export const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS projects (
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
    updated_at TEXT NOT NULL,
    grow_type TEXT NOT NULL DEFAULT 'individual',
    group_name TEXT NOT NULL DEFAULT '',
    member_names TEXT NOT NULL DEFAULT '',
    owner_role TEXT NOT NULL DEFAULT 'student',
    cover_key TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS observations (
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
  )`,
  `CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY NOT NULL,
    class_code TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
    pin_salt TEXT NOT NULL,
    pin_hash TEXT NOT NULL,
    must_change_pin INTEGER NOT NULL DEFAULT 1,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    UNIQUE (class_code, name, role)
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_projects_class_student ON projects(class_code, student_name, updated_at)`,
  `CREATE INDEX IF NOT EXISTS idx_projects_class_group ON projects(class_code, grow_type, group_name, updated_at)`,
  `CREATE INDEX IF NOT EXISTS idx_observations_project_date ON observations(project_id, observed_at, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_accounts_class_role ON accounts(class_code, role, name)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_account ON sessions(account_id, expires_at)`,
];

// Run on every cold start so databases created before a change get the new columns (drizzle/0003~).
export const SCHEMA_UPGRADES = [
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS owner_role TEXT NOT NULL DEFAULT 'student'`,
  `ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_key TEXT`,
];
