import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { showAlert } from '@/Utils/alerts';

export default function ModalTraslado({ isOpen, onClose, productos = [], sucursales = [], userSucursalId = 1 }) {
    const [selectedProducto, setSelectedProducto] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        sucursal_origen_id: userSucursalId || 1,
        sucursal_destino_id: '',
        producto_id: '',
        tipo: 'serializado',
        unidades_ids: [],
        cantidad: 1,
        observaciones: '',
    });

    useEffect(() => {
        if (data.producto_id) {
            const prod = productos.find(p => p.id === parseInt(data.producto_id));
            setSelectedProducto(prod || null);
            if (prod) {
                setData(d => ({
                    ...d,
                    tipo: prod.tipo,
                    unidades_ids: [],
                    cantidad: 1,
                }));
            }
        } else {
            setSelectedProducto(null);
        }
    }, [data.producto_id, productos]);

    if (!isOpen) return null;

    const availableSucursalesDestino = sucursales.filter(s => s.id !== parseInt(data.sucursal_origen_id));

    // Stock & Unidades en la sucursal de origen seleccionada
    const unidadesDisponiblesOrigen = selectedProducto && selectedProducto.tipo === 'serializado'
        ? (selectedProducto.unidades || []).filter(u => u.sucursal_id === parseInt(data.sucursal_origen_id) && u.estado === 'disponible')
        : [];

    const stockGenericoOrigenObj = selectedProducto && selectedProducto.tipo === 'stock_generico'
        ? (selectedProducto.stocks_sucursales || []).find(st => st.sucursal_id === parseInt(data.sucursal_origen_id))
        : null;

    const stockGenericoOrigenDisponible = stockGenericoOrigenObj ? stockGenericoOrigenObj.stock_disponible : (selectedProducto ? selectedProducto.stock_generico_disponible : 0);

    const toggleUnidad = (id) => {
        const idNum = parseInt(id);
        const current = [...data.unidades_ids];
        const index = current.indexOf(idNum);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(idNum);
        }
        setData('unidades_ids', current);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('inventario.traslados.store'), {
            onSuccess: () => {
                showAlert({
                    title: '¡Traslado Realizado!',
                    text: 'El inventario ha sido transferido a la sucursal de destino correctamente.',
                    icon: 'success'
                });
                reset();
                onClose();
            },
            onError: (errs) => {
                const msg = Object.values(errs).join('\n') || 'No se pudo procesar el traslado.';
                showAlert({
                    title: 'Error en el Traslado',
                    text: msg,
                    icon: 'error'
                });
            }
        });
    };

    const selectFirstNUnits = (n) => {
        const count = parseInt(n, 10) || 0;
        const firstN = unidadesDisponiblesOrigen.slice(0, count).map(u => u.id);
        setData('unidades_ids', firstN);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                Traslado de Inventario entre Sedes
                            </h3>
                            <p className="text-xs text-slate-500">
                                Asignación y movimiento de stock (individual o por cantidad) desde origen hacia el destino.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* Origen y Destino */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Sede Origen <span className="text-rose-600">*</span>
                            </label>
                            <select
                                value={data.sucursal_origen_id}
                                onChange={(e) => setData('sucursal_origen_id', e.target.value)}
                                className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                            >
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.nombre} {s.es_casa_matriz ? '(Sede Central)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Sede Destino <span className="text-rose-600">*</span>
                            </label>
                            <select
                                required
                                value={data.sucursal_destino_id}
                                onChange={(e) => setData('sucursal_destino_id', e.target.value)}
                                className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                            >
                                <option value="">-- Seleccionar Destino --</option>
                                {availableSucursalesDestino.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.nombre} ({s.codigo})
                                    </option>
                                ))}
                            </select>
                            {errors.sucursal_destino_id && <p className="text-rose-600 text-xs mt-1">{errors.sucursal_destino_id}</p>}
                        </div>
                    </div>

                    {/* Producto Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Seleccionar Producto a Trasladar <span className="text-rose-600">*</span>
                        </label>
                        <select
                            required
                            value={data.producto_id}
                            onChange={(e) => setData('producto_id', e.target.value)}
                            className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                        >
                            <option value="">-- Buscar por Nombre o Código --</option>
                            {productos.map(p => (
                                <option key={p.id} value={p.id}>
                                    [{p.codigo}] {p.nombre} ({p.tipo === 'serializado' ? 'N° Serie' : 'Stock Genérico'})
                                </option>
                            ))}
                        </select>
                        {errors.producto_id && <p className="text-rose-600 text-xs mt-1">{errors.producto_id}</p>}
                    </div>

                    {/* Detalle según tipo de producto */}
                    {selectedProducto && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                            {selectedProducto.tipo === 'serializado' ? (
                                <div>
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Unidades Disponibles en Origen ({unidadesDisponiblesOrigen.length})
                                        </label>

                                        <div className="flex items-center space-x-2 text-xs">
                                            <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                                {data.unidades_ids.length} Seleccionadas
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setData('unidades_ids', unidadesDisponiblesOrigen.map(u => u.id))}
                                                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 font-bold rounded-lg text-[11px] text-slate-800 transition-colors"
                                            >
                                                Todas
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('unidades_ids', [])}
                                                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 font-bold rounded-lg text-[11px] text-slate-800 transition-colors"
                                            >
                                                Limpiar
                                            </button>
                                        </div>
                                    </div>

                                    {unidadesDisponiblesOrigen.length > 0 && (
                                        <div className="mb-3 flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 text-xs">
                                            <span className="font-bold text-slate-700">⚡ Marcar Cantidad:</span>
                                            {[1, 2, 4, 5, 10].map(qty => (
                                                <button
                                                    key={qty}
                                                    type="button"
                                                    onClick={() => selectFirstNUnits(qty)}
                                                    disabled={qty > unidadesDisponiblesOrigen.length}
                                                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-lg border border-rose-200 disabled:opacity-30 transition-colors"
                                                >
                                                    Enviar {qty}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {unidadesDisponiblesOrigen.length === 0 ? (
                                        <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                            ⚠️ No hay unidades serializadas 'Disponibles' de este equipo en la sucursal de origen seleccionada.
                                        </p>
                                    ) : (
                                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                            {unidadesDisponiblesOrigen.map(u => {
                                                const isSelected = data.unidades_ids.includes(u.id);
                                                return (
                                                    <div
                                                        key={u.id}
                                                        onClick={() => toggleUnidad(u.id)}
                                                        className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all ${
                                                            isSelected
                                                                ? 'bg-rose-50 border-rose-400 text-rose-900 font-medium'
                                                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                readOnly
                                                                className="rounded-xs text-rose-600 focus:ring-rose-500 pointer-events-none"
                                                            />
                                                            <span className="font-mono text-sm">{u.codigo_unidad}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-400">
                                                            {u.estado_fisico || 'Buen estado'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                            Cantidad a Trasladar
                                        </label>
                                        <span className="text-xs font-semibold text-emerald-700">
                                            Disponible en Origen: {stockGenericoOrigenDisponible} unidades
                                        </span>
                                    </div>

                                    <input
                                        type="number"
                                        min="1"
                                        max={stockGenericoOrigenDisponible}
                                        value={data.cantidad}
                                        onChange={(e) => setData('cantidad', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                                    />
                                    {errors.cantidad && <p className="text-rose-600 text-xs mt-1">{errors.cantidad}</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Observaciones / Motivo del Traslado
                        </label>
                        <textarea
                            rows="2"
                            value={data.observaciones}
                            onChange={(e) => setData('observaciones', e.target.value)}
                            placeholder="Ej: Reasignación de stock para atención de demanda local en sucursal..."
                            className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing || (selectedProducto?.tipo === 'serializado' && data.unidades_ids.length === 0)}
                            className="px-5 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all disabled:opacity-50 inline-flex items-center gap-2"
                        >
                            <span>🔄</span>
                            Confirmar Traslado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
