import prisma from "../lib/db.js";

export const addGrade = async (req, res) => {
  try {
    const { studentId, classId, score, remarks } = req.body;

    if (!studentId || !classId || score === undefined) {
      return res.status(400).json({ message: "studentId, classId and score are required" });
    }

    
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    
    const foundClass = await prisma.class.findUnique({
      where: { id: parseInt(classId) },
    });
    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    
    const existing = await prisma.grade.findFirst({
      where: {
        studentId: parseInt(studentId),
        classId: parseInt(classId),
      },
    });
    if (existing) {
      return res.status(400).json({ message: "Grade already exists for this student in this class, use update instead" });
    }

    const grade = await prisma.grade.create({
      data: {
        studentId: parseInt(studentId),
        classId: parseInt(classId),
        score: parseFloat(score),
        remarks: remarks || null,
      },
    });

    res.status(201).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGradesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const grades = await prisma.grade.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        class: true,
      },
    });

    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getGradesByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const grades = await prisma.grade.findMany({
      where: { classId: parseInt(classId) },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, remarks } = req.body;

    if (score === undefined) {
      return res.status(400).json({ message: "Score is required" });
    }

    const grade = await prisma.grade.update({
      where: { id: parseInt(id) },
      data: {
        score: parseFloat(score),
        remarks: remarks || null,
      },
    });

    res.json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.grade.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};