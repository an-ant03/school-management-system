import prisma from "../lib/db.js";
import { askAI } from "../services/aiService.js";

export const generateReportComment = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { tone } = req.query.tone;

    
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      include: {
        user: true,
        grades: {
          include: { class: true },
        },
        attendance: {
          include: { section: { include: { class: true } } },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    
    const totalClasses = student.attendance.length;
    const presentCount = student.attendance.filter(
      (a) => a.status === "present"
    ).length;
    const attendancePercent =
      totalClasses > 0
        ? ((presentCount / totalClasses) * 100).toFixed(1)
        : "N/A";

    const grades = student.grades.map((g) => ({
      class: g.class.name,
      score: g.score,
      remarks: g.remarks || "No remarks",
    }));

    const averageScore =
      grades.length > 0
        ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
        : "N/A";

    const weakestSubject =
      grades.length > 0
        ? grades.reduce((min, g) => (g.score < min.score ? g : min), grades[0])
        : null;

    const strongestSubject =
      grades.length > 0
        ? grades.reduce((max, g) => (g.score > max.score ? g : max), grades[0])
        : null;

    
    const prompt = `
You are a professional school report card comment writer.
Generate a personalized report card comment for the following student.
Tone: ${tone || "formal and constructive"}

Student Name: ${student.user.name}
Attendance: ${attendancePercent}% (${presentCount} out of ${totalClasses} classes)
Average Score: ${averageScore}%
Strongest Subject: ${strongestSubject ? `${strongestSubject.class} (${strongestSubject.score}%)` : "N/A"}
Weakest Subject: ${weakestSubject ? `${weakestSubject.class} (${weakestSubject.score}%)` : "N/A"}
Subject Breakdown: ${JSON.stringify(grades)}

Requirements:
- 3 to 4 sentences only
- Mention attendance and academic performance
- Be specific about strongest and weakest subjects
- End with an encouraging or constructive suggestion
- Do NOT use placeholder text
- Respond with ONLY the comment text, nothing else
    `;

    const comment = await askAI(prompt);

    
    res.json({
      studentName: student.user.name,
      metrics: {
        attendancePercent,
        averageScore,
        strongestSubject: strongestSubject?.class,
        weakestSubject: weakestSubject?.class,
      },
      comment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const saveComment = async (req, res) => {
  try {
    const { studentId, comment } = req.body;

    if (!studentId || !comment) {
      return res.status(400).json({ message: "studentId and comment are required" });
    }

    
    await prisma.grade.updateMany({
      where: { studentId: parseInt(studentId) },
      data: { remarks: comment },
    });

    res.json({ message: "Comment saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};