import express from "express";
import multer from "multer";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { getDatabase } from "../../db/database.js";

const router = express.Router();

// 头像存储配置
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

// 上传头像
router.post("/upload", requiresAuthentication, upload.single("avatar"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "未上传文件" });

    const db = await getDatabase();
    await db.run("UPDATE Users SET avatar = ? WHERE id = ?", req.file.path, req.user.id);

    res.json({ message: "头像上传成功", avatar: req.file.path });
});

export default router;
