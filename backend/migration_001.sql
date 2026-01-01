-- Add Unique constraint to allow ON CONFLICT upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_projects_user_project ON active_projects(user_id, project_id);
