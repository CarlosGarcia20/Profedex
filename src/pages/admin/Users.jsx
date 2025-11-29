import toast from "react-hot-toast";
import api from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";

const ROLE_CONFIG = {
    1: { label: "Administrador", css: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    2: { label: "Maestro", css: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    3: { label: "Alumno", css: "bg-green-500/10 text-green-400 border-green-500/20" },
    // Default por si llega un ID raro
    default: { label: "Desconocido", css: "bg-gray-500/10 text-gray-400 border-gray-500/20" }
};

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
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
        fetchUsers();
    }, []);

    return (
        <div
            className="rounded-xl shadow-lg border border-white/5 overflow-hidden transition-colors duration-300"
        >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-lg dark:text-white">Usuarios</h3>
                <button
                    className="text-gray-900 text-sm px-4 py-2 rounded-lg shadow-md transition-all hover:opacity-90 font-bold dark:text-white hover:dark:opacity-65"
                    onClick={openModalCreateUser}
                >
                    + Agregar Nuevo
                </button>
            </div>
            <table className="w-full text-left text-sm dark:text-white">
                <thead className="bg-black/20  uppercase text-xs font-semibold opacity-70">
                    <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Nickname</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.length > 0 ? (
                        users.map((user) => {
                            const roleData = ROLE_CONFIG[user.idrol] || ROLE_CONFIG.default;

                            return (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 opacity-80">{user.userid}</td>
                                    <td className="px-6 py-4 font-medium">{user.name}</td>
                                    <td className="px-6 py-4 font-medium">{user.nickname}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleData.css}`}>
                                            {roleData.label}
                                        </span>
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            className="rounded-full text-sm font-semibold text-white bg-background hover:bg-hover px-4 py-2 dark:text-yellow-400 dark:bg-gray-700"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-12 text-center opacity-50 italic text-gray-400">
                                No se encontraron usuarios o está cargando...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
function openModalCreateUser() {
    return (
        <div className="bg-amber-300"> 
            <p>Holaa</p>
        </div>
    )
}