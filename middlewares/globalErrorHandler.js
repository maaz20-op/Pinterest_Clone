const { ApiResponseError } = require("../utils/apiResponse")

module.exports = function globalErrorHandler(err, req, res, next){
let api;
console.log("error glovbal hogya")
req.originalurl.startsWith("/api/v1")? api= true: api= false;
 if(api){
ApiResponseError(res, err, "Error", 500);
 }

 req.flash("error",`${err}`);
res.redirect(res.local?.failureRedirect);
}