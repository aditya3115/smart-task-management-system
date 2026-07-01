const { pool } = require("../config/db");

const createUser = async ({ name, email, passwordHash }) => {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );

  return {
    id: result.insertId,
    name,
    email,
  };
};

const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
};

const findUserById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
};

const setPasswordResetToken = async (id, token, expiresAt) => {
  await pool.execute(
    "UPDATE users SET password_reset_token = ?, password_reset_expires_at = ? WHERE id = ?",
    [token, expiresAt, id]
  );
};

const findUserByResetToken = async (token) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, role, password_reset_token, password_reset_expires_at FROM users WHERE password_reset_token = ? LIMIT 1",
    [token]
  );

  return rows[0] || null;
};

const updatePassword = async (id, passwordHash) => {
  await pool.execute(
    "UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires_at = NULL WHERE id = ?",
    [passwordHash, id]
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  setPasswordResetToken,
  findUserByResetToken,
  updatePassword,
};
