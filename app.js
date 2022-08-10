const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");

// middlewares
const fileExtLimiter = require("./middlewares/fileExtLimiter");
const fileSizeLimiter = require("./middlewares/fileSizeLimiter");
const filesPayloadExits = require("./middlewares/filesPayloadExists");

const ALLOWED_EXT = [".jpg" , ".jpeg" , ".png"];
const PORT = process.env.PORT || 5000;

// upload request handler
function imageUploadHandler(req, res) {
  const files = req.files;

  // mv files to ./images
  Object.keys(files).forEach(key => {
    const filepath = path.join(__dirname, "images", files[key].name);
    files[key].mv(filepath, err => {
      if (err) return res.status(500).json({ status: "error", message: err });
    });
  });

  return res.json({
    status: "success",
    message: `${Object.keys(files).toString()}`,
  });
}

const app = express();

app.get(
  "/",
  (req, res) => res.sendFile(path.join(__dirname, "index.html"))
);

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExits,
  fileExtLimiter(ALLOWED_EXT),
  fileSizeLimiter,
  imageUploadHandler
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
