const userModel = require("../models/user-model");
const postModel = require("../models/post-model");
const bcrypt = require("bcryptjs");
const sendSignupEmail = require('../emails/signupWelcome');
const sendOptonEmail = require('../emails/verifyOtpEmail');
const sendAccessAndRefreshTokenThroughCookies = require("../utils/sendAccessAndRefreshTokenThroughCookie")
const generateOTP = require("../utils/generateOTP");

// local authentication using email and password
module.exports.signupUser = async function(req,res){
  try {
  let {fullname, username, email, password} = req.body
  
if(!fullname || !username || !email || !passworreq){
  req.flash("error","Some field is Missing fill properly!")
  return res.redirect("/register")
}



if(fullname.trim().length > 18){
  req.flash("error","Full name must not exceed 18 characters")
  return res.redirect("/register")
}
  if(username.trim().length > 12){
  req.flash("error","Username must not exceed 12 characters")
  return res.redirect("/register")
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
  return res.redirect("/register");
}
  
  
const hash = await bcrypt.hash(password,6);

    let createdUser = await userModel.create({
        fullname,
        username,
        email,
        password:hash,
      })

      // send welcome email to signup user
      sendSignupEmail(createdUser.email, createdUser.fullname);
// send access and refresh token through cookies
    sendAccessAndRefreshTokenThroughCookies(createdUser.email, res);

 return res.redirect("/profile")
  } catch(err) {
    req.flash("error","Something Went wrong!")
  return  res.redirect("/register")
  }
};

module.exports.loginUser = async function(req,res){
  try {
  let {email,password} = req.body
  
  let user = await userModel.findOne({email});
  
  if(!user) {
req.flash("error","Account Not Exists")
return res.redirect("/register")
  }

bcrypt.compare(password,user.password,function(err, result){
  if(result){
   // send access and refresh token through cookies
    sendAccessAndRefreshTokenThroughCookies(user.email, res);

 sendSignupEmail(user.email, user.fullname);
    req.flash("success","Successfully Logined!")
  
    return res.redirect("/profile")
  }
  req.flash("error","Wrong email or password")
  return res.redirect("/register")
});
} catch(err){
  req.flash("error","something went wrong!");
  return res.redirect("/register");
}
};

module.exports.logoutUser =  function (req,res){
  try {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
req.flash("success","Successfully Logout");
 return res.redirect("/register");
  } catch(err){
    req.flash("error",`Logout Error: ${err.message}`);
    return res.redirect("/register");
  }
  
};

module.exports.getAccessToken = async function(req, res){
  try {
  let user = await userModel.findOne({email: req.session.backupUser.email});

  if(!user) return res.send("server error 500");

  // delete backup user from session 
  delete req.session.backupUser;

  // send access and refresh token through cookies
    sendAccessAndRefreshTokenThroughCookies(user.email, res);


// getting redirect url from session that we strore in isLoggedin middleware
let redirectUrl = req.session.requestURL || "/";

// delete redirect url from session 
delete req.session.requestURL

return res.redirect(redirectUrl);
  } catch(err) {
  console.log('access token error', err)
  }
}

module.exports.getEmailForVerification = function (req,res){
  try {
let verificationEmail = req.body.email;
if(!verificationEmail) {
  req.flash("error","Please enter your email");
  return res.redirect("/enterEmailForOTP");
}
req.session.email = verificationEmail;
res.redirect("/forgotpassword");
  } catch (err) {
req.flash("error","Something went wrong");
res.redirect("/enterEmailForOTP");
  }
}

module.exports.sendOTP = async function(req,res){
  try {
    let verificationEmail = req.body.email;
    if(!verificationEmail) return res.redirect("/enterEmailForOTP");
   let otp  = generateOTP();
   req.session.otp = otp;
   console.log('session otp',req.session.otp)
   sendOptonEmail(verificationEmail, req.session.otp);
   if(!req.session.email && !req.session.otp) {
res.json({ success: false, message: 'Error storing OTP or email in session' });
   }
   res.json({ success: true, message: 'OTP sent successfully',otp})
  } catch(err){
    console.log(err)
    res.json({ success: false, message: 'Error in verifiaction try later' });
  }
}

module.exports.forgotPassword = async function(req,res){
  try {
    let { val1, val2, val3, val4 } = req.body;
let emailOTP = req.session.otp;
let verificationEmail = req.session.email;
let userInputOPT = `${val1}${val2}${val3}${val4}`;
console.log(emailOTP,userInputOPT)
if(emailOTP.toString() === userInputOPT.toString()){

  let user = await userModel.findOne({ email: req.session.email});
if(!user) {
  req.flash('error','wrong email, error');
  return res.redirect("/enterEmailForOTP");
}

// send access and refresh token through cookies
    sendAccessAndRefreshTokenThroughCookies(user.email, res);


sendSignupEmail(user.email, user.fullname)

// delete email and otp from session 
delete req.session.otp;
delete req.session.email;
console.log('session after delete',req.session.otp, req.session.email)
 req.flash("success","Successfully Logined!");
    return res.redirect("/profile");
}

req.flash("error","wrong OTP code");
return res.redirect('/forgotpassword');
  } catch(err){
    req.flash("error","something went wrong in verification");
    res.redirect('/forgotpassword');
  }
}


// authentication using googleCallboogle passport strategy

module.exports.googleCallback = async (req, res) => {
  try {
    
    let email = req.user;
    if (!email) return res.redirect('/register');
  let user = await userModel.findOne({ email });
   if (!user) {
    req.flash("error", `Account Not exist on ${email}!`);
     return res.redirect('/register');
   }
// send access and refresh token through cookies
    sendAccessAndRefreshTokenThroughCookies(user.email, res);

res.redirect("/profile");
  } catch (err) {
res.redirect('/register');
  }

}


module.exports.googleConfigCallback = async function (accessToken, refreshToken, profile, done){
  try {
 let userEmail = profile.emails[0].value;
    done(null, userEmail);

  } catch (err) {
  done(err, false);
  }
 
}
