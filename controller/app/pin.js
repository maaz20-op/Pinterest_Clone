const userModel = require("../../models/user-model");
const postModel = require("../../models/post-model");
const pinModel = require("../../models/pin-model");



module.exports.savePin = async function(req){
  try {
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
 throw new Error("You PIned Image Already Saved!")
}

  user.pins.push(existingPin._id);
  await user.save();

}


let pin = await pinModel.create({
    image,
    text,
    createdBy:user._id,
  })
  
  user.pins.push(pin._id);
  await user.save();
let array = [user, pin]
return array;
  } catch(err) {
    throw err
  }
};

module.exports.deletePin = async function(req){
  try {
  
  let deletedPin = await pinModel.findByIdAndDelete(req.params.id);

  if(!deletedPin) {
    throw new Error("error","Unable to delete your Pin");
  }
  
   let userDeletedPin =  await userModel.updateOne(
  { _id: req.user._id },
  { $pull: { pins: deletedPin._id } }
);



return [userDeletedPin, deletedPin];
  } catch (err) {
    throw err
  }
}