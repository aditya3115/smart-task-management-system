const { pool } = require("../config/db");

const allowedSortColumns = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  dueDate: "due_date",
  priority: "priority",
  status: "status",
  title: "title",
};

const createTask = async ({ userId, title, description, status, priority, category, dueDate }) => {
  const [result] = await pool.execute(
    `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      title,
      description || null,
      status || "pending",
      priority || "medium",
      category || "General",
      dueDate || null,
    ]
  );

  return findTaskById(result.insertId, userId);
};

const findTasksByUserId = async (userId, filters = {}) => {
  const conditions = ["user_id = ?"];
  const values = [userId];
  const sortBy = allowedSortColumns[filters.sortBy] || "created_at";
  const sortOrder = filters.sortOrder === "asc" ? "ASC" : "DESC";

  if (filters.status) {
    conditions.push("status = ?");
    values.push(filters.status);
  }

  if (filters.priority) {
    conditions.push("priority = ?");
    values.push(filters.priority);
  }

  if (filters.category) {
    conditions.push("category = ?");
    values.push(filters.category);
  }

  if (filters.dueBefore) {
    conditions.push("due_date <= ?");
    values.push(filters.dueBefore);
  }

  if (filters.dueAfter) {
    conditions.push("due_date >= ?");
    values.push(filters.dueAfter);
  }

  if (filters.search) {
    conditions.push("(title LIKE ? OR description LIKE ? OR category LIKE ?)");
    const searchTerm = `%${filters.search}%`;
    values.push(searchTerm, searchTerm, searchTerm);
  }

  const [rows] = await pool.execute(
    `SELECT id, user_id, title, description, status, priority, category, due_date, completed_at, created_at, updated_at
     FROM tasks
     WHERE ${conditions.join(" AND ")}
     ORDER BY ${sortBy} ${sortOrder}`,
    values
  );

  return rows;
};

const findTaskById = async (id, userId) => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, title, description, status, priority, category, due_date, completed_at, created_at, updated_at
     FROM tasks
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId]
  );

  return rows[0] || null;
};

const updateTask = async (id, userId, data) => {
  const fields = [];
  const values = [];

  Object.entries({
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    category: data.category,
    due_date: data.dueDate,
    completed_at: data.status === "completed" ? new Date() : data.status && data.status !== "completed" ? null : data.completedAt,
  }).forEach(([field, value]) => {
    if (value !== undefined) {
      fields.push(`${field} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return findTaskById(id, userId);
  }

  values.push(id, userId);

  await pool.execute(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );

  return findTaskById(id, userId);
};

const completeTask = async (id, userId) => {
  await pool.execute(
    "UPDATE tasks SET status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
    ["completed", id, userId]
  );

  return findTaskById(id, userId);
};

const deleteTask = async (id, userId) => {
  const [result] = await pool.execute("DELETE FROM tasks WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
};

module.exports = {
  createTask,
  findTasksByUserId,
  findTaskById,
  updateTask,
  completeTask,
  deleteTask,
};
