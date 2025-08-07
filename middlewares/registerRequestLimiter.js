const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 60 * 60 * 2000,
  max: 2,
  handler: (req, res) => {
    req.flash("error", "Too many request From this IP, Try After 1 hour")
    res.redirect("/register");
  },
});


module.exports = limiter