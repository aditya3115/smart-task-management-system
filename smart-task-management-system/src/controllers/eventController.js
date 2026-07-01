const Event = require("../models/eventModel");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const createEvent = async (req, res, next) => {
  try {
    const event = await Event.createEvent({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      category: req.body.category,
      location: req.body.location,
      eventDate: req.body.eventDate,
    });

    return successResponse(res, 201, "Event created successfully", { event });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.findEventsByUserId(req.user.id, {
      status: req.query.status,
      category: req.query.category,
      eventDateBefore: req.query.eventDateBefore,
      eventDateAfter: req.query.eventDateAfter,
      search: req.query.search,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    });

    return successResponse(res, 200, "Events fetched successfully", { events });
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findEventById(req.params.id, req.user.id);

    if (!event) {
      return errorResponse(res, 404, "Event not found");
    }

    return successResponse(res, 200, "Event fetched successfully", { event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const existingEvent = await Event.findEventById(req.params.id, req.user.id);

    if (!existingEvent) {
      return errorResponse(res, 404, "Event not found");
    }

    const event = await Event.updateEvent(req.params.id, req.user.id, {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      category: req.body.category,
      location: req.body.location,
      eventDate: req.body.eventDate,
    });

    return successResponse(res, 200, "Event updated successfully", { event });
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const deleted = await Event.deleteEvent(req.params.id, req.user.id);

    if (!deleted) {
      return errorResponse(res, 404, "Event not found");
    }

    return successResponse(res, 200, "Event deleted successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
