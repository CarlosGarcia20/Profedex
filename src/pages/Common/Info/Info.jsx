import React, { useState, useEffect } from 'react';
import { IoThumbsUp, IoThumbsDown, IoChatboxEllipsesOutline, IoSend, IoPersonCircle } from 'react-icons/io5';
import Header from "../../../components/header/HeaderGeneral";
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import { showAlertConfirm } from '../../../utils/alerts';
import BaseModal from '../../../components/ui/BaseModal';

const InfoMaestros = () => {
	const [teachers, setTeachers] = useState([]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTeacher, setSelectedTeacher] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [loadingComments, setLoadingComments] = useState(false);

	const fetchTeachers = async () => {
		const teacherPromise = api.get('students/me/teachers-cards');
		toast.promise(
			teacherPromise,
			{
				loading: 'Cargando maestros...',
				success: (response) => {
					setTeachers(response.data.data);

					return 'Maestros cargados'
				},
				error: () => {
					return 'Error al cargar los maestros'
				}
			}
		);
	}

	useEffect(() => {
		fetchTeachers();
	}, [])

	const handleVote = async(teacherId, type) => {
		await showAlertConfirm(
			"¿Enviar voto?", 
			"Nota: si envias el mismo voto mas de dos veces este se anulara"
		).then( async(response) => {
			if(response.isConfirmed){
				const loadingToastId = toast.loading("Capturando voto...");
				try {
					await api.post(`students/${teacherId}/vote`, { type });
		
					toast.success("Voto capturado correctamente", { id: loadingToastId });
					fetchTeachers();
				} catch (error) {
					toast.dismiss(loadingToastId)
					console.error(error);
					toast.error('Error al capturar el voto');
				}
			} 
		});
	}

	const handleOpenComments = async (teacher) => {
		setSelectedTeacher(teacher);
		setIsModalOpen(true);
		setComments([]);
		setLoadingComments(true);

		try {
			const response = await api.get(`students/teachers/${teacher.master_id}/comments`);
			setComments(response.data.data || []);
		} catch (error) {
			console.error("Error cargando comentarios", error);
			// toast.error("No se pudieron cargar los comentarios");
		} finally {
			setLoadingComments(false);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTeacher(null);
		setNewComment("");
	};

	const handlePostComment = async (e) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		const loadingId = toast.loading("Publicando...");

		try {
			await api.post(`students/teachers/${selectedTeacher.master_id}/comments`, {
				content: newComment
			});

			toast.success("Comentario enviado", { id: loadingId });
			setNewComment("");

			const response = await api.get(`students/teachers/${selectedTeacher.master_id}/comments`);
			setComments(response.data.data || []);

		} catch (error) {
			toast.dismiss(loadingId);
			toast.error(error.response?.data?.message || "Error al comentar");
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col">
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

							<div className="bg-yellow-300/70 p-3 flex justify-between items-center px-5">

								<div className="flex items-center space-x-3 bg-white/50 rounded-full px-3 py-1">
									<button
										className={`text-xl transition-colors`}
										title="Me gusta"
										onClick={() => handleVote(teacher.master_id, 'up')}
									>
										<IoThumbsUp />
									</button>

									<div className="w-px h-4 bg-gray-400"></div>

									<button
										className={`text-xl transition-colors mt-1`}
										title="No me gusta"
										onClick={() => handleVote(teacher.master_id, 'down')}
									>
										<IoThumbsDown />
									</button>
								</div>

								<span className="font-semibold text-gray-800">
									Popularity: <span className="text-black font-bold">{teacher.popularity}</span>
								</span>
							</div>

							<div className="p-6 flex flex-col items-center">

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

								<p className="font-extrabold text-lg text-gray-900 text-center">
									{teacher.master}
								</p>

								{/* Separador */}
								<div className="h-0.5 w-3/4 bg-[#1c2833] mt-2 mb-3 shadow-[0_0_6px_#1c2833]"></div>

								<button
									onClick={() => handleOpenComments(teacher)}
									className="mt-auto flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
								>
									<IoChatboxEllipsesOutline size={20} />
									Ver Comentarios
								</button>

							</div>
						</div>
					))}

				</div>
			</div>
			<BaseModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={`Comentarios sobre ${selectedTeacher?.master || 'Profesor'}`}
				subtitle={"Opiniones de la comunidad estudiantil"}
			>
				<div className="flex flex-col h-[500px]">

					<div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 border-b border-gray-200 pb-4">
						{loadingComments ? (
							<div className="text-center py-10 text-gray-400">Cargando opiniones...</div>
						) : comments.length > 0 ? (
							comments.map((comment, idx) => (
								<div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl">
									<div className="shrink-0 text-gray-400">
										{comment.author_image ? (
											<img src={comment.author_image} className="w-8 h-8 rounded-full object-cover" />
										) : (
											<IoPersonCircle size={32} />
										)}
									</div>
									<div>
										<div className="flex items-center gap-2 mb-1">
											<span className="font-bold text-sm text-gray-800">
												{comment.author_name || "Estudiante Anónimo"}
											</span>
											<span className="text-xs text-gray-400">
												{new Date(comment.created_at || Date.now()).toLocaleDateString()}
											</span>
										</div>
										<p className="text-sm text-gray-600">
											{comment.content}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-col items-center justify-center h-full text-gray-400">
								<IoChatboxEllipsesOutline size={48} className="mb-2 opacity-50" />
								<p>Aún no hay comentarios.</p>
								<p className="text-sm">¡Sé el primero en opinar!</p>
							</div>
						)}
					</div>

					<form onSubmit={handlePostComment} className="flex gap-2 items-end bg-white pt-2">
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Escribe tu opinión de manera respetuosa..."
							className="w-full p-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm"
							rows="2"
							required
						></textarea>
						<button
							type="submit"
							disabled={!newComment.trim()}
							className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-colors shadow-lg mb-1"
						>
							<IoSend size={20} />
						</button>
					</form>
				</div>
			</BaseModal>
		</div>
	);
};

export default InfoMaestros;