import Swal from 'sweetalert2';

// Custom SweetAlert2 theme matching Fundación Gamboa design system
const gamboaSwal = Swal.mixin({
    customClass: {
        container: 'font-sans backdrop-blur-xs z-[9999]',
        popup: 'rounded-3xl p-6 shadow-2xl border border-slate-200 bg-white text-slate-900',
        title: 'text-lg font-extrabold text-slate-900 tracking-tight pt-1',
        htmlContainer: 'text-xs font-semibold text-slate-600 py-2 leading-relaxed',
        confirmButton: 'px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md mx-1',
        cancelButton: 'px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors mx-1',
        denyButton: 'px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors mx-1',
        actions: 'pt-3 gap-2 flex justify-center items-center',
    },
    buttonsStyling: false,
});

/**
 * Muestra una advertencia o alerta moderna
 * Soporta firma por objeto: showAlert({ title, text, icon, confirmText })
 * Soporta firma por argumentos: showAlert(title, text, icon, confirmText)
 */
export const showAlert = (titleOrOptions = 'Atención', textArg = '', iconArg = 'warning', confirmTextArg = 'Entendido') => {
    let title = 'Atención';
    let text = '';
    let icon = 'warning';
    let confirmText = 'Entendido';

    if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
        title = titleOrOptions.title || 'Atención';
        text = titleOrOptions.text || '';
        icon = titleOrOptions.icon || 'warning';
        confirmText = titleOrOptions.confirmText || 'Entendido';
    } else {
        title = titleOrOptions || 'Atención';
        text = textArg || '';
        icon = iconArg || 'warning';
        confirmText = confirmTextArg || 'Entendido';
    }

    return gamboaSwal.fire({
        title,
        text,
        icon,
        confirmButtonText: confirmText,
        iconColor: icon === 'warning' ? '#e11d48' : icon === 'error' ? '#ef4444' : '#10b981',
    });
};

/**
 * Muestra una confirmación moderna con botones Aceptar / Cancelar
 */
export const showConfirm = async ({
    title = '¿Estás seguro?',
    text = 'Esta acción no se puede deshacer.',
    confirmText = 'Sí, continuar',
    cancelText = 'Cancelar',
    icon = 'warning',
    danger = false
}) => {
    const result = await gamboaSwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
        iconColor: danger ? '#ef4444' : '#f59e0b',
        customClass: {
            container: 'font-sans backdrop-blur-xs z-[9999]',
            popup: 'rounded-3xl p-6 shadow-2xl border border-slate-200 bg-white text-slate-900',
            title: 'text-lg font-extrabold text-slate-900 tracking-tight pt-1',
            htmlContainer: 'text-xs font-semibold text-slate-600 py-2 leading-relaxed',
            confirmButton: danger
                ? 'px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md mx-1'
                : 'px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md mx-1',
            cancelButton: 'px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors mx-1',
            actions: 'pt-3 gap-2 flex justify-center items-center',
        }
    });

    return result.isConfirmed;
};

/**
 * Notificación rápida en la esquina (Toast)
 */
export const showToast = ({ title = 'Operación realizada', icon = 'success' }) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true,
        customClass: {
            container: 'z-[9999]',
            popup: 'rounded-2xl shadow-xl border border-slate-200 bg-white font-sans text-xs font-bold text-slate-900 p-3',
        },
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    Toast.fire({
        icon,
        title
    });
};

export default gamboaSwal;
