import toast from "react-hot-toast";
import api from "../../../api/axios";
import { useState, useEffect } from "react";
import BaseModal from '../../../components/ui/BaseModal';
import { IoPencil, IoTrash } from "react-icons/io5";
import { HiUserAdd, HiLink, HiArrowRight } from 'react-icons/hi';
import { showAlertConfirm } from '../../../utils/alerts';

const initialFormState = {
	acronym: '',
	name: '',
	lastname: '',
	status: 'S'
};

export default function AdminTeachers() {
	const [teachers, setTeachers] = useState([]);
	const [availableUsers, setAvailableUsers] = useState([]);
	const [availableTeachers, setAvailableTeachers] = useState([]);

	const [selectedUser, setSelectedUser] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");

	const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

	const [modalIsOpen, setIsOpen] = useState(false);

	const [formData, setFormData] = useState(initialFormState);
	const [edtingTeacher, setEditingTeacher] = useState(null);

	const fetchTeachers = () => {
		const usersPromise = api.get('admin/teachers');
		toast.promise(
			usersPromise,
			{
				loading: 'Obteniendo maestros...',
				success: (response) => {
					setTeachers(response.data.data);

					return 'Maestros cargados correctamente';
				},
				error: (err) => {
					const responseData = err.response?.data;
					return responseData?.message || 'Error al obtener los datos';
				},
			}
		);
	};

	useEffect(() => {
		fetchTeachers();
	}, []);

	function openModalAdd() {
		setFormData(initialFormState);
		setEditingTeacher(null);
		setIsOpen(true);
	}

	function openModalEdit(teacher) {
		setFormData({
			acronym: teacher.acronym,
			name: teacher.name,
			lastname: teacher.lastname,
			status: teacher.active
		});

		setEditingTeacher(teacher);
		setIsOpen(true);
	}

	function closeModal() { setIsOpen(false); }

	const handleInputChange = (e) => {
	    const { name, value } = e.target;
	    setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		const payload = {
			acronym: formData.acronym,
			name: formData.name,
			lastname: formData.lastname,
			status: formData.status,
		};

		const isEditing = !!edtingTeacher;
		const apiCall = isEditing
				? api.put(`admin/teachers/${edtingTeacher.master_id}`, payload)
				: api.post("admin/teachers", payload);

		toast.promise(apiCall, {
			loading: isEditing ? "Actualizando..." : "Guardando...",
			success: () => {
				fetchTeachers();
				closeModal();
				return isEditing ? "Maestro actualizado" : "Maestro creado";
			},
			error: (err) => {

				const msg = err.response?.data?.message;
				if (!msg) return "Error al guardar";
				return typeof msg === "string" ? msg : msg.message || "Error al guardar";
			}
		});
	};

	const handleDelete = async(id) => {
		showAlertConfirm("¿Esta seguro de eliminar?", "La acción no podrá deshacerse").then((response) => {
			if(response.isConfirmed) {
				const responsePromise = api.delete(`/admin/teachers/${id}`);
				
				toast.promise(responsePromise, {
					loading: "Eliminando maestro...",
					success: () => {
						fetchTeachers();
						return 'Maestro eliminado'
					},
					error: 'Error al eliminar'
				})
			}
		})
	}

	const fetchAvailableUsers = async() => {
		try {
			const responseData = await api.get('/admin/unassigned');
			const usersArray = Object.values(responseData.data)
			setAvailableUsers(usersArray)
		} catch (error) {
			console.error(error);
			toast.error("Error al cargar los usuarios no asignados");
		}
	}

	const fetchDataForLinking = async () => {
		const loadingToast = toast.loading("Cargando datos...");
		try {
			fetchAvailableUsers();

			const teachersWithoutAccount = teachers.filter(t => t.user_id === null);
			setAvailableTeachers(teachersWithoutAccount);

			toast.dismiss(loadingToast);
			setIsLinkModalOpen(true);
		} catch (error) {
			console.error(error);
			toast.dismiss(loadingToast);
			toast.error("Error al cargar listas para vincular");
		}
	}

	const handleLinkAccounts = async () => {
		if (!selectedUser || !selectedTeacher) {
			return toast.error("Debes seleccionar un usuario y un profesor");
		}

		const loadingToast = toast.loading("Vinculando cuentas...");
		try {

			await api.post('/admin/teachers/link-user', {
				userId: selectedUser,
				teacherId: selectedTeacher
			});

			toast.success("¡Cuentas vinculadas con éxito!", { id: loadingToast });
			setIsLinkModalOpen(false);

			setSelectedUser("");
			setSelectedTeacher("");

			fetchTeachers(); 

		} catch (error) {
			toast.dismiss(loadingToast);
			toast.error(error.response?.data?.message || "Error al vincular");
		}
	};

	return (
		<div className="text-black dark:text-white">
			<div className="rounded-xl shadow-lg border border-white/5 overflow-hidden transition-colors duration-300">
				<div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-[#3e3e50] gap-4">
					<div className='w-full md:w-1/3 flex justify-start'>
						<h3 className="font-bold text-lg text-gray-600 dark:text-white whitespace-nowrap">
							Maestros
						</h3>
					</div>

					<div className='w-full md:w-2/3 flex justify-end gap-3'>
						<button
							className="bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer text-sm px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap flex items-center gap-2"
							onClick={fetchDataForLinking}
						>
							<HiLink size={18} />
							Vincular Usuario
						</button>

						<button 
							className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold cursor-pointer text-sm px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap"
							onClick={openModalAdd}
						>
							+ Agregar Nuevo
						</button>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
						<thead className="bg-gray-200 dark:bg-black/20 uppercase text-xs font-semibold">
							<tr>
								<th className="px-6 py-4">#</th>
								<th className="px-6 py-4">Acronimo</th>
								<th className="px-6 py-4">Nombre</th>
								<th className="px-6 py-4">Estado</th>
								<th className="px-6 py-4 text-right">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-[#313141]">
							{teachers.length > 0 ? (
								teachers.map((teacher, index) => (
									<tr key={teacher.master_id} className="hover:bg-white/5 transition-colors">
										<td className="px-6 py-4 opacity-80">{index + 1}</td>
										<td className="px-6 py-4"> {teacher.acronym} </td>
										<td className="px-6 py-4"> {teacher.lastname} {teacher.name} </td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 rounded text-xs font-bold ${teacher.active == 'S' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
											>
												{teacher.active == 'S' ? 'Activo' : 'Inactivo'}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => openModalEdit(teacher)}
													className="p-2 rounded-lg text-blue-600 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-yellow-400/10 transition-all active:scale-95"
													title="Editar materia"
												>
													<IoPencil size={20} />
												</button>
												<button
													onClick={() => handleDelete(teacher.master_id)}
													className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
													title="Eliminar materia"
												>
													<IoTrash size={20} />
												</button>

											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="5" className="px-6 py-12 text-center opacity-50 italic text-gray-400">
										No se eencontraron maestros
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			<BaseModal
				isOpen={modalIsOpen}
				onClose={closeModal}
				title={edtingTeacher ? 'Editar Maestro' : 'Crear Maestro'}
				subtitle={edtingTeacher ? `Editando a ${edtingTeacher.name} ${edtingTeacher.lastname}` : 'Ingresa los datos del maestro.'}
			>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-normal mb-1">Acronimo:</label>
							<input
								type="text"
								name="acronym"
								value={formData.acronym}
								onChange={handleInputChange}
								className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
								min={1}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Nombre</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
								min={1}
								required
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Apellidos</label>
						<input
							type="text"
							name="lastname"
							value={formData.lastname}
							onChange={handleInputChange}
							className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							min={1}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-1">Estado</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleInputChange}
							className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
						>
							<option value={'S'}>Activo</option>
							<option value={'N'}>Inactivo</option>
						</select>
					</div>

					<div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-white/10">
						<button
							type="button"
							onClick={closeModal}
							className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-6 py-2 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors shadow-lg"
						>
							{edtingTeacher ? 'Actualizar Maestro' : 'Guardar Maestro'}
						</button>
					</div>
				</form>
			</BaseModal>

			<BaseModal isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)} title="Vincular Cuenta">
				<div className="mt-6 space-y-6">
					<div className="flex flex-col md:flex-row gap-4">

						<div className="w-full">
							<label className="font-bold">Usuario</label>
							<select
								className="w-full p-2 border rounded"
								value={selectedUser}
								onChange={e => setSelectedUser(e.target.value)}
							>
								<option value=""> Seleccionar </option>
								{availableUsers.map(u => (
									<option key={u.userid} value={u.userid}>{u.name} (@{u.nickname})</option>
								))}
							</select>
						</div>

						<div className="w-full">
							<label className="font-bold">Profesor (Sin cuenta)</label>
							<select
								className="w-full p-2 border rounded"
								value={selectedTeacher}
								onChange={e => setSelectedTeacher(e.target.value)}
							>
								<option value=""> Seleccionar </option>
								{availableTeachers.map(t => (
									<option key={t.master_id} value={t.master_id}>
										{t.name} {t.lastname} ({t.acronym})
									</option>
								))}
							</select>
						</div>
					</div>
					
					<button onClick={handleLinkAccounts} className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full">
						Confirmar
					</button>
				</div>
			</BaseModal>
		</div>
	);
}