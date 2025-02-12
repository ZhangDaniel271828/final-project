import express from "express";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { getAllusers, getUserWithId, updateUser } from "../../db/users-dao.js";

const router = express.Router();

// handle for ordinary users

//get user by Auth
router.get("/me", requiresAuthentication, (req, res) => {
  return res.json(req.user);
});

//update user request
router.patch("/update", requiresAuthentication, async (req, res) => {
  try {
    const isUpdated = await updateUser(req.user.id, req.body);
    return res.sendStatus(isUpdated ? 204 : 404);
  } catch {
    return res.sendStatus(422);
  }
});

//handle for manager
//get all user
router.get("/all", async (req, res) => {
  try {
    const allUsers = await getAllusers();
    return res.json(allUsers);
  } catch (error) {
    return res.status(500);
  }
});

//get user by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log(`request user's id: ${id}`);
  try {
    const user = await getUserWithId(id);
    if (!user) {
      return res.status(404).json({ message: "cannot find tis user" });
    }

    console.log(`result: ${JSON.stringify(user)}`);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
});

export default router;
