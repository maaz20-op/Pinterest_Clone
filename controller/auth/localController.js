const userModel = require("../../models/user-model");
const postModel = require("../../models/post-model");
const bcrypt = require("bcryptjs");
const sendSignupEmail = require('../../emails/signupWelcome');
const sendOptonEmail = require('../../emails/verifyOtpEmail');
const sendAccessAndRefreshTokenThroughCookies = require("../../utils/sendAccessAndRefreshTokenThroughCookie")
const generateOTP = require("../../utils/generateOTP");
const {addLoginEmailToQueue}  = require("../../queues/emailQueue");
const  validateLoginRequest = require("../../utils/noSQLPreventionTechniques");


// local authentication using email and password
module.exports.signupUser = async function(req){
  try {
    console.log(req.body)
  let {fullname, username, email, password} = req.body
  
if(!fullname || !username || !email || !password){
  throw new Error("Some field is Missing fill properly!")
}



if(fullname.trim().length > 18){
  throw new Error("Full name must not exceed 18 characters")
}
  if(username.trim().length > 12){
  throw new Error("Username must not exceed 12 characters")
}

  let isUserExists = await userModel.findOne({
  $or: [{ email }, { username }]
});


if (isUserExists) {
  if (isUserExists.email === email) {
    throw new Error("Email already exists.");
  }
throw new Error("Username already taken.");
  
}
  
  
const hash = await bcrypt.hash(password,6);

    let createdUser = await userModel.create({
        fullname,
        username,
        email,
        password:hash,
      })

// email send will be control by userWatcher (change streams) in Mongo DB

 return [createdUser];
  } catch(err) {
   throw err;
  }
};

module.exports.loginUser = async function(req){
  try {
const validateLoginSchema = validateLoginRequest();

 const { error, value } = validateLoginSchema.validate(req.body);

 if(error) {
  throw new Error(`${error?.details[0]?.message || "Invalid Details!"}`);
 }
 console.log("val9idation librerat",value, error)


  let {email,password} = req.body
  
  let user = await userModel.findOne({email});
  
  if(!user) {
 throw new Error("Account Not Exists")
  }

  const isMatch = await bcrypt.compare(password, user.password); 
if(!isMatch) throw new Error("Wrong email or password");

// add email of login user in  msg queue and after worker process it send to user
addLoginEmailToQueue(user.email, user.fullname);
return [user];
} catch(err){
  throw err;
}
};

module.exports.logoutUser =  async function (req){
  try {
  // other work done in res middleware 
return ["request Reached!"];
  } catch(err){
   throw err;
  }
  
};

module.exports.getAccessToken = async function(req){
  try {

  
  let user = await userModel.findOne({email: req.session.backupUser?.email});

  if(!user) throw new Error("server error 500");

  // delete backup user from session 
  delete req.session.backupUser;

 req.session.requestURL || "/";
return [user];
  } catch(err) {
  throw err;
  }
}

module.exports.getEmailForVerification = function (req){
  try {
let verificationEmail = req.body.email;
if(!verificationEmail) {
  throw new Error("Please enter your email");
}
req.session.email = verificationEmail;

return ["Email granted"];
  } catch (err) {
 throw err;
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

module.exports.forgotPassword = async function(req){
  try {
    let { val1, val2, val3, val4 } = req.body;
let emailOTP = req.session.otp;
let verificationEmail = req.session?.email;
let userInputOPT = `${val1}${val2}${val3}${val4}`;
console.log(emailOTP,userInputOPT)
if(emailOTP.toString() !== userInputOPT.toString()) throw new Error("wrong OTP code");

  let user = await userModel.findOne({ email: req.session.email});
if(!user) {
  throw new Error('wrong email, error');
}

sendSignupEmail(user.email, user.fullname)

// delete email and otp from session 
delete req.session.otp;
delete req.session.email;
console.log('session after delete',req.session.otp, req.session.email)
 return [user]
  } catch(err){
    throw err;
  }
}

