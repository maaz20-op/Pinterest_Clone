const cloudinary = require("../config/cloudinary");


module.exports.deleteimgFromCloudinary = async function (url, mediaType) {
    try {
 const urlArray = url.split("/");
    const folder = `${urlArray.at(-3)}/${urlArray.at(-2)}`
    
    const filename = urlArray.at(-1).split(".").at(0);
    const public_id = `${folder}/${filename}`;
    
    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: mediaType,
    });



    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error("cant delete your Post")
    }

 return result;
    } catch(err) {
 throw err;
    }
}