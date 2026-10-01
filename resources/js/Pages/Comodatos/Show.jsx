import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { formatDateOnly } from '@/Utils/dates';

export default function Show({ comodato }) {
    const [showModalDevolucion, setShowModalDevolucion] = useState(false);
    const [showModalFirmado, setShowModalFirmado] = useState(false);

    const { data: dataDev, setData: setDataDev, post: postDev, processing: procDev, errors: errDev } = useForm({
        fecha_devolucion_real: new Date().toISOString().split('T')[0],
        observaciones_devolucion: '',
    });

    const { data: dataFirm, setData: setDataFirm, post: postFirm, processing: procFirm, errors: errFirm } = useForm({
        documento_firmado: null,
    });

    const handleDevolucion = (e) => {
        e.preventDefault();
        postDev(route('comodatos.devolucion', comodato.id), {
            onSuccess: () => setShowModalDevolucion(false),
        });
    };

    const handleUploadFirmado = (e) => {
        e.preventDefault();
        postFirm(route('comodatos.uploadSigned', comodato.id), {
            onSuccess: () => setShowModalFirmado(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200 uppercase">
                                {comodato.codigo}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                comodato.estado === 'activo' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                comodato.estado === 'devuelto' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                            }`}>
                                {comodato.estado === 'activo' ? 'En Préstamo' : comodato.estado === 'devuelto' ? 'Devuelto' : comodato.estado}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mt-1">
                            Comodato de {comodato.beneficiario.nombre}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={route('comodatos.pdf', comodato.id)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-2xs transition-all text-xs flex items-center space-x-2"
                        >
                            <span>📄 PDF Contrato Entrega</span>
                        </a>

                        {comodato.estado === 'devuelto' && (
                            <a
                                href={route('comodatos.devolucion.pdf', comodato.id)}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-2xs transition-all text-xs flex items-center space-x-2"
                            >
                                <span>📄 PDF Acta Recepción / Devolución</span>
                            </a>
                        )}

                        {comodato.estado === 'activo' && (
                            <button
                                onClick={() => setShowModalDevolucion(true)}
                                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-2xs transition-all text-xs flex items-center space-x-2"
                            >
                                <span>🔄 Registrar Devolución</span>
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={`Comodato ${comodato.codigo} — Fundación Gamboa`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Header Info Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Beneficiario</span>
                            <div className="text-lg font-bold text-slate-900">{comodato.beneficiario.nombre}</div>
                            <div className="text-xs text-slate-600 font-semibold">{comodato.beneficiario.direccion || 'Sin dirección'}</div>
                            <div className="text-xs text-rose-700 font-bold">{comodato.beneficiario.telefono || 'Sin teléfono'}</div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Responsable y Sucursal</span>
                            <div className="text-lg font-bold text-slate-900">{comodato.responsable?.name || 'Administrador'}</div>
                            <div className="text-xs text-rose-700 font-bold">🏢 Sucursal: {comodato.sucursal?.nombre || 'Casa Matriz'}</div>
                            <div className="text-xs text-slate-600 font-semibold">Fecha Entrega: {formatDateOnly(comodato.fecha_entrega)}</div>
                            {comodato.fecha_devolucion_real && (
                                <div className="text-xs text-emerald-700 font-bold">Devuelto el: {formatDateOnly(comodato.fecha_devolucion_real)}</div>
                            )}
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                            <span className="text-xs font-bold text-slate-500 uppercase">Documento Firmado Manualmente</span>
                            {comodato.documento_firmado_path ? (
                                <div className="space-y-2">
                                    <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg">
                                        ✓ Documento Firmado Adjunto
                                    </span>
                                    <a
                                        href={`/storage/${comodato.documento_firmado_path}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-xs font-bold text-rose-600 hover:underline"
                                    >
                                        Ver / Descargar Escaneo
                                    </a>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <span className="text-xs text-amber-700 font-bold block">Pendiente de subir escaneo firmado</span>
                                    <button
                                        onClick={() => setShowModalFirmado(true)}
                                        className="px-3.5 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        Subir Escaneo Firmado
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detail Items Table */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Detalle de Equipos e Insumos Prestados
                        </h3>

                        {/* 📱 MOBILE VIEW: Cards for Small & Medium Screens */}
                        <div className="block lg:hidden space-y-3">
                            {comodato.items.map((item) => (
                                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                                        <span className="font-bold text-slate-900 text-sm">{item.producto.nombre}</span>
                                        <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-bold rounded-md text-[10px]">
                                            {item.producto.categoria}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div>
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Identificador / Serie:</span>
                                            {item.unidad ? (
                                                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-md border border-rose-200 inline-block mt-0.5">
                                                    {item.unidad.codigo_unidad}
                                                </span>
                                            ) : (
                                                <span className="text-slate-600 font-semibold">Stock Genérico</span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Cantidad:</span>
                                            <span className="text-sm font-extrabold text-slate-900">{item.cantidad} u.</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-700">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Categoría</th>
                                        <th className="px-4 py-3">Producto / Insumo</th>
                                        <th className="px-4 py-3">N° Serie / Unidad</th>
                                        <th className="px-4 py-3">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comodato.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 font-semibold text-xs text-slate-600">{item.producto.categoria}</td>
                                            <td className="px-4 py-3 font-bold text-slate-900">{item.producto.nombre}</td>
                                            <td className="px-4 py-3">
                                                {item.unidad ? (
                                                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-md border border-rose-200">
                                                        {item.unidad.codigo_unidad}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500 font-medium">Stock Genérico</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-slate-900">{item.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Timeline of Inventory Movements */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Historial de Movimientos de Inventario
                        </h3>

                        <div className="space-y-3">
                            {comodato.movimientos.map((mov) => (
                                <div key={mov.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                                                mov.tipo === 'salida' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                                            }`}>
                                                {mov.tipo}
                                            </span>
                                            <span className="text-xs font-bold text-slate-800">
                                                {new Date(mov.fecha).toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-600">{mov.observaciones}</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500">
                                        Usuario: {mov.usuario?.name || 'Sistema'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Devolución */}
            {showModalDevolucion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Registrar Devolución de Comodato</h3>
                            <button onClick={() => setShowModalDevolucion(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleDevolucion} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Real de Devolución *</label>
                                <input
                                    type="date"
                                    required
                                    value={dataDev.fecha_devolucion_real}
                                    onChange={(e) => setDataDev('fecha_devolucion_real', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones del Estado de Recepción</label>
                                <textarea
                                    rows={3}
                                    placeholder="Ej: Equipos recibidos limpios y funcionales. Sanitización realizada."
                                    value={dataDev.observaciones_devolucion}
                                    onChange={(e) => setDataDev('observaciones_devolucion', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={procDev}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-2xs transition-all text-sm"
                            >
                                Confirmar Devolución y Restablecer Stock
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Subir Firma Escaneada */}
            {showModalFirmado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">Subir Escaneo / Foto del Contrato Firmado</h3>
                            <button onClick={() => setShowModalFirmado(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleUploadFirmado} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Archivo PDF o Imagen Firmada *</label>
                                <input
                                    type="file"
                                    required
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setDataFirm('documento_firmado', e.target.files[0])}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                                />
                                {errFirm.documento_firmado && <p className="text-red-600 text-xs mt-1">{errFirm.documento_firmado}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={procFirm}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-2xs transition-all text-sm"
                            >
                                Adjuntar Documento Firmado
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
