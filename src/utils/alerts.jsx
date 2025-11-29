// src/utils/alerts.js
import Swal from 'sweetalert2';

const ProfedexAlert = Swal.mixin({
    background: '#313141',  // Tu fondo Umbreon
    color: '#e5e7eb',       // Tu texto claro
    confirmButtonColor: '#fbbf24', // Tu color de acento (Amarillo anillos)
    cancelButtonColor: '#ef4444',  // Rojo para cancelar
    iconColor: '#fbbf24',   // Iconos amarillos
    customClass: {
        popup: 'border border-gray-600 shadow-xl' // Un borde sutil
    }
});

// Función reutilizable para Éxito
export const showAlertSuccess = (title, text) => {
    return ProfedexAlert.fire({
        position: 'top-end',
        icon: 'success',
        title: title,
        text: text,
        showConfirmButton: false,
        timerProgressBar: false,
        timer: 2000
    });
};

// Función reutilizable para Error
export const showAlertError = (title, text) => {
    return ProfedexAlert.fire({
        position: 'top-end',
        icon: 'error',
        title: title,
        text: text,
        showConfirmButton: false,
        timerProgressBar: false,
        timer: 2000,
    });
};

// Función para confirmar acciones
export const showAlertConfirm = (title, text) => {
    return ProfedexAlert.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    });
};