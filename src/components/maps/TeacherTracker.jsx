import { useState, useEffect, useRef } from 'react';
import { socket } from '../../services/socket';
import toast from 'react-hot-toast';

export default function TeacherTracker({ teacherId, classId }) {
    const [isSharing, setIsSharing] = useState(false);
    const watchIdRef = useRef(null);

    const startSharing = () => {
        if (!("geolocation" in navigator)) {
            return toast.error("Tu navegador no soporta geolocalización");
        }

        socket.connect();
        socket.emit('join_class_room', { classId, role: 'teacher' });

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                socket.emit('send_location', {
                    classId,
                    teacherId,
                    coords: { lat: latitude, lng: longitude }
                });
            },
            (error) => {
                console.error(error);
                toast.error("Error obteniendo ubicación");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        setIsSharing(true);
        toast.success("¡Compartiendo ubicación en tiempo real!");
    };

    const stopSharing = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }
        socket.emit('stop_sharing', { classId });
        socket.disconnect();
        setIsSharing(false);
        toast("Ubicación detenida");
    };

    useEffect(() => {
        return () => {
            if (isSharing) stopSharing();
        };
    }, []);

    return (
        <div className="p-4 bg-white rounded-lg shadow-md text-center">
            <h3 className="font-bold text-lg mb-2">Estado de Ubicación</h3>
            <div className={`w-4 h-4 rounded-full mx-auto mb-4 ${isSharing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>

            {!isSharing ? (
                <button
                    onClick={startSharing}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                    📍 Encender Ubicación
                </button>
            ) : (
                <button
                    onClick={stopSharing}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                >
                    🛑 Detener
                </button>
            )}
        </div>
    );
}