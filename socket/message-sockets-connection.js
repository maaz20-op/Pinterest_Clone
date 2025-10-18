
const messageModel = require("../models/message-model");
const userModel = require("../models/user-model");
let socketMapID = {};



function messageSocketsConnection(io) {


let socketMapID = {};

io.on('connection', (socket) => {
  console.log("uiser connected", socket.id);
socket.on("register", (username)=> {
 socketMapID[username] = socket.id
 console.log(socketMapID);
})
console.log(socket.id)
  socket.on("chat-msg", async ({msg, to, from})=>{

let room = socketMapID[to];
console.log("Room ID: send ",to, room);

    console.log("Message from client:", msg);
    // Broadcast the message to all connected clients
  if(!room) return console.log("somew erro occured");
let sender = await userModel.findOne({username: from});
let receiver = await userModel.findOne({username: to});
console.log(sender.fullname,receiver.fullname)
if(!sender || !receiver) return;
  let text = await messageModel.create({
  from,
  to,
senderId: sender._id,
receiverId: receiver._id,
msg,
})

console.log(text);
 socket.to(room).emit("chat-msg", msg);
  })

 socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
    for (let user in socketMapID) {
      if (socketMapID[user] === socket.id) {
        delete socketMapID[user];
        break;
      }
    }
  
  });
})

}

module.exports =  messageSocketsConnection;