import express from "express";
import {
  assignTeacher,
  getAssignmentsBySection,
  getAssignmentsByTeacher,
  removeAssignment,
} from "../controllers/assignmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["ADMIN"]), assignTeacher);
router.get("/section/:sectionId", auth(["ADMIN", "TEACHER"]), getAssignmentsBySection);
router.get("/teacher/:teacherId", auth(["ADMIN", "TEACHER"]), getAssignmentsByTeacher);
router.delete("/:id", auth(["ADMIN"]), removeAssignment);

export default router;