const apiResponse = require("../utils/apiResponse");
const {APiResponseSuccess, ApiResponseError} = require("../utils/apiResponse")


const apiRouteResFormate = (fn) => async (req, res)=> {
  try {
 const data = await fn(req);
if(!data || !Array.isArray(data) || data.length === 0){
  ApiResponseError(res, "Invalid Data Operation Failed!", "Error", 404);
  return;
}
//console.log(data)
APiResponseSuccess(res, data, "Success", 200);
  } catch (err) {
    console.log("api route error", err)
    ApiResponseError(res, err, "Error", 500)
  }
 }


module.exports = apiRouteResFormate;