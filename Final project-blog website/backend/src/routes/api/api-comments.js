import { getComments, deleteComment, addComment, isNestingLevelValid} from '../../db/comments-dao.js';
import express from "express";

const router = express.Router();

// Get all comments for a specified article
router.get('/:articleId', async (req, res) => {
  const articleId = parseInt(req.params.articleId, 10);
  try {
    const comments = await getComments(articleId);
    
    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
});


//delete comments based on comments_id
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    await deleteComment(id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

//post a comments
router.post('/', async (req, res) => {
  let commentData = req.body
  console.log(commentData);
  const {articleId, userId, parentId, content} = commentData;

  //check content
  if (!content) {
    return res.status(400).json({ error: "Missing required fields" });
  }
    
  try {
    await addComment(articleId, userId, parentId, content);
    return res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;
