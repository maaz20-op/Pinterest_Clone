
let showMoreBtn = document.querySelector(".showMore");
let containerBio = document.querySelector(".containerBio");
let userDescription = document.querySelector(".bio");
let flag = true
showMoreBtn.addEventListener("click",function(){

if(flag){
  containerBio.style.cssText = "min-height:1vh"
  userDescription.classList.add("showText");
  showMoreBtn.classList.remove("fa-circle-chevron-down");
  showMoreBtn.classList.add("fa-circle-chevron-up");
   
  showMoreBtn.style.cssText = "bottom:0;left:288px"
  flag = false;
} else {
  containerBio.style.cssText = "min-height:2vh"

  showMoreBtn.classList.remove("fa-circle-chevron-up");
  showMoreBtn.classList.add("fa-circle-chevron-down");
userDescription.classList.remove("showText");
flag = true
}
})