
// for video controls 


export function videoControlsSetup(){
let currentActionBar = null;
let currentPlayPause = null;
let currentActionVideo = null;
let currentProgressBar = null;
let innerProgressBar = null;
let currentFollowContainer = null;
let commentInput = null;
let currentDeleteBtn = null;
let currentCommentLoader = null;
let currentVideoTitle = null;
let isDragging = false;
let clickedDiv = null;
let commentContainer = null;


// check is current video is in search container 
let videoContainer = null;



if(document.querySelector(".searchVideo")) videoContainer = document.querySelector(".searchVideo");
else if(document.querySelector(".container2")) videoContainer = document.querySelector(".container2");

if(!videoContainer.classList.contains("attached-bubling")) {
videoContainer.addEventListener("click", function(e) {
  clickedDiv = e.target.closest(".video") 

  // Run if video is clicked
  if (clickedDiv) {
    addClickOnVideo();
  }

  // Always run setupFunctionality for things like heart, comment, etc.
  setupFunctionality(e);
});
}
 videoContainer.classList.add("attached-bubling")


// setup fullscreen progress bar drag seek etc 
function addClickOnVideo() {
    
    let videoDiv = clickedDiv
    if(!videoDiv) return;
    
    
    if (videoDiv.requestFullscreen) {
      videoDiv.requestFullscreen();
    } else if (videoDiv.webkitRequestFullscreen) {
      videoDiv.webkitRequestFullscreen();
    } else if (videoDiv.msRequestFullscreen) {
      videoDiv.msRequestFullscreen();
    }

     
    currentActionBar = videoDiv.querySelector(".video-action");
    currentActionVideo = videoDiv.querySelector("video");
    currentFollowContainer = videoDiv.querySelector(".follow-container-video");
    currentPlayPause = videoDiv.querySelector(".play-pause");
    currentProgressBar = videoDiv.querySelector(".progress-bar");
    commentInput = videoDiv.querySelector(".commentInput")
    currentCommentLoader = videoDiv.querySelector(".loader")
  currentDeleteBtn = videoDiv.querySelector(".delete-icon-video")
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
  }


// setup likes comments and share btn

async function setupFunctionality(e) {
  if (e.target.classList.contains("heart")) {
    const heartIcon = e.target;
    const postId = heartIcon.getAttribute("data-src");
    const likeCountEl = heartIcon.closest(".like-video").querySelector(".show-video-likes");

    try {
      const res = await fetch("/api/v1/posts/like", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });

      const json = await res.json();
      let data = json.data;
      let post = data[0];
      let loggedInUser = data[1];
      if (post && loggedInUser) {
        likeCountEl.textContent = post.likes.length;

        if (post.likes.includes(loggedInUser._id)) {
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
  if(commentContainer){
  commentContainer.style.display = "block"
  
  }
  
  let showComments = async function(){
  let input = commentContainer.querySelector("textarea")
  let commentSection = commentContainer.querySelector(".actual-comments-box");

// Pehle loading message dikhao
commentSection.innerHTML = `<p style="color:white;margin: 70px 0px 0px 80px">Loading comments...</p>`;
  let id = input.getAttribute("data-src");
  try {
    
   let response = await fetch(`/api/v1/comments?postId=${id}`, {
      method:"GET",
      headers:{
        "Content-Type":"application/json"
      },
    });
  
  let jsonData = await response.json()
  
if(jsonData.data && jsonData.data[0].comments.length > 0){
commentSection.innerHTML = "";
jsonData.data[0].comments.reverse().forEach((comment) => {
let div = document.createElement("div");
div.classList.add('comment');
 div.innerHTML = `
  <div class="user-info">
    <a href="/otherusersprofile/${comment.userId._id}" >  <img src="${comment.userId.profileImage}"></a>
    <h1>@${comment.userId.username}</h1>
    <h2>${moment(comment.createdAt).fromNow()}</h2>
  </div>
<div class="text"><p>${comment.text}</p></div>`

commentSection.appendChild(div)
  
})
  } else {
    commentSection.innerHTML = `<p class="msg" style="color:white;margin: 70px 0px 0px 80px">No comments...</p>`;
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
let sendIcon = e.target;
let input = e.target.previousElementSibling;
let id = input.getAttribute("data-src");

let createComments = async ()=>{
  
if(!input || !id) return;

let commentContainerBox = input.closest(".comments-container").querySelector(".actual-comments-box"); 

if(commentContainerBox.querySelector(".msg")){
  commentContainerBox.innerHTML = ""
}

if(currentCommentLoader){
  currentCommentLoader.style.display = "block";
  sendIcon.style.display = "none";
}


try {

let response = await fetch("/api/v1/comments",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body: JSON.stringify({
    inputText:input.value,
    postId:id,
  })
});

let jsonData = await response.json();
let commentContainerBox = input.closest(".comments-container").querySelector(".actual-comments-box");

input.value = ""
    currentCommentLoader.style.display = "none";
  sendIcon.style.display = "block";
  if(jsonData.data[0] && jsonData.data[1]){
let loggedInUser = jsonData.data[1];
let comment = jsonData.data[0];
let div = document.createElement("div")
div.classList.add("comment");
div.innerHTML = `
    <div class="user-info">
<a href="/otherusersprofile/${loggedInUser._id}" >  <img src="${loggedInUser.profileImage}"> </a>
    <h1>@${loggedInUser.username}</h1>
    <h2>${moment(comment.createdAt).fromNow()}</h2>
  </div>
<div class="text"><p>${comment.text}</p></div>
`
commentContainerBox.prepend(div)
  }
  
  
  
} catch (err) {
  console.log("err",err)
}

};

createComments();
} 

}




  

  document.querySelectorAll(".share-icon").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const postUrl = e.target.getAttribute("data-url");
    if (!postUrl) return alert("No URL found");

    navigator.share({
      title: "ReelNest video",
      text: "Checkout this amazing video on ReelNest! 🔥🎥👇",
      url: postUrl,
    })
    .then(() => console.log("Share successful!"))
    .catch((err) => console.log("error in video share" + err)
    );
  })
});


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




// Fullscreen change

document.addEventListener("fullscreenchange", function () {
  if (currentActionBar && document.fullscreenElement) {
    currentActionBar.style.display = "block";
    currentActionVideo.currentTime = 0;
    if(currentFollowContainer){
    currentFollowContainer.style.display = "block"
    }
    if(currentDeleteBtn){
      currentDeleteBtn.style.display = "block";
    }
    
    if(currentVideoTitle){
    currentVideoTitle.style.display = "none";
    }
    
    if(currentPlayPause){
    currentPlayPause.innerHTML =  `<i class="fa-solid fa-play"></i>`
    }
    
  } else if (currentActionBar) {
    currentActionBar.style.display = "none";
        if(currentVideoTitle){
    currentVideoTitle.style.display = "block";
  currentVideoTitle.style.cssText = "overflow:hidden;font-weight:600;padding:6px; overflow: hidden; display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;"
    }
        if(currentFollowContainer){
    currentFollowContainer.style.display = "none"
    }
        if(currentDeleteBtn){
      currentDeleteBtn.style.display="none"
    }
    currentActionVideo.currentTime = 0
    if(commentContainer){
    commentContainer.style.display = "none"
    }
    if (currentActionVideo) currentActionVideo.pause();
  }
});

}

  document.addEventListener("DOMContentLoaded", () => {
    videoControlsSetup()
  });

window.videoControlsSetup = videoControlsSetup;