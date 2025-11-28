import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import profedex from "../../assets/images/Profedex.png";
import api from "../../api/axios";
import axios from "axios";

export default function Login() {
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const response = await axios.post('http://localhost:4000/auth/', {
				username: user,
				password: password
			});

			console.log(response);

			const { nickname, name } = response.data.user;

			// Guardamos la respuesta real del servidor
			localStorage.setItem("isLoggedIn", "true");
			// localStorage.setItem("role", role);
			localStorage.setItem("username", nickname);
			localStorage.setItem("name", name);

			// Redirección dinámica basada en la respuesta del servidor
			// navigate(`/${role}`);

		} catch (err) {
			console.error("Error en login:", err);

			// Manejo de errores de Axios
			if (err.response) {
				// El servidor respondió con un código de error (ej. 401, 400)
				setError(err.response.data.message || "Credenciales incorrectas");
			} else if (err.request) {
				// No hubo respuesta del servidor (backend caído)
				setError("No se pudo conectar con el servidor");
			} else {
				setError("Ocurrió un error inesperado");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-red-700 min-h-screen flex items-center justify-center p-4">
			<div className="bg-gray-200 w-full max-w-sm p-8 rounded-xl shadow-lg">
				<div className="mb-8">
					<img
						src={profedex}
						alt="Icon profedex"
						className="w-96 mx-auto"
					></img>
				</div>

				<form onSubmit={handleSubmit}>
					{/* Mensaje de Error Visual */}
					{error && (
						<div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded text-center">
							{error}
						</div>
					)}

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
							value={user}
							onChange={(e) => setUser(e.target.value)}
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
							className="w-full py-1 border rounded-md bg-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<div className="col-mb-6 mb-5">
						<button
							type="submit"
							disabled={loading} // Deshabilitamos si está cargando
							className={`w-full text-white py-2 px-4 rounded-md transition duration-300 ${loading
									? "bg-blue-400 cursor-not-allowed"
									: "bg-blue-800 hover:bg-blue-700"
								}`}
						>
							{loading ? "Verificando..." : "Acceder"}
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

				</form>
				<footer className="mt-5 p-2 text-center text-xs text-gray-500">
					Versión: 1.1 - Despliegue Automático CI/CD Funcional
				</footer>
			</div>
		</div>
	);
}