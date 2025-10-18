const express = require("express");
const router = express.Router();
const isLoggedIn = require("../../../../middlewares/isLoggedIn");
const apiRouteResFormate = require("../../../../utils/ApiRoute");
const { generateAiImage, deleteAiImgFromCloudinary } = require("../../../../controller/app/Ai_feature");

router.post("/image", isLoggedIn, apiRouteResFormate(generateAiImage));
router.delete("/image", isLoggedIn, apiRouteResFormate(deleteAiImgFromCloudinary));
module.exports = router;