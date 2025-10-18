const sendAccessAndRefreshTokenThroughCookie = require("../utils/sendAccessAndRefreshTokenThroughCookie")

const webRouteResFormate = (successRedirect, failureRedirect, succeesMsg, fn) => async (req, res, next) => {
  try {
      const promise = fn(req); // it will return error or data 
 const data = await promise;
  if(!data || !Array.isArray(data) || data.length === 0) {
    console.log(data)
    req.flash("error", "Operation Failed, Invalid Data!")
     return res.redirect(failureRedirect)
  }
  const specificURLMsg = {
    "/blockuser": `You blocked ${data[0].fullname || "User"}!`,
    "/unblockuser": `You Unblocked ${data[0].fullname || "USer"}!`,
  }
  const authToken = {
    "/register": sendAccessAndRefreshTokenThroughCookie,
    "/login": sendAccessAndRefreshTokenThroughCookie,
    "/getAccessToken": sendAccessAndRefreshTokenThroughCookie,
    "/forgotpassword": sendAccessAndRefreshTokenThroughCookie,
    "/callback": sendAccessAndRefreshTokenThroughCookie,
  }
  const deleteToken = ()=> {
   res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  }
   if(req.path === "/logout"){
    deleteToken();
   }
 const handler =  authToken[req.path];
 if(handler){
  handler(data[0].email, res);
 }
  // succees msg for specific urls 
   let flashMsgSucceess = succeesMsg || specificURLMsg[req.path];
const successRedirectUrl = successRedirect ||  req.session?.requestURL || "/";
// delete requestUrl from session that you put in isLoggedin middleware to get Access token and RefreshToken
delete req.session.requestURL;
if(req.path !== "/getAccessToken" && flashMsgSucceess) {
  req.flash("success", `${flashMsgSucceess}`);
} 
  res.redirect(successRedirectUrl);
  } catch (err) {
req.flash('error', `${err}`)
res.redirect(failureRedirect)
  }
 }



module.exports = webRouteResFormate;