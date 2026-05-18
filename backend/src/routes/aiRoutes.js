import express from "express";
import {
  generateReportComment,
  saveComment,
} from "../controllers/aiController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/report/:studentId", auth(["ADMIN", "TEACHER"]), generateReportComment);
router.post("/report/save", auth(["ADMIN", "TEACHER"]), saveComment);

export default router;