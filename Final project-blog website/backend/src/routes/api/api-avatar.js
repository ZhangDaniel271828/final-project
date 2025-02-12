import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// 头像存储配置
const storage = multer.diskStorage({
    destination: "./uploads/", // 图片存储在 server 上的 uploads 文件夹
    filename: (req, file, cb) => {
        // 通过时间戳和原始文件名来确保唯一性
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// 上传头像
router.post("/upload", upload.single("avatar"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "未上传文件" });
    }
    // 返回图片的 URL，图片可以通过 http://localhost:3000/uploads/... 访问
    const avatarUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    // 返回响应，包括图片 URL
    res.json({ message: "头像上传成功", avatar: avatarUrl });
});

export default router;