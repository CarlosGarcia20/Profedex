import React, { useState, useEffect } from 'react';
import { IoThumbsUp, IoThumbsDown, IoThumbsUpOutline, IoThumbsDownOutline } from 'react-icons/io5';

import Header from "../../../components/header/HeaderGeneral";
import api from '../../../api/axios';
import toast from 'react-hot-toast';

const InfoMaestros = () => {
	const [teachers, setTeachers] = useState([]);

	const fetchTeachers = async () => {
		const teacherPromise = api.get('students/me/teachers');
		toast.promise(
			teacherPromise,
			{
				loading: 'Cargando maestros...',
				success: (response) => {
					console.log(response.data.data);

					setTeachers(response.data.data);

					return 'Maestros cargados'
				},
				error: (err) => {
					return 'No hay'
				}
			}
		);
	}

	useEffect(() => {
		fetchTeachers();
	}, [])

	return (
		<div className="min-h-screen bg-[#dfe3ea] flex flex-col">
			<Header titulo="Información de los profesores" />

			<div className="p-8 pt-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 p-8">

					{teachers.map((teacher) => (
						<div
							key={teacher.id}
							className="
                            bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.15)]
                            border border-yellow-400
                            hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)]
                            transition-all duration-300
                            overflow-hidden
                            "
						>

							{/* Top stripe */}
							<div className="bg-yellow-300/70 p-3 flex justify-between items-center px-5">

								{/* --- NUEVA SECCIÓN: BOTONES LIKE / DISLIKE --- */}
								<div className="flex items-center space-x-3 bg-white/50 rounded-full px-3 py-1">
									{/* Botón Like */}
									<button
										className={`text-xl transition-colors`}
										title="Me gusta"
									>
										<IoThumbsUp />
									</button>

									{/* Separador vertical pequeño */}
									<div className="w-px h-4 bg-gray-400"></div>

									{/* Botón Dislike */}
									<button
										className={`text-xl transition-colors mt-1`}
										title="No me gusta"
									>
										<IoThumbsDown />
									</button>
								</div>

								<span className="font-semibold text-gray-800">
									Popularity: <span className="text-black font-bold">{teacher.popularity}</span>
								</span>
							</div>

							<div className="p-6 flex flex-col items-center">

								{/* Imagen */}
								<div className="
                                    w-44 h-40 mb-4 rounded-lg bg-gray-300 border-2 border-[#1c2833]
                                    flex items-center justify-center text-gray-700
                                ">
									{teacher.image ? (
										<img
											src={teacher.image}
											alt={teacher.name}
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										"Sin foto"
									)}
								</div>

								{/* Nombre */}
								<p className="font-extrabold text-lg text-gray-900 text-center">
									{teacher.master}
								</p>

								{/* Separador glow */}
								<div className="h-0.5 w-3/4 bg-[#1c2833] mt-2 mb-3 shadow-[0_0_6px_#1c2833]"></div>

								{/* Materias */}
								<p className="text-sm text-center text-gray-700 leading-tight">
									<strong>Materias que imparte / habilidades:</strong><br />
									{teacher.subjects}
								</p>

							</div>
						</div>
					))}

				</div>
			</div>
		</div>
	);
};

export default InfoMaestros;