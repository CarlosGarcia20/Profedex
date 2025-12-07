import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

import {
    HiHome,
    HiBookOpen,
    HiInformationCircle
} from "react-icons/hi";
import { FaFileUpload } from "react-icons/fa";

export default function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();
    // const user_image = user?.image || "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=random";
    const user_image = user?.image || "../../../public/user-svgrepo-com.svg";

    const isTeacher = location.pathname.startsWith("/teacher");
    const basePath = isTeacher ? "/teacher" : "/student";

    return (
        <motion.aside
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="bg-red-600 text-white flex flex-col justify-between items-center py-6 shadow-2xl border-r border-red-800 h-full relative z-50 w-15 md:w-24"
        >
            <nav className="flex flex-col w-full px-2 space-y-4 mt-4">
                {/* ENLACES */}

                <SidebarLink
                    to={basePath}
                    icon={<HiHome className="w-7 h-7" />}
                    title="Inicio"
                    isActive={location.pathname === basePath}
                />

                {!isTeacher && (
                    <SidebarLink
                        to={`${basePath}/team`}
                        icon={<HiBookOpen className="w-7 h-7" />}
                        title="Horario"
                        isActive={location.pathname.includes("/team")}
                    />
                )}

                <SidebarLink
                    to={`${basePath}/info`}
                    icon={<HiInformationCircle className="w-7 h-7" />}
                    title="Información"
                    isActive={location.pathname.includes("/info")}
                />

                <SidebarLink
                    to="/community"
                    icon={<FaFileUpload className="w-6 h-6" />}
                    title="Comunidad"
                    isActive={location.pathname.includes("/community")}
                />
            </nav>

            {/* --- FOOTER --- */}
            <div className="mb-6 w-full flex justify-center">
                <Link to={`${basePath}/profile`}>
                    <motion.div
                        className={`relative p-1 rounded-full transition-all duration-300 ${location.pathname.includes("/profile") ? "ring-4 ring-yellow-400" : "hover:ring-2 hover:ring-white"
                            }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img
                            src={user_image}
                            alt="Perfil"
                            className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-red-800 object-cover"
                        />
                    </motion.div>
                </Link>
            </div>
        </motion.aside>
    );
}

function SidebarLink({ to, icon, title, isActive }) {
    return (
        <Link to={to} className="w-full flex justify-center">
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                    p-3 rounded-xl cursor-pointer transition-all duration-300 relative group
                    ${isActive
                        ? "bg-white text-red-600 shadow-lg"
                        : "text-white hover:bg-red-700"
                    }
                `}
                title={title}
            >
                {icon}

                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {title}
                </span>
            </motion.div>
        </Link>
    );
}