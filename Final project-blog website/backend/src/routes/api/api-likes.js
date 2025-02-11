import express from "express";
const router = express.Router();
import {getLikesCount, deleteLike, addLike} from '../../db/likes-dao.js';

router.get("/:articleId", async (req, res) => {
  try {
    const article_Id = req.params.articleId; // 获取 ID 参数
    const count = await getLikesCount(article_Id);
    return res.json({ count }); // 返回 JSON 对象
  } catch (error) {
    console.error("Error fetching likes count:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const articleId = req.params.articleId; // 获取文章 ID 参数
    const {user_Id, article_Id} = req.body; // 从请求体获取 userId
    // 调用 addLike 方法添加点赞
    const result = await addLike(user_Id, article_Id);

    // 判断添加结果
    if (result.success) {
      return res.json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error adding like:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const {user_Id, article_Id} = req.body;
    // 调用 removeLike 方法删除点赞
    const result = await deleteLike(user_Id, article_Id);
    
    // 判断删除结果
    if (result.success) {
      return res.json({ message: result.message });
    } else {
      return res.status(400).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error removing like:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
