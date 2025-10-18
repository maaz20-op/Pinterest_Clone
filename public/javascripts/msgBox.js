// Client-side JavaScript for chat functionality
let socket = io();

socket.on("connect", ()=>{
  console.log("Connected to server with ID:", socket.id);
  
})



let userData = document.querySelector(".profile-status");
let username = userData.getAttribute("data-src");
let userData2 = document.querySelector(".profile-menu");
let loggedInUser = userData2.getAttribute("data-src");
// to register the user with socket id
socket.emit("register", loggedInUser); 
console.log("Registered as:", loggedInUser);

socket.on("chat-msg", (msg) =>{
  console.log("New message received", msg);

  const receiveMsgDiv = document.createElement("div");
   receiveMsgDiv.classList.add('message', 'other')
   receiveMsgDiv.textContent = msg;
   document.getElementById("chatMessages").appendChild(receiveMsgDiv);
})

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (text === "") return;
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user");
    messageDiv.textContent = text;


socket.emit("chat-msg", {
   msg: text,
   to: username,
   from: loggedInUser
  });

    document.getElementById("chatMessages").appendChild(messageDiv);
    input.value = "";



    // Auto scroll to bottom
    const chat = document.getElementById("chatMessages");
    chat.scrollTop = chat.scrollHeight;
  
}

document.querySelector('button').addEventListener('click', sendMessage)