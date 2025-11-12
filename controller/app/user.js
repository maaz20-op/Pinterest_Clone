const userModel = require("../../models/user-model");
const postModel = require("../../models/post-model");
const pinModel = require("../../models/pin-model");
const cloudinary = require("../../config/cloudinary");
const upload = require("../../config/multerConfig");
const mongoose = require("mongoose");
const redis = require("../../config/redisClient");

module.exports.editprofpic = async function(req){
try{
const user = await userModel.findOne({
  email:req.user?.email,
})
if(!user) { 
  throw new Error("Failed to Upload Profile Image");
}

user.profileImage = req.file.path; 
await user.save();


return [user];
} catch(err){
    throw err
}
}

module.exports.updateAccountSettings = async function(req) {

  try {
    let dbuser = await userModel.findById(req.user?.id);
    let updatedData = {};
console.log(req.body)
    for (let key in req.body) {
      const newValue = req.body[key];
      const oldValue = dbuser[key];

      if (newValue && newValue !== oldValue) {
        updatedData[key] = newValue; // build updated data
      }
    }


    if (Object.keys(updatedData).length === 0) throw new Error("You did'nt make any Changes!");
const updatedUser = await userModel.findByIdAndUpdate(req.user?.id, updatedData, { new: true })

   return [updatedUser]
  } catch (err) {
    throw err
  }
};

module.exports.blockOtherUser = async function(req){
  try {
  // blocked user
  let blockedUser = await userModel.findById(req.body.id);
  if(!blockedUser) {
    throw new Error("error","Error to Block the User")
  }
// logged in user 
  let user = await userModel.findById(req.user.id);
  
/* remove blocked user form following list*/
if(user.following.includes(blockedUser._id) && blockedUser.followers.includes(user._id)){
  
  blockedUser.followers = blockedUser.followers.filter((id)=>{
    return id.toString() !== user._id.toString()
  }); 
  
  user.following = user.following.filter((id)=>{
    return id.toString() !== blockedUser._id.toString()
  });
}

user.blockedUserId.push(blockedUser._id)
blockedUser.blockedBy.push(user._id)
await Promise.all([
  user.save(),
  blockedUser.save()
])
   
return [blockedUser, user];
  } catch (err) {
    throw err  
  }
  
}

module.exports.unblockUser = async function(req){
  
  try {
  let blockedUser  = await userModel.findById(req.body?.id);
  
  if(!blockedUser) return
  
  let user = await userModel.findById(req.user?.id);
  
  
   user.blockedUserId = user.blockedUserId.filter((id)=>{
     return id.toString() !== blockedUser._id.toString()
   })
  blockedUser.blockedBy = blockedUser.blockedBy.filter((id)=>{
    return id.toString() !== user.id.toString()
  })

  await Promise.all([
 user.save(),
 blockedUser.save()
  ])


return [blockedUser, user];
  } catch (err) {
  throw err
  }
};

module.exports.deleteAccount = async function(req){
  // start transaction for atomicity in Datsabase and keep db consistent
   try {
    let deletedUser = await userModel.findOne({_id: req.user?.id});
 
await Promise.all([
userModel.findByIdAndDelete(req.user.id),
 postModel.findOneAndDelete({ user:req.user.id}),
pinModel.findOneAndDelete({ createdBy:req.user.id }),
]);

  return [deletedUser];
  } catch(err) {
     throw new Error("Error, can't delete Acccount Try Again!")
  } 
};

module.exports.followOtherUser = async function(req){
  try {
let followedUser = await userModel.findById(req.body.id);

let loggedInUser = await userModel.findById(req.user.id);

if(!followedUser || !loggedInUser ) {
  throw new Error("Something went wrong!");
}


if(!followedUser.followers.includes(loggedInUser._id.toString()) && !loggedInUser.following.includes(followedUser._id.toString())) {
  
  followedUser.followers.push(loggedInUser._id);
loggedInUser.following.push(followedUser._id);
  await Promise.all([
  followedUser.save(),
  loggedInUser.save(),
]);
}
let followingCount = followedUser.following.length;
let followersCount = followedUser.followers.length;


return [
followingCount,
followersCount
 ];


  } catch (err) {
    throw err;
  }
}
  
module.exports.unfollowOtherUser = async function(req){
  try {
  
  // loggedIn User 
  let user = await userModel.findById(req.user.id);
  
  let followingUser  = await userModel.findById(req.body.id);
  
  if(!followingUser || !user){
    return res.status(404).json("error");
  }
  
  /* delete user id from loggedIn User ki following List */
  user.following =  user.following.filter((id)=>{
   return id.toString() !== followingUser._id.toString()
  })
  
  // removing logged In user from followers list of other user 
  followingUser.followers = followingUser.followers.filter((id)=>{
return  id.toString() !== user._id.toString()
  })
  
  await Promise.all([
    followingUser.save(),
    user.save(),
    ]);
  
  res.status(200).json("success");
  } catch (err) {
    res.status(500).json("internal server error!")
  }
};

  
  





