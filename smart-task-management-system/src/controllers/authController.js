const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findUserByEmail(email);

    if (existingUser) {
      return errorResponse(res, 409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.createUser({ name, email, passwordHash });
    const token = generateToken({ id: user.id, email: user.email, role: "user" });

    return successResponse(res, 201, "User registered successfully", {
      user: normalizeUser({ ...user, role: "user" }),
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);

    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return successResponse(res, 200, "Login successful", {
      user: normalizeUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await User.findUserById(req.user.id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "Profile fetched successfully", {
      user: normalizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findUserByEmail(email);

    if (user) {
      const resetToken = crypto.randomBytes(24).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await User.setPasswordResetToken(user.id, resetToken, expiresAt);

      if (process.env.NODE_ENV !== "production") {
        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password.html?token=${resetToken}`;
        return successResponse(res, 200, "If an account with that email exists, password reset instructions have been sent.", { resetUrl });
      }
    }

    return successResponse(res, 200, "If an account with that email exists, password reset instructions have been sent.");
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findUserByResetToken(token);

    if (!user || !user.password_reset_expires_at || new Date(user.password_reset_expires_at) < new Date()) {
      return errorResponse(res, 400, "Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.updatePassword(user.id, passwordHash);

    return successResponse(res, 200, "Password has been reset successfully.");
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    return successResponse(res, 200, "Logout successful. Please remove the token from client storage.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  profile,
  logout,
  forgotPassword,
  resetPassword,
};
