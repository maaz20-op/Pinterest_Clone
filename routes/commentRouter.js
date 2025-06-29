const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const userModel = require('../models/user-model');
const postModel = require('../models/post-model');
const { createComment } = require("../controllers/commentController")
const { showAllComments } = require("../controllers/commentController")
router.post("/createcomment", isLoggedIn,createComment )

router.get("/showcomments", isLoggedIn, showAllComments)

module.exports = router






