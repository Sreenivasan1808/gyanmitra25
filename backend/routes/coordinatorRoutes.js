const coordinatorController = require("../controllers/coordinatorController");
const express = require("express");
const pdf=require("../pdf")

const router = express.Router();
router.patch("/editwinners",coordinatorController.editWinners)
router.post("/uploadwinners",coordinatorController.uploadWinners)
router.get("/getwinners",coordinatorController.getWinners)
router.get("/get-collegewise-participants", coordinatorController.getParticipantsCollegeWise);
router.get("/getcollegelist", coordinatorController.getCollegeList);
router.get("/getdepartmentlist", coordinatorController.getUniqueDepartments);
router.get("/participants-pdf",pdf.getCollegeWisePdf)
router.get("/getdepartmentlist-workshop", coordinatorController.getUniqueDepartmentsWorkshop);
router.put("/updatePayment",coordinatorController.updatePayment)
router.put("/deleteEventAttendance",coordinatorController.deleteAttendance)
router.put("/deleteWorkshopAttendance",coordinatorController.deleteWorkshopAttendance)
router.get("/daywise-payment",coordinatorController.getDayWisePaymentDetails)
module.exports = router;