import DashboardLayout from "../../../layouts/DashboardLayout";
import Header from "../../../components/header/HeaderGeneral";

const AlumnoPerfil = () => {
    return (
    <div>
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header titulo="Datos del Perfil" />
            <div className="flex flex-col lg:flex-row justify-between items-start p-8 gap-8">

                <div className="bg-white shadow-lg rounded-2xl p-6 w-full lg:w-2/3">
                <h2 className="text-2xl font-semibold text-blue-700 mb-6">Información Personal</h2>

                <form className="space-y-4">
                    <div>
                    <label className="block text-gray-700 font-medium mb-1">Nombre completo:</label>
                    <input
                        type="text"
                        value="Serafín Zambada"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium mb-1">Apodo:</label>
                    <input
                        type="text"
                        value="Serapio"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium mb-1">Grupo:</label>
                    <input
                        type="text"
                        value="503"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    </div>

                    <div>
                    <label className="block text-gray-700 font-medium mb-1">Correo electrónico:</label>
                    <input
                        type="email"
                        value="serapiozamba@gmail.com"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    </div>

                    <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        className="bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
                    >
                        Cambiar contraseña
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                    >
                        Actualizar datos
                    </button>
                    </div>
                </form>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-6 w-full lg:w-1/3 flex flex-col items-center">
                <div className="w-48 h-48 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 text-center">
                    Foto de perfil
                </div>

                <button
                    type="button"
                    className="mt-4 bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
                >
                    Cambiar imagen
                </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AlumnoPerfil;