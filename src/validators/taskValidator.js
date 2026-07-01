const { body, param, query } = require("express-validator");

const allowedStatuses = ["pending", "in_progress", "completed"];
const allowedPriorities = ["low", "medium", "high"];
const allowedSortFields = ["createdAt", "updatedAt", "dueDate", "priority", "status", "title"];
const allowedSortOrders = ["asc", "desc"];

const taskIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Task ID must be a positive number"),
];

const createTaskValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Task title must be between 3 and 150 characters"),
  body("description").optional({ nullable: true }).trim(),
  body("status").optional().isIn(allowedStatuses).withMessage("Invalid task status"),
  body("priority").optional().isIn(allowedPriorities).withMessage("Invalid task priority"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Category must be between 2 and 80 characters"),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Due date must be a valid date"),
];

const updateTaskValidator = [
  ...taskIdValidator,
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage("Task title must be between 3 and 150 characters"),
  body("description").optional({ nullable: true }).trim(),
  body("status").optional().isIn(allowedStatuses).withMessage("Invalid task status"),
  body("priority").optional().isIn(allowedPriorities).withMessage("Invalid task priority"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Category must be between 2 and 80 characters"),
  body("dueDate").optional({ nullable: true }).isISO8601().withMessage("Due date must be a valid date"),
];

const taskFilterValidator = [
  query("status").optional().isIn(allowedStatuses).withMessage("Invalid status filter"),
  query("priority").optional().isIn(allowedPriorities).withMessage("Invalid priority filter"),
  query("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Category filter must be between 2 and 80 characters"),
  query("dueBefore").optional().isISO8601().withMessage("Due before must be a valid date"),
  query("dueAfter").optional().isISO8601().withMessage("Due after must be a valid date"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search must be between 2 and 100 characters"),
  query("sortBy").optional().isIn(allowedSortFields).withMessage("Invalid sort field"),
  query("sortOrder").optional().isIn(allowedSortOrders).withMessage("Invalid sort order"),
];

module.exports = {
  taskIdValidator,
  createTaskValidator,
  updateTaskValidator,
  taskFilterValidator,
};
