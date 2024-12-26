const coordinatorController = require("../controllers/coordinatorController");
const express = require("express");

const router = express.Router();
router.post("/uploadwinners",coordinatorController.uploadWinners)
router.get("/getwinners",coordinatorController.getWinners)
module.exports = router;