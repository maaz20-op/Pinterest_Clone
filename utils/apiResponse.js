const { v4: uuidv4} = require("uuid")

module.exports.APiResponseSuccess  = function (res, data, message = "Success", statusCode = 200){
return res.status(statusCode).json({
 success: true,
 statusCode,
message,
data,
meta: {
requestId: uuidv4(),
timestamp: new Date().toISOString(),
apiVersion: "v1",
}
})

}

module.exports.ApiResponseError = function (res, error, message = "Error", statusCode = 404){
return res.status(statusCode).json({
success: false,
statusCode,
message,
error,
meta: {
requestId: uuidv4(),
timestamp: new Date().toISOString(),
apiVersion: "v1",
}
})
}