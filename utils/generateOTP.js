// generate a 4-digit OTP login and signup verification
function generateOTP() {
return Math.floor(1000+ Math.random() * 9000).toString();
}

module.exports = generateOTP;
