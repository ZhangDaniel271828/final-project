import { getDatabase } from "./database.js";
import yup from "yup";
import { updateDatabase } from "./util.js";

export async function getArticles(sortBy, authorId) {
  const db = await getDatabase();
  let articles;

  if (!authorId) {
    if (sortBy === "username") {
      articles = await db.all(
        `SELECT * FROM Articles
         ORDER BY username ASC`
      );
    } else if (sortBy === "article_title") {
      articles = await db.all(
        `SELECT * FROM Articles
         ORDER BY article_title ASC`
      );
    } else if (sortBy === "createdAt" || !sortBy) {
      articles = await db.all(
        `SELECT * FROM Articles
         ORDER BY createdAt ASC`
      );
    }
  } else {
    if (sortBy === "createdAt" || !sortBy) {
      articles = await db.all(
        `SELECT * FROM Articles
         WHERE authorId = ?
         ORDER BY createdAt ASC`,
        [authorId]
      );
    } else if (sortBy === "article_title") {
      articles = await db.all(
        `SELECT * FROM Articles
         WHERE authorId = ?
         ORDER BY article_title ASC`,
        [authorId]
      );
    } else if (sortBy === "username") {
      articles = await db.all(
        `SELECT * FROM Articles
         WHERE authorId = ?
         ORDER BY username ASC`,
        [authorId]
      );
    }
  }

  console.log(articles);
  return articles;
}

export async function getAllArticles(sortBy) {
  const db = await getDatabase();
  let articles;
  if (sortBy == "username") {
    articles = await db.all(
      `SELECT * FROM Articles
       ORDER BY username ASC`
      );
  }

  if (sortBy == "article_title") {
    articles = await db.all(
      `SELECT * FROM Articles
       ORDER BY article_title ASC`
    );
  }

  if (sortBy == "createdAt" ||!sortBy) {
    articles = await db.all(
      `SELECT * FROM Articles
       ORDER BY createdAt ASC`
    );
  }


  
  return articles;
}

export async function addArticle(authorId, username, article_title, content) {
  const db = await getDatabase(); 
  await db.run(`
    INSERT INTO Articles (authorId, username, article_title, content, createdAt)
    VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
  `, authorId, username, article_title, content);
}

const updateArticleSchema = yup.object({
  article_title: yup.string().min(1).optional(),
  content: yup.string().min(1).optional()
  }).required();

export async function updateArticle(id, udpateData) {
  try {
    const validatedUpdates = updateArticleSchema.validateSync(udpateData, {
      abortEarly: false,
      stripUnknown: true
    });
    console.log(validatedUpdates);
    if (Object.keys(validatedUpdates).length === 0) {
      throw new Error("At least one field (title or content) must be provided for update.");
    }

    const db = await getDatabase();
    const result = await updateDatabase(db, "Articles", validatedUpdates, id);

    return result.changes > 0 ? { message: "Article updated successfully!" } : null;
    } catch (error) {
        console.error("Error updating article:", error);
        throw new Error("Database error while updating article.");
    }
}

export async function deleteArticle(id) {
  try {
    const db = await getDatabase();  
    const result = await db.run('DELETE FROM Articles WHERE id = ?', [id]); 
    if (result.changes === 0) {
      console.log(`No article found with id ${id}`);  
    } else {
      console.log(`Article with id ${id} deleted successfully`); 
    }
  } catch (error) {
    console.error("Error deleting article:", error); 
  }
}

export async function getArticleById(id) {
  try {
    const db = await getDatabase(); 
    const result = await db.get('SELECT * FROM Articles WHERE id = ?', [id]); 
    return result; 
  } catch (error) {
    console.error("Error fetching article:", error);
  }
}



