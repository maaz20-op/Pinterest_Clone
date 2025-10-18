const express = require('express');
const router = express.Router();
const isLoggedIn = require("../../../../middlewares/isLoggedIn");
const { createComment, showAllComments } = require("../../../../controller/app/comment");
const apiRouteResFormate = require("../../../../utils/ApiRoute");

// REST Api ---> Standarads

// create comments
router.post("/", isLoggedIn, apiRouteResFormate(createComment));

// get Comments of particular post
router.get("/",  apiRouteResFormate(showAllComments));

module.exports = router;






