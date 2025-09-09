const { generateRefreshToken } = require("./generateToken");
const { generateAccessToken } = require("./generateToken");


function sendAccessAndRefreshTokenThroughCookies (userEmail, res) {
const accessToken = generateAccessToken(userEmail);
    const refreshToken = generateRefreshToken(userEmail);
    res.cookie("accessToken", accessToken, {
  httpOnly: true, // prevent JS access to cookie (secure)
  secure: process.env.NODE_ENV === "production", // only HTTPS in prod
  sameSite: "Lax", // or "Strict" / "None" based on frontend-backend location
  maxAge: 15 * 60 * 1000 , // 15 min 
});
 res.cookie("refreshToken", refreshToken, {
  httpOnly: true, // prevent JS access to cookie (secure)
  secure: process.env.NODE_ENV === "production", // only HTTPS in prod
  sameSite: "Lax", // or "Strict" / "None" based on frontend-backend location
  maxAge: 24 * 60 * 60 * 1000 * 5, // 5 day in ms
});

}

module.exports = sendAccessAndRefreshTokenThroughCookies;