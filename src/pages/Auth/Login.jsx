import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profedex from "../../assets/images/Profedex.png";
import api from "../../api/axios";

import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";

const ROLE_PATHS = {
	'1': 'admin',
	'2': 'teacher',
	'3': 'student'
};

export default function Login() {
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const loginPromise = api.post('auth', {
			username: user,
			password: password
		});

		toast.promise(
			loginPromise,
			{
				loading: 'Verificando credenciales...',
				success: (data) => {
					const username = data.data.user.nickname;
					return `¡Bienvenido de nuevo, ${username}!`;
				},
				error: (err) => {
					const responseData = err.response?.data;

					if (responseData?.errors) {
						const errorFields = Object.keys(responseData.errors);

						const firstField = errorFields[0];

						const firstErrorMessage = responseData.errors[firstField][0];

						return firstErrorMessage;
					}

					return responseData?.message || 'Error al iniciar sesión';
				},
			}
		);

		try {
			const response = await loginPromise;
			const { idRol, nickname, name, image } = response.data.user;
			const rolePath = ROLE_PATHS[String(idRol)];

			login({
				nickname,
				name,
				rolePath,
				image
			});

			navigate(`/${rolePath}`);
		} catch (error) {
			// console.log("error: " + error);
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
							autoComplete="off"
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
							className={"w-full text-white py-2 px-4 rounded-md transition duration-300 bg-blue-800 hover:bg-blue-700"}
						>
							Acceder
						</button>
					</div>

					{/* <div className="text-left mb-10">
						<a
							href="#"
							className="text-sm text-blue-900 underline hover:text-blue-950"
						>
							Olvidé mi contraseña
						</a>
					</div> */}

					<hr className="border-gray-400 my-4" />

				</form>
				<footer className="mt-5 p-2 text-center text-xs text-gray-500">
					Versión: 1.1 - Despliegue Automático CI/CD Funcional
				</footer>
			</div>
		</div>
	);
}