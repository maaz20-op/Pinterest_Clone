const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


module.exports.signupUser = async function(req,res){
  try {
  let {fullname, username, email, password} = req.body
  
  let isUserExists = await userModel.findOne({
    email,
  })
  
  if(isUserExists) {
  
 req.flash("error","Account Already Exists")
 return res.redirect("/");
  }
  
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt, async function(err, hash){
    let createdUser = await userModel.create({
        fullname,
        username,
        email,
        password:hash,
      })
      
const  token = generateToken(email)

res.cookie("token",token)
 return res.redirect("/profile")
    });
  });
  } catch(err) {
    req.flash("error","Something went wrong!");
    return res.redirect("/");
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
    res.cookie("token",token)
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


