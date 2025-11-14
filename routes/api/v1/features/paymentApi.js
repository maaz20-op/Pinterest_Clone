const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../../../middlewares/isLoggedIn");
const apiRouteResFormate  = require("../../../../utils/ApiRoute")
const { getPaymentFromUser } = require("../../../../controller/app/payment");


router.post("/", isLoggedIn, apiRouteResFormate(getPaymentFromUser));

module.exports = router;
