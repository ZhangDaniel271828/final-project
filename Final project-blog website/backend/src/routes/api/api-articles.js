import express from "express";
import { getArticles, getAllArticles, addArticle, updateArticle, deleteArticle, getArticleById} from '../../db/articles-dao.js';

const router = express.Router();

router.get("/author/:id", async (req, res) => {
  try {
    const { sortBy } = req.query; 
    const authorId = req.params.id;
    console.log(sortBy, authorId)
    let articles;
    articles = await getArticles(sortBy, authorId);  
    return res.json(articles); 
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const article = await getArticleById(id);
    return res.json(article); 
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.get("/", async (req, res) => {
  console.log("Request query:", req.query);
  const { sortBy } = req.query;
  console.log("sortBy:", sortBy);

  try {
    let articles = await getAllArticles(sortBy);
    return res.json(articles); 
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

router.post('/', async (req, res) => {
  let articleData = req.body
  console.log(articleData);
  const {authorId, username, article_title, content} = articleData;

  //check content and article_title
  if (!content || !article_title) {
    return res.status(400).json({ error: "Missing required fields" });
  }
    

  try {
    await addArticle(authorId, username, article_title, content);
    return res.status(201).json({ message: 'Article added successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add article' });
  }
});

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

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    await deleteArticle(id);
    res.json({ message: 'Artilce deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});




export default router;
