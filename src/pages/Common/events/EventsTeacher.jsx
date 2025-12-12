import HeaderGeneral from "../../../components/header/HeaderGeneral";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { HiPencil, HiTrash } from "react-icons/hi";
import { showAlertConfirm } from "../../../utils/alerts";
import BaseModal from "../../../components/ui/BaseModal";

export default function EventsTeacher() {
	const [events, setEvents] = useState([]);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [selectedEventId, setSelectedEventId] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	

	const [createForm, setCreateForm] = useState({
		name: "",
		description: "",
		date: "",
		status: "S"
	});
	const [editForm, setEditForm] = useState({
		name: "",
		description: "",
		date: "",
		status: "S"
	});
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [newImageFile, setNewImageFile] = useState(null);

	const fileInputRef = useRef(null);

	const fetchEvents = async () => {
		const eventsPromise = api.get('teachers/my-events');
		toast.promise(eventsPromise, {
			loading: "Cargando eventos...",
			success: (response) => {
				setEvents(response.data.data)

				return 'Eventos cargados'
			},
			error: (err) => {
				return 'Aún no ha creado eventos';
			}
		})
	}

	useEffect(() => {
		fetchEvents();
	}, [])

	const handleCreateChange = (e) => {	
      const { name, value } = e.target;		
		setCreateForm(prev => ({ ...prev, [name]: value }));
   };

	const handleSelectChange = (e) => {
		createForm(prev => ({ ...prev, status: e.target.value }));
	};

	const handleImageChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleCreateEvent = async (e) => {
		e.preventDefault();

		if (createForm.name.length < 4) {
			return toast.error("El nombre debe tener al menos 4 caracteres");
		}
		
		if (!createForm.date) {
			return toast.error("Debes seleccionar una fecha");
		}

		setLoading(true);

		const formData = new FormData();
		formData.append('name', createForm.name);
		formData.append('description', createForm.description);
		formData.append('date', createForm.date);
		formData.append('status', createForm.status);

		if (image) {
			formData.append('image', image);
		}

		const createPromise = api.post('teachers/event', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});

		toast.promise(createPromise, {
			loading: 'Creando evento...',
			success: (res) => {
				setCreateForm({ name: "", description: "", date: "", status: "S" });
				setImage(null);
				if (fileInputRef.current) fileInputRef.current.value = "";

				fetchEvents();

				return '¡Evento creado con éxito!';
			},
			error: (err) => {
				return err.response?.data?.error
					|| err.response?.data?.message
					|| 'Error al crear evento';
			}
		});
	};

	// Función para eliminar evento
	const handleDeleteEvent = async (id) => {
		showAlertConfirm(
			`¿Esta seguro de eliminar el evento?`, 
			"Nota: si el evento tiene archivos cargados este solo se deshabilitara"
		).then((response) => {
			if(response.isConfirmed) {
				try {
					const responsePromise = api.delete(`teachers/event/${id}`);

					toast.promise(responsePromise, {
						loading: "Eliminando evento...",
						success: (res) => {
							fetchEvents();
							if(res.status === 200) {
								return res.data.message
							}
							
							return "Evento eliminado"
						},
						error: (err) => {
							if (err.response?.status == 404) {
								return err.response?.data?.message
							}

							return "Error al eliminar"
						}
					})
				} catch (error) {
					toast.error(error)
				}
			}
		});
	};

	function openModalEdit(event) {
		setSelectedEventId(event.event_id);

		setEditForm({
			name: event.name,
			description: event.description || "",
			date: event.date ? new Date(event.date).toISOString().split('T')[0] : "",
			status: event.status
		});

		setPreviewUrl(event.image || null);
		setNewImageFile(null);

		setIsOpen(true);
	}

	function closeModal() { setIsOpen(false); setSelectedEventId(null); }

	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditForm(prev => ({
			...prev, 
			[name]: value 
		}));
	};

	const handleUpdateImage = (e) => {
		const file = e.target.files[0];
		if (file) {
			setNewImageFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('name', editForm.name);
		formData.append('description', editForm.description);
		formData.append('date', editForm.date);
		formData.append('status', editForm.status);

		if (newImageFile) {
			formData.append('image', newImageFile);
		}

		const updatePromise = api.put(`teachers/event/${selectedEventId}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});

		toast.promise(updatePromise, {
			loading: 'Actualizando evento...',
			success: (res) => {
				fetchEvents();
				closeModal();
				return 'Evento actualizado correctamente';
			},
			error: (err) => {
				return err.response?.data?.message || 'Error al actualizar';
			}
		});
	};

	return (
		<div>
			<div className="min-h-screen bg-gray-100 flex flex-col">
				<HeaderGeneral titulo={"Eventos"} />
				<div className="flex flex-col lg:flex-row justify-between items-start p-8 gap-8">
					<div className="w-full lg:w-1/3">

						<form
							onSubmit={handleCreateEvent}
							className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden p-8 space-y-8 border border-gray-100"
						>
							<div className="text-center mb-6">
								<h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">
									Nuevo Evento
								</h2>
							</div>

							<div className="space-y-6">
								{/* Nombre del Evento */}
								<div>
									<label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2 tracking-wide">
										Nombre del Evento*
									</label>
									<input
										type="text"
										id="name"
										name="name"
										value={createForm.name}
										onChange={handleCreateChange}
										className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 font-medium shadow-sm"
										placeholder="Ej. Fiestón de Fin de Año"
										required
									/>
								</div>

								{/* Descripción */}
								<div>
									<label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2 tracking-wide">
										Descripción
									</label>
									<textarea
										id="description"
										name="description"
										rows={4}
										value={createForm.description}
										onChange={handleCreateChange}
										className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 ease-in-out text-gray-800 placeholder-gray-400 font-medium shadow-sm resize-none"
										placeholder="Cuéntanos los detalles..."
									></textarea>
								</div>

								{/* Fecha */}
								<div>
									<label htmlFor="date" className="block text-sm font-bold text-gray-900 mb-2 tracking-wide">
										Fecha*
									</label>
									<input
										type="date"
										id="date"
										name="date"
										value={createForm.date}
										onChange={handleCreateChange}
										className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 ease-in-out text-gray-800 font-medium shadow-sm"
										required
									/>
								</div>

								{/* Estado */}
								<div>
									<label htmlFor="date" className="block text-sm font-bold text-gray-900 mb-2 tracking-wide">
										Estado*
									</label>
									<div className="relative w-full">
										<select
											value={createForm.status}
											onChange={handleSelectChange}
											className="
                                            w-full appearance-none 
                                            bg-blue-400 hover:bg-blue-600 
                                            text-white font-bold text-sm 
                                            pl-4 pr-10 py-2
                                            rounded-lg shadow-md 
                                            transition-all cursor-pointer 
                                            border-none outline-none 
                                            focus:ring-2 focus:ring-yellow-600 
                                            text-left"
										>
											<option value="S">Activa</option>
											<option value="N">Inactiva</option>
										</select>

										<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
											<svg
												className="h-4 w-4 fill-current"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
											>
												<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
											</svg>
										</div>
									</div>
								</div>

								{/* Imagen (Upload) */}
								<div>
									<span className="block text-sm font-bold text-gray-900 mb-2 tracking-wide">
										Imagen de Portada
									</span>

									<div className="mt-2">
										<label className="group flex items-center justify-center gap-3 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white font-bold px-6 py-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden">
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform duration-200">
												<path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.159-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
											</svg>
											{image ? "Cambiar imagen" : "Elegir imagen"}

											<input
												type="file"
												accept="image/*"
												className="hidden"
												ref={fileInputRef}
												onChange={handleImageChange}
											/>
										</label>

										{/* Preview del nombre del archivo */}
										{image && (
											<div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-2 text-blue-700 animate-fade-in">
												<span className="text-sm font-semibold truncate">{image.name}</span>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Botón Submit */}
							<button
								type="submit"
								disabled={loading}
								className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:ring-4 focus:ring-blue-300 focus:outline-none mt-8"
							>
								{loading ? 'Creando...' : 'Crear Evento'}
							</button>
						</form>
					</div>

					<div className="bg-white shadow-lg rounded-2xl p-6 w-full flex flex-col lg:w-2/3">
						<h2 className="text-xl font-bold text-blue-700 mb-2 shrink-0 text-center">Eventos creados</h2>

						<div className="flex-1 overflow-auto shadow-md rounded-lg border border-gray-300 bg-white relative">
							<table className="w-full text-sm text-left border-collapse">
								<thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10 shadow-sm">
									<tr>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Nombre</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Descripción</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Fecha de inicio</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Imagen</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Estado</th>
										<th className="px-4 py-3 font-bold border-b border-gray-300">Acciones</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{events.length > 0 ? (
										events.map((event) => (
											<tr key={event.event_id} className="hover:bg-gray-50 transition-colors">

												<td className="px-4 py-3 font-medium text-gray-900">
													{event.name}
												</td>

												<td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={event.description}>
													{event.description || "Sin descripción"}
												</td>

												<td className="px-4 py-3 text-gray-600 whitespace-nowrap">
													{new Date(event.date).toLocaleDateString('es-MX', {
														year: 'numeric', month: 'short', day: 'numeric'
													})}
												</td>

												<td className="px-4 py-3">
													{event.image ? (
														<div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200">
															<img
																src={event.image}
																alt={event.name}
																className="h-full w-full object-cover"
															/>
														</div>
													) : (
														<span className="text-xs text-gray-400 italic">Sin img</span>
													)}
												</td>

												<td className="px-4 py-3">
													<span className={`px-2 py-1 rounded-full text-xs font-bold ${event.status === 'S'
														? 'bg-green-100 text-green-800 border border-green-200'
														: 'bg-red-100 text-red-800 border border-red-200'
														}`}>
														{event.status === 'S' ? 'Activo' : 'Inactivo'}
													</span>
												</td>

												<td className="px-4 py-3">
													<div className="flex items-center gap-3">

														<button
															className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-md hover:bg-blue-50"
															title="Editar evento"
														onClick={() => openModalEdit(event)}
														>
															<HiPencil size={20} />
														</button>

														<button
															onClick={() => handleDeleteEvent(event.event_id)}
															className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-md hover:bg-red-50"
															title="Eliminar evento"
														>
															<HiTrash size={20} />
														</button>
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan="6" className="text-center py-8 text-gray-500 italic">
												No hay eventos creados todavía.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<BaseModal
				isOpen={modalIsOpen}
				onClose={closeModal}
				title={'Editar Evento'}
				subtitle={'Modifica los detalles del evento seleccionado'}
			>
				<form onSubmit={handleUpdate} className="space-y-4 mt-4">
					<div className="flex flex-col items-center justify-center mb-6">
						<div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group hover:border-blue-500 transition-colors">

							{previewUrl ? (
								<img
									src={previewUrl}
									alt="Previsualización"
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="text-gray-400 flex flex-col items-center">
									<svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
									<span className="text-sm">Sin imagen</span>
								</div>
							)}

							<input
								type="file"
								accept="image/*"
								onChange={handleUpdateImage}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								title="Cambiar imagen"
							/>

							<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
								<span className="text-white font-medium">Click para cambiar</span>
							</div>
						</div>
					</div>
						
					<div>
						<label className="block text-sm font-medium text-gray-700">Nombre del Evento</label>
						<input
							type="text"
							name="name"
							value={editForm.name}
							onChange={handleEditChange}
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Descripción</label>
						<textarea
							name="description"
							value={editForm.description}
							onChange={handleEditChange}
							rows="3"
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">Fecha</label>
							<input
								type="date"
								name="date"
								value={editForm.date}
								onChange={handleEditChange}
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">Estado</label>
							<select
								name="status"
								value={editForm.status}
								onChange={handleEditChange}
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="S">Activo</option>
								<option value="N">Inactivo</option>
							</select>
						</div>
					</div>

					<div className="flex justify-end gap-3 mt-6">
						<button
							type="button"
							onClick={closeModal}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
						>
							Guardar Cambios
						</button>
					</div>
				</form>
			</BaseModal>
		</div>
	);
}