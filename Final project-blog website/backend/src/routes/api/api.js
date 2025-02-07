import express from "express";
const router = express.Router(); // 先声明 router

// 导入子路由
import avatarRoutes from "./api-avatar.js";
router.use("/avatar", avatarRoutes);

import authRoutes from "./api-auth.js";
router.use("/auth", authRoutes);

import userRoutes from "./api-users.js";
router.use("/users", userRoutes);

export default router;
