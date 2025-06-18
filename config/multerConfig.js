const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "maazpins", // optional Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"] // ✅ correct key
  }
});

const upload = multer({ storage: storage });

module.exports = upload;