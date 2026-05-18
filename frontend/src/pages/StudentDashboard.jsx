import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Get student profile first to get studentId
      const usersRes = await api.get("/auth/profile");
      const studentId = usersRes.data.student?.id;

      if (!studentId) return;

      const [enrollRes, gradeRes, attendRes] = await Promise.all([
        api.get(`/enrollments/student/${studentId}`),
        api.get(`/grades/student/${studentId}`),
        api.get(`/attendance/student/${studentId}`),
      ]);

      setEnrollments(enrollRes.data);
      setGrades(gradeRes.data);
      setAttendance(attendRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalClasses = attendance.length;
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendancePercent =
    totalClasses > 0
      ? ((presentCount / totalClasses) * 100).toFixed(1)
      : "N/A";

  const averageScore =
    grades.length > 0
      ? (
          grades.reduce((sum, g) => sum + g.score, 0) / grades.length
        ).toFixed(1)
      : "N/A";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar title="Student Dashboard" />
        <div className="flex items-center justify-center mt-20">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Student Dashboard" />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-xs text-gray-500">Enrolled Sections</p>
            <p className="text-2xl font-bold text-blue-600">
              {enrollments.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-xs text-gray-500">Subjects</p>
            <p className="text-2xl font-bold text-blue-600">{grades.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-xs text-gray-500">Attendance</p>
            <p className="text-2xl font-bold text-green-600">
              {attendancePercent}%
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-xs text-gray-500">Average Score</p>
            <p className="text-2xl font-bold text-purple-600">{averageScore}%</p>
          </div>
        </div>

        {/* My Classes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            My Classes
          </h2>
          {enrollments.length === 0 ? (
            <p className="text-gray-400 text-sm">Not enrolled in any sections yet.</p>
          ) : (
            <div className="space-y-2">
              {enrollments.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between border border-gray-200 rounded px-4 py-3"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {e.section.class.name}
                  </p>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    Section {e.section.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Grades */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            My Grades
          </h2>
          {grades.length === 0 ? (
            <p className="text-gray-400 text-sm">No grades recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {grades.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between border border-gray-200 rounded px-4 py-3"
                >
                  <p className="text-sm font-medium text-gray-700">
                    {g.class.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${
                        g.score >= 75
                          ? "text-green-600"
                          : g.score >= 50
                          ? "text-yellow-600"
                          : "text-red-500"
                      }`}
                    >
                      {g.score}%
                    </span>
                    {g.remarks && (
                      <span className="text-xs text-gray-500 italic">
                        {g.remarks}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Attendance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            My Attendance
          </h2>
          {attendance.length === 0 ? (
            <p className="text-gray-400 text-sm">No attendance records yet.</p>
          ) : (
            <div className="space-y-2">
              {attendance.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between border border-gray-200 rounded px-4 py-3"
                >
                  <p className="text-sm text-gray-700">
                    {a.section.class.name} — Section {a.section.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {new Date(a.date).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        a.status === "present"
                          ? "bg-green-100 text-green-700"
                          : a.status === "late"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;