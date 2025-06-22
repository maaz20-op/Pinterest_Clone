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




// for authentication & authorization
router.post("/register",signupUser);

router.post("/login",loginUser);

router.get("/logout",logoutUser);

router.post("/deleteaccount", isLoggedIn,deleteAccount)

//block and unblock other users 

router.post("/blockuser",isLoggedIn,blockOtherUser);

router.post("/unblockuser", isLoggedIn,unblockUser);



// user profile features
router.post("/editprofpic", isLoggedIn, upload.single("profileImage"), editprofpic);

router.post("/update/account", isLoggedIn, updateAccountSettings);

module.exports = router;




