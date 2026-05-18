import express from "express";
import {
  createClass,
  getClasses,
  getClassById,
  deleteClass,
} from "../controllers/classController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["ADMIN"]), createClass);
router.get("/", auth(["ADMIN", "TEACHER", "STUDENT"]), getClasses);
router.get("/:id", auth(["ADMIN", "TEACHER", "STUDENT"]), getClassById);
router.delete("/:id", auth(["ADMIN"]), deleteClass);

export default router;