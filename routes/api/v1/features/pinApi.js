const express = require("express");
const router = express.Router();
const userModel = require("../../../../models/user-model");
const pinModel = require("../../../../models/pin-model");
const isLoggedIn = require("../../../../middlewares/isLoggedIn");
const { savePin, deletePin } = require("../../../../controller/app/pin");
const apiRouteResFormate = require("../../../../utils/ApiRoute");

router.post("/", isLoggedIn, apiRouteResFormate(savePin));
router.delete("/:id", isLoggedIn, apiRouteResFormate(deletePin));

module.exports = router;






