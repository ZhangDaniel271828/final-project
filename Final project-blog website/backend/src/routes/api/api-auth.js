import express from "express";
import { getUserWithCredentials } from "../../db/users-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { getUserWithUsername } from "../../db/users-dao.js";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import bcrypt from "bcrypt";

const router = express.Router();

/**
 * Sending a POST request to /api/auth with a valid username and password will authenticate a user (log that user in) and
 * return the JWT auth token set as the "authToken" HTTP-only cookie. In addition, the user's username will be sent back
 * as JSON, in the response. This can be used to display the user's username on the frontend if required.
 *
 * If the user is already logged in, this will remove any old login details and replace the cookie with the new one.
 *
 * Sending invalid credentials will result in a 401. No difference between invalid username and invalid password.
 */
router.post("/", async (req, res) => {
  // Get user with provided login details; return 401 if not found
  const { username, password } = req.body;
  console.log(username, password);
  const user = await getUserWithCredentials(username, password);
  if (!user) return res.sendStatus(401);

  // 验证密码
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.sendStatus(401);

  // Create user JWT token and send it back as a HTTP-only cookie along with a 204 status.
  const jwtToken = createUserJWT(user.username);

  // Expires 24 hours from now
  const expires = new Date(Date.now() + 86400000);

  // Send the JWT token in an HTTP-only cookie named authToken which expires in 24 hours.
  return res.cookie("authToken", jwtToken, { httpOnly: true, expires }).json({ username });
});

/**
 * Sending a DELETE request to /api/auth will invalidate the authToken cookie, essentially causing that user to be logged out.
 *
 * Since there's no harm in invalidating a cookie which doesn't exist, we don't need to check if the user is actually logged in
 * or not first.
 */
//登出
router.delete("/", (req, res) => {
  const expires = new Date(0); // Setting the expiry time of the cookie to some time in the past will cause it to be deleted.
  return res.cookie("authToken", "", { httpOnly: true, expires }).sendStatus(204);
});

export default router;

//注销：
router.delete("/me", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();

  
  //await db.run("DELETE FROM Posts WHERE userId = ?", req.user.id);
  //await db.run("DELETE FROM Comments WHERE userId = ?", req.user.id);

  
  const result = await db.run("DELETE FROM Users WHERE username = ?", req.user.username);

  if (result.changes > 0) {
    // **注销后删除 Cookie**
    return res.cookie("authToken", "", { httpOnly: true, expires: new Date(0) }).sendStatus(204);
  } else {
    return res.sendStatus(404);
  }
});
//注册：
router.post("/register", async (req, res) => {
  const { username, password, realName, birthDate, blurb } = req.body;

  // **1️⃣ 检查必填字段**
  if (!username || !password || !realName || !birthDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // **2️⃣ 检查用户名是否已存在**
  const existingUser = await getUserWithUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already taken" });
  }

  // **3️⃣ 加密密码**
  const hashedPassword = await bcrypt.hash(password, 10); // 加盐哈希

  // **4️⃣ 存入数据库**
  try {
    await createUser({
      username,
      password: hashedPassword, // 存储加密后的密码
      realName,
      birthDate,
      blurb
    });
    
    return res.sendStatus(201); // 201 Created
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


//注册：检查用户名.测试通过
router.get("/check-username", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const existingUser = await getUserWithUsername(username);
  return res.json({ available: !existingUser });
});


