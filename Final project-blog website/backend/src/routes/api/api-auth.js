import express from "express";
import { getUserWithCredentials } from "../../db/users-dao.js";
import { getDatabase } from "../../db/database.js";
import {createUser, deleteUserById} from "../../db/users-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { getUserWithUsername } from "../../db/users-dao.js";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import bcrypt from "bcrypt";

const router = express.Router();

//Handle for ordinary user
//login
router.post("/login", async (req, res) => {
  // Get user with provided login details; return 401 if not found
  const { username, password } = req.body;
  console.log(username, password);
  const user = await getUserWithCredentials(username, password);
  if (!user) return res.sendStatus(401);


  // // 验证密码
  // const passwordMatch = await bcrypt.compare(password, user.password);
  // if (!passwordMatch) return res.sendStatus(401);

 
  // Create user JWT token and send it back as a HTTP-only cookie along with a 204 status.
  const jwtToken = createUserJWT(user.username);
  // Expires 24 hours from now
  const expires = new Date(Date.now() + 86400000);
  // Send the JWT token in an HTTP-only cookie named authToken which expires in 24 hours.
  return res.cookie("authToken", jwtToken, { httpOnly: true, expires })
  .json({ username: user.username,
    imageLink: user.imageLink  // ✅ 这里返回头像 URL
  });

});
//logout
router.delete("/logout", (req, res) => {
  const expires = new Date(0); // Setting the expiry time of the cookie to some time in the past will cause it to be deleted.
  return res.cookie("authToken", "", { httpOnly: true, expires }).sendStatus(204);
});
//delete user's account
router.delete("/delete", requiresAuthentication, async (req, res) => {
  const db = await getDatabase();
  
   
  //await db.run("DELETE FROM Posts WHERE userId = ?", req.user.id);
  //await db.run("DELETE FROM Comments WHERE userId = ?", req.user.id);
  const result = await db.run("DELETE FROM Users WHERE username = ?", req.user.username);
  
  if (result.changes > 0) {
    return res.cookie("authToken", "", { httpOnly: true, expires: new Date(0) }).sendStatus(204);
  } else {
    return res.sendStatus(404);
  }
});
//register
router.post("/register", async (req, res) => {
  
  const { username, password, realName, birthDate, blurb,isManager,imageLink} = req.body;

  // **1️⃣ 检查必填字段**
  if (!username || !password || !realName || !birthDate || !blurb) {
    return res.status(400);
    // .json({ error: "Missing required fields" });
  }
  // // **2️⃣ 检查用户名是否已存在**
  const existingUser = await getUserWithUsername(username);
  // if (existingUser) {
  //   return res.status(409).json({ error: "Username already taken" });
  // }


  // // **3️⃣ 加密密码**
  const hashedPassword = await bcrypt.hash(password, 10); // 加盐哈希
  // **4️⃣ 处理头像**
  const newUser = { 
    username, 
    password: hashedPassword,  // 存加密后的密码
    realName, 
    birthDate, 
    blurb,
    isManager: isManager || 0, 
    imageLink: imageLink || "/default_img/default.png" // 头像为空时使用默认头像
  };
  // **4️⃣ 存入数据库**
  try {
    await createUser(newUser);
    return res.sendStatus(201); // 201 Created
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});
//check username
router.get("/check-username", async (req, res) => {
  const {username} = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  const existingUser = await getUserWithUsername(username);
  return res.json({ available: !existingUser });
});

//Handle for manager.
//delete user based on id.
router.delete("/delete/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const change = await deleteUserById(userId);
    if (change==0){
    console.log("error to delete!");
    return res.sendStatus(404);
  }else{
    console.log("delete success!");
    return res.sendStatus(204);
  }
});




export default router;
