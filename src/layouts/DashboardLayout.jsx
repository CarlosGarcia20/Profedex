import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { useState } from "react";

export default function DashboardLayout() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const openSidebar = () => {
		setIsSidebarOpen(true);
	};

	const closeSidebar = () => {
		setIsSidebarOpen(false);
	};

	return (
		<div className="flex flex-col h-screen">
			{/* Header arriba */}
			<Header />

			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar lateral */}
				<Sidebar />

				{/* Contenido principal */}
				<main className="flex-1 p-4 bg-gray-800 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
