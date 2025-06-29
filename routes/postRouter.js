const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const postModel = require("../models/post-model");
const userModel = require("../models/user-model");
const upload = require("../config/multerConfig");
const { uploadPost } = require("../controllers/userController");
const { likePost } = require("../controllers/userController");
const { searchPosts } = require("../controllers/userController");




router.post("/upload", isLoggedIn, upload.single("media"), uploadPost );

router.post("/likepost", isLoggedIn, likePost)


router.post("/search", isLoggedIn,searchPosts) 

module.exports = router;