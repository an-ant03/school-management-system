import express from "express";
import {
  createSection,
  getSectionsByClass,
  getSectionById,
  deleteSection,
} from "../controllers/sectionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["ADMIN"]), createSection);
router.get("/class/:classId", auth(["ADMIN", "TEACHER", "STUDENT"]), getSectionsByClass);
router.get("/:id", auth(["ADMIN", "TEACHER", "STUDENT"]), getSectionById);
router.delete("/:id", auth(["ADMIN"]), deleteSection);

export default router;