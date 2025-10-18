const express = require("express");
const router = express.Router();
const userModel = require("../../../models/user-model");
const pinModel = require("../../../models/pin-model");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const { savePin, deletePin } = require("../../../controller/app/pin");
const webRouteResFormate = require("../../../utils/webRoute");


router.post("/savepin", isLoggedIn, webRouteResFormate('/', '/', 'Saved your Pined Image!', savePin));

router.post("/deletepin/:id", isLoggedIn, webRouteResFormate('/showpins', '/showpins', 'Pined Image deleted successfully', deletePin))

module.exports = router;






