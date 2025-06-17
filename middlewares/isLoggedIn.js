const jwt = require("jsonwebtoken");
const userModel = require('../models/user-model');

const isLoggedIn = async function(req,res,next){
  try{
    let token = req.cookies.token;
    
    if (!token) return res.redirect("/");
    
const decoded = jwt.verify(token,process.env.JWT_SECRET);

let user = await userModel.findOne({
  email:decoded.email,
});

if(!user) return res.redirect("/")

req.user = user

 return next();
    
  }catch(err){
    return res.redirect("/");
  }
};

module.exports = isLoggedIn;