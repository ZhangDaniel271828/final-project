import express from "express";
const router = express.Router(); 

//import child router
import avatarRoutes from "./api-avatar.js";
router.use("/avatar", avatarRoutes);

import authRoutes from "./api-auth.js";
router.use("/auth", authRoutes);

import userRoutes from "./api-users.js";
router.use("/users", userRoutes);

import commentsRoutes from "./api-comments.js"
router.use("/comments", commentsRoutes);

import articlesRoutes from "./api-articles.js"
router.use("/articles", articlesRoutes);

export default router;
