

document.addEventListener("click", async function(e) {
  // Block Logic
  const blockBtn = e.target.closest(".block-btn");
  if (blockBtn) {
    document.querySelector("#blockUserData").submit();
    return;
  }
  })