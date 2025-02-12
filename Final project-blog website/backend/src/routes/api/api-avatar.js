import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

//Avatar storage configuration
const storage = multer.diskStorage({
  // The images are stored in the uploads folder on the server
  destination: "./uploads/",
  filename: (req, file, cb) => {
    // Ensure uniqueness by timestamp and original file name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// upload avatar
router.post("/upload", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "There is nothing in the file!" });
  }
  // Returns the URL of the image
  const avatarUrl = req.file.filename;
  // Return a response, including the image URL
  res.json({ message: "suceess!", avatar: avatarUrl });
});

export default router;
