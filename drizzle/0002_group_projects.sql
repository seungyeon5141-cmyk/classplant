ALTER TABLE projects ADD COLUMN grow_type TEXT NOT NULL DEFAULT 'individual';
ALTER TABLE projects ADD COLUMN group_name TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN member_names TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_projects_class_group
ON projects(class_code, grow_type, group_name, updated_at);

PRAGMA optimize;
