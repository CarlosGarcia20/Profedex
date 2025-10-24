import DashboardLayout from "../../../layouts/DashboardLayout"
import HeaderGeneral from "../../../components/header/HeaderGeneral"

export default function CommunityContent() {
    return (
      <DashboardLayout>
        <div className="mx-auto bg-gray-300 flex flex-col">
          <HeaderGeneral titulo="Comunidad" />
          <div className="p-6 space-y-8">
            <div className="border-2 border-dashed border-blue-400 p-8 rounded-lg text-center bg-white shadow-sm">
              <input type="file" id="file-upload" multiple className="hidden" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg
                    className="w-16 h-16 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="text-xl font-semibold text-gray-700">
                    Arrastra y suelta tus archivos aquí
                  </p>
                  <p className="text-gray-500">
                    o{" "}
                    <span className="text-blue-600 font-medium hover:underline">
                      haz clic para seleccionar
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Imágenes, Videos, Audios, Documentos (Max 10MB)
                  </p>
                </div>
              </label>
            </div>

            <h2 className="text-2xl font-bold text-blue-700">Tus archivos</h2>

            <div
              id="uploaded-files-container"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <i className="fas fa-image text-4xl text-green-500"></i>{" "}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    foto_vacaciones.jpg
                  </p>
                  <p className="text-sm text-gray-500">2.3 MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-lg"></i>
                </button>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <i className="fas fa-image text-4xl text-green-500"></i>{" "}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    foto_vacaciones.jpg
                  </p>
                  <p className="text-sm text-gray-500">2.3 MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-lg"></i>
                </button>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <i className="fas fa-image text-4xl text-green-500"></i>{" "}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    foto_vacaciones.jpg
                  </p>
                  <p className="text-sm text-gray-500">2.3 MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-lg"></i>
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-blue-700">
              Archivos de la Comunidad
            </h2>

            <div
              id="uploaded-files-container"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <i className="fas fa-image text-4xl text-green-500"></i>{" "}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    foto_vacaciones.jpg
                  </p>
                  <p className="text-sm text-gray-500">2.3 MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-lg"></i>
                </button>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <i className="fas fa-image text-4xl text-green-500"></i>{" "}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    foto_vacaciones.jpg
                  </p>
                  <p className="text-sm text-gray-500">2.3 MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-lg"></i>
                </button>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <i className="fas fa-image text-4xl text-green-500"></i>{" "}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    foto_vacaciones.jpg
                  </p>
                  <p className="text-sm text-gray-500">2.3 MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-trash-alt text-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
}