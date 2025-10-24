import DashboardLayout from "../../../layouts/DashboardLayout"
import Header from "../../../components/header/HeaderGeneral";

export default function Equipo() {
    return (
      <DashboardLayout>
        <div className="mx-auto bg-gray-300 rounded-lg shadow-xl overflow-hidden">
          <Header titulo="Tu Equipo" />

          <main className="p-6 flex flex-col lg:flex-row gap-8 h-full min-h-[500px]">
            {/* Columna izquierda: Grupo y Horario */}
            <div className="flex-1 flex flex-col space-y-6 h-full">
              <div>
                <h1 className="text-xl font-bold text-blue-700 mb-2">Grupo</h1>
                <input
                  type="text"
                  className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 w-64"
                  placeholder="Grupo"
                  disabled
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-blue-700 mb-2">Horario</h2>
                <div className="overflow-x-auto shadow-md rounded-lg flex-1">
                  <table className="w-full border-collapse bg-white h-full">
                    <thead>
                      <tr className="bg-gray-100 rounded-md">
                        <th className="border border-gray-900 p-3 text-left font-semibold text-gray-700">Profesor</th>
                        <th className="border border-gray-900 p-3 text-left font-semibold text-gray-700">Hora</th>
                        <th className="border border-gray-900 p-3 text-left font-semibold text-gray-700">Materia</th>
                        <th className="border border-gray-900 p-3 text-left font-semibold text-gray-700">Aula</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Columna derecha: Recursamiento */}
            <div className="flex-1 flex flex-col h-full">
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-blue-700 mb-2">Recursamiento</h2>
                <div className="overflow-x-auto shadow-md rounded-lg flex-1">
                  <table className="w-full border-collapse bg-white h-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Hora</th>
                        <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Materia</th>
                        <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Aula</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
}