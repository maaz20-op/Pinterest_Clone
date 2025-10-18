
  document.addEventListener("click", async function(e) {
  const followBtn = e.target.closest(".follow");
  if (followBtn) {
    try {
      const userId = followBtn.getAttribute("data-src");
      const res = await fetch("/users/followuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId })
      });

      const data = await res.json();
      if (!data.followersCount || !data.followingCount) {
        console.log("Invalid data returned:", data);
        return;
      }

      document.querySelector(".count2").innerHTML = `|&nbsp; ${data.followersCount} &nbsp;|`;
      document.querySelector(".count1").innerHTML = `|&nbsp; ${data.followingCount} &nbsp;|`;
      followBtn.innerHTML = `<p>Followed</p> <i class="fas fa-user-plus"></i>`;
    } catch (err) {
      console.log("Follow error:", err.message);
    }
  }
});