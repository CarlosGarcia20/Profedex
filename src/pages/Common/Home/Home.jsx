import { useState, useEffect } from "react";
import Header from "../../../components/header/HeaderGeneral";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import StudentMap from "../../../components/maps/StudentMap";

export default function Home() {
	const [teachers, setTeachers] = useState([]);
	const [selectedTeacherId, setSelectedTeacherId] = useState("");

	const fetchTeachers = async () => {
		const teacherPromise = api.get('students/me/teachers');
		toast.promise(
			teacherPromise,
			{
				loading: 'Cargando maestros...',
				success: (response) => {
					setTeachers(response.data.data);

					return 'Maestros cargados'
				},
				error: (err) => {
					return 'No se pudieron cargar los maestros';
				}
			}
		);
	}

	useEffect(() => {
		fetchTeachers();
	}, [])

	const selectedTeacherName = teachers.find(t => String(t.master_id) === String(selectedTeacherId))?.master;

	return(
		<div>
			<Header titulo="Bienvenido(a)" />

			{/* BARRA DE NAVEGACIÓN Y BÚSQUEDA */}
			<nav className="bg-gray-300 p-4 flex flex-wrap justify-between items-center gap-4 shadow-lg rounded-b-md">
				<div className="text-xl font-bold text-blue-700">
					¡Encuéntralos a todos!
				</div>

				<div className="flex flex-wrap items-center gap-2 pr-5">
					<label htmlFor="search" className="font-semibold text-blue-700 ">
						Buscar maestro(a):
					</label>
					<select
						id="search"
						name="search"
						className="w-64 md:w-96 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
						value={selectedTeacherId}
						onChange={(e) => setSelectedTeacherId(e.target.value)}
					>
						<option value="">Seleccionar un maestro</option>
						{teachers?.map((teacher) => (
							<option key={teacher.master_id} value={teacher.master_id}>
								{teacher.master}
							</option>
						))}
					</select>
				</div>
			</nav>

			{/* CONTENIDO PRINCIPAL */}
			<div className="flex-1 mt-8 flex flex-col lg:flex-row gap-4 px-4 pb-10">

				<div className="bg-gray-300 p-4 rounded-lg shadow-xl lg:w-2/3 w-full">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold text-blue-700">
							Ubicación en Tiempo Real
						</h2>
						{selectedTeacherId && (
							<span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-bold animate-pulse border border-green-200">
								● Conectando GPS
							</span>
						)}
					</div>

					{/* 3. CONTENEDOR DEL MAPA */}
					<div className="w-full h-96 bg-white rounded-md overflow-hidden shadow-inner border border-gray-400 relative">
						{selectedTeacherId ? (
							<StudentMap classId={selectedTeacherId} />
						) : (
							<div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
								<i className="fas fa-map-marked-alt text-5xl mb-3 text-gray-300"></i>
								<p className="font-medium">Selecciona un maestro arriba</p>
								<p className="text-sm">para ver su ubicación en el mapa</p>
							</div>
						)}
					</div>
				</div>

				<div className="bg-white p-6 rounded-lg shadow-xl lg:w-1/3 w-full border border-gray-200 h-fit">
					<h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
						Detalles del Profesor
					</h2>

					{selectedTeacherId ? (
						<div className="animate-fade-in">
							<div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
								👨‍🏫
							</div>
							<h3 className="text-xl font-bold text-center text-blue-800">
								{selectedTeacherName}
							</h3>
							<p className="text-center text-gray-500 text-sm mb-4">
								Profesor Titular
							</p>

							<div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
								<p><strong>Estado:</strong> Rastreo activo</p>
								<p className="mt-1">El mapa se actualizará automáticamente cuando el profesor se mueva.</p>
							</div>
						</div>
					) : (
						<div className="text-center text-gray-400 py-10">
							<p>No hay profesor seleccionado.</p>
						</div>
					)}
				</div>

			</div>
		</div>
	);
}