
const MessageModel = require("../models/message-model");
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
  socket.on("chat-msg", ({msg, to})=>{

let room = socketMapID[to];
console.log("Room ID: send ",to, room);

    console.log("Message from client:", msg);
    // Broadcast the message to all connected clients
  if(!room) return;
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