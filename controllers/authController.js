const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


module.exports.signupUser = async function(req,res){
  try {
  let {fullname, username, email, password} = req.body
  
if(!fullname || !username || !email || !password){
  req.flash("error","Some field is Missing fill properly!")
  return res.redirect("/")
}

if(fullname.trim().length > 18){
  req.flash("error","Full name must not exceed 18 characters")
  return res.redirect("/")
}
  if(username.trim().length > 12){
  req.flash("error","Username must not exceed 12 characters")
  return res.redirect("/")
}

  let isUserExists = await userModel.findOne({
  $or: [{ email }, { username }]
});


if (isUserExists) {
  if (isUserExists.email === email) {
    req.flash("error", "Email already exists.");
  } else {
    req.flash("error", "Username already taken.");
  }
  return res.redirect("/");
}
  
  
const hash = await bcrypt.hash(password,6);

    let createdUser = await userModel.create({
        fullname,
        username,
        email,
        password:hash,
      })
      console.log(createdUser)
const  token = generateToken(email)

res.cookie("token", token, {
  httpOnly: true, // prevent JS access to cookie (secure)
  secure: process.env.NODE_ENV === "production", // only HTTPS in prod
  sameSite: "Lax", // or "Strict" / "None" based on frontend-backend location
  maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
});
 return res.redirect("/profile")
  } catch(err) {
    req.flash("error","Something Went wrong!")
    console.log(err.message)
  return  res.redirect("/")
  }
};

module.exports.loginUser = async function(req,res){
  try {
  let {email,password} = req.body
  
  let user = await userModel.findOne({email});
  
  if(!user) {
req.flash("error","Account Not Exists")
return res.redirect("/")
  }
  
bcrypt.compare(password,user.password,function(err, result){
  if(result){
    let token = generateToken(user.email)
    res.cookie("token", token, {
  httpOnly: true, // prevent JS access to cookie (secure)
  secure: process.env.NODE_ENV === "production", // only HTTPS in prod
  sameSite: "Lax", // or "Strict" / "None" based on frontend-backend location
  maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
});
    req.flash("success","Successfully Logined!")
    return res.redirect("/profile")
  }
  req.flash("error","Wrong email or password")
  return res.redirect("/")
});
} catch(err){
  req.flash("error","something went wrong!");
  return res.redirect("/");
}
};

module.exports.logoutUser =  function(req,res){
  try {
  res.clearCookie("token")
req.flash("success","Successfully Logout");
 return res.redirect("/");
  } catch(err){
    req.flash("error",`Logout Error: ${err.message}`);
    return res.redirect("/");
  }
  
};


