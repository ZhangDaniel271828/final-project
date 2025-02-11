import express from "express";
import { getUserWithCredentials } from "../../db/users-dao.js";
import { getDatabase } from "../../db/database.js";
import {createUser, deleteUserById} from "../../db/users-dao.js";
import { createUserJWT } from "../../utils/jwt-utils.js";
import { getUserWithUsername } from "../../db/users-dao.js";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import bcrypt from "bcrypt";

const router = express.Router();

// Middleware to parse cookies
import cookieParser from 'cookie-parser';
router.use(cookieParser());

// login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(password);

  // get user
  const user = await getUserWithUsername(username);
  if (!user) {
    return res.sendStatus(401); // user doesn't exist
  }

  // validate password
  const passwordMatch = await bcrypt.compare(password, user.password);
  console.log(password, user.password);
  if (!passwordMatch) {
    return res.sendStatus(401); // password doesn't match
  }

  // create JWT token
  const jwtToken = createUserJWT(user.username);

  // set HTTP-only Cookie
  const expires = new Date(Date.now() + 86400000); // expire after 24 hours
  res.cookie("authToken", jwtToken, { httpOnly: true, expires });

  // Store token in localStorage for frontend
  res.json({ username, token: jwtToken });

});

// register
router.post("/register", async (req, res) => {
  const { username, password, realName, birthDate, blurb } = req.body;

  // check required fields
  if (!username || !password || !realName || !birthDate || !blurb) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // check if username is already taken
  const existingUser = await getUserWithUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already taken" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10); 

  // store user in database
  try {
    await createUser({
      username,
      password: hashedPassword,
      realName,
      birthDate,
      blurb,
    });
    return res.sendStatus(201); // 201 Created
  } catch (error) {
    console.error("Error creating user:", error);
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

//check username
router.get("/check-username", async (req, res) => {
  const {username} = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  const existingUser = await getUserWithUsername(username);
  return res.json({ available: !existingUser });
});

// Middleware to authenticate requests
import jwt from 'jsonwebtoken';
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Protected route
router.get("/users/me", authenticateJWT, async (req, res) => {
  const user = await getUserWithUsername(req.user.username);
  if (!user) {
    return res.sendStatus(404);
  }
  res.json(user);
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
