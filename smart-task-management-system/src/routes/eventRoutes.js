const express = require("express");

const eventController = require("../controllers/eventController");
const authenticate = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  eventIdValidator,
  createEventValidator,
  updateEventValidator,
  eventFilterValidator,
} = require("../validators/eventValidator");

const router = express.Router();

router.use(authenticate);

router
  .route("/")
  .get(eventFilterValidator, validateRequest, eventController.getEvents)
  .post(createEventValidator, validateRequest, eventController.createEvent);

router
  .route("/:id")
  .get(eventIdValidator, validateRequest, eventController.getEvent)
  .put(updateEventValidator, validateRequest, eventController.updateEvent)
  .delete(eventIdValidator, validateRequest, eventController.deleteEvent);

module.exports = router;
