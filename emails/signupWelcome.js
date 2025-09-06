const transporter = require('../config/nodemailerConfig');


function sendWelcomeEmail(toEmail, userFullname) {
   transporter.sendMail({
    from: "from ReelNest",
    to: toEmail,
    subject: 'Welcome to REELNEST Official Web App:',
    html: `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #5b3cc4;">Welcome to <span style="color: #f25a41;">ReelNest</span>, ${userFullname}!</h2>
        <p>We're so excited to have you on board. 🚀</p>
        <p>ReelNest is a place to share your favorite reels, connect with creators, and express yourself freely.</p>
        <hr/>
        <p>Start your journey by exploring trending reels and making your first post!</p>
        <a href="https://reelnest-official.vercel.app" style="display:inline-block; background:#f25a41; color:white; padding:10px 20px; border-radius:5px; text-decoration:none; margin-top:15px;">
          Go to ReelNest
        </a>
        <p style="margin-top: 30px; font-size: 12px; color: #888;">If you didn’t create this account, you can ignore this email.</p>
      </div>
    `
   })
}

module.exports = sendWelcomeEmail;