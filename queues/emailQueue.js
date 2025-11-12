const {Queue, Worker} = require("bullmq")
const redisConnection = require("../config/redisClient");
const sendWelcomeEmail = require("../emails/signupWelcome");
const loginEmailQueue = new Queue("login-email", {connection: redisConnection});

async function addLoginEmailToQueue(email, fullname){
 await loginEmailQueue.add('send_email', {email, fullname});
 console.log("task added in quqeu")
};


const worker = new Worker('login-email',
async job => {
    console.log(` worker ka data ${job.data.email} ${job.data.fullname}`)
    sendWelcomeEmail(job.data.email, job.data.fullname)
}
    ,{connection: redisConnection});


module.exports = {
     worker,
     redisConnection,
 addLoginEmailToQueue,
}
