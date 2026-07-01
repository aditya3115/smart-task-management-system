const Task = require("../models/taskModel");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createTask = async (req, res, next) => {
  try {
    const task = await Task.createTask({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      category: req.body.category,
      dueDate: req.body.dueDate,
    });

    return successResponse(res, 201, "Task created successfully", { task });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findTasksByUserId(req.user.id, {
      status: req.query.status,
      priority: req.query.priority,
      category: req.query.category,
      dueBefore: req.query.dueBefore,
      dueAfter: req.query.dueAfter,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    return successResponse(res, 200, "Tasks fetched successfully", { tasks });
  } catch (error) {
    next(error);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findTaskById(req.params.id, req.user.id);

    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }

    return successResponse(res, 200, "Task fetched successfully", { task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const existingTask = await Task.findTaskById(req.params.id, req.user.id);

    if (!existingTask) {
      return errorResponse(res, 404, "Task not found");
    }

    const task = await Task.updateTask(req.params.id, req.user.id, {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      category: req.body.category,
      dueDate: req.body.dueDate,
    });

    return successResponse(res, 200, "Task updated successfully", { task });
  } catch (error) {
    next(error);
  }
};

const completeTask = async (req, res, next) => {
  try {
    const existingTask = await Task.findTaskById(req.params.id, req.user.id);

    if (!existingTask) {
      return errorResponse(res, 404, "Task not found");
    }

    const task = await Task.completeTask(req.params.id, req.user.id);

    return successResponse(res, 200, "Task marked as completed", { task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const deleted = await Task.deleteTask(req.params.id, req.user.id);

    if (!deleted) {
      return errorResponse(res, 404, "Task not found");
    }

    return successResponse(res, 200, "Task deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  completeTask,
  deleteTask,
};
