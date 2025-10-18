const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {  googleConfigCallback }  =  require("../controller/auth/googleController");


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, googleConfigCallback));




