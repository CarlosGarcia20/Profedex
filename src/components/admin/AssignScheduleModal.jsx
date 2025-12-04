import { useState, useEffect } from "react";
import BaseModal from "../../components/ui/BaseModal";
import api from "../../api/axios";
import toast from "react-hot-toast";

// Esta no es la mejor práctica pero por terminos practicos lo hacemos asi ejjeje
const DAYS = [
    { id: 1, label: 'Lunes' },
    { id: 2, label: 'Martes' },
    { id: 3, label: 'Miércoles' },
    { id: 4, label: 'Jueves' },
    { id: 5, label: 'Viernes' }
];

export default function AssignScheduleModal({ isOpen, onClose, groupId, onSuccess }) {
    const [subjects, setSubjects] = useState([]);

    const [formData, setFormData] = useState({
        subject_id: "",
        day_of_week: 1,
        start_time: "",
        end_time: "",
        classroom: ""
    });

    useEffect(() => {
        if (!isOpen) return;
        const fetchSubjects = async () => {
            try {
                const res = await api.get('admin/subjects');
                setSubjects(res.data.data || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSubjects();
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('admin/schedules', { ...formData, group_id: groupId });

            toast.success("Horario asignado correctamente");
            onSuccess();
            onClose();

            setFormData({ ...formData, start_time: "", end_time: "", classroom: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al guardar");
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Asignar Horario">
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* MATERIA */}
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Materia</label>
                    <select
                        name="subject_id"
                        value={formData.subject_id}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:text-white"
                        required
                    >
                        <option value="">Selecciona una materia</option>
                        {subjects.map(sub => (
                            <option key={sub.subject_id} value={sub.subject_id}>{sub.name}</option>
                        ))}
                    </select>
                </div>

                {/* DÍA */}
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Día</label>
                    <select
                        name="day_of_week"
                        value={formData.day_of_week}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:text-white"
                    >
                        {DAYS.map(day => (
                            <option key={day.id} value={day.id}>{day.label}</option>
                        ))}
                    </select>
                </div>

                {/* HORAS */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <TimePicker label="Basic time picker" />
                        {/* <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hora Inicio</label>
                        <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:text-white"
                            required
                        /> */}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hora Fin</label>
                        <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:text-white"
                            required
                        />
                    </div>
                </div>

                {/* SALÓN */}
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Salón / Aula</label>
                    <input
                        type="text"
                        name="classroom"
                        value={formData.classroom}
                        onChange={handleChange}
                        className="w-full bg-gray-50 dark:bg-[#52525a] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 dark:text-white"
                        placeholder="Ej: A-4 o Laboratorio 1"
                        required
                    />
                </div>

                {/* BOTONES */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">Cancelar</button>
                    <button type="submit" className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400">Guardar</button>
                </div>
            </form>
        </BaseModal>
    );
}