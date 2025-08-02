
let backIcon = document.querySelector("i");
// to return profile or other user profile
const userDataDiv = document.getElementById("userData");
const loggedInUser = JSON.parse(userDataDiv.dataset.user);
const userDataDiv2 = document.getElementById("userData2");
const user = JSON.parse(userDataDiv2.dataset.user);
backIcon.addEventListener("click",function(){
backIcon.style.color = "red"
  if(user._id.toString() === loggedInUser._id.toString()){
  window.location.href = "/profile"
  } else {
  window.location.href = `/otherusersprofile/${user._id}`
  }
})

let unfollowBtns = document.querySelectorAll(".unfollow");
let unfollowUser = function(){
if(!unfollowBtns) return console.log("something went wrong btns error");

unfollowBtns.forEach((btn)=>{
  
btn.addEventListener("click",async function(e){
  let id = e.target.getAttribute("data-src");
try {
  
  let response = await fetch("/users/unfollowuser",{
    method:"POST",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      id:id
    })
  });
  
  let data = await  response.json()
  
  if(response.status === 200 && data === "success"){
  let card = e.target.closest(".card");
  card.style.cssText = "opacity:0.5;transition: opacity 0.4s ease;"
setTimeout(function(){
  card.remove()
},1500)
  
  }else {
    console.log("error form server!")
  }
  
  
  
} catch(err) {
  console.log(err.message)
}
});
})
}
unfollowUser()

  