import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { IoPencil, IoTrash } from 'react-icons/io5';
import { showAlertConfirm } from '../../../utils/alerts';
import BaseModal from '../../../components/ui/BaseModal';

const initialFormState = {
    name: '',
    code: '',
    description: '',
    credits: '',
    semester: '',
    plan_year: '',
    hours: '',
    major_id: '',
    active: 'S',
};

export default function AdminSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [careers, setCareers] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState("-1");

    const [formData, setFormData] = useState(initialFormState);
    const [editingSubject, setEditingSubject] = useState(null);

    const fetchSubjects = () => {
        const subjectsPromise = api.get('admin/subjects');
        toast.promise(subjectsPromise, {
            loading: 'Cargando materias...',
            success: (response) => {
                setSubjects(response.data.data);
                return 'Datos actualizados';
            },
            error: 'Error al cargar datos'
        });
    };

    const fetchCareers = async () => {
        try {
            const response = await api.get('admin/majors');
            setCareers(response.data.data || response.data);
        } catch (error) {
            console.error("Error al cargar carreras", error);
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchCareers();
    }, []);

    const filteredSubjects = subjects.filter((subject) => {
        if (filterStatus === "-1") return true;
        return subject.active === filterStatus;
    });

    // ABRIR PARA CREAR
    function openModalAdd() {
        setFormData(initialFormState);
        setEditingSubject(null);
        setIsOpen(true);
    }

    function openModalEdit(subject) {
        setFormData({
            major_id: subject.major_id,
            name: subject.name,
            code: subject.code,
            plan_year: subject.plan_year,
            active: subject.active,
            description: subject.description || '',
            credits: subject.credits,
            hours: subject.hours,
            semester: subject.semester
        });
        setEditingSubject(subject);
        setIsOpen(true);
    }

    function closeModal() { setIsOpen(false); }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ENVIAR FORMULARIO (POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.major_id || formData.major_id == "-1" || formData.major_id == "") {
            toast.error("Selecciona una carrera válida");
            return;
        }

        const isEditing = !!editingSubject;

        const apiCall = isEditing
            ? api.put(`admin/subjects/${editingSubject.subject_id}`, formData)
            : api.post('admin/subjects', formData);

        toast.promise(apiCall, {
            loading: isEditing ? 'Actualizando...' : 'Guardando...',
            success: () => {
                fetchSubjects();
                closeModal();
                return isEditing ? 'Materia actualizada' : 'Materia creada';
            },
            error: (err) => err.response?.data?.message || 'Error al guardar'
        });
    };

    const handleDelete = async (id) => {
        showAlertConfirm("¿Eliminar la materia?", "Esta acción no se puede deshacer").then((result) => {
            if (result.isConfirmed) {
                const deletePromise = api.delete(`admin/subjects/${id}`);
    
                toast.promise(deletePromise, {
                    loading: 'Eliminando...',
                    success: () => {
                        fetchSubjects();
                        return 'Materia eliminada';
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

                    <div className="w-full md:w-1/3 flex justify-start">
                        <h3 className="font-bold text-lg text-gray-600 dark:text-white whitespace-nowrap">
                            Catálogo de Materias
                        </h3>
                    </div>

                    <div className="w-full md:w-1/3 flex justify-center items-center gap-3">
                        <label className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                            Estado:
                        </label>
                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className='appearance-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm pl-4 pr-8 py-2 rounded-lg shadow-md transition-all cursor-pointer border-none outline-none focus:ring-2 focus:ring-yellow-600 text-center'
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

                    <div className="w-full md:w-1/3 flex justify-end">
                        <button
                            onClick={openModalAdd}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm px-4 py-2 rounded-lg shadow-md transition-all whitespace-nowrap"
                        >
                            + Nueva Materia
                        </button>
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                        <thead className="bg-gray-200 dark:bg-black/20 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Código</th>
                                <th className="px-6 py-4">Materia</th>
                                <th className="px-6 py-4">Carrera</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-[#313141]">
                            {filteredSubjects.length > 0 ? (
                                filteredSubjects.map((subject) => (
                                    <tr 
                                        key={subject.subject_id}
                                        className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs opacity-70"> {subject.code} </td>
                                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white"> {subject.name} </td>
                                        <td className="px-6 py-4"> {subject.major} </td>
                                        <td className="px-6 py-4"> {subject.plan_year} </td>
                                        <td className="px-6 py-4">
                                            <span 
                                                className={`px-2 py-1 rounded text-xs font-bold ${subject.active == 'S' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
                                            >
                                                {subject.active == 'S' ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModalEdit(subject)}
                                                    className="p-2 rounded-lg text-blue-600 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-yellow-400/10 transition-all active:scale-95"
                                                    title="Editar materia"
                                                >
                                                    <IoPencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(subject.subject_id)}
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

            <BaseModal
                isOpen={modalIsOpen}
                onClose={closeModal}
                title={ editingSubject ? 'Editar Materia': 'Nueva Materia' }
                subtitle={ editingSubject ? `Editando: ${editingSubject.name}` : 'Ingresa los datos de la materia.' }
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Código / Clave</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 1210"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Año del Plan</label>
                            <input
                                type="number"
                                name="plan_year"
                                value={formData.plan_year}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 2024"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre de la Materia</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Ej: Cálculo Diferencial"
                            autoComplete='off'
                            required
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-1'>Descripción</label>
                        <textarea
                            typeof='text'
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            className='w-full resize-none bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                            placeholder="Descripción de la materia (opcional)"
                            rows={3}
                        >
                        </textarea>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Créditos</label>
                            <input
                                type="number"
                                name="credits"
                                value={formData.credits}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 8"
                                min={1}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Horas</label>
                            <input
                                type="number"
                                name="hours"
                                value={formData.hours}
                                onChange={handleInputChange}
                                className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Ej: 40"
                                min={1}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">N° Semestre al que pertenece</label>
                        <input
                            type="number"
                            name="semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            min={1}
                            required
                        />
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
                            {editingSubject ? 'Actualizar Materia' : 'Guardar Materia'}
                        </button>
                    </div>
                </form>
            </BaseModal>
        </div>
    );
}