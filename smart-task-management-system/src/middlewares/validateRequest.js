const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/apiResponse");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, 422, "Validation failed", errors.array());
  }

  next();
};

module.exports = validateRequest;
