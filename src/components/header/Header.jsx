import { useState, useEffect } from "react";
import Profedex from "../../assets/images/Profedex.png";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { showAlertConfirm } from "../../utils/alerts";

const ROLE_PATHS = {
	'admin': 'admin',
	'teacher': 'maestro',
	'student': 'estudiante'
};

export default function Header() {
	const location = useLocation();
	const navigate = useNavigate();

	const [userInfo, setUserInfo] = useState("");

	const isTeacher = location.pathname.startsWith("/teacher");
	const basePath = isTeacher ? "/teacher" : "/student";

	useEffect(() => {
		const storedName = localStorage.getItem("nickname");
		const storedRole = localStorage.getItem("role");

		setUserInfo({
			username: storedName || "Usuario",
			roleLabel: ROLE_PATHS[storedRole]
		});
	}, []);

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
		<header className="bg-red-600 text-white flex justify-between items-center shadow-md border-b border-gray-950 px-6 h-24 sticky top-0 z-40">
			<Link to={basePath}>
				<motion.img
					src={Profedex}
					className="h-20 object-contain"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				></motion.img>
			</Link>

			<div className="flex items-center space-x-6 p-2">
				<div className="text-right">
					<div className="text-2xl font-bold text-yellow-400 font-mono tracking-tighter">
						@{userInfo.username}
					</div>
					<div className="font-semibold text-gray-200 text-sm uppercase tracking-wide">
						{userInfo.roleLabel}
					</div>
				</div>

				<motion.div
					whileHover={{ x: 5, scale: 1.1, color: "#fbbf24" }}
					whileTap={{ scale: 0.9 }}
					transition={{ type: "spring", stiffness: 300 }}
					className="p-2 rounded-full hover:bg-red-800 transition-colors cursor-pointer border-2 border-transparent hover:border-red-400"
					title="Cerrar sesión"
					onClick={handleLogout}
				>
					<MdLogout size={32} />
				</motion.div>
			</div>
		</header>
	);
}