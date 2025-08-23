function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if (text !== "") {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "user");
    messageDiv.textContent = text;

    document.getElementById("chatMessages").appendChild(messageDiv);
    input.value = "";

    // Auto scroll to bottom
    const chat = document.getElementById("chatMessages");
    chat.scrollTop = chat.scrollHeight;
  }
}

document.querySelector('button').addEventListener('click', sendMessage)