const express = require('express');
const router = express.Router();
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const postModel = require("../../../models/post-model");
const userModel = require("../../../models/user-model");
const upload = require("../../../config/multerConfig");
const { uploadPost, likePost, searchPosts, deletePost, imagesFetchingFeedPage, videosFetchingFeedPage } = require("../../../controller/app/post");
const webRouteResFormate = require("../../../utils/webRoute");


router.get("/getPostsImages", isLoggedIn, imagesFetchingFeedPage);

router.get("/getPostsVideos", isLoggedIn, videosFetchingFeedPage);

router.post("/upload", isLoggedIn, upload.single("media"), webRouteResFormate('/profile', '/profile', 'Your creation is Added!', uploadPost));

router.post("/likepost", isLoggedIn, likePost);

router.get("/delete/post/:id",isLoggedIn, deletePost);

router.post("/search", isLoggedIn, searchPosts) 

module.exports = router;