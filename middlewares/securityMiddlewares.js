const { ApiResponseError } = require("../utils/apiResponse");

const checkOrigin = (req, res, next) => {
    const origin =  req.protocol + '://' + req.get('host') + req.originalUrl;
    if(origin && origin.startsWith("http://localhost:3000")) return next();
  let isApiRequest;
    req.url?.startsWith('/api/')?isApiRequest = true : isApiRequest = false;
 if(isApiRequest)  ApiResponseError(res, "Unauthorized Request", "Error", 401)
 else {
 req.flash("error", "Unauthorized Access Request Denied!")
 res.redirect("/register")
};
}

module.exports = checkOrigin;