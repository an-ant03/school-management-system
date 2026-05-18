import prisma from "../lib/db.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, sectionId, status, date } = req.body;

    if (!studentId || !sectionId || !status) {
      return res.status(400).json({ message: "studentId, sectionId and status are required" });
    }

    
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_sectionId: {
          studentId: parseInt(studentId),
          sectionId: parseInt(sectionId),
        },
      },
    });
    if (!enrollment) {
      return res.status(400).json({ message: "Student is not enrolled in this section" });
    }

    
    const attendanceDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(attendanceDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: parseInt(studentId),
        sectionId: parseInt(sectionId),
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this student today" });
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        sectionId: parseInt(sectionId),
        status,
        date: attendanceDate,
      },
    });

    res.status(201).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendanceBySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { date } = req.query;

    const where = { sectionId: parseInt(sectionId) };

    if (date) {
      const attendanceDate = new Date(date);
      const startOfDay = new Date(attendanceDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(attendanceDate);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = { gte: startOfDay, lte: endOfDay };
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: { user: true },
        },
      },
    });

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await prisma.attendance.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        section: {
          include: { class: true },
        },
      },
      orderBy: { date: "desc" },
    });

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};