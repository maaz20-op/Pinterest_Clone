const express = require("express");
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleCallback }  =  require("../controllers/authController");
const { googleConfigCallback } =  require("../controllers/authController");



passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, googleConfigCallback));


//route where frontend will interact with backend 
router.get('/google', passport.authenticate('google', {
  scope : ['profile', 'email'],
  session: false,
}))


// route to handle the callback from google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/register', session: false}), googleCallback );

module.exports = router;