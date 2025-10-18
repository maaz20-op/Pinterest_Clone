const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../../../middlewares/isLoggedIn.js");
const { editprofpic, updateAccountSettings, blockOtherUser, unblockUser, deleteAccount, followOtherUser, unfollowOtherUser  } = require("../../../../controller/app/user.js");
const upload = require("../../../../config/multerConfig.js")
const apiRouteResFormate = require("../../../../utils/ApiRoute");


// user profile features

router.delete("/", isLoggedIn, apiRouteResFormate(deleteAccount));

router.patch("/block", isLoggedIn, apiRouteResFormate(blockOtherUser));

router.patch("/unblock", isLoggedIn, apiRouteResFormate(unblockUser));

router.patch("/profile-pic", isLoggedIn, upload.single("profileImage"), apiRouteResFormate(editprofpic));
//update user 
router.patch("/update", isLoggedIn, apiRouteResFormate(updateAccountSettings));

router.patch("/follow", isLoggedIn , apiRouteResFormate(followOtherUser))

router.patch("/unfollow", isLoggedIn, apiRouteResFormate(unfollowOtherUser))


module.exports = router;




