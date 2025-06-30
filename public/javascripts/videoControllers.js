
// for video controls 

export function videoControlsSetup(){
  alert("working maaz")
let currentActionBar = null;
let currentPlayPause = null;
let currentActionVideo = null;
let currentProgressBar = null;
let innerProgressBar = null;
let commentInput = null;
let currentVideoTitle = null;
let isDragging = false;

let videos = document.querySelectorAll(".video");

videos.forEach((videoDiv) => {
  videoDiv.addEventListener("click", function (e) {
    // Fullscreen
    if (videoDiv.requestFullscreen) {
      videoDiv.requestFullscreen();
    } else if (videoDiv.webkitRequestFullscreen) {
      videoDiv.webkitRequestFullscreen();
    } else if (videoDiv.msRequestFullscreen) {
      videoDiv.msRequestFullscreen();
    }

    currentActionBar = videoDiv.querySelector(".video-action");
    currentActionVideo = videoDiv.querySelector("video");
    currentPlayPause = videoDiv.querySelector(".play-pause");
    currentProgressBar = videoDiv.querySelector(".progress-bar");
    commentInput = videoDiv.querySelector(".commentInput")
    currentVideoTitle = videoDiv.querySelector(".video-title")
    innerProgressBar = videoDiv.querySelector(".bar");
    if (!currentPlayPause.classList.contains("listener-attached")) {
      currentPlayPause.classList.add("listener-attached");

      currentPlayPause.addEventListener("click", function (event) {
        event.stopPropagation();
        if (!currentActionVideo) return;

        if (currentActionVideo.paused) {
          currentActionVideo.play();
          currentPlayPause.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        } else {
          currentActionVideo.pause();
          currentPlayPause.innerHTML = `<i class="fa-solid fa-play"></i>`;
        }
      });
      
      
      

      // Click seek
      currentProgressBar.addEventListener("click", function (e) {
        seek(e.clientX);
      });

      // Mouse drag
      currentProgressBar.addEventListener("mousedown", function (e) {
        isDragging = true;
        seek(e.clientX);
      });

      // Touch drag start
      currentProgressBar.addEventListener("touchstart", function (e) {
        isDragging = true;
        seek(e.touches[0].clientX);
      });

      // Progress update
      currentActionVideo.addEventListener("timeupdate", function () {
        let percent = (currentActionVideo.currentTime / currentActionVideo.duration) * 100;
        innerProgressBar.style.width = percent + "%";
      });
    }
  });
});
let commentContainer = null;
// like video
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("heart")) {
    const heartIcon = e.target;
    const postId = heartIcon.getAttribute("data-src");
    const likeCountEl = heartIcon.closest(".like-video").querySelector(".show-video-likes");

    try {
      const res = await fetch("/posts/likepost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });

      const data = await res.json();
      if (data.post && data.loggedInUser) {
        likeCountEl.textContent = data.post.likes.length;

        if (data.post.likes.includes(data.loggedInUser._id)) {
          heartIcon.classList.remove("fa-regular");
          heartIcon.classList.add("fa-solid", "liked");
          heartIcon.style.color = "red"; // Optional: Add red color on like
        } else {
          heartIcon.classList.remove("fa-solid", "liked");
          heartIcon.classList.add("fa-regular");
          heartIcon.style.color = ""; // Optional: Reset color on unlike
        }
      }
    } catch (err) {
      console.error("Video like failed:", err);
    } } else if(e.target.closest(".comment-video")){
  commentContainer = e.target.closest(".video").querySelector(".comments-container")
  commentContainer.style.display = "block"
  
  let showComments = async function(){
  let input = commentContainer.querySelector("textarea")
  let commentSection = commentContainer.querySelector(".actual-comments-box");

// Pehle loading message dikhao
commentSection.innerHTML = `<p style="color:white;margin: 70px 0px 0px 80px">Loading comments...</p>`;
  let id = input.getAttribute("data-src");
  try {
    
   let response = await fetch(`/comments/showcomments?postId=${id}`, {
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
    });
  
  let post = await response.json()
  

if(post && post.comments.length > 0){
commentSection.innerHTML = "";
post.comments.reverse().forEach((comment) => {
let div = document.createElement("div");
div.classList.add('comment');
 div.innerHTML = `
  <div class="user-info">
    <img src="${comment.userId.profileImage}">
    <h1>@${comment.userId.username}</h1>
    <h2>1 min ago</h2>
  </div>
<div class="text"><p>${comment.text}</p></div>`

commentSection.appendChild(div)
  
})
  } else {
    commentSection.innerHTML = `<p style="color:white;margin: 70px 0px 0px 80px">No comments...</p>`;
  }
  
  
    
  } catch(err) {
    console.log(err.message)
  }
    };
  showComments();
  
  }
  else if (e.target.closest(".crossIcon")){
  commentContainer.style.display = "none"
  }
  else if(e.target.classList.contains("send")){

let input = e.target.previousElementSibling;
let id = input.getAttribute("data-src");

let createComments = async ()=>{
  
if(!input) return;

try {

let response = await fetch("/comments/createcomment",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body: JSON.stringify({
    inputText:input.value,
    postId:id,
  })
});

let data = await response.json();

let commentContainerBox = input.closest(".comments-container").querySelector(".actual-comments-box");
  if(data.comment && data.loggedInUser){
let div = document.createElement("div")
div.classList.add("comment");
div.innerHTML = `
    <div class="user-info">
    <img src="${data.loggedInUser.profileImage}">
    <h1>@${data.loggedInUser.username}</h1>
    <h2>1 min ago</h2>
  </div>
<div class="text"><p>${data.comment.text}</p></div>
`
commentContainerBox.prepend(div)
  }
  
  
  
} catch (err) {
  console.log(`Server error is ${err.message}`)
}

};

createComments();
}


});

function shareVideo(element){
    let postUrl = element.getAttribute("data-url");
  const postText = "Checkout this amazing video on ReelNest! 🔥🎥👇";
navigator.share({
  title: "ReelNest video",
  text: postText,
  url: postUrl,
}).then(() => {
  console.log("Share successful!");
}).catch((error) => {
  alert("Sharing failed: " + error.message);
});
  
}

// Mouse move
window.addEventListener("mousemove", function (e) {
  if (isDragging) {
    seek(e.clientX);
  }
});

// Touch move
window.addEventListener("touchmove", function (e) {
  if (isDragging) {
    seek(e.touches[0].clientX);
  }
});

// End dragging
window.addEventListener("mouseup", () => isDragging = false);
window.addEventListener("touchend", () => isDragging = false);

function seek(clientX) {
  if (!currentProgressBar || !innerProgressBar || !currentActionVideo) return;

  let barStart = currentProgressBar.getBoundingClientRect().left;
  let barWidth = currentProgressBar.clientWidth;
  let offsetX = clientX - barStart;
  let percent = Math.max(0, Math.min(1, offsetX / barWidth));

  innerProgressBar.style.width = percent * 100 + "%";
  innerProgressBar.style.backgroundColor = "red";
  currentActionVideo.currentTime = percent * currentActionVideo.duration;
}


/* show video on click of share link example share to wattsapp  */ 




// Fullscreen change
document.addEventListener("fullscreenchange", function () {
  if (currentActionBar && document.fullscreenElement) {
    currentActionBar.style.display = "block";
    currentActionVideo.currentTime = 0;
    if(currentVideoTitle){
    currentVideoTitle.style.display = "none";
    }
  } else if (currentActionBar) {
    currentActionBar.style.display = "none";
        if(currentVideoTitle){
    currentVideoTitle.style.display = "block";
    }
    if(commentContainer){
    commentContainer.style.display = "none"
    }
    if (currentActionVideo) currentActionVideo.pause();
  }
});

}

