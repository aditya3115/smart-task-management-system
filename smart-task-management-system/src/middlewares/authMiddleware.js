const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/apiResponse");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Authentication token is required");
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch (error) {
    return errorResponse(res, 401, "Invalid or expired authentication token");
  }
};

module.exports = authenticate;
