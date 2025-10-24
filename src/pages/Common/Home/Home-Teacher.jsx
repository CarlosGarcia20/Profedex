import DashboardLayout from "../../../layouts/DashboardLayout";
import Header from "../../../components/header/HeaderGeneral";

export default function HomeTeacher() {
  return (
    <DashboardLayout>
      <div className="mx-auto bg-gray-300 rounded-lg shadow-xl overflow-hidden">
        <Header titulo="Bienvenido(a)" />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-700">Tu ubicación</h2>

              <div className="grid gird-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex items-start space-x-4">
                  <button
                    type="button"
                    className="bg-gray-300 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="pointer-events-none h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"></span>
                  </button>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      Ubicación en tiempo real
                    </p>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Activar
                    </a>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border-l-4 border-yellow-500 shadow-sm">
                  <h3 className="font-semibold text-sm text-gray-800">
                    Ubicación en tiempo real
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Si activas tu ubicación en tiempo real, se verá tu posición
                    exacta en el momento, si la desactivas solo se verá tu
                    ubicación conforme a las aulas y al horario seleccionados
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-blue-700 mb-2">Agenda</h2>

                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full table-fixed border-collapse bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Hora</th>
                                <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Materia</th>
                                <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Aula/Centro de cómputo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-1">
                <h2 className="text-xl font-bold text-blue-700 mb-2">Eventos</h2>

                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="w-full table-fixed border-collapse bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Día</th>
                                <th className="border border-gray-400 p-3 text-left font-semibold text-gray-700">Evento</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
