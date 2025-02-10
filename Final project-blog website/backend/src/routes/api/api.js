import express from "express";
<<<<<<< HEAD
const router = express.Router(); // 先声明 router

// 导入子路由
=======
const router = express.Router(); 

//import child router
>>>>>>> dbce1d6e4e352073ac824cebda5fbabeca4be15a
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
