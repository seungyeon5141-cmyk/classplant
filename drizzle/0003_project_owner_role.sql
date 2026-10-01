ALTER TABLE projects ADD COLUMN owner_role TEXT NOT NULL DEFAULT 'student';

PRAGMA optimize;
