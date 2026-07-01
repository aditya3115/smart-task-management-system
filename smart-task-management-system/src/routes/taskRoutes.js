const express = require("express");

const taskController = require("../controllers/taskController");
const authenticate = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  taskIdValidator,
  createTaskValidator,
  updateTaskValidator,
  taskFilterValidator,
} = require("../validators/taskValidator");

const router = express.Router();

router.use(authenticate);

router
  .route("/")
  .get(taskFilterValidator, validateRequest, taskController.getTasks)
  .post(createTaskValidator, validateRequest, taskController.createTask);

router
  .route("/:id")
  .get(taskIdValidator, validateRequest, taskController.getTask)
  .put(updateTaskValidator, validateRequest, taskController.updateTask)
  .delete(taskIdValidator, validateRequest, taskController.deleteTask);

router.patch("/:id/complete", taskIdValidator, validateRequest, taskController.completeTask);

module.exports = router;
