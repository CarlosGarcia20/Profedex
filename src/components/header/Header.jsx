import Profedex from "../../assets/images/Profedex.png"
import { motion } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { MdLogout } from "react-icons/md";

export default function Header() {
  const location = useLocation();
  const isTeacher = location.pathname.startsWith("/teacher");
  const basePath = isTeacher ? "/teacher" : "/student";

  return (
    <header className="bg-red-600 text-white flex justify-between items-center shadow-md border border-gray-950 px-6">
      <Link to={basePath}>
        <motion.img
          src={Profedex}
          className="h-24"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        ></motion.img>
      </Link>

      <div className="flex items-center space-x-6 p-2">
        <div className="text-right">
          <div className="text-2xl font-semibold text-yellow-400">
            @Nombre de usuario
          </div>
          <div className="font-semibold text-gray-200">Rol del usuario</div>
        </div>
        <motion.div
          whileHover={{ x: 20, y: -2, scale: 1.15, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 250, damping: 15 }}
          className="p-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          title="Cerrar sesión"
        >
          <MdLogout size={40} />
        </motion.div>
      </div>
    </header>
  );
}