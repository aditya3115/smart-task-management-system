CREATE DATABASE IF NOT EXISTS smart_task_management_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_task_management_system;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  password_reset_token VARCHAR(255) DEFAULT NULL,
  password_reset_expires_at DATETIME DEFAULT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tasks (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  due_date DATE NULL,
  completed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_user_id (user_id),
  KEY idx_tasks_status (status),
  KEY idx_tasks_priority (priority),
  KEY idx_tasks_category (category),
  KEY idx_tasks_due_date (due_date),
  KEY idx_tasks_user_status (user_id, status),
  KEY idx_tasks_user_priority (user_id, priority),
  KEY idx_tasks_user_category (user_id, category),
  KEY idx_tasks_user_due_date (user_id, due_date),
  FULLTEXT KEY ft_tasks_search (title, description, category),
  CONSTRAINT fk_tasks_user_id
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE events (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  category VARCHAR(80) NOT NULL DEFAULT 'General',
  location VARCHAR(150) DEFAULT NULL,
  event_date DATE DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_events_user_id (user_id),
  KEY idx_events_status (status),
  KEY idx_events_category (category),
  KEY idx_events_event_date (event_date),
  CONSTRAINT fk_events_user_id
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', '$2b$12$9Y4qhwiRUux9xL0w39wTU.RzRkSOESsNTOd5JEGvLyXj2NyYyB.Im', 'admin'),
('Aditya Sharma', 'aditya@example.com', '$2b$12$9Y4qhwiRUux9xL0w39wTU.RzRkSOESsNTOd5JEGvLyXj2NyYyB.Im', 'user'),
('Demo User', 'demo@example.com', '$2b$12$9Y4qhwiRUux9xL0w39wTU.RzRkSOESsNTOd5JEGvLyXj2NyYyB.Im', 'user');

INSERT INTO tasks (user_id, title, description, status, priority, category, due_date, completed_at) VALUES
(2, 'Prepare MCA project synopsis', 'Write the project introduction, objectives, scope, and modules.', 'completed', 'high', 'Academics', '2026-07-05', CURRENT_TIMESTAMP),
(2, 'Design task dashboard', 'Create a dashboard layout for task counts, filters, and recent activities.', 'in_progress', 'high', 'Development', '2026-07-12', NULL),
(2, 'Create API documentation', 'Document auth and task REST API endpoints with sample requests.', 'pending', 'medium', 'Documentation', '2026-07-15', NULL),
(3, 'Review assigned tasks', 'Check all pending tasks and update their current status.', 'pending', 'medium', 'Work', '2026-07-10', NULL),
(3, 'Submit weekly report', 'Prepare a short progress report for the project guide.', 'pending', 'low', 'Academics', '2026-07-18', NULL);
