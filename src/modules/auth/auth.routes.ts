import { Router } from "express";
import { authControllers } from "./auth.controllers";

const router = Router();
router.post("/auth/signup", authControllers.signup);

router.post("/auth/signin", authControllers.signin);

export const authRoutes = router;
