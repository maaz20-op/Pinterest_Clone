let followerBoxes = document.querySelectorAll(".chat-user");



followerBoxes.forEach((followerBox) => {
followerBox.addEventListener("click", (e) => {
    e.stopPropagation();
  let followerId =  e.currentTarget.querySelector(".avatar").getAttribute("data-src");
  window.location.href  = `/showmsgpageofothersuser/${followerId}`;
});
    
});
