import { getDatabase } from "./database.js";

// Return the number of likes
export async function getLikesCount(article_Id) {
  const db = await getDatabase();
  const result = await db.get(
    "SELECT COUNT(*) as count FROM Likes WHERE article_id = ?",
    article_Id
  );
  return result.count;
}

// add a like
export async function addLike(user_Id, article_Id) {
  const db = await getDatabase();
  // Check if the button has been liked
  const existingLike = await db.get(
    "SELECT * FROM Likes WHERE user_id = ? AND article_id = ?",
    user_Id,
    article_Id
  );
  if (existingLike) {
    return { success: false, message: "Already liked" }; // 防止重复点赞
  }

  await db.run("INSERT INTO Likes (user_id, article_id) VALUES (?, ?)", user_Id, article_Id);
  return { success: true, message: "Like added" };
}

// Check if the button has been liked
export async function checkIslike(user_Id, article_Id) {
  const db = await getDatabase();
  const existingLike = await db.get(
    "SELECT * FROM Likes WHERE user_id = ? AND article_id = ?",
    user_Id,
    article_Id
  );

  return existingLike ? true : false;
}
// delele a like
export async function deleteLike(user_Id, article_Id) {
  const db = await getDatabase();
  const result = await db.run(
    "DELETE FROM Likes WHERE user_id = ? AND article_id = ?",
    user_Id,
    article_Id
  );
  if (result.changes > 0) {
    return { success: true, message: "Like removed" };
  } else {
    return { success: false, message: "Like not found" };
  }
}
