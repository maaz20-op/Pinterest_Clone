
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
  
