const mongoose = require("mongoose");


const messageSchema =  new mongoose.Schema({
from: String,
to: String,
senderId: {
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
msg: String,
})


let messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;