import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";

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

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

	return (
		<motion.aside
			animate={{ width: isSidebarOpen ? 200 : 80 }} // Ancho animado
			transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
			className="bg-red-600 text-white flex flex-col justify-between items-center py-4 shadow-lg border border-gray-950 h-full"
		>
			<nav className="flex flex-col items-center space-y-6 w-full">
				{/* Botón del menú */}
				<motion.button
					onClick={toggleSidebar}
					className="p-2 rounded-lg hover:bg-red-700 transition-colors mb-4"
					whileHover={{ rotateY: 180, scale: 1.3 }}
					whileTap={{ scale: 0.9 }}
				>
					<HiMenu className="w-8 h-8" />
				</motion.button>

				{/* Enlaces */}
				<SidebarLink
					to={basePath}
					icon={<HiHome className="w-8 h-8" />}
					label="Inicio"
					isSidebarOpen={isSidebarOpen}
				/>

				<SidebarLink
					to="/student/team"
					icon={<HiBookOpen className="w-8 h-8" />}
					label="Equipo"
					isSidebarOpen={isSidebarOpen}
					hoverAnimation
				/>

				<SidebarLink
					to="/student/team"
					icon={<HiInformationCircle className="w-8 h-8" />}
					label="Información"
					isSidebarOpen={isSidebarOpen}
				/>

				<SidebarLink
					to="/community"
					icon={<FaFileUpload className="w-8 h-8" />}
					label="Comunidad"
					isSidebarOpen={isSidebarOpen}
				/>
			</nav>

			{/* Imagen inferior */}
			<div className="mb-4 flex items-center justify-center">
				<Link
					to={`${basePath}/profile`}
					className="flex items-center space-x-3 px-2"
				>
					<img
						src="https://api.github.com/users/CarlosGarcia20.png"
						alt="Avatar de usuario"
						className="w-14 h-14 rounded-full border-2 border-white"
					/>
					{isSidebarOpen && (
						<motion.span
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							className="font-semibold"
						>
						</motion.span>
					)}
				</Link>
			</div>
		</motion.aside>
	);
}

/* 🔧 Componente auxiliar para cada enlace del Sidebar */
function SidebarLink({ to, icon, label, isSidebarOpen, hoverAnimation }) {
	const motionProps = hoverAnimation
		? {
			whileHover: {
				rotateY: [0, 25, -25, 15, -10, 0],
				transition: { duration: 0.8 },
			},
		}
		: {};

	return (
		<motion.div
			{...motionProps}
			className="p-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center w-full justify-center sm:justify-start px-3"
		>
			<Link to={to} className="flex items-center space-x-3">
				{icon}
				{isSidebarOpen && (
					<motion.span
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						className="font-medium"
					>
						{label}
					</motion.span>
				)}
			</Link>
		</motion.div>
	);
}
