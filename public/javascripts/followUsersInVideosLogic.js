   let followUser =  function(){
  
  document.addEventListener("click",async function(e){
  if(e.target.classList.contains("follow")){
    
    let userId = e.target.getAttribute("data-src");
    
    if(!userId) return 
  try {
  
  
  
   let response = await fetch("/users/followuser", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        id:userId,
      }),
    })
    
let data = await response.json()

if (typeof data.followersCount === "undefined" || typeof data.followingCount === "undefined") {
  return 
}



e.target.innerHTML = `        <p>Followed </p> <i class="fas fa-user-plus"></i>`
  } catch (err) {
  
  }
  }
  });
  };
  
    document.addEventListener("DOMContentLoaded",function(){
    window.followUser()
  })
  window.followUser = followUser
  
  
  