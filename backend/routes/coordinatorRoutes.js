const coordinatorController = require("../controllers/coordinatorController");
const express = require("express");

const router = express.Router();
router.post("/uploadwinners",coordinatorController.uploadWinners)
module.exports = router;