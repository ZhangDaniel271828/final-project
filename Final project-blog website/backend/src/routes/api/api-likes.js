import express from "express";
const router = express.Router();
import { getLikesCount, deleteLike, addLike, checkIslike } from "../../db/likes-dao.js";

//get likes by article id
router.get("/:articleId", async (req, res) => {
  try {
    const article_Id = req.params.articleId;
    const count = await getLikesCount(article_Id);
    return res.json({ count });
  } catch (error) {
    console.error("Error fetching likes count:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//give a like
router.post("/", async (req, res) => {
  try {
    const { user_Id, article_Id } = req.body; 
    const result = await addLike(user_Id, article_Id);
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

//cancle a like
router.delete("/", async (req, res) => {
  try {
    const { user_Id, article_Id } = req.body;
    const result = await deleteLike(user_Id, article_Id);
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

//check if user like specific article
router.post("/check", async (req, res) => {
  try {
    const { user_Id, article_Id } = req.body; 

    if (!user_Id || !article_Id) {
      return res.status(400).json({ error: "Missing user_Id or article_Id" });
    }
    const result = await checkIslike(user_Id, article_Id);

    return res.json({ isLiked: result }); 
  } catch (error) {
    console.error("Error checkIsLike:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
