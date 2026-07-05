const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
  user: process.env.DB_USER || process.env.MYSQLUSER || "root",
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "",
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || "smart_task_management_system",
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connection successful");
    connection.release();
  } catch (error) {
    console.warn("MySQL database connection skipped:", error.message);
    console.warn("Server will start, but database features need valid .env settings and a running MySQL server.");
  }
};

const ensureUsersTable = async () => {
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS users (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
};

const ensureTasksTable = async () => {
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS tasks (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
};

const ensureEventsTable = async () => {
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS events (
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
      CONSTRAINT fk_events_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
};

const seedDefaultUsers = async () => {
  const passwordHash = "$2b$12$9Y4qhwiRUux9xL0w39wTU.RzRkSOESsNTOd5JEGvLyXj2NyYyB.Im";

  await pool.execute(
    `INSERT IGNORE INTO users (name, email, password_hash, role) VALUES
      ('Admin User', 'admin@example.com', ?, 'admin'),
      ('Aditya Sharma', 'aditya@example.com', ?, 'user'),
      ('Demo User', 'demo@example.com', ?, 'user')`,
    [passwordHash, passwordHash, passwordHash]
  );
};

const ensureDatabaseSchema = async () => {
  await ensureUsersTable();
  await ensureTasksTable();
  await ensureEventsTable();
  await seedDefaultUsers();
};

module.exports = {
  pool,
  testConnection,
  ensureDatabaseSchema,
  ensureEventsTable,
};
