import {
  HiMenu,
  HiHome,
  HiBookOpen,
  HiInformationCircle,
} from "react-icons/hi";
import { FaFileUpload } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-20 bg-red-600 text-white flex flex-col justify-between items-center py-4 shadow-lg border border-gray-950">
      <nav className="flex flex-col items-center space-y-6">
        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <HiMenu className="w-10 h-10" />
        </a>
        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <HiHome className="w-10 h-10" />
        </a>
        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <HiBookOpen className="w-10 h-10" />
        </a>
        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <HiInformationCircle className="w-10 h-10" />
        </a>
        <a
          href="#"
          className="p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaFileUpload className="w-10 h-10" />
        </a>
      </nav>

      {/* Imagen inferior */}
      <div className="mb-4">
        <img
          src="https://via.placeholder.com/48x48.png?text=User"
          alt="Avatar de usuario"
          className="w-18 h-18 rounded-full border-2 border-white"
        />
      </div>
    </aside>
  );
}
