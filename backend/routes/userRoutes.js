const userController = require('../controllers/userController');
const express = require("express");
const router = express.Router();

router.get("/getParticipantDetails", userController.getDetails);
router.post("/markAttendance", userController.markAttendence);

module.exports = router;