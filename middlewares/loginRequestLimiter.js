const rateLimit = require("express-rate-limit")

const  limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // aik ip kitni request bhej sakta hai 
  max: 4,
  handler: (req,res) => {
   req.flash("error", "Too Many Login Requests, Try After 1 Hour!");
   res.redirect("/register");
  },
  
  
});


module.exports = limiter;