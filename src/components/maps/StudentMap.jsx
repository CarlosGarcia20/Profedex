import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { socket } from '../../services/socket';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


function RecenterMap({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo([coords.lat, coords.lng], map.getZoom());
        }
    }, [coords]);
    return null;
}

export default function StudentMap({ classId }) {
    const [teacherLocation, setTeacherLocation] = useState(null);

    // 1. COORDENADAS DE LA ESCUELA (Centro)
    const schoolCenter = [25.81470920291251, -108.98029973959655];

    const mapBounds = [
        [25.81574352405161, -108.98071878168817],  // Esquina Abajo-Izquierda
        [25.81430859480615, -108.97975904506221] // Esquina Arriba-Derecha
    ];

    useEffect(() => {
        socket.connect();
        socket.emit('join_class_room', { classId, role: 'student' });

        socket.on('receive_location', (data) => {
            setTeacherLocation(data.coords);
        });

        return () => {
            socket.off('receive_location');
            socket.disconnect();
        };
    }, [classId]);

    return (
        <div className="h-full w-full">
            <MapContainer
                center={schoolCenter}
                zoom={16}
                minZoom={18}
                maxZoom={18}
                maxBounds={mapBounds}
                maxBoundsViscosity={1.0}
                dragging={false}
                touchZoom={false}
                doubleClickZoom={false}
                scrollWheelZoom={false}
                zoomControl={false}

                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {teacherLocation && (
                    <>
                        <Marker position={[teacherLocation.lat, teacherLocation.lng]}>
                            <Popup>
                                👨‍🏫 ¡El profesor está aquí!
                            </Popup>
                        </Marker>
                        
                        <RecenterMap coords={teacherLocation} />
                    </>
                )}
            </MapContainer>

            {!teacherLocation && (
                <div className="text-center p-2 text-sm text-gray-500 bg-gray-100">
                    Esperando ubicación del profesor...
                </div>
            )}
        </div>
    );
}