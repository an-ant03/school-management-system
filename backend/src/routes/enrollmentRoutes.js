import express from "express";
import {
  enrollStudent,
  getEnrollmentsBySection,
  getEnrollmentsByStudent,
  removeEnrollment,
} from "../controllers/enrollmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["ADMIN"]), enrollStudent);
router.get("/section/:sectionId", auth(["ADMIN", "TEACHER"]), getEnrollmentsBySection);
router.get("/student/:studentId", auth(["ADMIN", "STUDENT"]), getEnrollmentsByStudent);
router.delete("/:id", auth(["ADMIN"]), removeEnrollment);

export default router;