import { Router } from "express";
import { userControllers } from "./user.controllers";
import { auth } from "../../middleware/auth";

const router = Router();

router.get("/users", auth("admin"), userControllers.getAllUsers);
router.put(
  "/users/:userId",
  auth("admin", "customer"),
  userControllers.updateUser
);
router.delete("/users/:userId", auth("admin"), userControllers.deleteUser);

export const userRoutes = router;
