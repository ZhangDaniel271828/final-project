import express from "express";
import { getUserWithCredentials } from "../../db/users-dao.js";
import { getDatabase } from "../../db/database.js";
import {createUser, deleteUserById} from "../../db/users-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { getUserWithUsername } from "../../db/users-dao.js";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import bcrypt from "bcrypt";

const router = express.Router();
const saltRounds = 10;

//Handle for ordinary user
//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // get user information
    const user = await getUserWithUsername(username);
    if (!user) return res.sendStatus(401);

    // match password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.sendStatus(401);

    // create JWT
    const jwtToken = createUserJWT(user.username);
    const expires = new Date(Date.now() + 86400000);
    
    return res.cookie("authToken", jwtToken, { 
      httpOnly: true, 
      expires 
    }).json({ username });
    
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
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
  const { username, password, realName, birthDate, blurb, imageLink } = req.body;
  const Newuser = { username, password, realName, birthDate, blurb, imageLink };

  //Validate required fields
  if (!username || !password || !realName || !birthDate || !blurb || !imageLink) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // check if username exists
    const existingUser = await getUserWithUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user
    const userData = {
      ...Newuser,
      password: hashedPassword
    };

    // post in database
    await createUser(userData);
    return res.sendStatus(201);
  } catch (error) {
    console.error("Registration error:", error);
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
