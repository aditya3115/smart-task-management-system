const { body, param, query } = require("express-validator");

const allowedStatuses = ["scheduled", "completed", "cancelled"];
const allowedSortFields = ["createdAt", "updatedAt", "eventDate", "category", "status", "title"];
const allowedSortOrders = ["asc", "desc"];

const eventIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Event ID must be a positive number"),
];

const createEventValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Event title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Event title must be between 3 and 150 characters"),
  body("description").optional({ nullable: true }).trim(),
  body("status").optional().isIn(allowedStatuses).withMessage("Invalid event status"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Category must be between 2 and 80 characters"),
  body("location").optional().trim().isLength({ max: 150 }).withMessage("Location must be 150 characters or fewer"),
  body("eventDate").optional({ nullable: true }).isISO8601().withMessage("Event date must be a valid date"),
];

const updateEventValidator = [
  ...eventIdValidator,
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Event title must be between 3 and 150 characters"),
  body("description").optional({ nullable: true }).trim(),
  body("status").optional().isIn(allowedStatuses).withMessage("Invalid event status"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Category must be between 2 and 80 characters"),
  body("location").optional().trim().isLength({ max: 150 }).withMessage("Location must be 150 characters or fewer"),
  body("eventDate").optional({ nullable: true }).isISO8601().withMessage("Event date must be a valid date"),
];

const eventFilterValidator = [
  query("status").optional().isIn(allowedStatuses).withMessage("Invalid status filter"),
  query("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Category filter must be between 2 and 80 characters"),
  query("eventDateBefore").optional().isISO8601().withMessage("Event date before must be a valid date"),
  query("eventDateAfter").optional().isISO8601().withMessage("Event date after must be a valid date"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search must be between 2 and 100 characters"),
  query("sortBy").optional().isIn(allowedSortFields).withMessage("Invalid sort field"),
  query("sortOrder").optional().isIn(allowedSortOrders).withMessage("Invalid sort order"),
];

module.exports = {
  eventIdValidator,
  createEventValidator,
  updateEventValidator,
  eventFilterValidator,
};
