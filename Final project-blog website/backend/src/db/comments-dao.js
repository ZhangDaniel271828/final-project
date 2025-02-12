import { getDatabase } from "./database.js";

export async function getComments(articleId) {
  const db = await getDatabase();
  const comments = await db.all(
    `
    SELECT 
      Comments.*, 
      Users.username 
    FROM Comments 
    JOIN Users ON Comments.userId = Users.id
    WHERE Comments.articleId = ? 
    ORDER BY Comments.createdAt ASC
  `,
    [articleId]
  );

  console.log(comments);

  const topLevelComments = [];

  comments.forEach((comment) => {
    if (comment.parentId === null) {
      comment.childComment = [];
      topLevelComments.push(comment);
    } else {
      const parent = comments.find((p) => p.id === comment.parentId);
      if (parent) {
        if (!parent.childComment) {
          parent.childComment = [];
        }
        parent.childComment.push(comment);
      }
    }
  });

  return topLevelComments;
}

export async function deleteComment(id) {
  const db = await getDatabase();
  const result = await db.run("DELETE FROM Comments WHERE id = ?", [id]);
}

export async function addComment(articleId, userId, parentId, content) {
  const db = await getDatabase();
  await db.run(
    `
    INSERT INTO Comments (articleId, userId, parentId, content, createdAt)
    VALUES (?, ?, ?, ?, datetime('now', 'localtime'))
  `,
    articleId,
    userId,
    parentId,
    content
  );
}

export async function isNestingLevelValid(articleId, parentId) {
  const db = await getDatabase();

  const row = await db.get(
    `
    SELECT COUNT(*) AS parentCount
    FROM Comments
    WHERE articleId = ? AND parentId = ?
  `,
    articleId,
    parentId
  );

  if (row.parentCount >= 3) {
    return false;
  }
  return true;
}
