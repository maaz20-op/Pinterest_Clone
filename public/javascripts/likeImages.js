const container = document.querySelector(".container");
  container.addEventListener("click", async function(e) {
    const likebtn = e.target.classList.contains("like-btn")
  if (likebtn) {
    const id = e.target.getAttribute("data-src");

    try {
      const response = await fetch("api/v1/posts/like", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
     
      if (data.success && data.data[0] && data.data[1]) {
        if (data.data[0].likes.includes(data.data[1]._id.toString())) {
          e.target.innerHTML = `❤️ Liked ${data.data[0].likes.length}`;
       
        } else {
         e.target.innerHTML = `Likes ${data.data[0].likes.length}`;
        }
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  }
});
