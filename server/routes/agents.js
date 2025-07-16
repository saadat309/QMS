const express = require("express");
const { getAgents, addAgent } = require("../controllers/agent.controllers");
const router = express.Router();

router.post("/getAgents", getAgents);
router.post("/addAgent", addAgent);

module.exports = router;
