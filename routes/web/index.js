const express = require('express');
const router = express.Router();
const isLoggedIn = require("../../middlewares/isLoggedIn.js");
const util = require('util');
const isPageCache = require("../../middlewares/redisCacheMiddleware.js");
const {setCache, makeKey} = require("../..//utils/setAndGetRedisKeys.js");
const 
{
register,
enterEmailForOTP,
forgotpassword,
profile,
createpost,
otherusersprofile,
showaccountsettings,
showblockusers,
feedPage,
showpins,
otherUsersPin,
showfollowers,
showfollowing,
showmsgbox,
msginbox,
showmsgpageofothersuser,
premiumDetails
} = require("../../controller/web/indexController.js");



router.use('/users', require('./features/user'));
router.use('/posts', require('./features/post'));
router.use('/pins', require('./features/pin'));
router.use('/comment', require('./features/comment'));
router.use('/auth/local', require('./auth/local.js'));
router.use('/auth/google', require('./auth/google'));

router.get("/register", register);
router.get('/getpremium', premiumDetails)
router.get('/enterEmailForOTP', enterEmailForOTP);
router.get('/forgotpassword', forgotpassword);
router.get("/profile", isLoggedIn, profile);
router.get("/createpost",isLoggedIn, createpost)
router.get("/otherusersprofile/:id", isLoggedIn, otherusersprofile);
router.get("/showaccountsettings", isLoggedIn, showaccountsettings)
router.get("/showblockusers", isLoggedIn, showblockusers)
router.get("/", isLoggedIn, feedPage);
router.get("/showpins", isLoggedIn, showpins)
router.get("/otherUsersPin/:id", isLoggedIn, otherUsersPin)
router.get("/showfollowers/:id", isLoggedIn, showfollowers)
router.get("/showfollowing/:id", isLoggedIn, showfollowing);
router.get('/showmsgbox', isLoggedIn, showmsgbox)
router.get('/msginbox', isLoggedIn, msginbox)
router.get('/showmsgpageofothersuser/:id', isLoggedIn , showmsgpageofothersuser)



module.exports = router;
