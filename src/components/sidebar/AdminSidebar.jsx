import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";
import { showAlertConfirm } from "../../utils/alerts";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { APP_NAME } from "../../config/constants";

// ICONOS
import { MdGroup, MdSpaceDashboard } from "react-icons/md";
import { FaUser, FaBook, FaBars, FaBookOpen, FaBookReader, FaUniversity, FaChevronDown, FaChevronRight, FaUserGraduate, FaUserTie, FaUserPlus } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

export default function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        if (e) e.preventDefault();
        showAlertConfirm("¿Cerrar sesión?").then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.post('auth/logout');
                    toast.success("Hasta pronto");
                } catch (error) {
                    console.error("Error logout:", error);
                } finally {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        });
    };

    return (
        <aside className="w-20 md:w-64 flex flex-col shadow-2xl z-10 h-screen bg-[#c7b3a7] text-gray-600 transition-all duration-300 dark:bg-[#29314a]">

            {/* LOGO */}
            <div className="h-20 flex items-center border-b border-black/10 transition-all duration-300 justify-center md:justify-start md:px-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center font-bold text-black shadow-md dark:text-yellow-400 bg-white dark:bg-gray-800">
                        P
                    </div>
                    <span className="text-xl font-bold tracking-wide hidden md:block whitespace-nowrap text-gray-950 dark:text-amber-400">
                        {APP_NAME}
                    </span>
                </div>
            </div>

            {/* NAVEGACIÓN */}
            <nav className="flex-1 px-2 md:px-4 py-6 space-y-2 overflow-y-auto">

                <AdminLink to="/admin" end icon={<MdSpaceDashboard />} label="Dashboard" />

                {/* --- GRUPO ESCOLAR --- */}
                <SidebarGroup icon={<FaUser />} label="Gestión de usuarios" >
                    <AdminLink to="/admin/users" icon={<FaUserPlus />} label="Usuarios" />
                    <AdminLink to="/admin/students" icon={<FaUserGraduate />} label="Estudiantes" />
                    <AdminLink to="/admin/teachers" icon={<FaUserTie />} label="Profesores" />

                </SidebarGroup> 

                {/* --- GRUPO ESCOLAR --- */}
                <SidebarGroup icon={<FaUniversity />} label="Gestión Escolar">
                    <AdminLink to='/admin/majors' icon={<FaBars />} label="Carreras" isChild />
                    <AdminLink to='/admin/groups' icon={<MdGroup />} label="Grupos" isChild />
                    <AdminLink to="/admin/subjects" icon={<FaBook />} label="Materias" isChild />
                    <AdminLink to="/admin/units" icon={<FaBookOpen />} label="Unidades" isChild />
                    <AdminLink to="/admin/topics" icon={<FaBookReader />} label="Temas" isChild />
                </SidebarGroup>

            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-black/10 bg-black/5 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center shadow-md border border-white/20 bg-gray-700/50 overflow-hidden">
                            <img src="../../public/user-svgrepo-com.svg" alt="User" />
                        </div>
                        <div className="hidden md:block flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-950 dark:text-yellow-400">Carlos Garcia</p>
                            <p className="text-xs truncate opacity-70 font-bold text-gray-950 dark:text-yellow-400">Admin</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>

                <button
                    className="w-full flex items-center justify-center md:justify-start gap-3 px-0 md:px-4 py-3 rounded-lg hover:bg-[#dfab8c] hover:dark:bg-[#62627b] hover:text-red-500 transition-colors text-red-500 dark:text-red-400"
                    title="Cerrar Sesión"
                    onClick={handleLogout}
                >
                    <span className="text-2xl md:text-xl"><IoLogOutOutline /></span>
                    <span className="hidden md:block font-medium">Salir</span>
                </button>
            </div>
        </aside>
    );
}

function AdminLink({ to, icon, label, end = false, isChild = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `
                flex items-center 
                justify-center md:justify-start
                gap-3 px-2 py-3 
                ${isChild ? 'md:pl-8 text-sm' : 'md:px-4'} /* Indentación si es hijo */
                rounded-lg transition-all duration-200 group
                ${isActive
                    ? 'text-rose-400 bg-[#ece8d7] dark:bg-gray-700 dark:text-yellow-400 font-bold shadow-sm'
                    : 'text-white hover:text-gray-950 hover:bg-[#dfab8c] dark:hover:bg-gray-600 dark:hover:text-white'
                }
            `}
            title={label}
        >
            <span className={`${isChild ? 'text-lg md:text-base' : 'text-2xl md:text-xl'} transition-all`}>
                {icon}
            </span>
            <span className="hidden md:block whitespace-nowrap">
                {label}
            </span>
        </NavLink>
    );
}

function SidebarGroup({ icon, label, children }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center 
                    justify-center md:justify-between
                    gap-3 px-2 md:px-4 py-3 
                    rounded-lg transition-all duration-200
                    text-white hover:text-gray-950 hover:bg-[#dfab8c] dark:hover:bg-gray-600 dark:hover:text-white
                `}
                title={label}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl md:text-xl">{icon}</span>
                    <span className="hidden md:block whitespace-nowrap font-medium">{label}</span>
                </div>

                <div className="hidden md:block transition-transform duration-300">
                    {isOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                </div>
            </button>

            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="flex flex-col space-y-1">
                    {children}
                </div>
            </div>
        </div>
    );
}