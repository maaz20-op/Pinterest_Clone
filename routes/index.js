var express = require('express');
var router = express.Router();
const userModel = require("../models/user-model");
const mongoose = require("mongoose");
const postModel = require("../models/post-model");
const cloudinary = require("../config/cloudinary.js");
const upload  = require('../config/multerConfig.js');
const commentModel = require("../models/comment-model");
const pinModel = require("../models/pin-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const util = require('util');



router.get("/find",async function(req,res){
  let user = await userModel.find()
  console.log(user)
})
router.get("/filter", async function(req,res){




})


router.get("/register", function (req, res){
  res.render("register")
})


router.get("/profile",isLoggedIn, async function(req,res){
let user = await userModel.findOne({email:req.user.email})
.populate("post")
.populate("pins");
  res.render("profile",{user})
});


router.get("/createpost",isLoggedIn , function(req,res){
  res.render("createPost")
})


router.get("/otherusersprofile/:id", isLoggedIn, async function(req,res){
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid user ID");
  }
  let loggedInUser =await userModel.findOne({
    _id:req.user.id,
  })
  .populate("post")
  .populate("pins");
  let otherUser = await userModel.findOne({
    _id:req.params.id
  })
  .populate("post")
  .populate("pins");
if(otherUser._id.toString() === loggedInUser._id.toString()){
  return res.redirect("/profile")
}
  res.render("otherUsersProfile",{otherUser,loggedInUser})
});


router.get("/showaccountsettings",isLoggedIn, async function(req,res){
  let loggedInUser = await userModel.findById(req.user.id);
  let user = await userModel.findById(req.user.id).populate("blockedUserId")
  let array = []
  user.blockedUserId.forEach((eachBlockedUser)=>{
 array.push(eachBlockedUser.fullname)
  })
  
  res.render("accountSettings",{user,array,loggedInUser})
})


router.get("/showblockusers", isLoggedIn, async function(req,res){
  let user = await userModel.findById(req.user.id).select("-password -email -__v -bio -followers -following -pins -post")
  .populate("blockedUserId")
  res.render("showBlockedUsers",{user})
})


router.get("/", isLoggedIn, async function(req,res){
  let loggedInUser = await userModel.findById(req.user.id).select("-bio -password -email -__v").lean()
  let users = await userModel.find().select("-email -bio -password -__v -pins")
  .populate("post")
  res.render("feed", { users, loggedInUser});
});


router.get("/showpins", isLoggedIn, async function(req,res){
let user = await userModel.findOne({
  email:req.user.email,
}).select("-password -email -following -followers -__v -bio")
.populate("pins")
.lean()
  res.render("showPins", { user });
})


router.get("/otherUsersPin/:id", isLoggedIn, async function(req,res){
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if(!isValid) return res.redirect("/");
let otherUserPin = await userModel.findById(req.params.id).select("-password -email -bio -followers -pins -following -__v")
.populate("pins")
.lean();
res.render("showOtherUsersPin",{otherUserPin})
})


router.get("/showfollowers/:id", isLoggedIn, async function(req,res){
  let user = await userModel.findById(req.params.id).select("-password -bio -email -post -blockedUserId -blockedBy -__v")
  .populate("followers");
  
    let loggedInUser = await userModel.findById(req.user.id).select("-password -bio -email -post -blockedUserId -blockedBy -__v").lean()
  if(!user) return res.redirect("/profile")

res.render("showFollowers", {user, loggedInUser});
})


router.get("/showfollowing/:id", isLoggedIn, async function(req,res){
  let user = await userModel.findById(req.params.id).populate("following");
  let loggedInUser = await userModel.findById(req.user.id);
  if(!user) return res.redirect("/profile")
res.render("showFollowing", {user, loggedInUser});
});


module.exports = router;
