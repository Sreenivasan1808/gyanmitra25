const workshopController = require("../controllers/workshopController");
const express = require("express");
const router = express.Router();
router.get("/getallworkshopbydepartment",workshopController.getAllWorkshopByDepartment)
router.get("/getworkshopdetailsbyid",workshopController.getWorkshopDetailsById)
module.exports = router;
