import { useState, useEffect, useCallback } from "react";
import { IoTime, IoLocation, IoPencil, IoTrash, IoAdd, IoCalendar, IoBook } from "react-icons/io5";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { showAlertConfirm } from "../../utils/alerts";
import AssignScheduleModal from "./AssignScheduleModal";

const DAYS_MAP = {
    1: { label: 'Lunes', colorClass: 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-500/10' },
    2: { label: 'Martes', colorClass: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-500/10' },
    3: { label: 'Miércoles', colorClass: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-500/10' },
    4: { label: 'Jueves', colorClass: 'border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-500/10' },
    5: { label: 'Viernes', colorClass: 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-500/10' },
    6: { label: 'Sábado', colorClass: 'border-l-4 border-l-gray-500 bg-gray-50 dark:bg-gray-500/10' },
    default: { label: 'Desconocido', colorClass: 'border-l-4 border-l-gray-400 bg-gray-100 dark:bg-gray-700' }
};

export default function GroupScheduleCards({ groupId }) {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSchedules = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const res = await api.get(`admin/groups/${groupId}/schedules`);
            setSchedules(res.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar horarios");
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const handleDelete = (id) => {
        showAlertConfirm("¿Estás seguro de eliminar?", "La acción no podrá deshacerse").then((result) => {
            if (result.isConfirmed) {
                const deletePromise = api.delete(`admin/schedules/${id}`);

                toast.promise(deletePromise, {
                    loading: 'Eliminando...',
                    success: () => {
                        fetchSchedules();
                        return 'Clase eliminada';
                    },
                    error: 'Error al eliminar'
                });
            }
        });
    };

    if (loading) return <div className="text-center p-4">Cargando horarios...</div>;

    return (
        <div className="space-y-4">
            {schedules.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 dark:bg-[#3e3e50] rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <IoCalendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Sin horarios asignados</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Este grupo aún no tiene clases programadas.</p>
                    <button
                        className="mt-4 text-yellow-600 hover:text-yellow-500 font-medium"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Asignar primer horario
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-700 dark:text-white flex items-center gap-2">
                            <IoTime /> Horario Semanal
                        </h3>
                        <button 
                            className="text-sm bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-sm flex items-center gap-1"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <IoAdd /> Agregar
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {schedules.map((schedule) => {
                            const dayConfig = DAYS_MAP[schedule.day_of_week] || DAYS_MAP.default;
    
                            return (
                                <div
                                    key={schedule.id}
                                    className={`
                                        relative p-4 rounded-lg shadow-sm hover:shadow-md transition-all 
                                        bg-white dark:bg-[#3e3e50] 
                                        ${dayConfig.colorClass} 
                                    `}
                                >
                                    <div className="absolute top-3 right-3 flex gap-2 group-hover:opacity-100 transition-opacity">
                                        <button className="text-gray-400 hover:text-blue-500">  
                                            <IoPencil />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(schedule.schedule_id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <IoTrash />
                                        </button>
                                    </div>
    
                                    <div className="flex flex-col gap-3">
                                        <h4 className="font-bold text-lg text-gray-800 dark:text-white uppercase tracking-wide">
                                            {dayConfig.label}
                                        </h4>
    
                                        <div className="flex items-start gap-2 text-gray-800 dark:text-white">
                                            <IoBook className="text-purple-700 dark:text-purple-500 mt-1 shrink-0" />
                                            <span className="font-bold text-base leading-tight">
                                                {schedule.subject || "Nombre de la materia"}
                                            </span>
                                        </div>
    
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            <IoTime className="text-yellow-600 dark:text-yellow-500" />
                                            <span className="font-mono text-sm font-semibold">
                                                {schedule.start_time} - {schedule.end_time}
                                            </span>
                                        </div>
    
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-400 text-sm">
                                            <IoLocation className="text-gray-950 dark:text-gray-400" />
                                            <span>
                                                Salón: 
                                                <strong className="text-gray-700 dark:text-gray-200"> {schedule.classroom || 'Sin asignar'}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                </>
            )}

            <AssignScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                groupId={groupId}
                onSuccess={fetchSchedules}
            />
        </div>
    );
}