import { getDatabase } from "./database.js";

export async function getLikesCount(article_Id) {
  const db = await getDatabase();
  const result = await db.get("SELECT COUNT(*) as count FROM Likes WHERE article_id = ?", article_Id);
  return result.count;  // 返回点赞数量
}


export async function addLike(user_Id, article_Id) {
  const db = await getDatabase();
  // 检查是否已经点赞过
  const existingLike = await db.get("SELECT * FROM Likes WHERE user_id = ? AND article_id = ?", user_Id, article_Id);
  if (existingLike) {
    return { success: false, message: "Already liked" }; // 防止重复点赞
  }
  // 添加点赞
  await db.run("INSERT INTO Likes (user_id, article_id) VALUES (?, ?)", user_Id, article_Id);
  return { success: true, message: "Like added" };
}

export async function checkIslike(user_Id, article_Id) {
  const db = await getDatabase();
  // 检查是否已经点赞过
  const existingLike = await db.get("SELECT * FROM Likes WHERE user_id = ? AND article_id = ?", user_Id, article_Id);

  return existingLike ? true : false;
}


export async function deleteLike(user_Id, article_Id) {
  const db = await getDatabase();
  // 删除点赞
  const result = await db.run("DELETE FROM Likes WHERE user_id = ? AND article_id = ?", user_Id, article_Id);
  // 检查是否真的删除了一行
  if (result.changes > 0) {
    return { success: true, message: "Like removed" };
  } else {
    return { success: false, message: "Like not found" };
  }
}