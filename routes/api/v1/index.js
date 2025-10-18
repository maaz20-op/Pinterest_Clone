const express = require('express');
const router = express.Router();
const isLoggedIn = require("../../../middlewares/isLoggedIn.js");
const util = require('util');
const isPageCache = require("../../../middlewares/redisCacheMiddleware.js");
const {setCache, makeKey} = require("../../../utils/setAndGetRedisKeys.js");
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
} = require("../../../controller/web/indexController.js");



router.use('/users', require('./features/userApi'));
router.use('/posts', require('./features/postApi'));
router.use('/pins', require('./features/pinApi'));
router.use('/Ai-features', require('./features/ai-huggyFaceApi.js'));
router.use('/comments', require('./features/commentApi'));
router.use('/payments', require('./features/paymentApi.js'));
router.use('/auth/local', require('./auth/local.js'));
router.use('/auth/google', require('./auth/google'));




router.get("/register", register);
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
