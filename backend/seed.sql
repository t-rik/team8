-- Insert Users
INSERT INTO users (id, login, level, blackholed_at, image_url) VALUES 
(1, 'current_user', 5.5, '2026-02-01', 'https://avatar.code.org/1'),
(2, 'match_maker', 5.6, '2026-03-01', 'https://avatar.code.org/2'), -- Good Match (Same Project, Close Level)
(3, 'expert_deviant', 12.0, '2026-06-01', 'https://avatar.code.org/3'), -- Same Project, Level too high
(4, 'busy_bee', 4.0, '2026-02-01', 'https://avatar.code.org/4'); -- Different Project

-- Insert Projects (User 1 wants Minishell)
INSERT INTO active_projects (user_id, project_id, project_name, status, looking_for_match) VALUES
(1, 42, 'Minishell', 'in_progress', 1),
(1, 21, 'NetPractice', 'finished', 0); 

-- User 2 wants Minishell too (Match!)
INSERT INTO active_projects (user_id, project_id, project_name, status, looking_for_match) VALUES
(2, 42, 'Minishell', 'searching', 1);

-- User 3 wants Minishell (Match, but skill gap)
INSERT INTO active_projects (user_id, project_id, project_name, status, looking_for_match) VALUES
(3, 42, 'Minishell', 'in_progress', 1);

-- User 4 wants Cub3d (No match)
INSERT INTO active_projects (user_id, project_id, project_name, status, looking_for_match) VALUES
(4, 43, 'Cub3d', 'searching', 1);
