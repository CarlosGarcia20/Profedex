// import { useState } from "react";
import profedex from "../../assets/images/Profedex.png";

export default function Register() {
    //   const [user, setUser] = useState("");
    //   const [password, setPassword] = useState("");

    //   const handleSubmit = (e) => {
    //     e.preventDefault();

    //     console.log("User:", user);
    //     console.log("Password:", password);
    //     alert("Intento de inicio de sesion");
    //   };

  return (
    <div className="bg-red-700 min-h-screen flex items-center justify-center p-4">
      <div class="bg-gray-200 w-full max-w-lg p-8 rounded-xl border-4 border-gray-300 shadow-lg">
        <div className="mb-8">
          <img
            src={profedex}
            alt="Icon profedex"
            className="w-96 mx-auto"
          ></img>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Información del perfil
        </h2>

        <form>
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre:
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4 flex items-end space-x-2">
            <div className="flex-grow">
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Apodo:
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition duration-300 h-10"
            >
              Verificar
            </button>
          </div>

1          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-right">
            <button
                type="submit"
                className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition duration-300"
            >
                Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
