import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import { IoPencil, IoTrash, IoAdd } from 'react-icons/io5';
import { showAlertConfirm } from "../../../utils/alerts";
import BaseModal from "../../../components/ui/BaseModal";

const initialFormState = {
    subject_id: '',
    title: '',
    unit_number: '',
    active: 'S'
};

// Estado inicial de una unidad vacía
const emptyUnit = { title: '', number: '', active: 'S' };

export default function AdminUnits() {
    const [units, setUnits] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [filterSubject, setFilterSubject] = useState("-1");
    const [filterStatus, setFilterStatus] = useState("-1");
    const [modalIsOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState(initialFormState);
    const [editingUnit, setEditingUnit] = useState(null);

    // 1. Estado para la Materia Seleccionada
    const [selectedSubject, setSelectedSubject] = useState("-1");
    
    const [unitsList, setUnitsList] = useState([{ ...emptyUnit }]);

    const fetchUnits = (subjectId) => {
        if (!subjectId || subjectId === "-1") return;

        const unitsPromise = api.get(`/admin/units/subjects/${subjectId}`);

        toast.promise(unitsPromise, {
            loading: 'Cargando unidades...',
            success: (response) => {
                setUnits(response.data.data);
                return 'Unidades actualizadas';
            },
            error: (err) => {
                if (err.response?.status === 404) {
                    setUnits([]);
                    return "No hay unidades registradas para esta materia.";
                }

                return err.response?.data?.message || 'Error al cargar los datos';
            }
        });
    };

    const fetchSubjects = async () => {
        try {
            const response = await api.get('admin/subjects');
            setSubjects(response.data.data || response.data);
        } catch (error) {
            console.error("Error al cargar carreras", error);
        }
    };
    
    useEffect(() => {
        fetchSubjects();
        if (filterSubject !== "-1") {
            fetchUnits(filterSubject);
        } else {
            setUnits([]);
        }
    }, [filterSubject]);

    const filteredSubjects = subjects.filter((subject) => {
        if (filterStatus === "-1") return true;
        return subject.active === filterStatus;
    });

    // Al cerrar/abrir modal puedes resetear con copias también:
    function openModalAdd() {
        setFormData(initialFormState);
        setEditingUnit(null);
        // iniciar unidades con una copia limpia
        setUnitsList([{ ...emptyUnit }]);
        setIsOpen(true);
    }

    function closeModal() {
        // opcional: limpiar antes de cerrar
        setUnitsList([{ ...emptyUnit }]);
        setIsOpen(false);
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
        setEditingUnit(subject);
        setIsOpen(true);
    }

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
        showAlertConfirm("¿Eliminar la unidad?", "Esta acción no se puede deshacer").then((result) => {
            if (result.isConfirmed) {
                const deletePromise = api.delete(`admin/units/${id}`);

                toast.promise(deletePromise, {
                    loading: 'Eliminando...',
                    success: () => {
                        fetchUnits(id);
                        return 'Unidad eliminada';
                    },
                    error: 'Error al eliminar'
                });
            }
        });
    };

    const handleUnitChange = (index, field, value) => {
        setUnitsList(prev => {
            const updated = [...prev];
            const row = { ...updated[index] };

            row[field] = value;
            updated[index] = row;
            return updated;
        });
    };

    const addUnitRow = () => {
        setUnitsList(prev => [...prev, { ...emptyUnit }]);
    };

    const removeUnitRow = (index) => {
        setUnitsList(prev => {
            if (prev.length === 1) {
                toast.error("Debes agregar al menos una unidad.");
                return prev;
            }
            return prev.filter((_, i) => i !== index);
        });
    };

    

    return (
        <div className="text-black dark:text-white">
            <div className="rounded-xl shadow-lg border border-white/5 overflow-hidden transition-colors duration-300">

                <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center bg-gray-50 dark:bg-[#3e3e50] gap-4 lg:gap-6">

                    <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                        <h3 className="font-bold text-lg text-gray-600 dark:text-white whitespace-nowrap">
                            Catálogo de Unidades
                        </h3>
                    </div>

                    <div className="w-full lg:flex-1 flex flex-col md:flex-row justify-center items-center gap-4">

                        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap hidden md:block">
                                Materia:
                            </label>
                            <div className="relative w-full md:w-auto">
                                <select
                                    value={filterSubject}
                                    onChange={(e) => setFilterSubject(e.target.value)}
                                    className='w-full md:w-64 appearance-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm pl-4 pr-8 py-2 rounded-lg shadow-md transition-all cursor-pointer border-none outline-none focus:ring-2 focus:ring-yellow-600 text-center text-ellipsis overflow-hidden'
                                >
                                    <option value="-1">Selecciona una materia</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.subject_id} value={subject.subject_id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Flecha SVG */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Filtro Estado */}
                        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap hidden md:block">
                                Estado:
                            </label>
                            <div className="relative w-full md:w-auto">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className='w-full md:w-auto appearance-none bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm pl-4 pr-8 py-2 rounded-lg shadow-md transition-all cursor-pointer border-none outline-none focus:ring-2 focus:ring-yellow-600 text-center'
                                >
                                    <option value="-1">Todos</option>
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
                            className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm px-6 py-2 rounded-lg shadow-md transition-all whitespace-nowrap"
                        >
                            + Nueva unidad
                        </button>
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300 min-w-[800px]">
                        <thead className="bg-gray-200 dark:bg-black/20 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Materia</th>
                                <th className="px-6 py-4">Nombre de la unidad</th>
                                <th className="px-6 py-4">Número de la unidad</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-[#313141]">
                            {units.length > 0 ? (
                                units.map((unit) => (
                                    <tr
                                        key={unit.unit_id}
                                        className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono text-xs opacity-70"> {unit.subject} </td>
                                        <td className="px-6 py-4 font-mono text-xs opacity-70"> {unit.title} </td>
                                        <td className="px-6 py-4 font-mono text-xs opacity-70"> {unit.unit_number} </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-bold ${unit.active == 'S' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}
                                            >
                                                {unit.active == 'S' ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModalEdit(unit)}
                                                    className="p-2 rounded-lg text-blue-600 dark:text-yellow-400 hover:bg-blue-50 dark:hover:bg-yellow-400/10 transition-all active:scale-95"
                                                    title="Editar materia"
                                                >
                                                    <IoPencil size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(unit.unit_id)}
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
                                        No hay unidades disponibles
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
                title={'Agregar Unidades'}
                subtitle={'Ingresa los datos de las unidades para la materia'}
            >
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                            Materia
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className='w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-gray-900 dark:text-white'
                            name="subject"
                            required
                        >
                            <option value="-1">Selecciona una materia</option>
                            {subjects.map((subject) => (
                                <option key={subject.subject_id} value={subject.subject_id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="border-t border-gray-200 dark:border-white/10 my-4"></div>

                    {/* 2. LISTA DINÁMICA DE UNIDADES */}
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {unitsList.map((unit, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-3 items-end bg-gray-50 dark:bg-[#3e3e50] p-3 rounded-xl border border-gray-200 dark:border-white/5 animate-fade-in">

                                {/* Número de Unidad (Pequeño) */}
                                <div className="w-full md:w-20">
                                    <label className="block text-xs font-bold mb-1 text-gray-500 dark:text-gray-400">
                                        No.
                                    </label>
                                    <input
                                        type="number"
                                        value={unit.number}
                                        onChange={(e) => handleUnitChange(index, 'number', e.target.value)}
                                        className="w-full bg-white dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                                        placeholder="#"
                                        required
                                    />
                                </div>

                                {/* Título (Grande) */}
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold mb-1 text-gray-500 dark:text-gray-400">
                                        Título de la Unidad
                                    </label>
                                    <input
                                        type="text"
                                        value={unit.title}
                                        onChange={(e) => handleUnitChange(index, 'title', e.target.value)}
                                        className="w-full bg-white dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                                        placeholder="Ej: Introducción a Límites"
                                        required
                                    />
                                </div>

                                <div className="w-full md:w-32">
                                    <label className="block text-xs font-bold mb-1 text-gray-500 dark:text-gray-400">
                                        Estado
                                    </label>
                                    <select
                                        value={unit.active}
                                        onChange={(e) => handleUnitChange(index, 'active', e.target.value)}
                                        className="w-full bg-white dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="S">Activa</option>
                                        <option value="N">Inactiva</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pb-0.5">
                                    {unitsList.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeUnitRow(index)}
                                            className="p-2 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/40 transition-colors"
                                            title="Quitar esta unidad"
                                        >
                                            <IoTrash size={18} />
                                        </button>
                                    )}

                                    {/* Botón Agregar (Verde/Amarillo) - Solo en el último elemento */}
                                    {index === unitsList.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={addUnitRow}
                                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-500/20 dark:hover:bg-green-500/40 transition-colors"
                                            title="Agregar otra unidad abajo"
                                        >
                                            <IoAdd size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Botones */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
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
                            Guardar {unitsList.length} {unitsList.length === 1 ? 'Unidad' : 'Unidades'}
                        </button>
                    </div>

                </form>
            </BaseModal>
        </div>
    );
}