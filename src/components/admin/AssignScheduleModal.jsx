import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { IoAdd, IoTrash, IoClose, IoTime, IoCalendar, IoLocation } from "react-icons/io5";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from "dayjs";

import api from "../../api/axios";
import toast from "react-hot-toast";
import { showAlertConfirm } from "../../utils/alerts";

Modal.setAppElement('#root');

const modalStyles = {
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 50 },
    content: {
        top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%',
        transform: 'translate(-50%, -50%)', padding: 0, border: 'none', background: 'transparent',
        width: '95%', maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden'
    },
};

// Esta no es la mejor práctica pero por terminos practicos lo hacemos asi ejjeje
const DAYS = [
    { id: 1, label: 'Lunes' },
    { id: 2, label: 'Martes' },
    { id: 3, label: 'Miércoles' },
    { id: 4, label: 'Jueves' },
    { id: 5, label: 'Viernes' }
];

// Plantilla para una fila vacía
const emptySchedule = {
    id: Date.now(),
    subject_id: "",
    day_of_week: 1,
    start_time: null,
    end_time: null,
    classroom_id: ""
};

export default function AssignScheduleModal({ isOpen, onClose, groupId, onSuccess }) {
    const [subjects, setSubjects] = useState([]);
    const [classrooms, setClassrooms] = useState([]);

    const [scheduleList, setScheduleList] = useState([emptySchedule]);
    
    const fetchSubjects = async () => {
        try {
            const res = await api.get('admin/subjects');
            setSubjects(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchClassrooms = async () => {
        try {
            const res = await api.get('admin/classrooms');
            setClassrooms(res.data.data || []);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!isOpen) return;
        fetchSubjects();
        fetchClassrooms();
    }, [isOpen]);

    const addRow = () => setScheduleList([...scheduleList, { ...emptySchedule, id: Date.now() }]);

    const removeRow = (index) => {
        if (scheduleList.length === 1) return;
        setScheduleList(scheduleList.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updated = [...scheduleList];
        updated[index][field] = value;
        setScheduleList(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = scheduleList.every(row =>
            row.subject_id && row.start_time && row.end_time && row.classroom_id
        );

        if (!isValid) {
            toast.error('Completa todos los campos en todas las filas');
            return;
        }

        showAlertConfirm("¿Guardar los horarios?", "").then((result) => {
            if (result.isConfirmed) {

                const schedulesPayload = scheduleList.map(row => ({
                    subject_id: row.subject_id,
                    day: row.day_of_week,
                    start_time: dayjs(row.start_time).format('HH:mm:ss'),
                    end_time: dayjs(row.end_time).format('HH:mm:ss'),
                    classroom_id: row.classroom_id,
                    group_id: groupId
                }));

                const apiCall = api.post('admin/schedules', schedulesPayload);

                toast.promise(apiCall, {
                    loading: 'Guardando horario...',
                    success: () => {
                        onSuccess?.();
                        onClose();

                        setScheduleList([{ ...emptySchedule, id: Date.now() }]);

                        return 'Horarios guardados correctamente';
                    },
                    error: (err) => {
                        // 5. LÓGICA DE ERROR (No cerramos el modal)
                        console.error(err);
                        return err.response?.data?.message || 'Error al guardar';
                    }
                });
            }
        });

    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyles}>

            {/* CONTENEDOR PRINCIPAL */}
            <div className="flex flex-col bg-white dark:bg-[#2d3748] rounded-xl shadow-2xl h-full max-h-[90vh] overflow-hidden text-gray-800 dark:text-white">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f2937]">
                    <div>
                        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Asignar Horarios</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Configura las clases para este grupo</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <IoClose size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-gray-100 dark:bg-[#2d3748]">
                    <form id="schedule-form" onSubmit={handleSubmit} className="space-y-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            {/* ENCABEZADOS  */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <div className="col-span-3">Materia</div>
                                <div className="col-span-2">Día</div>
                                <div className="col-span-2">Inicio</div>
                                <div className="col-span-2">Fin</div>
                                <div className="col-span-2">Salón</div>
                                <div className="col-span-1 text-center">Acción</div>
                            </div>

                            {/* LISTA DE FILAS */}
                            {scheduleList.map((row, index) => (
                                <div
                                    key={row.id}
                                    className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 bg-white dark:bg-[#3e3e50] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm md:items-center relative"
                                >

                                    {/* Botón Borrar */}
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        className="md:hidden absolute top-2 right-2 p-2 text-red-400 hover:text-red-600"
                                    >
                                        <IoTrash size={20} />
                                    </button>

                                    {/* 1. MATERIA */}
                                    <div className="md:col-span-3">
                                        <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">Materia</label>
                                        <select
                                            value={row.subject_id}
                                            onChange={(e) => handleChange(index, 'subject_id', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#2d3748] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                                            required
                                        >
                                            <option value="">Seleccionar Materia...</option>
                                            {subjects.map(sub => (
                                                <option key={sub.subject_id} value={sub.subject_id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* 2. DÍA */}
                                    <div className="md:col-span-2">
                                        <label className="md:hidden text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><IoCalendar /> Día</label>
                                        <select
                                            value={row.day_of_week}
                                            onChange={(e) => handleChange(index, 'day_of_week', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#2d3748] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                                        >
                                            {DAYS.map(day => <option key={day.id} value={day.id}>{day.label}</option>)}
                                        </select>
                                    </div>

                                    {/* 3. INICIO */}
                                    <div className="md:col-span-2">
                                        <label className="md:hidden text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><IoTime /> Inicio</label>
                                        <TimePicker
                                            value={row.start_time}
                                            onChange={(val) => handleChange(index, 'start_time', val)}
                                            slotProps={{ textField: { size: 'small', fullWidth: true, className: 'bg-gray-50 dark:bg-[#2d3748] rounded-lg' } }}
                                        />
                                    </div>

                                    {/* 4. FIN */}
                                    <div className="md:col-span-2">
                                        <label className="md:hidden text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><IoTime /> Fin</label>
                                        <TimePicker
                                            value={row.end_time}
                                            onChange={(val) => handleChange(index, 'end_time', val)}
                                            slotProps={{ textField: { size: 'small', fullWidth: true, className: 'bg-gray-50 dark:bg-[#2d3748] rounded-lg' } }}
                                        />
                                    </div>

                                    {/* 5. SALÓN */}
                                    <div className="md:col-span-2">
                                        <label className="md:hidden text-xs font-bold text-gray-500 mb-1 flex items-center gap-1"><IoLocation /> Salón</label>
                                        <select
                                            value={row.classroom_id}
                                            onChange={(e) => handleChange(index, 'classroom_id', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#2d3748] border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                                            required
                                        >
                                            <option value="">Aula...</option>
                                            {classrooms.map(room => (
                                                <option key={room.id} value={room.id}>{room.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="hidden md:flex col-span-1 justify-center gap-2">
                                        {scheduleList.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeRow(index)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <IoTrash size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </LocalizationProvider>

                        {/* BOTÓN AGREGAR FILA */}
                        <button
                            type="button"
                            onClick={addRow}
                            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-all flex items-center justify-center gap-2 font-bold"
                        >
                            <IoAdd size={20} /> Agregar otro horario
                        </button>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1f2937] flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        form="schedule-form" 
                        className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Guardar {scheduleList.length} horarios
                    </button>
                </div>

            </div>
        </Modal>
    );
}