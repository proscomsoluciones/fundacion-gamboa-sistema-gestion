import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { formatDateOnly } from '@/Utils/dates';

export default function Index({
    filtros = {},
    metricasPeriodo = {},
    entregasDetalle = [],
    stockPorCategoria = [],
    unidadesPorEstado = [],
    comodatosPorEstado = [],
    totalBeneficiarios = 0,
    productosMasPrestados = []
}) {
    const [periodoMode, setPeriodoMode] = useState(filtros.periodo || 'este_mes');
    const [fechaInicio, setFechaInicio] = useState(filtros.fecha_inicio || '');
    const [fechaFin, setFechaFin] = useState(filtros.fecha_fin || '');
    const [mesSel, setMesSel] = useState(filtros.mes || new Date().getMonth() + 1);
    const [anoSel, setAnoSel] = useState(filtros.ano || new Date().getFullYear());

    const countUnidades = (estado) => {
        const item = unidadesPorEstado.find(u => u.estado === estado);
        return item ? item.total : 0;
    };

    const countComodatos = (estado) => {
        const item = comodatosPorEstado.find(c => c.estado === estado);
        return item ? item.total : 0;
    };

    const handleApplyFilter = (newMode = periodoMode) => {
        setPeriodoMode(newMode);
        router.get(
            route('reportes.index'),
            {
                periodo: newMode,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                mes: mesSel,
                ano: anoSel,
            },
            { preserveState: true, replace: true }
        );
    };

    const meses = [
        { id: 1, nombre: 'Enero' },
        { id: 2, nombre: 'Febrero' },
        { id: 3, nombre: 'Marzo' },
        { id: 4, nombre: 'Abril' },
        { id: 5, nombre: 'Mayo' },
        { id: 6, nombre: 'Junio' },
        { id: 7, nombre: 'Julio' },
        { id: 8, nombre: 'Agosto' },
        { id: 9, nombre: 'Septiembre' },
        { id: 10, nombre: 'Octubre' },
        { id: 11, nombre: 'Noviembre' },
        { id: 12, nombre: 'Diciembre' },
    ];

    const anos = [2024, 2025, 2026, 2027];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-0.5">Indicadores & Auditoría</span>
                        <h1 className="text-2xl font-bold text-slate-900">Centro de Reportes y Estadísticas</h1>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                        {/* Acrobat Red PDF button for active period */}
                        <a
                            href={route('reportes.comodatos.pdf', {
                                fecha_inicio: filtros.fecha_inicio,
                                fecha_fin: filtros.fecha_fin,
                                nombre_periodo: filtros.nombrePeriodo,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            className="col-span-1 sm:col-auto h-11 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md text-center whitespace-nowrap"
                            title={`Descargar Reporte PDF de ${filtros.nombrePeriodo}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>Reporte PDF</span>
                        </a>

                        {/* Native Excel Green button */}
                        <a
                            href={route('comodatos.export.excel')}
                            className="col-span-1 sm:col-auto h-11 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md text-center whitespace-nowrap"
                            title="Descargar Planilla Excel Completa (.xls)"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Planilla Excel</span>
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Reportes por Período — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* CONTROL PANEL DE FILTRADO POR PERÍODO */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                            <div>
                                <span className="text-xs font-black text-rose-600 uppercase tracking-widest block">Selección de Período</span>
                                <h3 className="text-lg font-bold text-slate-900">¿Qué rango de fechas deseas auditar?</h3>
                            </div>
                            <span className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-extrabold text-rose-700 flex items-center space-x-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Evaluando: {filtros.nombrePeriodo}</span>
                            </span>
                        </div>

                        {/* Preset Buttons */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleApplyFilter('este_mes')}
                                className={`col-span-1 sm:col-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 ${
                                    periodoMode === 'este_mes'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Mes Actual</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleApplyFilter('mes_anterior')}
                                className={`col-span-1 sm:col-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 ${
                                    periodoMode === 'mes_anterior'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                </svg>
                                <span>Mes Anterior</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleApplyFilter('ano_actual')}
                                className={`col-span-1 sm:col-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 ${
                                    periodoMode === 'ano_actual'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4m14 0h-4m2 2V3m-2 16h4m-2 2v-4M5 21h-4m2-2v4m0-6V9a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <span>Año Actual ({anoSel})</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPeriodoMode('mensual')}
                                className={`col-span-1 sm:col-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 ${
                                    periodoMode === 'mensual'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Seleccionar Mes</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPeriodoMode('personalizado')}
                                className={`col-span-2 sm:col-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center space-x-1.5 ${
                                    periodoMode === 'personalizado'
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>Rango Libre</span>
                            </button>
                        </div>

                        {/* Custom Selectors depending on mode */}
                        {periodoMode === 'mensual' && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-end gap-3 animate-fade-in">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Selecciona el Mes</label>
                                    <select
                                        value={mesSel}
                                        onChange={(e) => setMesSel(parseInt(e.target.value, 10))}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    >
                                        {meses.map(m => (
                                            <option key={m.id} value={m.id}>{m.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full sm:w-40">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Año</label>
                                    <select
                                        value={anoSel}
                                        onChange={(e) => setAnoSel(parseInt(e.target.value, 10))}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    >
                                        {anos.map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleApplyFilter('mensual')}
                                    className="w-full sm:w-auto px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-2xs whitespace-nowrap"
                                >
                                    Generar Reporte Mensual
                                </button>
                            </div>
                        )}

                        {periodoMode === 'personalizado' && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-end gap-3 animate-fade-in">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Desde *</label>
                                    <input
                                        type="date"
                                        required
                                        value={fechaInicio}
                                        onChange={(e) => setFechaInicio(e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    />
                                </div>

                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Hasta *</label>
                                    <input
                                        type="date"
                                        required
                                        value={fechaFin}
                                        onChange={(e) => setFechaFin(e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleApplyFilter('personalizado')}
                                    className="w-full sm:w-auto px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-2xs whitespace-nowrap"
                                >
                                    Filtrar Rango
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📊 MÉTRICAS EJECUTIVAS DEL PERÍODO SELECCIONADO */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900">
                                Indicadores del Período ({filtros.nombrePeriodo})
                            </h3>
                            <a
                                href={route('reportes.comodatos.pdf', {
                                    fecha_inicio: filtros.fecha_inicio,
                                    fecha_fin: filtros.fecha_fin,
                                    nombre_periodo: filtros.nombrePeriodo,
                                })}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center space-x-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>Imprimir Informe PDF del Período →</span>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            
                            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Entregas en Período</span>
                                <div className="text-3xl font-extrabold text-slate-900">{metricasPeriodo.entregas}</div>
                                <p className="text-xs text-slate-500 font-medium">Equipos y entregas registradas</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Devoluciones Recibidas</span>
                                <div className="text-3xl font-extrabold text-emerald-600">{metricasPeriodo.devoluciones}</div>
                                <p className="text-xs text-emerald-700/80 font-medium">Equipos devueltos a taller</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nuevos Beneficiarios</span>
                                <div className="text-3xl font-extrabold text-slate-900">{metricasPeriodo.nuevosBeneficiarios}</div>
                                <p className="text-xs text-slate-500 font-medium">Familias registradas en el rango</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Insumos Entregados</span>
                                <div className="text-3xl font-extrabold text-amber-600">{metricasPeriodo.insumosEntregados} u.</div>
                                <p className="text-xs text-amber-700/80 font-medium">Pañales, sabanillas y consumibles</p>
                            </div>

                        </div>
                    </div>

                    {/* Tabla de Entregas Realizadas en el Período */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Entregas Realizadas en el Período</h3>
                                <p className="text-xs text-slate-500">Nómina de fichas registradas entre {filtros.fecha_inicio} y {filtros.fecha_fin}</p>
                            </div>
                            <Link href={route('comodatos.index')} className="text-xs font-bold text-rose-600 hover:underline">
                                Ver Gestor Completo →
                            </Link>
                        </div>

                        {/* 📱 MOBILE VIEW: Cards for Small & Medium Screens */}
                        <div className="block lg:hidden space-y-3">
                            {entregasDetalle.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                                    No se encontraron entregas en el período seleccionado ({filtros.nombrePeriodo}).
                                </div>
                            ) : (
                                entregasDetalle.map((c) => (
                                    <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2.5">
                                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                                            <span className="px-2.5 py-1 bg-white text-slate-900 font-extrabold text-xs rounded-lg border border-slate-200">
                                                {c.codigo}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                                c.estado === 'activo' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {c.estado === 'activo' ? 'En Uso' : 'Devuelto'}
                                            </span>
                                        </div>

                                        <div className="text-xs">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Beneficiario:</span>
                                            <span className="font-bold text-slate-900 text-sm">{c.beneficiario.nombre}</span>
                                        </div>

                                        <div className="text-xs">
                                            <span className="text-slate-400 font-bold block text-[10px] uppercase">Equipos Entregados:</span>
                                            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 mt-0.5 space-y-0.5 font-semibold text-slate-800">
                                                {c.items.map((item, idx) => (
                                                    <div key={idx}>• {item.producto.nombre}</div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-xs text-slate-500 font-medium pt-1 flex justify-between items-center border-t border-slate-200/60">
                                            <span>Fecha: <strong>{formatDateOnly(c.fecha_entrega)}</strong></span>
                                            <Link href={route('comodatos.show', c.id)} className="text-rose-600 font-bold text-xs hover:underline">
                                                Ver Ficha →
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3">Código</th>
                                        <th className="px-4 py-3">Beneficiario</th>
                                        <th className="px-4 py-3">Equipo Entregado</th>
                                        <th className="px-4 py-3">Fecha Entrega</th>
                                        <th className="px-4 py-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {entregasDetalle.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-xs text-slate-400">
                                                No se encontraron entregas en el período seleccionado ({filtros.nombrePeriodo}).
                                            </td>
                                        </tr>
                                    ) : (
                                        entregasDetalle.map((c) => (
                                            <tr key={c.id} className="hover:bg-slate-50/70">
                                                <td className="px-4 py-3 font-bold text-slate-900">{c.codigo}</td>
                                                <td className="px-4 py-3 font-semibold text-slate-800">{c.beneficiario.nombre}</td>
                                                <td className="px-4 py-3 text-xs">
                                                    {c.items.map((item, idx) => (
                                                        <span key={idx} className="block">• {item.producto.nombre}</span>
                                                    ))}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-medium">
                                                    {formatDateOnly(c.fecha_entrega)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                                                        c.estado === 'activo' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    }`}>
                                                        {c.estado === 'activo' ? 'En Uso' : 'Devuelto'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stock por Categoría y Equipos más Demandados */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Categorías Table */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-base font-bold text-slate-900">Existencias por Categoría</h3>
                                <a
                                    href={route('productos.reporte.pdf')}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-bold text-rose-600 hover:underline inline-flex items-center space-x-1"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>PDF Stock</span>
                                </a>
                            </div>

                            <div className="space-y-3">
                                {stockPorCategoria.map((cat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                        <div className="flex items-center space-x-2.5">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            <span className="font-bold text-slate-800 text-sm">{cat.categoria}</span>
                                        </div>
                                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-extrabold text-slate-900">
                                            {cat.total_productos} tipo(s)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Productos Más Prestados */}
                        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="text-base font-bold text-slate-900">Equipos Más Solicitados en el Período</h3>
                                <Link href={route('comodatos.index')} className="text-xs font-bold text-rose-600 hover:underline">
                                    Ver Entregas →
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {productosMasPrestados.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-500">No hay salidas registradas en este período.</div>
                                ) : (
                                    productosMasPrestados.map((prod, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                            <div className="space-y-0.5">
                                                <div className="font-bold text-slate-900 text-sm">{prod.nombre}</div>
                                                <span className="text-xs text-slate-500 font-medium">{prod.categoria}</span>
                                            </div>
                                            <span className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-lg text-xs font-extrabold text-rose-700">
                                                {prod.movimientos_count} salida(s)
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Modal para ingresar stock rápido o reportes */}
        </AuthenticatedLayout>
    );
}
