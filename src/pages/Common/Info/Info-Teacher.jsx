import { useState, useEffect, useMemo } from "react";
import Header from "../../../components/header/HeaderGeneral";
import toast from "react-hot-toast";
import api from "../../../api/axios";

const DAY_MAP = {
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
    7: "Domingo"
};

export default function InfoTeacher() {
    const [userSchedule, setUserSchedule] = useState([]);
    const [teacherName, setTeacherName] = useState("");
    const [selectedDay, setSelectedDay] = useState("");

    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [image, setImage] = useState(null);

    const fetchSchedule = () => {
        const schedulePromise = api.get("teachers/me/schedules");

        toast.promise(schedulePromise, {
            loading: "Obteniendo horario...",
            success: (response) => {
                setUserSchedule(response.data.data || []);
                setTeacherName(response.data.data[0].teacher)

                return "Horario cargado";
            },
            error: (err) => {
                setUserSchedule([]);
                if (err.response?.status === 404) {
                    setTeacherName("Sin asignación");
                    return err.response.data.message;
                }
                return "Error al cargar los datos";
            }
        });
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const filteredSchedule = useMemo(() => {
        if (!Array.isArray(userSchedule)) return [];
        if (selectedDay === "") return userSchedule;
        return userSchedule.filter(
            (item) => item.day_of_week === parseInt(selectedDay)
        );
    }, [userSchedule, selectedDay]);

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        if (!eventName || !description || !date || !startTime || !endTime) {
            toast.error("Llena todos los campos obligatorios");
            return;
        }

        const formData = new FormData();
        formData.append("name", eventName);
        formData.append("description", description);
        formData.append("date", date);
        formData.append("start_time", startTime);
        formData.append("end_time", endTime);
        if (image) formData.append("image", image);

        try {
            const res = api.post("events/create", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.promise(res, {
                loading: "Creando evento...",
                success: "Evento creado correctamente",
                error: "No se pudo crear el evento"
            });

            setEventName("");
            setDescription("");
            setDate("");
            setStartTime("");
            setEndTime("");
            setImage(null);

        } catch (error) {
            toast.error("Error al enviar el formulario");
        }
    };

    return (
        <div className="w-full p-4">
            <div className="mx-auto bg-gray-300 rounded-lg shadow-xl overflow-hidden flex flex-col h-screen max-h-[800px]">
                <Header titulo="Tu Equipo" />

                <main className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-full overflow-hidden">

                    {/* LEFT SIDE (horario + grupo) */}
                    <div className="flex-1 flex flex-col space-y-4 h-full min-h-0">
                        <div className="shrink-0">
                            <h1 className="text-xl font-bold text-blue-700 mb-2">
                                Nombre del profesor
                            </h1>
                            <input
                                type="text"
                                value={teacherName}
                                className="p-2 w-full md:w-150 rounded-md border border-gray-400 bg-gray-200 text-gray-700 font-medium"
                                disabled
                            />
                        </div>

                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-blue-700">
                                    Horario
                                </h2>

                                <select
                                    className="p-1 rounded border border-gray-400 text-sm"
                                    value={selectedDay}
                                    onChange={(e) =>
                                        setSelectedDay(e.target.value)
                                    }
                                >
                                    <option value="">Todos los días</option>
                                    {Object.entries(DAY_MAP).map(
                                        ([key, label]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="flex-1 overflow-auto shadow-md rounded-lg border border-gray-300 bg-white">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
                                        <tr>
                                            <th className="px-4 py-3">Día</th>
                                            <th className="px-4 py-3">Grupo</th>
                                            <th className="px-4 py-3">Hora</th>
                                            <th className="px-4 py-3">Materia</th>
                                            <th className="px-4 py-3">Aula</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredSchedule.length > 0 ? (
                                            filteredSchedule.map((item) => (
                                                <tr
                                                    key={item.schedule_id}
                                                    className="hover:bg-red-50"
                                                >
                                                    <td className="px-4 py-3">
                                                        {DAY_MAP[item.day_of_week]}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.group || "Sin asignar"}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.start_time?.slice(0, 5)} -{" "}
                                                        {item.end_time?.slice(0, 5)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.subject}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {item.classroom}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-4 py-8 text-center text-gray-500 italic"
                                                >
                                                    No hay horarios asignados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}