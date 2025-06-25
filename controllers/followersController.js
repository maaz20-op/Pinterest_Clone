const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const pinModel = require("../models/pin-model");


module.exports.followOtherUser = async function(req,res){
  try {
let followedUser = await userModel.findById(req.body.id);

let loggedInUser = await userModel.findById(req.user.id);

if(!followedUser || !loggedInUser ) {
  return res.status(500).json("Something went wrong!")
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

res.json({
followingCount,
followersCount,
})




  } catch (err) {
    res.status(500).json("Error to Follow")
    
  }
}
  
module.exports.unfollowOtherUser = async function(req,res){
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

  
  
