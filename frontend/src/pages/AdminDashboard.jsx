import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function AdminDashboard() {
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [enrollStudentId, setEnrollStudentId] = useState("");
  const [enrollSectionId, setEnrollSectionId] = useState("");
  const [assignTeacherId, setAssignTeacherId] = useState("");
  const [assignSectionId, setAssignSectionId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("STUDENT");

  useEffect(() => {
    fetchClasses();
    fetchUsers();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const showMessage = (msg, isError = false) => {
    if (isError) setError(msg);
    else setMessage(msg);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.post("/classes", { name: className });
      setClassName("");
      fetchClasses();
      showMessage("Class created successfully");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to create class", true);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      await api.post("/sections", {
        name: sectionName,
        classId: selectedClassId,
      });
      setSectionName("");
      setSelectedClassId("");
      fetchClasses();
      showMessage("Section created successfully");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to create section", true);
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/enrollments", {
        studentId: enrollStudentId,
        sectionId: enrollSectionId,
      });
      setEnrollStudentId("");
      setEnrollSectionId("");
      showMessage("Student enrolled successfully");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to enroll student", true);
    }
  };

  const handleAssignTeacher = async (e) => {
    e.preventDefault();
    try {
      await api.post("/assignments", {
        teacherId: assignTeacherId,
        sectionId: assignSectionId,
      });
      setAssignTeacherId("");
      setAssignSectionId("");
      showMessage("Teacher assigned successfully");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to assign teacher", true);
    }
  };

  const handleCreateUser = async (e) => {
  e.preventDefault();
  try {
    await api.post("/auth/register", {
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
    });
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("STUDENT");
    fetchUsers();
    showMessage("User created successfully");
  } catch (err) {
    showMessage(err.response?.data?.message || "Failed to create user", true);
  }
};


  const students = users.filter((u) => u.role === "STUDENT");
  const teachers = users.filter((u) => u.role === "TEACHER");

  const allSections = classes.flatMap((c) =>
    c.sections.map((s) => ({ ...s, className: c.name }))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Admin Dashboard" />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {message && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Create User */}
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-lg font-semibold text-gray-700 mb-4">
    Create User
  </h2>
  <form onSubmit={handleCreateUser} className="flex gap-3 flex-wrap">
    <input
      type="text"
      value={newUserName}
      onChange={(e) => setNewUserName(e.target.value)}
      placeholder="Full Name"
      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
    <input
      type="email"
      value={newUserEmail}
      onChange={(e) => setNewUserEmail(e.target.value)}
      placeholder="Email"
      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
    <input
      type="password"
      value={newUserPassword}
      onChange={(e) => setNewUserPassword(e.target.value)}
      placeholder="Password"
      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
    <select
      value={newUserRole}
      onChange={(e) => setNewUserRole(e.target.value)}
      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="STUDENT">Student</option>
      <option value="TEACHER">Teacher</option>
      <option value="ADMIN">Admin</option>
    </select>
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
    >
      Create
    </button>
  </form>
</div>

        {/* Create Class */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Create Class
          </h2>
          <form onSubmit={handleCreateClass} className="flex gap-3">
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="e.g. Grade 10 Math"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Create
            </button>
          </form>
        </div>

        {/* Create Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Create Section
          </h2>
          <form onSubmit={handleCreateSection} className="flex gap-3">
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. 10-A"
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Create
            </button>
          </form>
        </div>

        {/* Enroll Student */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Enroll Student in Section
          </h2>
          <form onSubmit={handleEnrollStudent} className="flex gap-3">
            <select
              value={enrollStudentId}
              onChange={(e) => setEnrollStudentId(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.student?.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={enrollSectionId}
              onChange={(e) => setEnrollSectionId(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Section</option>
              {allSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.className} - {s.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Enroll
            </button>
          </form>
        </div>

        {/* Assign Teacher */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Assign Teacher to Section
          </h2>
          <form onSubmit={handleAssignTeacher} className="flex gap-3">
            <select
              value={assignTeacherId}
              onChange={(e) => setAssignTeacherId(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.teacher?.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <select
              value={assignSectionId}
              onChange={(e) => setAssignSectionId(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Section</option>
              {allSections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.className} - {s.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Assign
            </button>
          </form>
        </div>

        {/* Classes Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Classes Overview
          </h2>
          {classes.length === 0 ? (
            <p className="text-gray-400 text-sm">No classes created yet.</p>
          ) : (
            <div className="space-y-4">
              {classes.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded p-4">
                  <h3 className="font-medium text-gray-700">{c.name}</h3>
                  {c.sections.length === 0 ? (
                    <p className="text-gray-400 text-sm mt-1">No sections yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {c.sections.map((s) => (
                        <span
                          key={s.id}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;