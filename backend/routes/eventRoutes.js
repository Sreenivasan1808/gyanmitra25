const eventController = require("../controllers/eventsController");
const express = require("express");
const router = express.Router();

router.get("/getalleventbydepartment", eventController.getAllEventsByDepartment);
router.get("/geteventdetailsbyid", eventController.getEventDetailsById);

module.exports = router;
