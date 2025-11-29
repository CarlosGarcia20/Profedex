import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";
import { showAlertConfirm } from "../../utils/alerts";
import toast from "react-hot-toast";
import api from "../../api/axios";

// ICONOS
import { MdSpaceDashboard } from "react-icons/md";
import { FaUser, FaBook } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

export default function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        if (e) e.preventDefault();

        showAlertConfirm(
            "¿Cerrar sesión?",
        ).then(async (result) => {

            if (result.isConfirmed) {

                const logoutPromise = api.post('auth/logout');

                toast.promise(logoutPromise, {
                    loading: 'Cerrando sesión...',
                    success: 'Hasta pronto',
                    error: 'Sesión cerrada (localmente)',
                });

                try {
                    await logoutPromise;
                } catch (error) {
                    console.error("Error al cerrar sesión en servidor:", error);
                } finally {
                    localStorage.clear();
                    navigate('/login');
                }
            }
        });
    };

    return (
        <aside
            className="w-20 md:w-64 flex flex-col shadow-2xl z-10 h-screen bg-[#c7b3a7] text-gray-600 transition-all duration-300 dark:bg-[#29314a]"
        >

            {/* Logo */}
            <div className="h-20 flex items-center border-b border-black/10 transition-all duration-300 px-0 justify-center md:justify-start md:px-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 min-w-[32px] rounded-full flex items-center justify-center font-bold text-black shadow-md dark:text-yellow-400"
                    >
                        P
                    </div>
                    <span className="text-xl font-bold tracking-wide hidden md:block whitespace-nowrap text-gray-950 dark:text-amber-400">
                        Profedex
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-2 md:px-4 py-6 space-y-2">
                <AdminLink to="/admin" end icon={<MdSpaceDashboard />} label="Dashboard" />
                <AdminLink to="/admin/users" icon={<FaUser />} label="Usuarios" />
                <AdminLink to="/admin/subjects" icon={<FaBook />} label="Materias" />
            </nav>

            <div className="p-4 border-t border-black/10 bg-black/5 flex flex-col gap-4">

                <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-0">

                    {/* 1. Foto y Nombre */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center text-xs font-bold shadow-md border border-white/20 bg-gray-700/50 overflow-hidden">
                            <img src="https://api.github.com/users/CarlosGarcia20.png" alt="User" />
                        </div>

                        <div className="hidden md:block flex-1 min-w-0">
                            <p className="text-sm font-medium truncate leading-tight text-gray-950 dark:text-yellow-400">Carlos Garcia</p>
                            <p className="text-xs truncate opacity-70 font-bold text-gray-950 dark:text-yellow-400">Admin</p>
                        </div>
                    </div>

                    <ThemeToggle />
                </div>

                {/* Botón Cerrar Sesión */}
                <button
                    className="w-full flex items-center justify-center md:justify-start gap-3 px-0 md:px-4 py-3 rounded-lg hover:bg-[#dfab8c] hover:dark:bg-[#62627b] hover:text-red-500 transition-colors text-red-400"
                    title="Cerrar Sesión"
                    onClick={handleLogout}
                >
                    <span className="text-2xl md:text-xl">
                        <IoLogOutOutline />
                    </span>
                    <span className="hidden md:block font-medium">Salir</span>
                </button>
            </div>
        </aside>
    );

}

// Componente auxiliar optimizado
function AdminLink({ to, icon, label, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `
                flex items-center 
                justify-center md:justify-start
                gap-3 px-2 md:px-4 py-3 
                rounded-lg transition-all duration-200 group
                ${isActive
                ? 'text-rose-300 bg-[#ece8d7] dark:bg-gray-700 dark:text-yellow-400 font-bold shadow-sm'
                : 'text-white hover:text-gray-950 hover:bg-[#dfab8c]'
                }
            `}
            title={label}
        >
            <span className="text-2xl md:text-xl transition-all">
                {icon}
            </span>

            <span className="hidden md:block whitespace-nowrap">
                {label}
            </span>
        </NavLink>
    );
}