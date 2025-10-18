const nodemailer = require('nodemailer');


// Create a transporter object using SMTP 

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secrue: true,
    auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
 }
})

module.exports = transporter;