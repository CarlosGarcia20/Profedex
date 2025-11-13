import profedex from "../../assets/images/Profedex.png";
import { Link } from "react-router-dom";
// 1. Importa useEffect
import { useState, useEffect } from "react";
import axios from "axios";

// 🔹 Función para renderizar el ícono según el estado
// (La moví fuera del componente, ya que no depende de ningún estado o prop)
const renderStatusIcon = (status) => {
	switch (status) {
		case "loading":
			return (
				// Animación de carga (spinner)
				<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-700"></div>
			);
		case "valid":
			return (
				// Icono de check (✓)
				<div className="transition-all duration-1000 text-white bg-green-500 rounded-full h-5 w-5 flex items-center justify-center font-bold">
					✓
				</div>
			);
		case "invalid":
			return (
				// Icono de X (✕)
				<div className="transition-all duration-1000 text-white bg-red-500 rounded-full h-5 w-5 flex items-center justify-center font-bold">
					✕
				</div>
			);
		default:
			return null; // 'idle' o por defecto no muestra nada
	}
};

export default function Register() {
	const API_URL = 'http://localhost:4000/users/register';
	const API_URL_VALIDATOR = 'http://localhost:4000/users/validate-nickname';

	// Estados de los datos del formulario
	const [nickname, setNickname] = useState("");
	const [fullName, setFullName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// Estados de la UI y validación
	const [isValidNickname, setIsValidNickname] = useState(false);
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("idle"); // idle | loading | valid | invalid

	// --- 2. useEffect para el "Debounce" ---
	useEffect(() => {
		// Si el nickname está vacío, resetea todo.
		if (nickname.trim() === "") {
			setStatus("idle");
			setMessage("");
			setIsValidNickname(false);
			return;
		}

		// Inicia un temporizador
		const timerId = setTimeout(() => {
			// Cuando el usuario deja de escribir (después de 500ms),
			// llama a la función de validación.
			handleValidateNickname();
		}, 500); // 500 milisegundos de espera

		// Función de limpieza:
		// Si el usuario vuelve a escribir ANTES de los 500ms,
		// cancela el temporizador anterior y crea uno nuevo.
		return () => {
			clearTimeout(timerId);
		};
	}, [nickname]); // Este efecto se ejecuta cada vez que 'nickname' cambia

	// 3. Función de validación (actualizada)
	const handleValidateNickname = async () => {
		setStatus("loading");
		setIsValidNickname(false);
		setMessage("");

		if (nickname.trim() === "") {
			setStatus("idle");
			return;
		}

		try {
			const res = await axios.post(API_URL_VALIDATOR, { nickname });

			setIsValidNickname(true);
			setMessage(res.data.message)
			setStatus("valid")
		} catch (error) {
			setIsValidNickname(false);
			setStatus("invalid");

			console.log("Error: " + error.response.data.message)

			if (error.response && error.response.data && error.response.data.message) {
				setMessage(error.response.data.message);
			} else {
				setMessage("Error al verificar el apodo");
			}
		}
	};

	// 4. Manejador de 'onChange' para el nickname (simplificado)
	const handleNicknameChange = (e) => {
		const newNickname = e.target.value;
		setNickname(newNickname);

		// Resetea el estado de validación mientras escribe
		setIsValidNickname(false);
		setStatus("idle"); // Pone el estado en 'idle' (sin icono)
		setMessage(""); // Limpia el mensaje
	};

	// 5. Manejador para el envío final (¡No lo tenías!)
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isValidNickname) {
			setMessage("Tu apodo no es válido.");
			return;
		}
		if (password !== confirmPassword) {
			setMessage("Las contraseñas no coinciden.");
			return;
		}

		// Lógica para enviar el registro final con axios.post(API_URL, {...})
		console.log("Enviando registro...", { nickname, fullName, password });
		// ... aquí iría tu 'try/catch' para el registro
	};

	return (
		<div className="bg-red-700 min-h-screen flex items-center justify-center p-4">
			<div className="bg-gray-200 w-full max-w-md p-8 rounded-xl border-4 border-gray-300 shadow-lg">
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

				{/* 6. Formulario conectado */}
				<form onSubmit={handleSubmit}>
					{/* --- APODO (Nickname) --- */}
					<div className="mb-4">
						<label
							htmlFor="nickname"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Nickname:
						</label>
						{/* Contenedor relativo para el icono */}
						<div className="flex-grow relative">
							<input
								type="text"
								id="nickname"
								name="nickname"
								className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Padding derecho para el icono
								onChange={handleNicknameChange} // 👈 Usa el nuevo manejador
								value={nickname}
							/>
							{/* Icono (se posiciona sobre el input) */}
							<div className="absolute right-3 top-1/2 -translate-y-1/2">
								{renderStatusIcon(status)}
							</div>
						</div>
						{/* Mensaje de estado (opcional, pero útil) */}
						{message && (
							<p className={`mt-1 text-sm ${status === 'invalid' ? 'text-red-600' : 'text-gray-600'}`}>
								{message}
							</p>
						)}
					</div>

					{/* --- GRUYPO --- */}
					<div className="mb-4">
						<label 
							htmlFor=""
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Grupo:
						</label>
						<select 
							className="w-full p-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							disabled={!isValidNickname}
						>
							<option value={"-1"}>Selecciona un grupo</option>
						</select>
					</div>

					{/* --- NOMBRE --- */}
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
							disabled={!isValidNickname}
							onChange={(e) => setFullName(e.target.value)}
							value={fullName}
							required
						/>
					</div>

					{/* --- CONTRASEÑA --- */}
					<div className="mb-4">
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
							disabled={!isValidNickname}
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
						/>
					</div>

					{/* --- CONFIRMAR CONTRASEÑA --- */}
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
							disabled={!isValidNickname}
							onChange={(e) => setConfirmPassword(e.target.value)}
							value={confirmPassword}
							required
						/>
					</div>

					{/* --- BOTONES --- */}
					<div className="w-full flex items-center justify-between">
						<Link to="/login">
							<button
								type="button"
								className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition duration-300"
							>
								Volver
							</button>
						</Link>

						<button
							type="submit"
							className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition duration-300 disabled:bg-gray-400"
							disabled={!isValidNickname}
						>
							Registrarse
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}