const container = document.querySelector(".container");
  container.addEventListener("click", async function(e) {
  if (e.target.classList.contains("like-btn")) {
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

      if (data.post && data.loggedInUser) {
        if (data.post.likes.includes(data.loggedInUser._id.toString())) {
          e.target.innerHTML = `❤️ Liked ${data.post.likes.length}`;
        } else {
          e.target.innerHTML = `Likes ${data.post.likes.length}`;
        }
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  }
});
