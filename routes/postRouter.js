const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const postModel = require("../models/post-model");
const userModel = require("../models/user-model");
const upload = require("../config/multerConfig");
const { uploadPost } = require("../controllers/userController");
const { likePost } = require("../controllers/userController");


router.post("/upload", isLoggedIn, upload.single("image"), uploadPost );

router.post("/likepost/:id", isLoggedIn 
, likePost)



module.exports = router;