let sections = document.querySelector("ul");
let container1 = document.querySelector(".container");
let container2 = document.querySelector(".container2");
let imagesBar = sections.querySelector(".images");
let videoBar = sections.querySelector(".videos");

imagesBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"

sections.addEventListener("click",function(e){
  if(e.target.classList.contains("videos")){
imagesBar.style.cssText = "border-bottom:none"
videoBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"
container2.style.cssText = "display:block;min-height:100vh;"
container1.style.cssText ="display:none"
    
  } else if(e.target.classList.contains("images")) {
    
videoBar.style.cssText = "border-bottom:none"
imagesBar.style.cssText = "border-bottom:2px solid red;transition: border ease 0.4s;"
container2.style.cssText = "display:none;"
container1.style.cssText ="display:block;min-height:100vh;"
      
  }
})

  