const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const pinModel = require("../models/pin-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { savePin } = require("../controllers/userController");
const { deletePin } = require("../controllers/userController");


router.post("/savepin", isLoggedIn, savePin);

router.post("/deletepin/:id", isLoggedIn,deletePin)

module.exports = router;






