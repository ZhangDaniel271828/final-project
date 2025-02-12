import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getArticles, getAllArticles, addArticle, updateArticle, deleteArticle, getArticleById } from "../../db/articles-dao.js";

const router = express.Router();

// 解决 ES 模块的 __dirname 问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 确保 uploads 目录存在
const uploadDir = path.join(__dirname, "../../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 Multer 存储方式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // 图片存储到 uploads 目录
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 确保文件名唯一
  }
});

const upload = multer({ storage });

// ✅ 图片上传 API

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // 生成图片的完整 URL
  const imageUrl = `/uploads/${req.file.filename}`;

  console.log("✅ 图片上传成功，URL:", imageUrl);

  // 返回 JSON 数据
  res.json({ imageUrl });
});



// ✅ 获取作者文章
router.get("/author/:id", async (req, res) => {
  try {
    const { sortBy } = req.query;
    const authorId = req.params.id;
    console.log(sortBy, authorId);
    let articles = await getArticles(sortBy, authorId);
    return res.json(articles);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// ✅ 获取单篇文章
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const article = await getArticleById(id);
    return res.json(article);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// ✅ 获取所有文章
router.get("/", async (req, res) => {
  console.log("Request query:", req.query);
  const { sortBy } = req.query;
  console.log("sortBy:", sortBy);

  try {
    let articles = await getAllArticles(sortBy);
    return res.json(articles);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// ✅ 发布文章 API
router.post("/", async (req, res) => {
  let { authorId, username, article_title, content } = req.body;

  console.log("📌 文章发布请求:", { authorId, username, article_title, content });

  if (!content || !article_title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 解析文章内容，提取 Base64 图片并上传
    const imgRegex = /<img src="data:image\/[^;]+;base64,([^"]+)"/g;
    let match;
    let updatedContent = content;

    while ((match = imgRegex.exec(content)) !== null) {
      const base64Data = match[1];
      const buffer = Buffer.from(base64Data, "base64");
      const fileName = `${Date.now()}.png`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);
      const imageUrl = `/uploads/${fileName}`;
      updatedContent = updatedContent.replace(match[0], `<img src="http://localhost:3000${imageUrl}"`);
      console.log("✅ Base64 图片已转换并保存:", imageUrl);
    }

    // 存入数据库
    await addArticle(authorId, username, article_title, updatedContent);
    return res.status(201).json({ message: "Article added successfully" });
  } catch (error) {
    console.error("❌ 文章发布失败:", error);
    return res.status(500).json({ error: "Failed to add article" });
  }
});

// ✅ 更新文章
router.patch("/update/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  console.log(id);
  console.log(req.body);
  try {
    const isUpdated = await updateArticle(id, req.body);
    return res.sendStatus(isUpdated ? 204 : 404);
  } catch {
    return res.sendStatus(422);
  }
});

// ✅ 删除文章
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await deleteArticle(id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;
