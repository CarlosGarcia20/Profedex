import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    HiMenu,
    HiHome,
    HiBookOpen,
    HiInformationCircle,
} from "react-icons/hi";

import { FaFileUpload } from "react-icons/fa";

export default function Sidebar() {

    const isTeacher = location.pathname.startsWith("/teacher");
    const basePath = isTeacher ? "/teacher" : "/student";

    return (
        <motion.aside
            className="bg-red-600 text-white flex flex-col justify-between items-center py-6 shadow-2xl border-r border-red-800 h-full relative z-50">
            <nav className="flex flex-col w-full px-2 space-y-2">
                {/* ENLACES */}
                <SidebarLink
                    to={basePath}
                    icon={<HiHome className="w-7 h-7" />}
                    title={"Inicio"}
                >
                </SidebarLink>
                {!isTeacher && (
                    <SidebarLink
                        to={`${basePath}/team`}
                        icon={<HiBookOpen className="w-7 h-7" />}
                        title={"Horario"}
                    />
                )}
                <SidebarLink
                    to={`${basePath}/info`}
                    icon={<HiInformationCircle className="w-7 h-7" />}
                />
                <SidebarLink
                    to="/community"
                    icon={<FaFileUpload className="w-6 h-6" />}
                    title={"Comunidad"}
                />
            </nav>
            {/* --- FOOTER --- */}
            <div className="mb-6 w-full flex justify-center">
                <Link to={`${basePath}/profile`}>
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1 }} // Efecto sutil al pasar el mouse
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <img
                            src="https://api.github.com/users/CarlosGarcia20.png"
                            alt="Perfil"
                            className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-red-800"
                        />
                    </motion.div>
                </Link>
            </div>
        </motion.aside>
    );
}

function SidebarLink({ to, icon, title }) {
    return (
        <Link to={to} className="w-full block">
            <motion.div
                whileHover={{ backgroundColor: "rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.1 }}
                className="p-3 rounded-xl cursor-pointer flex items-center"
                title={title}
            >
                {/* Icono */}
                <motion.div
                >
                    {icon}
                </motion.div>
            </motion.div>
        </Link>
    );
}