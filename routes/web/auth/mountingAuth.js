const express = require("express");
const router = express.Router();

router.use("/local", require("./local"));
router.use("/google", require("./google"));

module.exports = router;