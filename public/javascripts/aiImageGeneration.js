let generatedImage = "";
let promptText = "";
// 🔹 Open / Close AI popup
const aiOverlay = document.getElementById("aiOverlay");
const openBtn = document.getElementById("openAiBtn");
const closeBtn = document.getElementById("closeAiBox");

openBtn.addEventListener("click", () => (aiOverlay.style.display = "flex"));
closeBtn.addEventListener("click", () => (aiOverlay.style.display = "none"));

// 🔹 Generate Image
document.getElementById("generateBtn").addEventListener("click", async () => {
 promptText = document.getElementById("aiPrompt").value.trim();
   
  if (!promptText) return alert("Please enter a description!");

  const btn = document.getElementById("generateBtn");
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
  btn.disabled = true;

  try {
    const res = await fetch("/api/v1/Ai-features/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText }),
    });

    const jsonRes = await res.json();
    if (jsonRes.success) {
      generatedImage = jsonRes.data[0]; // ai img cloudinary link
      promptText.value = "";
      const preview = document.getElementById("aiPreview");
      preview.src = generatedImage;
      preview.style.display = "block";

    } else {
      alert("Error: " + jsonRes.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to generate image");
  } finally {
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate';
    btn.disabled = false;
  }
});

// 🔹 Use AI Image (Convert to Blob + attach to FormData)
document.getElementById("useImageBtn").addEventListener("click", async () => {
  if (!generatedImage) return alert("Generate an image first!");
   preview.src = generatedImage;
  preview.style.display = "block";

  // Disable required for file input since user has AI image
  fileInput.required = false;

  document.getElementById("aiOverlay").style.display = "none";
  document.querySelector(".isAIimg").value = generatedImage
  console.log( document.querySelector(".isAIimg").value )
});

document.getElementById("closeAiBox").addEventListener("click",async function(){
const preview = document.getElementById("aiPreview")
preview.src = ""
preview.style.display = "none";

  try {
if(!generatedImage) return alert("first generate image!")
let res = await fetch("/api/v1/Ai-features/image", {
    method:"DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generatedImage }),
  });

  let jsondata = res.json()

if(jsondata.success && jsondata.statusCode === 200) {
  console.log("image deleted from cloundinary ");
  document.getElementById("aiOverlay").style.display = "none";
} else {
  console.log("err in res")
}
 const preview = document.getElementById("aiPreview").style.display = "none";
  } catch(err) {
 console.error(err)
  }
 
})