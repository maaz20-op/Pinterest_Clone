const express = require("express");
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { googleCallback }  =  require('../../../controller/auth/googleController');
const webRouteResFormate = require("../../../utils/webRoute");

// login with google setup

//route where frontend will interact with backend and redirect to google login pages
router.get('/', passport.authenticate('google', {
  scope : ['profile', 'email'],
  session: false,
}))

// route to handle the callback from google
router.get('/callback', passport.authenticate('google', { failureRedirect: '/register', session: false}), webRouteResFormate('/profile', '/register', 'Successfully Logedin!', googleCallback));



module.exports = router;
