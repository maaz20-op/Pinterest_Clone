let msgIcon = document.querySelector(".msgicon")

let userId =  msgIcon.getAttribute("data-src");


console.log(userId)

msgIcon.addEventListener("click", function(){

    window.location.href = "/showmsgpageofothersuser/" + userId;
})