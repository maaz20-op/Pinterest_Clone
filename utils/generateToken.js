const jwt = require('jsonwebtoken');

const generateAccessToken = (email) => {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (email) => {
 return jwt.sign({  email }, process.env.REFRESH_TOKEN_SECRET, {
  expiresIn: "7d",
 })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
 } 







