import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";

export default function DashboardLayout() {
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
