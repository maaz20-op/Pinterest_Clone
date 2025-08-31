const mongoose = require("mongoose");


const messageSchema =  new mongoose.Schema({

})


let MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;