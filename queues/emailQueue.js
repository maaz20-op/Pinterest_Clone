const {Queue, Worker} = require("bullmq")
const IORedis = require("ioredis")
const redisConnection =  new IORedis("rediss://default:AUuHAAIncDIxOWU0ZmFiMDUzYzg0YzRhYjNhMzZiNzk2MWY3MjYyZXAyMTkzMzU@stable-seasnail-19335.upstash.io:6379", {maxRetriesPerRequest: null
})
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
