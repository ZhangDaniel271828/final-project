import express from "express";

const router = express.Router();

// import child routes
import authRoutes from "./api-auth.js";
router.use("/auth", authRoutes);
import userRoutes from "./api-users.js";
router.use("/users", userRoutes);

export default router;
