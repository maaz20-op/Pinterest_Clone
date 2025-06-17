var express = require('express');
var router = express.Router();
const userModel = require("../models/user-model");
const mongoose = require("mongoose");
const postModel = require("../models/post-model");
const pinModel = require("../models/pin-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/delete", async function(req,res){
  let alluser = await userModel.deleteMany({});
  let post = await postModel.deleteMany({})
  
  let pin = await pinModel.deleteMany({})
  res.send({alluser,pin,post})
});
router.get("/read",async function(req,res){
  const post = await postModel.find()
  res.send(post)
});

router.get('/', function(req, res) {
  res.render("register")
});

router.get("/profile",isLoggedIn, async function(req,res){
let user = await userModel.findOne({email:req.user.email})
.populate("post")
.populate("pins");
  res.render("profile",{user})
});

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
  
  res.render("otherUsersProfile",{otherUser})
});

router.get("/feed", isLoggedIn, async function(req,res){
  let users = await userModel.find()
  .populate("post");
  res.render("feed", { users });
});

router.get("/showpins", isLoggedIn, async function(req,res){
let user = await userModel.findOne({
  email:req.user.email,
})
.populate("pins");


  res.render("showPins", { user });
})





module.exports = router;
