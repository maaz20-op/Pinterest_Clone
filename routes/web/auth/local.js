const express = require("express");
const router = express.Router();
const { signupUser, loginUser, logoutUser, forgotPassword, sendOTP, getEmailForVerification, getAccessToken } = require("../../../controller/auth/localController.js");
const loginLimiter = require("../../../middlewares/loginRequestLimiter.js");
const registerLimiter = require("../../../middlewares/registerRequestLimiter.js");
const webRouteResFormate = require("../../../utils/webRoute");
const isLoggedIn = require("../../../middlewares/isLoggedIn.js");

// for authentication & authorization
router.post("/register",  webRouteResFormate('/profile', '/register', 'Account Created Successfully!', signupUser));

router.post("/login",  webRouteResFormate('/profile', '/register', 'Successfully Logined!', loginUser));


router.post("/sendOTP", sendOTP);

router.get('/getAccessToken', webRouteResFormate('', '/register', '', getAccessToken));

// getting verification email for forgot password
router.post("/getVerificationEmail",  webRouteResFormate('/forgotpassword', '/enterEmailForOTP', 'Enter 4 digit OTP', getEmailForVerification));

router.post("/forgotpassword", webRouteResFormate('/profile', '/forgotpassword', 'Successfully Logined!', forgotPassword));

router.get("/logout", webRouteResFormate("/register", "/", "You Logout Successfully!", logoutUser));


module.exports = router;
