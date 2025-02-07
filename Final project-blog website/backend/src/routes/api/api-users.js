import express from "express";
import { requiresAuthentication } from "../../middleware/auth-middleware.js";
import { updateUser } from "../../db/users-dao.js";

const router = express.Router();

/**
 * Sending a GET request to /api/users/me will return the user info for the currently authenticated user,
 * or return a 401 if there's an authentication error.
 *
 * The authentication functionality is handled by the requiresAuthentication middleware, which adds the user
 * info to req.user. So we just need to return that.
 */
router.get("/me", requiresAuthentication, (req, res) => {
  return res.json(req.user);
});

/**
 * Sending a PATCH request to /api/users/me will allow requesters to update the currently authenticated user's
 * firstName, lastName, password, and blurb.
 *
 * If there is no currently authenticated user, a 401 response is returned (handled by requiresAuthentication middleware).
 *
 * If the "update user" info in req.body is invalid, a 422 response is returned.
 *
 * If the user is not found, a 404 is returned (really should never happen...)
 *
 * Otherwise, the user info is updated and a 204 response is returned.
 */
router.patch("/me", requiresAuthentication, async (req, res) => {
  try {
    const isUpdated = await updateUser(req.user.id, req.body);
    return res.sendStatus(isUpdated ? 204 : 404);
  } catch {
    return res.sendStatus(422);
  }
});

export default router;


