import Modal from 'react-modal';
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { IoClose, IoPencil, IoTrash } from 'react-icons/io5';
import { showAlertConfirm } from '../../../utils/alerts';

Modal.setAppElement('#root');

const customStyles = {
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 },
    content: {
        top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%',
        transform: 'translate(-50%, -50%)', backgroundColor: 'transparent', border: 'none', padding: 0,
        maxWidth: '600px', width: '95%'
    },
};

const initialFormState = {
    name: "",
    grade_level: "",
    major_id: "",
    active: "S",
};

export default function AdminGroups() {
    const [groups, setGroups] = useState([]);
    const [careers, setCareers] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    const [filterStatus, setFilterStatus] = useState("-1");
    const [filterCareer, setFilterCareer] = useState("-1");

    const [formData, setFormData] = useState(initialFormState);
    const [editingGroup, setEditinGroup] = useState(null);

    const fetchGroups = () => {
        const groupsPromise = api.get('admin/groups');
        toast.promise(groupsPromise, {
            loading: "Cargando grupos...",
            success: (response) => {
                setGroups(response.data.data);
                return "Datos actualizados";
            },
            error: "Error al cargar los datos"
        })
    }

    const fetchCareers = async () => {
        try {
            const response = await api.get('admin/majors');
            setCareers(response.data.data || response.data);
        } catch (error) {
            console.error("Error al cargar carreras", error);
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchCareers();
    }, []);

    const filteredGroups = groups.filter((group) => {
        const matchStatus = filterStatus === "-1" ? true : group.active === filterStatus;

        const matchCareer = filterCareer === "-1" ? true : group.major_id == filterCareer;

        return matchStatus && matchCareer;
    });

    function openModalAdd() {
        setFormData(initialFormState);
        setEditinGroup(null);
        setIsOpen(true);
    }

    function openModalEdit(group) {
        setFormData({
            name: group.name,
            grade_level: group.grade_level,
            major_id: group.major_id,
            active: group.active,
        });
        setEditinGroup(group);
        setIsOpen(true);
    }

    function closeModal() { setIsOpen(false); }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEditing = !! editingGroup;

        const apiCall = isEditing
            ? api.put(`admin/groups/${editingGroup.group_id}`, formData)
            : api.post('admin/groups', formData);

        toast.promise(apiCall, {
            loading: isEditing ? 'Actualizando...' : 'Guardando...',
            success: () => {
                fetchGroups();
                closeModal();
                return isEditing ? 'Grupo actualizado' : 'Grupo creado';
            },
            error: (err) => err.response?.data?.message || 'Error al guardar'
        });
    };

    const handleDelete = async (id) => {
        showAlertConfirm("¿Eliminar el grupo?", "Esta acción no se puede deshacer").then((result) => {
            if (result.isConfirmed) {
                const deletePromise = api.delete(`admin/groups/${id}`);

                toast.promise(deletePromise, {
                    loading: 'Eliminando...',
                    success: () => {
                        fetchGroups();
                        return 'Carrera eliminada';
                    },
                    error: 'Error al eliminar'
                });
            }
        });
    };

    return (
        <div className="text-black dark:text-white">
			<div className="rounded-xl shadow-lg border border-white/5 overflow-hidden transition-colors duration-300">

				<div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center bg-gray-50 dark:bg-[#3e3e50] gap-4 lg:gap-6">

					<div className="w-full lg:w-auto flex justify-center lg:justify-start">
						<h3 className="font-bold text-lg text-gray-800 dark:text-white whitespace-nowrap">
							Catálogo de Grupos
						</h3>
					</div>

					<div className="w-full lg:flex-1 flex flex-col md:flex-row justify-center items-center gap-4">

						<div className="flex items-center gap-2 w-full md:w-auto justify-center">
							<label className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
								Carrera:
							</label>
							<div className="relative w-full md:w-auto">
								<select
									value={filterCareer}
									onChange={(e) => setFilterCareer(e.target.value)}
									className='w-full md:w-auto appearance-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm pl-4 pr-8 py-2 rounded-lg shadow-md transition-all cursor-pointer border-none outline-none focus:ring-2 focus:ring-yellow-600 text-center'
									required
								>
									<option value="-1" className="bg-white text-gray-700 dark:bg-gray-700 dark:text-white">Todas</option>
									{careers.map((career) => (
										<option
											key={career.major_id}
											value={career.major_id}
											className="bg-white text-gray-700 dark:bg-gray-700 dark:text-white"
										>
											{career.name}
										</option>
									))}
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
									<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 w-full md:w-auto justify-center">
							<label className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
								Estado:
							</label>
							<div className="relative w-full md:w-auto">
								<select
									value={filterStatus}
									onChange={(e) => setFilterStatus(e.target.value)}
									className='w-full md:w-auto appearance-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm pl-4 pr-8 py-2 rounded-lg shadow-md transition-all cursor-pointer border-none outline-none focus:ring-2 focus:ring-yellow-600 text-center'
								>
									<option value="-1">Todas</option>
									<option value="S">Activas</option>
									<option value="N">Inactivas</option>
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
									<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
								</div>
							</div>
						</div>

					</div>

					<div className="w-full lg:w-auto flex justify-center lg:justify-end">
						<button
							onClick={openModalAdd}
							className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm px-6 py-2 rounded-lg shadow-md transition-all block"
						>
							+ Nuevo grupo
						</button>
					</div>

				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 min-w-[800px]">
						<thead className="bg-gray-200 dark:bg-black/20 uppercase text-xs font-semibold">
							<tr>
								<th className="px-6 py-4">Id</th>
								<th className="px-6 py-4">Carrera</th>
								<th className="px-6 py-4">Grupo</th>
								<th className="px-6 py-4">Año del grupo</th>
								<th className="px-6 py-4">Estado</th>
								<th className="px-6 py-4 text-right">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-[#313141]">
							{filteredGroups.length > 0 ? (
								filteredGroups.map((group) => (
									<tr
										key={group.group_id}
										className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
									>
										<td className="px-6 py-4 font-mono text-xs opacity-70"> {group.group_id} </td>
										<td className="px-6 py-4 font-bold text-gray-800 dark:text-white"> {group.major} </td>
										<td className="px-6 py-4"> {group.name} </td>
										<td className="px-6 py-4"> {group.grade_level} </td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 rounded text-xs font-bold ${group.active == 'S' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
											>
												{group.active == 'S' ? 'Activa' : 'Inactiva'}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => openModalEdit(group)}
													className="p-2 rounded-lg text-blue-600 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-yellow-400/10 transition-all active:scale-95"
													title="Editar materia"
												>
													<IoPencil size={20} />
												</button>
												<button
													onClick={() => handleDelete(group.group_id)}
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
									<td colSpan="6" className="px-6 py-12 text-center opacity-50 italic">
										{filterStatus !== "-1"
											? "No hay materias con este estatus."
											: "No hay materias registradas."}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Grupo Modal"
            >
                <div className="bg-white dark:bg-[#313141] text-gray-800 dark:text-white p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-2xl relative transition-all">

                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <IoClose size={24} />
                    </button>

                    <h2 className="text-xl font-bold mb-1 text-yellow-600 dark:text-yellow-400">
                        {editingGroup ? 'Editar Grupo' : 'Nuevo Grupo'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {editingGroup ? `Editando: ${editingGroup.name}` : 'Ingresa los datos del grupo.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre del grupo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Ej: 1-01"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Grado del grupo</label>
                                <input
                                    type="number"
                                    name="grade_level"
                                    value={formData.grade_level}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Ej: 1"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Carrera / Especialidad</label>
                            <select
                                name='major_id'
                                value={formData.major_id}
                                onChange={handleInputChange}
                                className='w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white'
                                required
                            >
                                <option value="-1">Selecciona una carrera</option>
                                {careers.map((career) => (
                                    <option key={career.major_id} value={career.major_id}>
                                        {career.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Estatus</label>
                            <select
                                name="active"
                                value={formData.active}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value={'S'}>Activa</option>
                                <option value={'N'}>Inactiva (Baja Temporal)</option>
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
                                {editingGroup ? 'Actualizar Grupo' : 'Guardar Grupo'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}