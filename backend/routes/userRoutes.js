const userController = require("../controllers/userController");
const express = require("express");
const excel = require("../excel");
const router = express.Router();
router.get("/getAllParticipants", userController.getAllParticipants);
router.get("/getParticipantDetails", userController.getDetails);
router.post("/markAttendance", userController.markAttendence);
router.get("/attendancedownload", excel.attendanceDownload);
module.exports = router;
