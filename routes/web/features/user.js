const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../../middlewares/isLoggedIn.js");
const { editprofpic, updateAccountSettings, blockOtherUser, unblockUser, deleteAccount, followOtherUser, unfollowOtherUser  } = require("../../../controller/app/user.js");
const upload = require("../../../config/multerConfig.js")
const webRouteResFormate = require("../../../utils/webRoute");


// user profile features

router.post("/deleteaccount", isLoggedIn, webRouteResFormate('/register', '/profile', 'Successfully your Account is Deleted, Create A new Account!', deleteAccount));

router.post("/blockuser", isLoggedIn, webRouteResFormate('/', '/', '', blockOtherUser));

router.post("/unblockuser", isLoggedIn, webRouteResFormate('/', '/', '', unblockUser));

router.post("/editprofpic", isLoggedIn, upload.single("profileImage"), webRouteResFormate('/profile', '/profile', 'Profile Pic Updated', editprofpic));

router.post("/update/account", isLoggedIn, webRouteResFormate('/profile',  '/profile', 'your account updated succesfully!', updateAccountSettings));

router.post("/followuser", isLoggedIn , followOtherUser)

router.post("/unfollowuser", isLoggedIn, unfollowOtherUser)


module.exports = router;




