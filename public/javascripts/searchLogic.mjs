import { videoControlsSetup } from "/javascripts/videoControllers.mjs"

  
  const toggleSection = document.querySelector(".sections")
  const container = document.querySelector(".container");
  const contai = document.querySelector(".container2")
  let isSearchActive = false;
    let feedBtn = document.querySelector(".button");
const searchBtn = document.querySelector(".search-btn");
  const userDataDiv = document.getElementById("userData");
const user = JSON.parse(userDataDiv.dataset.user);
window.loggedInUser = user;
  // search logic 
  const sendData = async () => {
    container.classList.add("searchVideo")
    const searchedValue = document.querySelector(".search").value.trim();
    if (!searchedValue) {
      alert("Please enter something to search.");
      return;
    }
contai.style.display = "none"
toggleSection.style.display = "none"
container.style.display = "block"
    container.innerHTML = '<h2 style="color:white; margin-left:2.5cm;margin-top:1cm">Searching...</h2>';

    try {
      
      const response = await fetch(`api/v1/posts?text=${searchedValue }`, {
        method:"GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

    

      const posts = await response.json();
      if(!posts.success || Array.isArray(posts) )  return  
      
    console.log(posts)
      feedBtn.classList.remove("normal")
    feedBtn.classList.add("style")
      container.innerHTML = ""; // Clear after successful fetch
  console.log(posts.data)
      if (posts.data[0].length > 0) {
       posts.data[0].forEach((eachPost) => {
      
           // protect from null post
           if(eachPost.user ===null){
             return console.log("err")
           } 
   // Optional: Double-check postdata matches fallback
   
  const div = document.createElement("div");
let loggedInUser = window.loggedInUser;
if(eachPost.mediaType === "image" ) {
let likeBtn = "";
if(eachPost.likes.includes(loggedInUser._id.toString())){
  likeBtn =  ` <button data-src="${eachPost._id}"   class="like-btn"> ❤️ Liked ${eachPost.likes.length} </button>`
} else {
  likeBtn = ` <button data-src="${eachPost._id}"   class="like-btn">Likes ${eachPost.likes.length} </button>`
}
     div.classList.add("masonry-item", "upgraded-card");
            div.innerHTML = `
              <div class="user-avatar">
                <a class="profileRefrence"  href="/otherusersprofile/${eachPost.user._id}">
                <img src="${eachPost.user.profileImage}" alt="User Avatar" />
              </a>
                <a class="profileRefrence2"  href="/otherusersprofile/${eachPost.user._id}">@${eachPost.user.username}</a>
              </div>

              <img src="${eachPost.mediaUrl}" alt="pic" class="main-image" />
              <p class="post-text">${eachPost.postdata}</p>

      <div class="post-actions">
  
  ${likeBtn}
            

                <form action="/pins/savepin" method="post" style="display:inline;">
                  <input hidden type="text" name="image" value="${eachPost.mediaUrl}" required />
                  <input hidden type="text" name="text" value="${eachPost.postdata}" required />
                  <button class="save-btn">📌 Save</button>
                </form>
              </div>
            `;
} else if(eachPost.mediaType === "video"){
let isLiked = eachPost.likes.includes(loggedInUser._id.toString())?`<i data-src="${eachPost._id}" class="heart fa-solid fa-heart" style="color: red;"></i>`: ` <i  data-src="${eachPost._id}" class="heart fa-regular fa-heart"></i>`;
let isFollowed = "";
  if(eachPost.user._id.toString() === loggedInUser._id.toString()){ 
      isFollowed  =`  <button data-src="${eachPost.user._id}" class="you-btn" type="submit">You </button>`
     } else if(eachPost.user.followers.includes(loggedInUser._id.toString())) {
       
isFollowed = ` <button data-src="${eachPost.user._id}" class="you-btn" type="submit">  <p>Followed </p> <i class="fas fa-user-plus"></i></button>`
   } else { 
  isFollowed = ` <button data-src="${eachPost.user._id}" class="follow" type="submit">Follow </button>`
  } 
  
  div.classList.add('video')
  
  div.innerHTML = `
  <video src="${eachPost.mediaUrl}"  ></video>
 <div class="follow-container-video">
  <div class="follow-user">
  
 <a href="/otherusersprofile/${eachPost.user._id}"> <img src="${eachPost.user.profileImage}"> </a>
  <div class="user-data">
    <h1>${eachPost.user.fullname}</h1>
    <h2>@${eachPost.user.username}</h2>
  </div>
${isFollowed}
  

    
</div>
</div>
<div class="video-title">${eachPost.postdata}  #reelNest</div>
<div class="video-action">
<div class="play-pause" >
  <i class="fa-solid fa-play"></i>
</div>
  <div class="column-action">
<div  class="like-video">
${isLiked}

  <p class="show-video-likes">${eachPost.likes.length}</p>
</div>

 <div class="comment-video">
  <i class="fa-solid fa-comment-dots"></i>
  <P>${ eachPost.comments.length}</P>
</div>


<div class="share-video">
  <i onclick="shareVideo(this)" data-url="https://reelnest-official.vercel.app/feed?postId=${eachPost._id} "  class="share-icon fa-solid fa-share-nodes"></i>
  <p>Share</p>
</div>

</div>

<div class="post-data">
<div class="text">
  <p>${eachPost.postdata} #reelNest</p>
</div>
</div>

<div class="progress-bar">
<div class="bar"></div>
</div>

    <div class="comments-container">
  <div class="heading">
  <h1>Comments</h1> <i class="crossIcon fa fa-times"></i>
</div>
<div class="divider-line"></div>
<div class="inner">
<textarea data-src="${eachPost._id }" placeholder="Share your thought's..." class="commentInput" name="message" rows="5" cols="30"></textarea>
  <i class="send fa-solid fa-paper-plane"></i>
    <div class="loader"></div>
</div>
<div class="wrapper">
<div class="actual-comments-box">
  
</div>
</div>
  </div>
 </div>
 `
}
            container.appendChild(div);
  
          });
 videoControlsSetup()

      } else {
        container.innerHTML = `<h1 style="color:white;font-size:20px;margin-left:2cm;width:60vw;">No Posts Found...</h1>`
      }
    } catch (error) {
      console.log("Search Error:", error);
      container.innerHTML = "<h2>Something went wrong. Try again later.</h2>";
    }
  };

searchBtn.addEventListener("click", function(){
  isSearchActive = true;
  sendData()
})



  feedBtn.addEventListener("click", function () {
        container.classList.remove("searchVideo")
    window.location.href = "/";
  });
  
  export let isSearch =  isSearchActive;