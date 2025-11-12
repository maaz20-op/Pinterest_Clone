const userModel = require("../../models/user-model.js");
const mongoose = require("mongoose");
const postModel = require("../../models/post-model.js");
const cloudinary = require("../../config/cloudinary.js");
const upload  = require('../../config/multerConfig.js');
const commentModel = require("../../models/comment-model.js");
const pinModel = require("../../models/pin-model.js");
const util = require('util');
const redis = require("../../config/redisClient.js");
// index routes (SSR using ejs)

module.exports.register = function (req, res){
  res.render("register")
};

module.exports.enterEmailForOTP  = function (req, res) {
  res.render('enteremailforOTP');
}

module.exports.premiumDetails = async function (req, res){
  try {
 let user = await userModel.findOne({email: req.user?.email});
 res.render("premium_payment", {user});
  } catch (err) {
    req.flash("error", "cant redirect to premium page!");
    res.redirect('/');
  }
}

module.exports.forgotpassword = function (req, res) {
  let email = req.session.email
  res.render('loginSignupOtpVerification', { email });
}

module.exports.profile =  async function(req,res){
 try {
    let {email} = req.user;
 let user = await userModel.findOne({email:email})
.populate("post")
.populate("pins");
  res.render("profile",{user})
 } catch (err) {
  console.log("loading profile route error", err);
 }
}

module.exports.createpost = function(req,res){
  res.render("createPost")
}

module.exports.otherusersprofile = async function(req,res){
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
}

module.exports.showaccountsettings = async function(req,res){
  let loggedInUser = await userModel.findById(req.user.id);
  let user = await userModel.findById(req.user.id).populate("blockedUserId")
  let array = []
  user.blockedUserId.forEach((eachBlockedUser)=>{
 array.push(eachBlockedUser.fullname)
  })
  
  res.render("accountSettings",{user,array,loggedInUser})
}


module.exports.showblockusers = async function(req,res){
  let user = await userModel.findById(req.user.id).select("-password -email -__v -bio -followers -following -pins -post")
  .populate("blockedUserId")
  res.render("showBlockedUsers",{user})
}

module.exports.feedPage = async function(req,res){
  let loggedInUser = await userModel.findById(req.user.id).select("-bio -password -email -__v").lean()
  let users = await userModel.find().select("-email -bio -password -__v -pins")
  .populate("post")
  res.render("feed", { users, loggedInUser});
}

module.exports.showpins = async function(req,res){
let user = await userModel.findOne({
  email:req.user.email,
}).select("-password -email -following -followers -__v -bio")
.populate("pins")
.lean()
  res.render("showPins", { user });
}

module.exports.otherUsersPin = async function(req,res){
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  if(!isValid) return res.redirect("/");
let otherUserPin = await userModel.findById(req.params.id).select("-password -email -bio -followers -pins -following -__v")
.populate("pins")
.lean();
res.render("showOtherUsersPin",{otherUserPin})
}

module.exports.showfollowers = async function(req,res){
  let user = await userModel.findById(req.params.id).select("-password -bio -email -post -blockedUserId -blockedBy -__v")
  .populate("followers");
  
    let loggedInUser = await userModel.findById(req.user.id).select("-password -bio -email -post -blockedUserId -blockedBy -__v").lean()
  if(!user) return res.redirect("/profile")

res.render("showFollowers", {user, loggedInUser});
}

module.exports.showfollowing = async function(req,res){
  let user = await userModel.findById(req.params.id).populate("following");
  let loggedInUser = await userModel.findById(req.user.id);
  if(!user) return res.redirect("/profile")
res.render("showFollowing", {user, loggedInUser});
}

module.exports.showmsgbox = function (req, res) {
res.render('msgBox');
}

module.exports.msginbox = async  function (req, res) {
let user = await userModel.findById(req.user?.id)
.populate("followers"); //you can msg your your followers
console.log(user)
res.render('showallmsgbyusers', { user });
}

module.exports.showmsgpageofothersuser = async function (req, res) {
   let user = await userModel.findById(req.params.id);

  
  let sendMsgs = await userModel.aggregate([
    {
      $match: {
        email: req.user?.email
      }
    },
    {
      $lookup: {
        from: "messages",
        localField:"_id",
        foreignField: "senderId",
        as: "userData"
      }
    },
    {
      $project: {
        fullname: 0,
        username: 0,
          username:0,
          email:0 ,
          password:0 ,
          bio: 0,
          blockedUser:0,
          post:0,
          blockedBy:0,
          pins:0,
            following:0, 
            followers:0,
            userCommented:0,
          }
    }
  ]);

  let receivedMsgs = await userModel.aggregate([
    {
      $match: {
        email: req.user?.email
      }
    },
    {
      $lookup: {
        from: "messages",
        localField:"_id",
        foreignField: "receiverId",
        as: "userData"
      }
    },
    {
      $project: {
        fullname: 0,
        username: 0,
          username:0,
          email:0 ,
          password:0 ,
          bio: 0,
          blockedUser:0,
          post:0,
          blockedBy:0,
          pins:0,
            following:0, 
            followers:0,
            userCommented:0,
          }
    }
  ]);

console.log(receivedMsgs[0].userData)
  
  let loggedInUser = await userModel.findById(req.user.id);
res.render('msgBox', {user, loggedInUser, sendMsgs, receivedMsgs});
}






