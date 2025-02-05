const db = require('../db/database');
const { validationResult } = require('express-validator');


exports.getArticles = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { search, sort = 'createdAt', order = 'desc' } = req.query;
    let sql = `
      SELECT 
        articles.*, 
        users.username,
        COUNT(likes.article_id) AS likes_count
      FROM articles
      LEFT JOIN users ON articles.user_id = users.id
      LEFT JOIN likes ON articles.id = likes.article_id
    `;

    const params = [];
    if (search) {
      sql += ' WHERE articles.title LIKE ? OR articles.content LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` GROUP BY articles.id ORDER BY ${sort} ${order.toUpperCase()}`;

    const articles = await db.all(sql, params);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};


exports.createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const result = await db.run(
      'INSERT INTO articles (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, req.user.id]
    );

    res.status(201).json({
      id: result.lastID,
      title,
      content,
      user_id: req.user.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
};


exports.getArticleById = async (req, res) => {
  try {
    const article = await db.get(`
      SELECT 
        articles.*,
        users.username,
        COUNT(likes.article_id) AS likes_count
      FROM articles
      LEFT JOIN users ON articles.user_id = users.id
      LEFT JOIN likes ON articles.id = likes.article_id
      WHERE articles.id = ?
      GROUP BY articles.id
    `, [req.params.id]);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};


exports.updateArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const article = await db.get(
      'SELECT * FROM articles WHERE id = ?',
      [req.params.id]
    );

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized operation' });
    }

    const { title, content } = req.body;
    await db.run(
      'UPDATE articles SET title = ?, content = ? WHERE id = ?',
      [title, content, req.params.id]
    );

    res.json({ id: req.params.id, title, content });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
};


exports.deleteArticle = async (req, res) => {
  try {
    const article = await db.get(
      'SELECT * FROM articles WHERE id = ?',
      [req.params.id]
    );

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized operation' });
    }

    await db.run('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
};


exports.likeArticle = async (req, res) => {
  try {
    const existingLike = await db.get(
      'SELECT * FROM likes WHERE user_id = ? AND article_id = ?',
      [req.user.id, req.params.id]
    );

    if (existingLike) {
      return res.status(400).json({ error: 'Already liked' });
    }

    await db.run(
      'INSERT INTO likes (user_id, article_id) VALUES (?, ?)',
      [req.user.id, req.params.id]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like article' });
  }
};


exports.unlikeArticle = async (req, res) => {
  try {
    const result = await db.run(
      'DELETE FROM likes WHERE user_id = ? AND article_id = ?',
      [req.user.id, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(400).json({ error: 'Like not found' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike article' });
  }
};


exports.getLikesCount = async (req, res) => {
  try {
    const result = await db.get(
      'SELECT COUNT(*) AS count FROM likes WHERE article_id = ?',
      [req.params.id]
    );

    res.json({ count: result.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get likes count' });
  }
};