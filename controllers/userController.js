const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const pinModel = require("../models/pin-model");

module.exports.editprofpic = async function(req,res){
try{
const user = await userModel.findOne({
  email:req.user.email,
})

if(!user) { 
  req.flash("error","Failed to Upload Profile Image");
return res.redirect("/profile")
}

user.profileImage = req.file.filename;
await user.save();


res.redirect("/profile")
} catch(err){
    req.flash("error","Failed to Upload Profile Image");
return res.redirect("/profile")
}

}

module.exports.uploadPost = async function(req,res){
  try {
  let { postdata } = req.body;
  
    let user = await userModel.findOne({
      email:req.user.email,
    })
  
  if(!user) return res.redirect("/profile");
  
  let post = await postModel.create({
    image:req.file.filename,
    postdata,
    user:user._id,
  });
  
user.post.push(post._id);
await user.save();
  


req.flash("success","Your creation is Added!")

return res.redirect("/profile")
} catch(err) {
  console.log(err.message)
}

}

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
  return res.redirect("/feed");
}

req.flash("success","Suxmsjsksosiis")
  user.pins.push(existingPin._id);
  await user.save();
return res.redirect("/feed");
}


let pin = await pinModel.create({
    image,
    text,
    createdBy:user._id,
  })
  
  user.pins.push(pin._id);
  await user.save();
req.flash("success","You Image Is save in your Pins!")

return res.redirect("/feed")
    
  } catch(err){
    req.flash("error",`something went wrong`)
  
    res.redirect("/feed")
    
  }
  
  
  
  
}

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
  let user = await userModel.findById(req.user.id );
  
  let post = await postModel.findById(req.params.id);
  
  if(!post || !user) {
    req.flash("error","cannot like post")
    return res.redirect("/feed")
  }
  if (post.likes.includes(user._id)) {
  req.flash("error", "You've already liked this post");
  return res.redirect("/feed");
}
post.likes.push(user._id);
await post.save();
  
  
  req.flash("success","post Liked");
  
  return res.redirect("/feed");
  } catch (err){
      req.flash("error",`cannot like post beacuse of ${err.message}`)
    return res.redirect("/feed")  
  }
  
}