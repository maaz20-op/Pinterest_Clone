const express = require("express");
const router = express.Router();
const { signupUser, loginUser, logoutUser, forgotPassword, sendOTP, getEmailForVerification, getAccessToken } = require("../../../../controller/auth/localController.js");
const loginLimiter = require("../../../../middlewares/loginRequestLimiter.js");
const registerLimiter = require("../../../../middlewares/registerRequestLimiter.js");
const apiRouteResFormate = require("../../../../utils/ApiRoute");


// for authentication & authorization
router.post("/signup", registerLimiter, apiRouteResFormate(signupUser));

router.post("/login",  apiRouteResFormate(loginUser));

router.post("/OTP", apiRouteResFormate(sendOTP));

router.post('/refresh', apiRouteResFormate(getAccessToken));

// getting verification email for forgot password
router.post("/verify-email", apiRouteResFormate(getEmailForVerification));

router.post("/forgot-password", apiRouteResFormate(forgotPassword));

router.post("/logout", apiRouteResFormate(logoutUser));


module.exports = router;
