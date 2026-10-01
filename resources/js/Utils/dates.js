/**
 * Formatea un string de fecha "sin hora" (YYYY-MM-DD, como los campos que Laravel
 * castea como 'date') de forma segura para mostrar en pantalla.
 *
 * `new Date('2026-09-16').toLocaleDateString()` interpreta ese string como
 * medianoche UTC, así que en cualquier navegador con huso horario detrás de UTC
 * (como Chile) el día se corre uno hacia atrás. Esta función arma la fecha
 * directamente en horario local para que el día mostrado sea siempre el mismo
 * que se guardó.
 */
export function formatDateOnly(dateString, locale = 'es-CL', options = undefined) {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    if (!year || !month || !day) return '';

    return new Date(year, month - 1, day).toLocaleDateString(locale, options);
}
