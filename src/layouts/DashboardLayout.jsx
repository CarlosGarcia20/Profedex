import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
        <div className="flex flex-col h-screen">
        {/* Header arriba */}
        <Header />

        <div className="flex flex-1">
            {/* Sidebar lateral */}
            <Sidebar />

            {/* Contenido principal */}
            <main className="flex-1 p-4 bg-gray-800 overflow-y-auto">
            {children}
            </main>
        </div>
        </div>
  );
}
