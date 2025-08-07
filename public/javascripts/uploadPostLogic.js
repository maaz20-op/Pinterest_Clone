
const fileInput = document.getElementById("fileInput");
let form = document.querySelector(".upload-box");
const previewImage = document.getElementById("preview");
  let loadingText =  document.querySelector(".loadingText");
  let loader = document.querySelector(".loader");
  let loadingContainer = document.querySelector(".container");
let loadingMsg = ["Uploading...","Processing...","please wait!"];
let index = 0;

// Trigger file input when custom icon is clicked
document.querySelector(".upload-btn2").addEventListener("click", function () {
  fileInput.click();
});

// Show image preview when file is selected

let isFile = false;
fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const fileType = file.type;

    if (fileType.startsWith("image/")) {
      previewImage.style.display = "block";
      videoPreview.style.display = "none";
      
      const reader = new FileReader();
      reader.onload = function (e) {
       previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else if (fileType.startsWith("video/")) {
      previewImage.style.display = "none";
      videoPreview.style.display = "block";

      const videoURL = URL.createObjectURL(file);
      videoPreview.src = videoURL;
    }

    uploadBtn.style.cssText = "pointer-events:auto;"
  }
});

let uploadBtn = document.querySelector(".upload-btn");
let input = document.querySelector(".input");
form.addEventListener("submit", function(){
  uploadBtn.style.cssText = "pointer-events:none;"
  

  
  setInterval(function(){
loadingContainer.style.display = "block";
if(index >= 3) {
  index = 0
}
let text = loadingMsg[index];
loadingText.textContent = text

index = index + 1;
  
},3000)

});  



