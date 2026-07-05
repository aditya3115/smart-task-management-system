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

module.exports = {
  pool,
  testConnection,
  ensureEventsTable,
};
