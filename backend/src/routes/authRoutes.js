import express from "express";
import { register, login, getUsers, getProfile } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth(["ADMIN"]), getUsers);
router.get("/profile", auth([" ADMIN", "TEACHER", "STUDENT"]), getProfile);

export default router;