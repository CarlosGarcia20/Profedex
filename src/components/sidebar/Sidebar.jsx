import { Link, useLocation } from "react-router-dom";

import {
  HiMenu,
  HiHome,
  HiBookOpen,
  HiInformationCircle,
} from "react-icons/hi";
import { FaFileUpload } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const isTeacher = location.pathname.startsWith("/teacher");
  const basePath = isTeacher ? "/teacher" : "/student";

  return (
    <aside className="w-20 bg-red-600 text-white flex flex-col justify-between items-center py-4 shadow-lg border border-gray-950">
      <nav className="flex flex-col items-center space-y-6">
        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          {/* Icono de menú */}
          <HiMenu className="w-8 h-8" />
        </a>

        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Link to={basePath}>
            <HiHome className="w-8 h-8" />
          </Link>
        </a>

        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Link to="/student/team">
            <HiBookOpen className="w-8 h-8" />
          </Link>
        </a>

        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Link to="/student/team">
            <HiInformationCircle className="w-8 h-8" />
          </Link>
        </a>

        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Link to="/community">
            <FaFileUpload className="w-8 h-8" />
          </Link>
        </a>
      </nav>

      {/* Imagen inferior */}
      <div className="mb-4">
        <Link to={`${basePath}/profile`}>
          <img
            src="https://api.github.com/users/CarlosGarcia20.png"
            alt="Avatar de usuario"
            className="w-18 h-18 rounded-full border-2 border-white"
          />
        </Link>
      </div>
    </aside>
  );
}