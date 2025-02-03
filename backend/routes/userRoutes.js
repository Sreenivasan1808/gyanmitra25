const userController = require("../controllers/userController");
const express = require("express");
const gform = require("../googleForms")
const excel = require("../excel");
const router = express.Router();
router.get("/getAllParticipants", userController.getAllParticipants);
router.get("/getAllWorkshopParticipants", userController.getAllWorkshopParticipants);
router.get("/getParticipantDetails", userController.getDetails);
router.post("/markAttendance", userController.markAttendence);
router.get("/attendancedownload", excel.attendanceDownload);
router.get("/workshopattendancedownload",excel.workshopAttendanceDownload)
router.get("/getattendancedetails",userController.getAttendanceDetails)
router.post("/markworkshopattendance",userController.markWorkshopAttendance)
router.get("/getregistrationdetails",gform.getDetails)
router.post("/deleteregistrationdetails",gform.deleteRowByEmail)
router.post("/approve",gform.approveParticipants),
router.patch("/updateParticipantData",userController.updateParticipantData)

module.exports = router;
