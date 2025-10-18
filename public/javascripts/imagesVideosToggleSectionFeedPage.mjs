 import { videoControlsSetup } from '/javascripts/videoControllers.mjs'
 import { isSearch } from "/javascripts/searchLogic.mjs";
 
 let sections = document.querySelector("ul");
let container1 = document.querySelector(".container");
let isEndOfPosts = false;
// loader logic
let loaderContainer = document.querySelector(".paginationLoader")
let loaderDiv = document.createElement("div");



let container2 = document.querySelector(".container2");
let imagesBar = sections.querySelector(".images");
let videoBar = sections.querySelector(".videos");
let isVideoSection = false

imagesBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"

sections.addEventListener("click",function(e){
  if(e.target.classList.contains("videos")){
  isVideoSection = true;
  isEndOfPosts = false
  loaderContainer.innerHTML = ""
  loaderContainer.appendChild(loaderDiv)
imagesBar.style.cssText = "border-bottom:none"
videoBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"
container2.style.cssText = "display:block;min-height:100vh;margin-bottom:160px;"
container1.style.cssText ="display:none"
    
  } else if(e.target.classList.contains("images")) {

loaderContainer.innerHTML = ""
loaderContainer.appendChild(loaderDiv)
  isVideoSection = false
  isEndOfPosts = false;
videoBar.style.cssText = "border-bottom:none"
imagesBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"
container2.style.cssText = "display:none;"
container1.style.cssText ="display:block;min-height:100vh;"
      
  }
  localStorage.setItem("section", isVideoSection)
})

function getCurrentSection(){
let isVideo = localStorage.getItem("section");
   
if(isVideo === "false") {
  
  videoBar.style.cssText = "border-bottom:none"
  isVideoSection = false
imagesBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"
container2.style.cssText = "display:none;"
container1.style.cssText ="display:block;min-height:100vh;"
return;
}

isVideoSection = true
imagesBar.style.cssText = "border-bottom:none"
videoBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"
container2.style.cssText = "display:block;min-height:100vh;margin-bottom:160px"
container1.style.cssText ="display:none"


}

  getCurrentSection()
  

// flags 
let videosPage = 1;
let imagesPage = 1;

let isLoading = false;
let page;
let url;



let fetechedVideosContainer = document.querySelector(".video-container");


async function loadPosts() {
  const page = isVideoSection ? videosPage : imagesPage;
  const url = isVideoSection ? '/posts/getPostsVideos' : '/posts/getPostsImages';

try {
let response  = await  fetch(`${url}?page=${page}`)
let data = await response.json();


loaderDiv.classList.remove("lazyLoader") 
if(!data.success) return

  if(data.posts.length  === 0) {
    isEndOfPosts = true;
    let h1 = document.createElement("h1")
    h1.innerText = "You Reached The End";
    h1.style.cssText = "color: white; margin-left:27%; font-size:15px;width:100%;"

  return  loaderContainer.appendChild(h1)
  }

const mediaType = data.posts[0].mediaType?.toLowerCase();

if (mediaType === 'video') {
  videosPage++;
} else if (mediaType === 'image') {
  imagesPage++;
}

data.posts.forEach((eachPost) => {
  
  if(eachPost.mediaType === 'video'){
  
  let div = document.createElement("div")
  
  let isLiked = eachPost.likes.includes(loggedInUser._id.toString())?`<i data-src="${eachPost._id}" class="heart fa-solid fa-heart" style="color: red;"></i>`: ` <i  data-src="${eachPost._id}" class="heart fa-regular fa-heart"></i>`;
let isFollowed = "";
  if(eachPost.userData._id.toString() === loggedInUser._id.toString()){ 
      isFollowed  =`  <button data-src="${eachPost.userData._id}" class="you-btn" type="submit">You </button>`
     } else if(eachPost.userData.followers.includes(loggedInUser._id.toString())) {
       
isFollowed = ` <button data-src="${eachPost.userData._id}" class="you-btn" type="submit">  <p>Followed </p> <i class="fas fa-user-plus"></i></button>`
   } else { 
  isFollowed = ` <button data-src="${eachPost.userData._id}" class="follow" type="submit">Follow </button>`
  } 
  
  div.classList.add('video')
  
  div.innerHTML = `
  <video src="${eachPost.mediaUrl}"  ></video>
 <div class="follow-container-video">
  <div class="follow-user">
  
 <a href="/otherusersprofile/${eachPost.userData._id}"> <img src="${eachPost.userData.profileImage}"> </a>
  <div class="user-data">
    <h1>${eachPost.userData.fullname}</h1>
    <h2>@${eachPost.userData.username}</h2>
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

fetechedVideosContainer.appendChild(div);
}
else if(eachPost.mediaType === 'image') {
  
  let isLiked = ``
  if (eachPost.likes.includes(loggedInUser._id.toString())) { 
  isLiked = `❤️ Liked ${eachPost.likes.length}`
} else { 
 isLiked = ` Likes  ${eachPost.likes.length}`
}  
  let div = document.createElement("div")
  div.classList.add("masonry-item", "upgraded-card")
div.innerHTML = ` <div class="user-avatar">
     <a class="profileRefrence" href="/otherusersprofile/${eachPost.userData._id}">   <img src="${eachPost.userData.profileImage}" alt="User Avatar" /> </a>
    <a class="profileRefrence2" href="/otherusersprofile/${eachPost.userData._id}">${eachPost.userData.username}</a>
  </div>

  <!-- Main Image -->
  <img src="${eachPost.mediaUrl}" alt="${eachPost.postData}" class="main-image" />

  <!-- Post Text -->
  <p class="post-text">${eachPost.postdata}</p>

  <!-- Action Buttons -->
  <div class="post-actions">
    

 <button data-src="${eachPost._id}" class="like-btn">
  ${isLiked}
 </button>
  
  
    
    <form action="/pins/savepin" method="post" style="display:inline;">
      <input hidden type="text" name="image" value="${eachPost.mediaUrl}"  required/>
     <input hidden type="text" name="text" value="${eachPost.postdata}" required/>
      <button class="save-btn">📌 Save</button>
    </form>
  </div>
`

container1.appendChild(div)
}
});


if(isVideoSection){
videoControlsSetup()
}


} catch(err){
  console.log(err)
}


};


window.addEventListener('scroll', function(){
  if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading){

if(isEndOfPosts || isSearch) return 
 loaderDiv.classList.add("lazyLoader")
 
  isLoading = true
  
    loadPosts().then(() => {
      isLoading = false
    })
  }
})


