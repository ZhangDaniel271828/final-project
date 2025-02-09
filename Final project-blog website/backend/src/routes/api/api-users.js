import express from "express";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { getAllusers, getUserWithId } from "../../db/users-dao.js";

const router = express.Router();

// handle for ordinary users
router.get("/me", requiresAuthentication, (req, res) => {
  return res.json(req.user);
});

router.patch("/update", requiresAuthentication, async (req, res) => {
  try {
    const isUpdated = await updateUser(req.user.id, req.body);
    return res.sendStatus(isUpdated ? 204 : 404);
  } catch {
    return res.sendStatus(422);
  }
});

//handle for manager
router.get("/all", async (req, res) => {
  try {
    const allUsers = await getAllusers();    
    return res.json(allUsers);
  }catch (error) {
      return res.status(500);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id; // 获取 ID 参数
  console.log(`请求的用户 ID: ${id}`); // 调试输出

  try {
    const user = await getUserWithId(id); // 从数据库中获取用户信息

    if (!user) {
      return res.status(404).json({ message: "用户未找到" }); // 用户未找到
    }

    console.log(`查询结果: ${JSON.stringify(user)}`); // 调试输出
    return res.json(user); // 返回用户信息
  } catch (error) {
    console.error(error); // 打印错误信息
    return res.status(500).json({ message: "服务器错误" }); // 返回服务器错误
  }
});


export default router;

