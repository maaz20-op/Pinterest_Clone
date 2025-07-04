const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const pinModel = require("../models/pin-model");
const cloudinary = require("../config/cloudinary")
const upload = require("../config/multerConfig")



module.exports.editprofpic = async function(req,res){
try{
const user = await userModel.findOne({
  email:req.user.email,
})
if(!user) { 
  req.flash("error","Failed to Upload Profile Image");
return res.redirect("/profile")
}

user.profileImage = req.file.path;
await user.save();


res.redirect("/profile")
} catch(err){
    req.flash("error","Failed to Upload Profile Image");
return res.redirect("/profile")
}

}

module.exports.uploadPost = async function(req,res){
  try {
  
    let user = await userModel.findOne({
      email:req.user.email,
    })
  
  if(!user) return res.redirect("/profile");
  
let file = req.file

if(!file) {
  req.flash("error","something went wrong!");
  return res.redirect("/profile")
}
let type =  file.mimetype.startsWith("video/")?"video":"image";

let result = await cloudinary.uploader.upload(file.path,{
  resource_type:type,
});
let optimizeUrl = result.secure_url.replace("/upload/", "/upload/q_auto,f_auto/");


  let post = await postModel.create({
    mediaUrl:optimizeUrl,
    mediaType:type,
    user:user._id,
    postdata:req.body.postdata,
  });
  
user.post.push(post._id);
await user.save();

req.flash("success","Your creation is Added!")
return res.redirect("/profile")

} catch(err) {
  req.flash("error","Unable to upload your Post...")
 res.redirect("/profile");
}
}

module.exports.deletePost = async function(req,res){
  let id = req.params.id;

  if(!id) {
    return res.status(404).json({ message: "Something went wrong!" }); 
  }

  try {
    let post = await postModel.findByIdAndDelete(id);
    let user = await userModel.findById(req.user.id);
  
  user.post = user.post.filter((eachId)=>{
  return  eachId.toString()  !== post._id.toString();
  })
  await user.save();
    return res.status(200).json({ message: "success" }); 
  } catch(err) {
    
    res.status(500).json({ message: "Server error!" }); 
  }
};



module.exports.savePin = async function(req,res){
  try{
    
let user = await userModel.findOne({
  email:req.user.email,
});

if(!user){
  req.flash("error","Cant show your Pins")
  return res.redirect("/profile")
}

let { image,text }  = req.body;

    let existingPin = await pinModel.findOne({
    image,
    text,
    createdBy:user._id,
  })
  
  if(existingPin){
  if(user.pins.some(id => id.toString() === existingPin._id.toString())){
  req.flash("error", "You've already saved this this pin");
  return res.redirect("/");
}

req.flash("success","Saved");
  user.pins.push(existingPin._id);
  await user.save();
return res.redirect("/");
}


let pin = await pinModel.create({
    image,
    text,
    createdBy:user._id,
  })
  
  user.pins.push(pin._id);
  await user.save();
req.flash("success","You Image Is save in your Pins!")

return res.redirect("/")
    
  } catch(err){
    req.flash("error",`something went wrong`)
  
    res.redirect("/")
    
  }
};

module.exports.deletePin = async function(req,res){
  try {
  
  let deletedPin = await pinModel.findByIdAndDelete(req.params.id);

  if(!deletedPin) {
    req.flash("error","Unable to delete your Pin");
    return res.redirect("/showpins")
  }
  
   let userDeletedPin =  await userModel.updateOne(
  { _id: req.user._id },
  { $pull: { pins: deletedPin._id } }
);


req.flash("success","Your Pin deleted successfully");
return res.redirect("/showpins")
  } catch (err) {
     req.flash("error",`unable to delete pin ${err.message}`);
     res.redirect("/showpins")
    
  }
}

module.exports.likePost = async function(req,res){
try {
  let post = await postModel.findById(req.body.id);
  let loggedInUser = await userModel.findById(req.user.id);
  
  if(!post || !loggedInUser) {
    return res.status(500)
  };
  
  if(!post.likes.includes(loggedInUser._id.toString())) {
  post.likes.push(loggedInUser._id);
  await post.save();
}
res.json({
  post,
  loggedInUser,
})

} catch (err) {
  res.status(500).json({ error: "Something went wrong", message: err.message });
}
 
}



module.exports.updateAccountSettings = async function(req, res) {
  try {
    let dbuser = await userModel.findById(req.user.id);
    let changedFields = [];
    let updatedData = {};

    for (let key in req.body) {
      const newValue = req.body[key];
      const oldValue = dbuser[key];

      if (newValue && newValue !== oldValue) {
        changedFields.push(key);
        updatedData[key] = newValue; // ✅ build updated data
      }
    }


    if (Object.keys(updatedData).length > 0) {
      await userModel.findByIdAndUpdate(req.user.id, updatedData);
    }

req.flash("success","your account updated succesfully ")
   return res.redirect("/profile");
  } catch (err) {
    res.status(500).send("Something went wrong.");
    req.flash("error","Error in account settngs")
    res.redirect("/profile")
  }
};


module.exports.blockOtherUser = async function(req,res){
  try {
  // blocked user
  let blockedUser = await userModel.findById(req.body.id);
  if(!blockedUser) {
    req.flash("error","Error to Block the User")
   return res.redirect("/")
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
   
  req.flash("success",`You blocked ${blockedUser.fullname}`);
return res.redirect("/");
  
  } catch (err) {
    req.flash("error",`Failed to block`);

   return res.redirect("/");
    
  }
  
}

module.exports.unblockUser = async function(req,res){
  
  try {
  let blockedUser  = await userModel.findById(req.body.id);
  
  if(!blockedUser) return
  
  let user = await userModel.findById(req.user.id);
  
  
   user.blockedUserId = user.blockedUserId.filter((id)=>{
     return id.toString() !== blockedUser._id.toString()
   })
  blockedUser.blockedBy = blockedUser.blockedBy.filter((id)=>{
    return id.toString() !== user.id.toString()
  })
  
await user.save();
await blockedUser.save();

req.flash("success",`You unblocked ${blockedUser.fullname}`);
return res.redirect("/");
  } catch (err) {
  req.flash("error","unable to unblock");
    res.redirect("/");
    
  }
};


module.exports.deleteAccount = async function(req,res){
  try {
  let deletedUser = await userModel.findOneAndDelete({_id:req.user.id});
  
  let userPosts = await postModel.findAndDelete({
    user:req.user.id,
  })
  
  let userPins  = await userModel.findAndDelete({
    createdBy:req.user.id,
  });
  
  req.flash("success","Successfully your Account is Deleted, Create A new Account!")
  return res.redirect("/register")
  } catch(err) {
    req.flash("error","Cannot delete Your Account!")
  res.redirect("/profile")
  }
};

module.exports.searchPosts = async  function(req,res){
  try {
    let input = req.body.inputValue;
if (!input) {
  return res.status(400).json([]);
}

let regexp = new RegExp(input,"i");
let posts = await postModel.find({
  postdata:regexp,
}).populate({
  path:"user",
  model:'User',
  match : {
    accountVisibility:"Public"
  },
  select:"-post -bio",
})

posts = posts.filter((post)=>{
  return post.user !== null;
})

res.json(posts)
  } catch (err) {
    req.status(404).json("Error From Server!")
  }
}




