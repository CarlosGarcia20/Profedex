import toast from "react-hot-toast";
import api from "../../api/axios";
import { useState, useEffect } from "react";
import BaseModal from '../../components/ui/BaseModal';
import { IoPencil, IoTrash, IoCheckmarkCircle, IoCloseCircle, IoSearch, IoReload } from "react-icons/io5";
import { showAlertConfirm } from '../../utils/alerts';

const ROLE_CONFIG = {
	1: { label: "Administrador", css: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
	2: { label: "Maestro", css: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
	3: { label: "Alumno", css: "bg-green-500/10 text-green-400 border-green-500/20" },
	default: { label: "Desconocido", css: "bg-gray-500/10 text-gray-400 border-gray-500/20" }
};

const initialFormState = {
	name: '',
	nickname: '',
	password: '',
	validatePassword: '',
	role: ''
};

export default function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [filterRoles, setFilterRoles] = useState("-1");

	const [formData, setFormData] = useState(initialFormState);
	const [editingUser, setEditingUser] = useState(null);
	const [nicknameStatus, setNicknameStatus] = useState('idle');

	const fetchUsers = () => {
		const usersPromise = api.get('admin/users');
		toast.promise(
			usersPromise,
			{
				loading: 'Obteniendo usuarios...',
				success: (response) => {
					setUsers(response.data.data);

					return 'Usuarios cargados correctamente';
				},
				error: (err) => {
					const responseData = err.response?.data;
					return responseData?.message || 'Error al obtener usuarios';
				},
			}
		);
	};

	const fetchRoles = async() => {
		try {
			const response = await api.get('admin/roles');
			setRoles(response.data.data || response.data);
		} catch (error) {
			console.error("Error al cargar los roles: ", error);
		}
	}

	useEffect(() => {
		fetchUsers();
		fetchRoles();
	}, []);

	const filteredUsers = users.filter((user) => {
		if (filterRoles === "-1") return true;
		return user.idrol === filterRoles;
	});

	// ABRIR PARA CREAR
	function openModalAdd() {
		setFormData(initialFormState);
		setEditingUser(null);
		setNicknameStatus('idle');
		setIsOpen(true);
	}

	function openModalEdit(user) {
		setFormData({
			name: user.name,
			nickname: user.nickname,
			role: user.idrol
		});
		setEditingUser(user);
		setNicknameStatus("valid");
		setIsOpen(true);
	}

	function closeModal() { setIsOpen(false); }

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		for (const key of ["name", "nickname", "role"]) {
			if (!formData[key] || formData[key].trim() === "") {
				toast.error("Todos los campos son obligatorios");
				return;
			}
		}

		if (nicknameStatus !== "valid") {
			toast.error("Debes validar el nickname antes de continuar");
			return;
		}

		if (!editingUser || formData.password.length > 0 || formData.validatePassword.length > 0) {

			if (formData.password !== formData.validatePassword) {
				toast.error("Las contraseñas no coinciden");
				return;
			}

			if (!formData.password) {
				toast.error("La contraseña es obligatoria");
				return;
			}
		}

		const payload = {
			name: formData.name,
			nickname: formData.nickname,
			role: formData.role,
			...(formData.password ? { password: formData.password } : {})
		};
		
		console.log("Payload enviado:", payload);
		const isEditing = !!editingUser;

		const apiCall = isEditing
			? api.put(`admin/users/${editingUser.userid}`, payload)
			: api.post("admin/users", payload);

		toast.promise(apiCall, {
			loading: isEditing ? "Actualizando..." : "Guardando...",
			success: () => {
				fetchUsers();
				closeModal();
				return isEditing ? "Usuario actualizado" : "Usuario creado";
			},
			error: (err) => {
				console.log("📥 Response ERROR:", err.response);
				console.log("📥 Response DATA:", err.response?.data);
				console.log("📥 Response STATUS:", err.response?.status);

				const msg = err.response?.data?.message;
				if (!msg) return "Error al guardar";
				return typeof msg === "string" ? msg : msg.message || "Error al guardar";
			}

		});
	};

	const handleValidateNickname = async (e) => {
		e.preventDefault();

		if (!formData.nickname) return;

		setNicknameStatus('loading');

		try {
			const response = await api.post('admin/users/validate-nickname', {
				nickname: formData.nickname,
				userid: editingUser?.userid || null
			});

			if (response.status === 200) {
				setNicknameStatus('valid');
				toast.success(response.data.message);
			}

		} catch (error) {
			setNicknameStatus('invalid');
			const errorMsg = error.response?.data?.message || "El nickname no está disponible";
			toast.error(errorMsg);
		}
	};

	const handleNicknameChange = (e) => {
		const { value } = e.target;

		if (editingUser && value === editingUser.nickname) {
			setNicknameStatus("valid");
		} else {
			setNicknameStatus("idle");
		}

		handleInputChange(e);
	};

	const handleDelete = async (id) => {
		showAlertConfirm("¿Eliminar el usuario?", "Esta acción no se puede deshacer").then((result) => {
			if (result.isConfirmed) {
				const deletePromise = api.delete(`admin/users/${id}`);

				toast.promise(deletePromise, {
					loading: 'Eliminando...',
					success: () => {
						fetchUsers();
						return 'Usuario eliminado';
					},
					error: 'Error al eliminar'
				});
			}
		});
	};

	return (
		<div className="text-black dark:text-white">
			<div className="rounded-xl shadow-lg border border-white/5 overflow-hidden transition-colors duration-300">
				<div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-[#3e3e50] gap-4">
					<div className='w-full md:w-1/3 flex justify-start'>
						<h3 className="font-bold text-lg text-gray-600 dark:text-white whitespace-nowrap">
							Usuarios
						</h3>
					</div>

					<div className="w-full md:w-1/3 flex justify-center items-center gap-3">
						<label className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
							Rol:
						</label>
						<div className="relative">
							<select
								value={filterRoles}
								onChange={(e) => setFilterRoles(e.target.value)}
								className='appearance-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm pl-4 pr-8 py-2 rounded-lg shadow-md transition-all cursor-pointer border-none outline-none focus:ring-2 focus:ring-yellow-600 text-center'
							>
								<option value="-1">Todos</option>
								{roles.map((role) => (
									<option key={role.idrol} value={role.idrol}>
										{role.name}
									</option>
								))}
							</select>
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
								<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
							</div>
						</div>
					</div>

					<div className='w-full md:w-1/3 flex justify-end'>
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
								<th className="px-6 py-4">ID</th>
								<th className="px-6 py-4">Nombre</th>
								<th className="px-6 py-4">Nickname</th>
								<th className="px-6 py-4">Rol</th>
								<th className="px-6 py-4 text-right">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-[#313141]">
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => {
									const roleData = ROLE_CONFIG[user.idrol] || ROLE_CONFIG.default;

									return (
										<tr key={user.userid} className="hover:bg-white/5 transition-colors">
											<td className="px-6 py-4 opacity-80">{user.userid}</td>
											<td className="px-6 py-4 font-medium">{user.name}</td>
											<td className="px-6 py-4 font-medium">{user.nickname}</td>
											<td className="px-6 py-4">
												<span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleData.css}`}>
													{roleData.label}
												</span>
											</td>

											{/* Acciones */}
											<td className="px-6 py-4">
												<div className="flex justify-end gap-2">
													<button
														onClick={() => openModalEdit(user)}
														className="p-2 rounded-lg text-blue-600 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-yellow-400/10 cursor-pointer transition-all active:scale-95"
														title="Editar usuario"
													>
														<IoPencil size={20} />
													</button>
													<button
														onClick={() => handleDelete(user.userid)}
														className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-all active:scale-95"
														title="Eliminar usuario"
													>
														<IoTrash size={20} />
													</button>
												</div>
											</td>
										</tr>
									);
								}) 
							) : (
								<tr>
									<td colSpan="5" className="px-6 py-12 text-center opacity-50 italic text-gray-400">
										No se encontraron usuarios con este rol
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
				title={editingUser ? 'Editar Usuario' : 'Crear Usuario'}
				subtitle={editingUser ? `Editando a ${editingUser.name}` : 'Ingresa los datos del usuario.'}	
			>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label className="block text-sm font-medium mb-1">Nombre del usuario</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
							autoComplete='off'
							required
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Nickname</label>
							<div className="flex gap-2 items-center">
								<input
									type="text"
									name="nickname"
									value={formData.nickname}
									onChange={handleNicknameChange}
									className={`
										flex-1 
										bg-gray-50 dark:bg-[#52525a] 
										border rounded-lg px-4 py-2 
										focus:outline-none focus:ring-2 
										transition-colors
										${nicknameStatus === 'valid'
												? 'border-green-500 focus:ring-green-500'
												: nicknameStatus === 'invalid'
												? 'border-red-500 focus:ring-red-500'
												: 'border-gray-300 dark:border-gray-600 focus:ring-yellow-500'
										}
									`}
									required
								/>

								<button
									type="button"
									onClick={handleValidateNickname}
									disabled={nicknameStatus === 'loading' || !formData.nickname}
									className={`
                    				shrink-0 p-2.5 rounded-lg font-bold text-white cursor-pointer shadow-md transition-all
                    				flex items-center justify-center min-w-[44px]
                    				${nicknameStatus === 'valid'
											? 'bg-green-500 hover:bg-green-600'
											: nicknameStatus === 'invalid'
											? 'bg-red-500 hover:bg-red-600'
											: 'bg-blue-600 hover:bg-blue-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-black'
										}
                    				disabled:opacity-50 disabled:cursor-not-allowed
                				`}
									title="Validar disponibilidad"
								>
									{nicknameStatus === 'loading' ? (
										<IoReload className="animate-spin w-5 h-5" />
									) : nicknameStatus === 'valid' ? (
										<IoCheckmarkCircle className="w-5 h-5" />
									) : nicknameStatus === 'invalid' ? (
										<IoCloseCircle className="w-5 h-5" />
									) : (
										<IoSearch className="w-5 h-5" />
									)}
								</button>
							</div>
							{nicknameStatus === 'invalid' && (
								<p className="text-xs text-red-500 mt-1">Este nickname ya está en uso.</p>
							)}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">Rol del usuario</label>
						<select
							name='role'
							value={formData.role}
							onChange={handleInputChange}
							className='w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white'
							required
						>
							<option value="-1">Selecciona un rol</option>
							{roles.map((role) => (
								<option key={role.idrol} value={role.idrol}>
									{role.name}
								</option>
							))}
						</select>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Contraseña</label>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
								min={1}
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Validar contraseña</label>
							<input
								type="password"
								name="validatePassword"
								value={formData.validatePassword}
								onChange={handleInputChange}
								className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
								min={1}
								required
							/>
						</div>
					</div>

					<div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-white/10">
						<button
							type="button"
							onClick={closeModal}
							className="px-4 py-2 cursor-pointer rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
						>
							Cancelar
						</button>
						<button
							type="submit"
							disabled={
								!formData.name ||
								!formData.nickname ||
								!formData.role ||
								nicknameStatus !== "valid"
							}
							className={` px-6 py-2 cursor-pointer rounded-lg font-bold transition-colors shadow-lg
								${nicknameStatus === "valid"
									? "bg-yellow-500 text-black hover:bg-yellow-400"
									: "bg-gray-400 text-gray-700 cursor-not-allowed"} `}
						>
							{editingUser ? 'Actualizar usuario' : 'Guardar usuario'}
						</button>
					</div>
				</form>
			</BaseModal>
			
		</div>
	);
}