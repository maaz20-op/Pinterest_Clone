const express = require("express");
const router = express.Router();
const { signupUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const { logoutUser } = require("../controllers/authController")
const isLoggedIn = require("../middlewares/isLoggedIn");
const { editprofpic } = require("../controllers/userController");
const upload = require("../config/multerConfig")
const { updateAccountSettings } = require("../controllers/userController");
const  { blockOtherUser } = require("../controllers/userController");
const  { unblockUser } = require("../controllers/userController");
const  { deleteAccount  } = require("../controllers/userController");
const  { followOtherUser  } = require("../controllers/followersController");
const  { unfollowOtherUser  } = require("../controllers/followersController");
const loginLimiter = require("../middlewares/loginRequestLimiter.js")
const registerLimiter = require("../middlewares/registerRequestLimiter.js");
const { forgotPassword } = require("../controllers/authController");
const { sendOTP } = require("../controllers/authController");
const { getEmailForVerification } = require("../controllers/authController");
const { getAccessToken } = require("../controllers/authController");


// for authentication & authorization
router.post("/register", registerLimiter, signupUser);

router.post("/login", loginUser);

router.post("/sendOTP", sendOTP);

router.get('/getAccessToken', getAccessToken)

// getting verification email for forgot password
router.post("/getVerificationEmail", getEmailForVerification);

router.post("/forgotpassword", forgotPassword);

router.get("/logout",logoutUser);

router.post("/deleteaccount", isLoggedIn, deleteAccount)


// user profile features
router.post("/blockuser", isLoggedIn, blockOtherUser);

router.post("/unblockuser", isLoggedIn, unblockUser);

router.post("/editprofpic", isLoggedIn, upload.single("profileImage"), editprofpic);

router.post("/update/account", isLoggedIn, updateAccountSettings);

router.post("/followuser", isLoggedIn , followOtherUser)

router.post("/unfollowuser", isLoggedIn, unfollowOtherUser)


module.exports = router;




