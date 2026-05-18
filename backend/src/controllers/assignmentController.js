import prisma from "../lib/db.js";

export const assignTeacher = async (req, res) => {
  try {
    const { teacherId, sectionId } = req.body;

    if (!teacherId || !sectionId) {
      return res.status(400).json({ message: "teacherId and sectionId are required" });
    }

    // Check if teacher exists
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(teacherId) },
    });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { id: parseInt(sectionId) },
    });
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    // Check if already assigned
    const existing = await prisma.assignment.findUnique({
      where: {
        teacherId_sectionId: {
          teacherId: parseInt(teacherId),
          sectionId: parseInt(sectionId),
        },
      },
    });
    if (existing) {
      return res.status(400).json({ message: "Teacher already assigned to this section" });
    }

    const assignment = await prisma.assignment.create({
      data: {
        teacherId: parseInt(teacherId),
        sectionId: parseInt(sectionId),
      },
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssignmentsBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const assignments = await prisma.assignment.findMany({
      where: { sectionId: parseInt(sectionId) },
      include: {
        teacher: {
          include: { user: true },
        },
      },
    });

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAssignmentsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const assignments = await prisma.assignment.findMany({
      where: { teacherId: parseInt(teacherId) },
      include: {
        section: {
          include: {
            class: true,
          },
        },
      },
    });

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.assignment.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Assignment removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};