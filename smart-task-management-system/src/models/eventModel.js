const { pool } = require("../config/db");

const allowedSortColumns = {
  createdAt: "created_at",
  updatedAt: "updated_at",
  eventDate: "event_date",
  category: "category",
  status: "status",
  title: "title",
};

const createEvent = async ({ userId, title, description, status, category, location, eventDate }) => {
  const [result] = await pool.execute(
    `INSERT INTO events (user_id, title, description, status, category, location, event_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      title,
      description || null,
      status || "scheduled",
      category || "General",
      location || null,
      eventDate || null,
    ]
  );

  return findEventById(result.insertId, userId);
};

const findEventsByUserId = async (userId, filters = {}) => {
  const conditions = ["user_id = ?"];
  const values = [userId];
  const sortBy = allowedSortColumns[filters.sortBy] || "event_date";
  const sortOrder = filters.sortOrder === "asc" ? "ASC" : "DESC";

  if (filters.status) {
    conditions.push("status = ?");
    values.push(filters.status);
  }

  if (filters.category) {
    conditions.push("category = ?");
    values.push(filters.category);
  }

  if (filters.eventDateBefore) {
    conditions.push("event_date <= ?");
    values.push(filters.eventDateBefore);
  }

  if (filters.eventDateAfter) {
    conditions.push("event_date >= ?");
    values.push(filters.eventDateAfter);
  }

  if (filters.search) {
    conditions.push("(title LIKE ? OR description LIKE ? OR category LIKE ? OR location LIKE ?)");
    const searchTerm = `%${filters.search}%`;
    values.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  const [rows] = await pool.execute(
    `SELECT id, user_id, title, description, status, category, location, event_date, created_at, updated_at
     FROM events
     WHERE ${conditions.join(" AND ")}
     ORDER BY ${sortBy} ${sortOrder}`,
    values
  );

  return rows;
};

const findEventById = async (id, userId) => {
  const [rows] = await pool.execute(
    `SELECT id, user_id, title, description, status, category, location, event_date, created_at, updated_at
     FROM events
     WHERE id = ? AND user_id = ?
     LIMIT 1`,
    [id, userId]
  );

  return rows[0] || null;
};

const updateEvent = async (id, userId, data) => {
  const fields = [];
  const values = [];

  Object.entries({
    title: data.title,
    description: data.description,
    status: data.status,
    category: data.category,
    location: data.location,
    event_date: data.eventDate,
  }).forEach(([field, value]) => {
    if (value !== undefined) {
      fields.push(`${field} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return findEventById(id, userId);
  }

  values.push(id, userId);

  await pool.execute(
    `UPDATE events SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    values
  );

  return findEventById(id, userId);
};

const deleteEvent = async (id, userId) => {
  const [result] = await pool.execute("DELETE FROM events WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
};

module.exports = {
  createEvent,
  findEventsByUserId,
  findEventById,
  updateEvent,
  deleteEvent,
};
