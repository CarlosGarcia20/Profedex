import toast from "react-hot-toast";
import api from "../../../api/axios";
import Header from "../../../components/header/HeaderGeneral";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";

const AlumnoPerfil = () => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        nickname: '',
        group: '',
        enrollment_id: '',
        image: null
    });
    const fileInputRef = useRef(null);
    const { user, updateProfileImage } = useAuth();

    const fetchUserInfo = () => {
        const userInfoPromise = api.get('students/me/info');

        toast.promise(userInfoPromise, {
            loading: 'Cargando información...',
            success: (response) => {
                const userData = response.data;

                setUserInfo(userData);

                return 'Datos obtenidos';
            },
            error: 'Error al cargar datos'
        });
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];

        if (!file) return;
        if (!file.type.startsWith('image/')) {
            toast.error("Por favor selecciona un archivo de imagen válido");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        const uploadPromise = api.patch('students/profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        toast.promise(uploadPromise, {
            loading: 'Subiendo foto...',
            success: (response) => {
                const newUrl = response.data.url;

                setUserInfo(prev => ({
                    ...prev,
                    image: newUrl
                }));
                updateProfileImage(newUrl);

                return 'Foto de perfil actualizada';
            },
            error: (err) => err.response?.data?.message || 'Error al subir la imagen'
        });

        e.target.value = null;
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                <Header titulo="Datos del Perfil" />
                <div className="flex flex-col lg:flex-row justify-between items-start p-8 gap-8">

                    <div className="bg-white shadow-lg rounded-2xl p-6 w-full lg:w-2/3">
                    <h2 className="text-2xl font-semibold text-blue-700 mb-6">Información Personal</h2>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Nombre completo:</label>
                            <input
                                type="text"
                                value={userInfo.name || ''} 
                                className={`
                                    w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors
                                    ${!userInfo.name
                                        ? "border-red-500 text-red-500 bg-red-50"
                                        : "border-gray-300 focus:ring-yellow-400"
                                    }
                                `}
                                disabled
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Apodo:</label>
                            <input
                                type="text"
                                value={userInfo.nickname}
                                className={`
                                    w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors
                                    ${!userInfo.nickname
                                        ? "border-red-500 text-red-500 bg-red-50"
                                        : "border-gray-300 focus:ring-yellow-400"
                                    }
                                `}
                                disabled
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Grupo:</label>
                            <input
                                type="text"
                                value={userInfo.group}
                                className={`
                                    w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-gray-200
                                    ${!userInfo.group
                                        ? "border-red-500 text-red-500 bg-red-50"
                                        : "border-gray-300 focus:ring-yellow-400"
                                    }  
                                `}
                                disabled
                                readOnly
                            />
                        
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Número de cuenta:</label>
                            <input
                                type="text"
                                value={userInfo.enrollment_id}
                                className={`
                                    w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-colors bg-gray-200
                                    ${!userInfo.enrollment_id
                                        ? "border-red-500 text-red-500 bg-red-50"
                                        : "border-gray-300 focus:ring-yellow-400"
                                    }  
                                `}
                                disabled
                                readOnly
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            className="bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
                        >
                            Cambiar contraseña
                        </button>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                        >
                            Actualizar datos
                        </button>
                        </div>
                    </form>
                    </div>

                    <div className="bg-white shadow-lg rounded-2xl p-6 w-full lg:w-1/3 flex flex-col items-center">
                        <div className="w-48 h-48 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center text-gray-500 text-center overflow-hidden bg-gray-50 relative group">
                            {userInfo.image ? (
                                <img
                                    src={userInfo.image}
                                    alt="Perfil"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm">Sin foto</span>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />

                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="mt-4 bg-yellow-400 text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-yellow-500 transition"
                        >
                            Cambiar imagen
                        </button>
                    </div>
                </div>
            </div>
        </div>
  );
};

export default AlumnoPerfil;