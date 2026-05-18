import express from "express";
import {
  markAttendance,
  getAttendanceBySection,
  getAttendanceByStudent,
  updateAttendance,
} from "../controllers/attendanceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["TEACHER", "ADMIN"]), markAttendance);
router.get("/section/:sectionId", auth(["TEACHER", "ADMIN"]), getAttendanceBySection);
router.get("/student/:studentId", auth(["ADMIN", "STUDENT"]), getAttendanceByStudent);
router.put("/:id", auth(["TEACHER", "ADMIN"]), updateAttendance);

export default router;