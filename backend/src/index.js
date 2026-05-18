import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/assignments", assignmentRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));