import DashboardLayout from "../../../layouts/DashboardLayout";
import Header from "../../../components/header/HeaderGeneral";

export default function Home() {
    return (
        <DashboardLayout>
            <Header titulo="Bienvenido(a)" />

            <nav className="bg-gray-300 p-4 relative flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg rounded-b-md">
                <div className="text-xl font-bold text-blue-700">
                    ¡Encuentralos a todos!
                </div>

                {/* Search controls: centered across the nav on larger screens, full-width centered on small screens */}
                <div className="flex items-center justify-center w-full space-x-2 sm:absolute sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-auto">
                    <label htmlFor="search" className="font-semibold text-blue-700">
                    Buscar maestro(a):
                    </label>
                    <select
                    id="search"
                    name="search"
                    className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    >
                    <option>Seleccionar</option>
                    </select>
                </div>
            </nav>

            <div className="flex-1 mt-8 flex flex-col lg:flex-row gap-4">
                <div className="bg-gray-300 p-4 rounded-lg shadow-xl lg:w-2/3">
                    <h2 className="text-lg font-semibold text-blue-700 mb-4">
                        Planta 1
                    </h2>

                    <div className="w-full h-96 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                            Mapa de la planta 1
                        </span>
                    </div>
                </div>

                <div className="bg-gray-300 p-4 rounded-lg shadow-xl lg:w-1/3">
                    <h2 className="text-lg font-semibold text-blue-700 mb-4">
                        Planta 2
                    </h2>

                    <div className="w-full h-96 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                            Mapa de la planta 2
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}