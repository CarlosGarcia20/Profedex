import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/sidebar/AdminSidebar";

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-[#ece8d7] dark:bg-[#414152] font-sans overflow-hidden">
            {/* 1. Sidebar Fijo */}
            <AdminSidebar />

            {/* 2. Área de Contenido */}
            <div className="flex-1 flex flex-col min-w-0">

                <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}