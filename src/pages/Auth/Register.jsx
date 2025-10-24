import { useState } from "react";
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
      <div class="bg-gray-200 w-full max-w-sm p-8 rounded-xl shadow-lg">
        <div className="mb-8">
          <img
            src={profedex}
            alt="Icon profedex"
            className="w-96 mx-auto"
          ></img>
        </div>

        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full py-1 rounded-md bg-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña:
            </label>
            <input
              type="password"
              className="w-full py-1 border rounded-md bg-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="col-mb-6 mb-5">
            <button
              type="submit"
              className="bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Acceder
            </button>
          </div>

          <div className="text-left mb-10">
            <a
              href="#"
              className="text-sm text-blue-900 underline hover:text-blue-950"
            >
              Olvidé mi contraseña
            </a>
          </div>

          <hr className="border-gray-400 my-4" />

          <div className="text-center">
            <a
              href="#"
              className="text-sm text-blue-900 underline hover:text-blue-950"
            >
              Registrarme
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
