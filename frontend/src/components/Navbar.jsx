import { useNavigate } from "react-router-dom";

function Navbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-50 text-sm font-medium"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;