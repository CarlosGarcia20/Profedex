import { useState } from "react";
import Header from "../../../components/header/HeaderGeneral";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useEffect, useMemo } from "react";

const DAY_MAP = {
	1: "Lunes",
	2: "Martes",
	3: "Miércoles",
	4: "Jueves",
	5: "Viernes",
	6: "Sábado",
	7: "Domingo"
};

const STATUS_MAP = {
	'PENDING': 'PENDIENTE',
	'APPROVED': 'APROBADO',
	'FAILED': 'REPROBADO'
}

export default function Equipo() {
	const [userSchedule, setUserSchedule] = useState([]);
	const [userRetakes, setUserRetakes] = useState([]);
	const [groupName, setGroupName] = useState("");
	const [selectedDay, setSelectedDay] = useState("");

	const fetchSchedule = () => {
		const schedulePromise = api.get('students/me/schedules');
		toast.promise(
			schedulePromise,
			{
				loading: "Obteniendo horario...",
				success: (response) => {
					setUserSchedule(response.data.data || []);
					setGroupName(response.data.group || "Sin Grupo");

					return "Horario cargado";
				},
				error: (err) => {
					if (err.response) {

						setUserSchedule([]);
						if (err.response.status === 404) {
							setGroupName("Sin asignación");

							return err.response.data.message;
						}
					}

					return 'Error al cargar los datos';
				}
			}
		)
	}

	// const fetchRetakes = async() => {
	// 	try {
	// 		const response = await api.get('students/me/retakes');
	// 		setUserRetakes(response.data.data);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// }

	useEffect(() => {
		fetchSchedule();
		// fetchRetakes();
	}, []);

	const filteredSchedule = useMemo(() => {
		if (!Array.isArray(userSchedule)) return [];

		if (selectedDay === "") {
			return userSchedule;
		}

		return userSchedule.filter(item => item.day_of_week === parseInt(selectedDay));
		
	}, [userSchedule, selectedDay]);

	return (
		<div className="w-full p-4">
			<div className="mx-auto bg-gray-300 rounded-lg shadow-xl overflow-hidden flex flex-col h-screen max-h-[800px]">
				<Header titulo="Tu Equipo" />
				<main className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-full overflow-hidden">

					<div className="flex-1 flex flex-col space-y-4 h-full min-h-0">
						<div className="shrink-0">
							<h1 className="text-xl font-bold text-blue-700 mb-2">Grupo</h1>
							<input
								type="text"
								value={groupName}
								className="p-2 w-full sm:w-64 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-gray-700 font-medium"
								placeholder="Grupo"
								disabled
							/>
						</div>

						<div className="flex-1 flex flex-col min-h-0">
							<div className="flex justify-between items-center mb-2 shrink-0">
								<h2 className="text-xl font-bold text-blue-700">Horario</h2>

								<select
									className="p-1 rounded border border-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
									value={selectedDay}
									onChange={(e) => setSelectedDay(e.target.value)}
								>
									<option value="">Todos los días</option>
									{Object.entries(DAY_MAP).map(([key, label]) => (
										<option key={key} value={key}>{label}</option>
									))}
								</select>
							</div>

							<div className="flex-1 overflow-auto shadow-md rounded-lg border border-gray-300 bg-white relative">
								<table className="w-full text-sm text-left border-collapse min-w-[500px]">
									<thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
										<tr>
											<th className="px-4 py-3 font-bold border-b border-gray-300">Día</th>
											<th className="px-4 py-3 font-bold border-b border-gray-300">Profesor</th>
											<th className="px-4 py-3 font-bold border-b border-gray-300">Hora</th>
											<th className="px-4 py-3 font-bold border-b border-gray-300">Materia</th>
											<th className="px-4 py-3 font-bold border-b border-gray-300">Aula</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredSchedule.length > 0 ? (
											filteredSchedule.map((item) => (
												<tr key={item.schedule_id} className="hover:bg-red-50 transition-colors">

													{ /* Día */}
													<td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
														{DAY_MAP[item.day_of_week] || 'Día desconocido'}
													</td>

													{ /* Maestro */}
													<td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
														{item.master
															? `${item.master}`
															: "Sin asignar"}
													</td>

													{ /* Hora */}
													<td className="px-4 py-3 text-gray-600 whitespace-nowrap">
														{item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}
													</td>

													{ /* Materia */}
													<td className="px-4 py-3 text-gray-600 min-w-[150px]">
														{item.subject || "N/A"}
													</td>

													{ /* Salón / Aula */}
													<td className="px-4 py-3 text-gray-600 whitespace-nowrap">
														{item.classroom || "N/A"}
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan="4" className="px-4 py-8 text-center text-gray-500 italic">
													No hay horarios asignados actualmente.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* <div className="flex-1 flex flex-col h-full min-h-0">
						<h2 className="text-xl font-bold text-blue-700 mb-2 shrink-0">Recursamiento</h2>

						<div className="flex-1 overflow-auto shadow-md rounded-lg border border-gray-300 bg-white relative">
							<table className="w-full text-sm text-left border-collapse min-w-[400px]">
								<thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
									<tr>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Fecha - Hora</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Materia</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Aula</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Intento</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Estado</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{userRetakes.length > 0 ? (
										userRetakes.map((item) => {
											const fecha = new Date(item.date);

											return (
												<tr key={item.id} className="hover:bg-red-50 transition-colors">

													<td className="px-4 py-3 text-gray-700">
														<div className="flex flex-col">
															<span className="font-bold text-gray-900 capitalize">
																{fecha.toLocaleDateString('es-MX', {
																	weekday: 'short',
																	day: 'numeric',
																	month: 'short'
																})}
															</span>
															<span className="text-xs text-gray-500">
																{fecha.toLocaleTimeString('es-MX', {
																	hour: '2-digit',
																	minute: '2-digit'
																})}
															</span>
														</div>
													</td>

													<td className="px-4 py-3 font-medium text-gray-900">
														{item.subject}
													</td>

													<td className="px-4 py-3 font-medium text-gray-900">
														{item.classroom}
													</td>

													<td className="px-4 py-3 font-medium text-gray-900">
														{item.attempt_number}
													</td>

													<td className="px-4 py-3 font-medium text-gray-900s">
														{STATUS_MAP[item.status]}
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td colSpan="5" className="text-center py-4 text-gray-500">Sin recursamientos</td>
											</tr>
									)}
								</tbody>
							</table>
						</div>
					</div> */}

				</main>
			</div>
		</div>
	);
}