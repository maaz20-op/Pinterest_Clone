const userModel = require("../models/user-model");
const sendWelcomeEmail = require("../emails/signupWelcome")


// send signup email on insert of new user document
async function userWatcherStreams() {
const changeStream =  userModel.watch([
    {
   $match:  {  operationType: "insert"}
    }
  ], { fullDocument: "updateLookup"});

  changeStream.on("change", (change)=> {
    let email = change?.fullDocument?.email;
    let fullname = change?.fullDocument?.fullname;
   sendWelcomeEmail(email, fullname);
  });
}

module.exports  = userWatcherStreams;