ALTER TABLE tasks
  ADD COLUMN category VARCHAR(80) NOT NULL DEFAULT 'General' AFTER priority,
  ADD KEY idx_tasks_category (category),
  ADD KEY idx_tasks_user_priority (user_id, priority),
  ADD KEY idx_tasks_user_category (user_id, category),
  ADD KEY idx_tasks_user_due_date (user_id, due_date),
  ADD FULLTEXT KEY ft_tasks_search (title, description, category);
