import prisma from "../lib/db.js";

export const createSection = async (req, res) => {
  try {
    const { name, classId } = req.body;

    if (!name || !classId) {
      return res.status(400).json({ message: "Name and classId are required" });
    }

    const section = await prisma.section.create({
      data: {
        name,
        classId: parseInt(classId),
      },
    });

    res.status(201).json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSectionsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const sections = await prisma.section.findMany({
      where: { classId: parseInt(classId) },
      include: {
        assignments: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
        enrollments: {
          include: {
            student: {
              include: { user: true },
            },
          },
        },
      },
    });

    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await prisma.section.findUnique({
      where: { id: parseInt(id) },
      include: {
        assignments: {
          include: {
            teacher: {
              include: { user: true },
            },
          },
        },
        enrollments: {
          include: {
            student: {
              include: { user: true },
            },
          },
        },
        attendance: true,
      },
    });

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.section.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Section deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};