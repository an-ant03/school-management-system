import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function TeacherDashboard() {
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [grades, setGrades] = useState({});
  const [reportComment, setReportComment] = useState("");
  const [reportMetrics, setReportMetrics] = useState(null);
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);
  const [reportTone, setReportTone] = useState("formal and constructive");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);

  //const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSections();
  }, []);

  const showMessage = (msg, isError = false) => {
    if (isError) setError(msg);
    else setMessage(msg);
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const fetchSections = async () => {
  try {
    // First get profile to get the Teacher table ID
    const profileRes = await api.get("/auth/profile");
    const teacherId = profileRes.data.teacher?.id;

    if (!teacherId) {
      console.error("No teacher profile found");
      return;
    }

    const res = await api.get(`/assignments/teacher/${teacherId}`);
    setSections(res.data);
  } catch (err) {
    console.error(err);
  }
};

  const fetchStudents = async (sectionId) => {
    try {
      const res = await api.get(`/enrollments/section/${sectionId}`);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectSection = (section) => {
    setSelectedSection(section);
    fetchStudents(section.sectionId);
    setAttendance({});
    setGrades({});
    setReportComment("");
    setReportMetrics(null);
    setSelectedStudentForReport(null);
  };

  const handleMarkAttendance = async (studentId) => {
    const status = attendance[studentId];
    if (!status) {
      showMessage("Please select a status for this student", true);
      return;
    }
    try {
      await api.post("/attendance", {
        studentId,
        sectionId: selectedSection.sectionId,
        status,
      });
      showMessage("Attendance marked successfully");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to mark attendance", true);
    }
  };

  const handleAddGrade = async (studentId, classId) => {
    const score = grades[studentId];
    if (score === undefined || score === "") {
      showMessage("Please enter a score", true);
      return;
    }
    try {
      await api.post("/grades", {
        studentId,
        classId,
        score,
      });
      showMessage("Grade added successfully");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to add grade", true);
    }
  };

  const handleGenerateReport = async (student) => {
    setSelectedStudentForReport(student);
    setLoadingReport(true);
    setReportComment("");
    setReportMetrics(null);
    try {
      const res = await api.get(`/ai/report/${student.studentId}`, {
        params: { tone: reportTone },
      });
      setReportComment(res.data.comment);
      setReportMetrics(res.data.metrics);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to generate report", true);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleSaveComment = async () => {
    try {
      await api.post("/ai/report/save", {
        studentId: selectedStudentForReport.studentId,
        comment: reportComment,
      });
      showMessage("Comment saved successfully");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to save comment", true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar title="Teacher Dashboard" />

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

        {/* My Sections */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            My Sections
          </h2>
          {sections.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No sections assigned yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSection(s)}
                  className={`px-4 py-2 rounded text-sm font-medium border ${
                    selectedSection?.id === s.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {s.section.class.name} - {s.section.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Students in Selected Section */}
        {selectedSection && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Students in {selectedSection.section.class.name} -{" "}
              {selectedSection.section.name}
            </h2>
            {students.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No students enrolled yet.
              </p>
            ) : (
              <div className="space-y-4">
                {students.map((s) => (
                  <div
                    key={s.id}
                    className="border border-gray-200 rounded p-4 space-y-3"
                  >
                    <p className="font-medium text-gray-700">
                      {s.student.user.name}
                    </p>

                    {/* Attendance */}
                    <div className="flex items-center gap-3">
                      <select
                        value={attendance[s.studentId] || ""}
                        onChange={(e) =>
                          setAttendance({
                            ...attendance,
                            [s.studentId]: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Mark Attendance</option>
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                      </select>
                      <button
                        onClick={() => handleMarkAttendance(s.studentId)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Save Attendance
                      </button>
                    </div>

                    {/* Grade */}
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[s.studentId] || ""}
                        onChange={(e) =>
                          setGrades({
                            ...grades,
                            [s.studentId]: e.target.value,
                          })
                        }
                        placeholder="Enter grade (0-100)"
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                      />
                      <button
                        onClick={() =>
                          handleAddGrade(
                            s.studentId,
                            selectedSection.section.classId
                          )
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Save Grade
                      </button>
                    </div>

                    {/* Generate Report */}
                    <div className="flex items-center gap-3">
                      <select
                        value={reportTone}
                        onChange={(e) => setReportTone(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="formal and constructive">
                          Formal & Constructive
                        </option>
                        <option value="encouraging and positive">
                          Encouraging & Positive
                        </option>
                        <option value="direct and concise">
                          Direct & Concise
                        </option>
                      </select>
                      <button
                        onClick={() => handleGenerateReport(s)}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                      >
                        Generate Report Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Report Comment */}
        {loadingReport && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Generating report comment...</p>
          </div>
        )}

        {reportComment && selectedStudentForReport && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Report Card Comment — {selectedStudentForReport.student.user.name}
            </h2>

            {reportMetrics && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500">Attendance</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {reportMetrics.attendancePercent}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500">Average Score</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {reportMetrics.averageScore}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500">Strongest Subject</p>
                  <p className="text-sm font-semibold text-green-600">
                    {reportMetrics.strongestSubject || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-3 text-center">
                  <p className="text-xs text-gray-500">Weakest Subject</p>
                  <p className="text-sm font-semibold text-red-500">
                    {reportMetrics.weakestSubject || "N/A"}
                  </p>
                </div>
              </div>
            )}

            <textarea
              value={reportComment}
              onChange={(e) => setReportComment(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSaveComment}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Save Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;