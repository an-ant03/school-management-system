import prisma from "../lib/db.js";

export const enrollStudent = async (req, res) => {
  try {
    const { studentId, sectionId } = req.body;

    if (!studentId || !sectionId) {
      return res.status(400).json({ message: "studentId and sectionId are required" });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
    });
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_sectionId: {
          studentId: parseInt(studentId),
          sectionId: parseInt(sectionId),
        },
      },
    });
    if (existing) {
      return res.status(400).json({ message: "Student already enrolled in this section" });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: parseInt(studentId),
        sectionId: parseInt(sectionId),
      },
    });

    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEnrollmentsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { sectionId: parseInt(sectionId) },
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        section: {
          include: {
            class: true,
          },
        },
      },
    });

    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeEnrollment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.enrollment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Enrollment removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};