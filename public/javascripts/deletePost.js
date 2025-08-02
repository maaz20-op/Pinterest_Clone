
  
let postsContainer = document.querySelector(".masonry");
  
document.addEventListener("click", async function(e){

if(e.target.closest(".delete-post") || e.target.closest(".delete-video")){
 let deleteBtn = e.target

let id = deleteBtn.getAttribute("data-src");

try {
  
let response =  await fetch(`/posts/delete/post/${id}`,{
    method:"GET",
    headers:{
      'Content-Type':'application/json'
    }
  })

let data = await response.json();
const postCard =
  e.target.closest(".masonry-item") || e.target.closest(".video");
if(!data) return 

if(data.message === "success" && response.status === 200){
postCard.style.cssText = "opacity:0.5;transition: opacity 0.4s ease;"

setTimeout(function(){
  postCard.remove()
},1500)
}

} catch(err) {
  
  
}

  
}
})
  
