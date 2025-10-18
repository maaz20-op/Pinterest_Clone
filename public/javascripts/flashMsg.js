let alertMsg = document.querySelectorAll(".alert");
  
  alertMsg.forEach((eachAlert)=>{
    setTimeout(function(){
  eachAlert.style.display  = "none"
    },2500);
  })
  