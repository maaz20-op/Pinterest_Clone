const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const postModel = require("../models/post-model");
const userModel = require("../models/user-model");
const upload = require("../config/multerConfig");
const { uploadPost } = require("../controllers/userController");
const { likePost } = require("../controllers/userController");
const { searchPosts } = require("../controllers/userController");
const { deletePost } = require("../controllers/userController");
const { imagesFetchingFeedPage } = require("../controllers/userController");
const { videosFetchingFeedPage } = require("../controllers/userController");



router.get("/getPostsImages", isLoggedIn, imagesFetchingFeedPage)

router.get("/getPostsVideos", isLoggedIn, videosFetchingFeedPage)

router.post("/upload", isLoggedIn, upload.single("media"), uploadPost );

router.post("/likepost", isLoggedIn, likePost)

router.get("/delete/post/:id",isLoggedIn, deletePost);


router.post("/search", isLoggedIn,searchPosts) 

module.exports = router;