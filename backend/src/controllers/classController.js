import prisma from "../lib/db.js";

export const createClass = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const newClass = await prisma.class.create({
      data: { name },
    });

    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        sections: true,
      },
    });

    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    const foundClass = await prisma.class.findUnique({
      where: { id: parseInt(id) },
      include: {
        sections: {
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
        },
      },
    });

    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(foundClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.class.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Class deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};