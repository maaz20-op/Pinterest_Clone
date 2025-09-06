const transporter = require('../config/nodemailerConfig');


function sendOptonEmail(toEmail, otp) {
   transporter.sendMail({
    from: "from ReelNest for Account Verification",
    to: toEmail,
    subject: `Verification code from ReelNest:`,
    html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #5b3cc4;"> your verication code is <span style="color: #080808ff;">${otp}</span></h2>
        <p>We're so excited to have you on board. 🚀</p>
        <p>ReelNest is a place to share your favorite reels, connect with creators, and express yourself freely.</p>
        <hr/>
        <p>Start your journey by exploring trending reels and making your first post!</p>
        <a href="https://reelnest-official.vercel.app" style="display:inline-block; background:#f25a41; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; margin-top:15px;">
          Go to ReelNest
        </a>
      </div>
    `
   })
}


module.exports = sendOptonEmail;