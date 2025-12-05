import { useState, useEffect } from "react";
import Header from "../../../components/header/HeaderGeneral";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export default function Home() {
    const [teachers, setTeachers] = useState([]);
  
    const fetchTeachers = async () => {
        const teacherPromise = api.get('students/me/teachers');
        toast.promise(
            teacherPromise,
            {
                loading: 'Cargando maestros...',
                success: (response) => {
                    console.log(response.data.data);
                    
                    setTeachers(response.data.data);

                    return 'Maestros cargados'
                },
                error: (err) => {
                    return 'No hay'
                }
            }
        );
    }

    useEffect(() => {
        fetchTeachers();
    }, [])

    return (
        <div>

            <Header titulo="Bienvenido(a)" />

            <nav className="bg-gray-300 p-4 flex flex-wrap justify-between items-center gap-4 shadow-lg rounded-b-md">
                <div className="text-xl font-bold text-blue-700">
                    ¡Encuéntralos a todos!
                </div>

                <div className="flex flex-wrap items-center gap-2 pr-5">
                    <label htmlFor="search" className="font-semibold text-blue-700 ">
                        Buscar maestro(a):
                    </label>
                    <select
                        id="search"
                        name="search"
                        // CAMBIO AQUÍ: Agregué 'w-64 md:w-96' para hacerlo más largo
                        className="w-64 md:w-96 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                    >
                        <option>Seleccionar un maestro</option>
                        {teachers?.map((teacher) => (
                            <option key={teacher.master_id} value={teacher.master_id}>
                                {teacher.master}
                            </option>
                        ))}
                    </select>
                </div>
            </nav>

            <div className="flex-1 mt-8 flex flex-col lg:flex-row gap-4">
                <div className="bg-gray-300 p-4 rounded-lg shadow-xl lg:w-2/3">
                    <h2 className="text-lg font-semibold text-blue-700 mb-4">
                        Planta 1
                    </h2>

                    <div className="w-full h-96 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                            Mapa de la planta 1
                        </span>
                    </div>
                </div>

                <div className="bg-gray-300 p-4 rounded-lg shadow-xl lg:w-1/3">
                    <h2 className="text-lg font-semibold text-blue-700 mb-4">
                        Planta 2
                    </h2>

                    <div className="w-full h-96 border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                            Mapa de la planta 2
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}