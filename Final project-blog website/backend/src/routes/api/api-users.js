import express from "express";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { getAllusers, getUserWithId, updateUser } from "../../db/users-dao.js";

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
  const id = req.params.id; 

  try {
    const users = await getUserWithId(id);    
    return res.json(users);
  }catch (error) {
    return res.status(500);
  }
});

export default router;


