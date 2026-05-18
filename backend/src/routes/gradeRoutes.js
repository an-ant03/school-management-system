import express from "express";
import {
  addGrade,
  getGradesByStudent,
  getGradesByClass,
  updateGrade,
  deleteGrade,
} from "../controllers/gradeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["TEACHER", "ADMIN"]), addGrade);
router.get("/student/:studentId", auth(["ADMIN", "STUDENT"]), getGradesByStudent);
router.get("/class/:classId", auth(["ADMIN", "TEACHER"]), getGradesByClass);
router.put("/:id", auth(["TEACHER", "ADMIN"]), updateGrade);
router.delete("/:id", auth(["ADMIN"]), deleteGrade);

export default router;