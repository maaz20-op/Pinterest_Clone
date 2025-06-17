const express = require("express");
const router = express.Router();
const { signupUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/authController");
const { logoutUser } = require("../controllers/authController")
const isLoggedIn = require("../middlewares/isLoggedIn");
const { editprofpic } = require("../controllers/userController");
const upload = require("../config/multerConfig")

// for authentication & authorization
router.post("/register",signupUser);

router.post("/login",loginUser);

router.get("/logout",logoutUser);


// user profile features
router.post("/editprofpic", isLoggedIn, upload.single("profileImage"), editprofpic);



module.exports = router;




