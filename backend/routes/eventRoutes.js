const eventController = require("../controllers/eventsController");
const coordinatorController = require("../controllers/coordinatorController");
const express = require("express");
const router = express.Router();
const pdf=require("../pdf")

router.get("/getalleventbydepartment", eventController.getAllEventsByDepartment);
router.get("/geteventdetailsbyid", eventController.getEventDetailsById);
router.get("/getdomainwisewinners",pdf.getDomainWiseWinnersPdf)
router.get("/getallwinners",pdf.getAllPdf)
router.get("/getdomainwisewinnersdata",coordinatorController.getDomainWiseWinnersData)
router.post("/approvewinners",coordinatorController.approveEventWinner)

module.exports = router;
