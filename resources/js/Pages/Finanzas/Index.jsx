import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { showConfirm, showAlert } from '@/Utils/alerts';

export default function Index({
    movimientos = [],
    totales = {},
    filtros = {},
    categoriasUnicas = [],
    proyectosUnicos = [],
    listaProyectos = [],
    gastosPorCategoria = [],
    resumenPorProyecto = [],
    categoriasIngreso = [],
    categoriasEgreso = [],
}) {
    const [periodo, setPeriodo] = useState(filtros.periodo || 'este_mes');
    const [mes, setMes] = useState(filtros.mes || new Date().getMonth() + 1);
    const [ano, setAno] = useState(filtros.ano || new Date().getFullYear());
    const [fechaInicio, setFechaInicio] = useState(filtros.fecha_inicio || '');
    const [fechaFin, setFechaFin] = useState(filtros.fecha_fin || '');
    const [tipoFiltro, setTipoFiltro] = useState(filtros.tipo || 'todos');
    const [categoriaFiltro, setCategoriaFiltro] = useState(filtros.categoria || '');
    const [proyectoFiltro, setProyectoFiltro] = useState(filtros.proyecto || '');
    const [search, setSearch] = useState(filtros.search || '');

    // Modals state
    const [showIngresoModal, setShowIngresoModal] = useState(false);
    const [showEgresoModal, setShowEgresoModal] = useState(false);
    const [showProyectosModal, setShowProyectosModal] = useState(false);
    const [editingMovimiento, setEditingMovimiento] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [movimientoToDelete, setMovimientoToDelete] = useState(null);

    // Preview photo modal
    const [previewFile, setPreviewFile] = useState(null);

    // Form for movement create / edit
    const { data, setData, post, processing, errors, reset } = useForm({
        tipo: 'egreso',
        concepto: '',
        categoria: '',
        proyecto: 'Fondo General / Operación',
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: '',
        comprobante: null,
    });

    // Form for project create
    const {
        data: projData,
        setData: setProjData,
        post: postProj,
        processing: processingProj,
        errors: projErrors,
        reset: resetProj,
    } = useForm({
        nombre: '',
        codigo: '',
        descripcion: '',
        presupuesto_total: '',
    });

    const handleFilterChange = (newParams = {}) => {
        router.get(
            route('finanzas.index'),
            {
                periodo: newParams.periodo !== undefined ? newParams.periodo : periodo,
                mes: newParams.mes !== undefined ? newParams.mes : mes,
                ano: newParams.ano !== undefined ? newParams.ano : ano,
                fecha_inicio: newParams.fecha_inicio !== undefined ? newParams.fecha_inicio : fechaInicio,
                fecha_fin: newParams.fecha_fin !== undefined ? newParams.fecha_fin : fechaFin,
                tipo: newParams.tipo !== undefined ? newParams.tipo : tipoFiltro,
                categoria: newParams.categoria !== undefined ? newParams.categoria : categoriaFiltro,
                proyecto: newParams.proyecto !== undefined ? newParams.proyecto : proyectoFiltro,
                search: newParams.search !== undefined ? newParams.search : search,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleOpenCreateIngreso = () => {
        setEditingMovimiento(null);
        reset();
        const defaultProj = listaProyectos.length > 0 ? listaProyectos[0].nombre : 'Fondo General / Operación';
        setData({
            tipo: 'ingreso',
            concepto: '',
            categoria: '',
            proyecto: defaultProj,
            monto: '',
            fecha: new Date().toISOString().split('T')[0],
            observaciones: '',
            comprobante: null,
        });
        setShowIngresoModal(true);
    };

    const handleOpenCreateEgreso = () => {
        setEditingMovimiento(null);
        reset();
        const defaultProj = listaProyectos.length > 0 ? listaProyectos[0].nombre : 'Fondo General / Operación';
        setData({
            tipo: 'egreso',
            concepto: '',
            categoria: '',
            proyecto: defaultProj,
            monto: '',
            fecha: new Date().toISOString().split('T')[0],
            observaciones: '',
            comprobante: null,
        });
        setShowEgresoModal(true);
    };

    const handleOpenEdit = (mov) => {
        setEditingMovimiento(mov);
        setData({
            tipo: mov.tipo,
            concepto: mov.concepto,
            categoria: mov.categoria,
            proyecto: mov.proyecto || 'Fondo General / Operación',
            monto: mov.monto,
            fecha: mov.fecha,
            observaciones: mov.observaciones || '',
            comprobante: null,
        });
        if (mov.tipo === 'ingreso') {
            setShowIngresoModal(true);
        } else {
            setShowEgresoModal(true);
        }
    };

    const handleSubmitIngreso = (e) => {
        e.preventDefault();
        const submitData = { ...data, tipo: 'ingreso' };
        if (editingMovimiento) {
            router.post(route('finanzas.update', editingMovimiento.id), {
                _method: 'put',
                ...submitData,
            }, {
                onSuccess: () => {
                    reset();
                    setShowIngresoModal(false);
                }
            });
        } else {
            post(route('finanzas.store'), {
                onSuccess: () => {
                    reset();
                    setShowIngresoModal(false);
                }
            });
        }
    };

    const handleSubmitEgreso = (e) => {
        e.preventDefault();
        const submitData = { ...data, tipo: 'egreso' };
        if (editingMovimiento) {
            router.post(route('finanzas.update', editingMovimiento.id), {
                _method: 'put',
                ...submitData,
            }, {
                onSuccess: () => {
                    reset();
                    setShowEgresoModal(false);
                }
            });
        } else {
            post(route('finanzas.store'), {
                onSuccess: () => {
                    reset();
                    setShowEgresoModal(false);
                }
            });
        }
    };

    const handleSubmitProyecto = (e) => {
        e.preventDefault();
        postProj(route('finanzas.proyectos.store'), {
            onSuccess: () => {
                resetProj();
            }
        });
    };

    const handleDeleteProyecto = async (projId) => {
        if (!projId) return;
        const confirmed = await showConfirm({
            title: '¿Eliminar Proyecto?',
            text: '¿Deseas eliminar este proyecto registrado de la nómina?',
            confirmText: 'Sí, eliminar',
            cancelText: 'Cancelar',
            danger: true
        });
        if (confirmed) {
            router.delete(route('finanzas.proyectos.destroy', projId));
        }
    };

    const handleOpenDelete = (mov) => {
        setMovimientoToDelete(mov);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (!movimientoToDelete) return;
        router.delete(route('finanzas.destroy', movimientoToDelete.id), {
            onSuccess: () => {
                setMovimientoToDelete(null);
                setShowDeleteModal(false);
            }
        });
    };

    const handleExportPdf = () => {
        const url = route('finanzas.pdf', {
            periodo,
            mes,
            ano,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            tipo: tipoFiltro,
            proyecto: proyectoFiltro,
            nombre_periodo: filtros.nombrePeriodo,
        });
        window.open(url, '_blank');
    };

    const handleExportProyectoPdf = (nombreProyecto) => {
        const url = route('finanzas.pdf', {
            periodo: 'ano_actual',
            proyecto: nombreProyecto,
            nombre_periodo: `Rendición de Cuentas Oficial del Proyecto — ${nombreProyecto}`,
        });
        window.open(url, '_blank');
    };

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Cálculos dinámicos de saldo de presupuesto en modal de Egreso
    const selectedProyectoMeta = listaProyectos.find(p => p.nombre === data.proyecto);
    const maxPresupuesto = selectedProyectoMeta ? selectedProyectoMeta.presupuesto_total : 0;
    const totalGastadoHist = selectedProyectoMeta ? selectedProyectoMeta.total_egresos : 0;
    const currentEditingMonto = editingMovimiento && editingMovimiento.tipo === 'egreso' && editingMovimiento.proyecto === data.proyecto ? (editingMovimiento.monto || 0) : 0;
    const egresosAcumuladosSinActual = Math.max(0, totalGastadoHist - currentEditingMonto);
    const saldoDisponibleEst = maxPresupuesto > 0 ? (maxPresupuesto - egresosAcumuladosSinActual) : (selectedProyectoMeta ? selectedProyectoMeta.saldo_disponible : 0);
    const montoIngresado = parseFloat(data.monto) || 0;
    const isExcedido = maxPresupuesto > 0 && montoIngresado > saldoDisponibleEst;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-0.5">Control Contable & Libro de Respaldos</span>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Módulo de Finanzas</h1>
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                        <button
                            onClick={handleOpenCreateIngreso}
                            className="col-span-1 sm:col-auto px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs text-center"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Ingreso</span>
                        </button>

                        <button
                            onClick={handleOpenCreateEgreso}
                            className="col-span-1 sm:col-auto px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs text-center"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                            <span>Egreso</span>
                        </button>

                        <button
                            onClick={() => setShowProyectosModal(true)}
                            className="col-span-2 sm:col-auto px-3.5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs text-center"
                            title="Gestionar Proyectos y Presupuestos"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <span>Proyectos</span>
                        </button>

                        <button
                            onClick={handleExportPdf}
                            className="col-span-2 sm:col-auto px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs text-center"
                            title="Exportar Libro de Respaldos PDF"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>Libro PDF</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Finanzas & Respaldos — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* KPI CARDS (FINANCIAL SUMMARY) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Total Ingresos */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Ingresos Período</span>
                            <div className="text-2xl font-black text-emerald-600">
                                {totales.ingresos_formatted}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
                                {filtros.nombrePeriodo}
                            </span>
                        </div>

                        {/* Total Egresos */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-full bg-rose-500"></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Total Egresos Período</span>
                            <div className="text-2xl font-black text-rose-600">
                                {totales.egresos_formatted}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
                                {filtros.nombrePeriodo}
                            </span>
                        </div>

                        {/* Balance Neto */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-2 h-full ${totales.balance >= 0 ? 'bg-blue-600' : 'bg-rose-600'}`}></div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Balance Neto Período</span>
                            <div className={`text-2xl font-black ${totales.balance >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                                {totales.balance_formatted}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
                                {totales.balance >= 0 ? '✓ Saldo Positivo' : '⚠️ Déficit en Período'}
                            </span>
                        </div>
                    </div>

                    {/* RESUMEN FINANCIERO POR PROYECTO / FONDO */}
                    {resumenPorProyecto.length > 0 && (
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                                    <span>📁</span>
                                    <span>Ejecución Presupuestaria por Proyecto / Fondo</span>
                                </span>
                                <button
                                    onClick={() => setShowProyectosModal(true)}
                                    className="text-[11px] text-indigo-700 font-extrabold hover:underline flex items-center space-x-1"
                                >
                                    <span>+ Crear / Configurar Presupuestos</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {resumenPorProyecto.map((p, idx) => {
                                    const meta = listaProyectos.find(item => item.nombre === p.proyecto);
                                    const tienePresupuesto = meta && meta.presupuesto_total > 0;
                                    const pct = tienePresupuesto ? Math.min(100, Math.round((meta.total_egresos / meta.presupuesto_total) * 100)) : 0;

                                    return (
                                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between h-full min-h-[200px] shadow-2xs">
                                            {/* Header del Card */}
                                            <div className="font-extrabold text-slate-900 text-xs flex items-center justify-between gap-2">
                                                <span className="truncate max-w-[170px]" title={p.proyecto}>📌 {p.proyecto}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${p.balance >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                    {p.balance >= 0 ? '✓ Positivo' : '⚠️ Déficit'}
                                                </span>
                                            </div>

                                            {/* Ranura de Estado de Presupuesto (Altura Fija de 48px para perfecta alineación visual) */}
                                            <div className="my-2 h-[48px] flex flex-col justify-center">
                                                {tienePresupuesto ? (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                                            <span>Presupuesto Límite: {meta.presupuesto_total_formatted}</span>
                                                            <span>{pct}% Gastado</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all ${pct > 90 ? 'bg-red-600' : (pct > 70 ? 'bg-amber-500' : 'bg-emerald-600')}`}
                                                                style={{ width: `${pct}%` }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-[10px] font-black text-right text-emerald-700">
                                                            Saldo Disp: {meta.saldo_disponible_formatted}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                                            <span>Operación General Fundación</span>
                                                            <span>Continuo</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-slate-300 w-full"></div>
                                                        </div>
                                                        <div className="text-[10px] font-bold text-right text-slate-400">
                                                            Fondo Operacional Continuo
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bloque Inferior: Desglose + Botón de Rendición (Alineados al pie) */}
                                            <div className="space-y-2 mt-auto">
                                                <div className="grid grid-cols-3 gap-1 text-[11px] font-bold border-t border-slate-200 pt-2 text-center">
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Ingresos</span>
                                                        <span className="text-emerald-700">{p.ingresos_formatted}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Egresos</span>
                                                        <span className="text-rose-700">{p.egresos_formatted}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-slate-400 uppercase font-semibold">Balance</span>
                                                        <span className={p.balance >= 0 ? 'text-slate-900 font-black' : 'text-rose-600 font-black'}>{p.balance_formatted}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleExportProyectoPdf(p.proyecto)}
                                                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition-colors flex items-center justify-center space-x-1 shadow-2xs"
                                                    title={`Descargar Rendición de Cuentas PDF de ${p.proyecto}`}
                                                >
                                                    <span>📄 Rendición PDF del Proyecto</span>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* FILTER TOOLBAR */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                                <span>🔍</span>
                                <span>Filtros de Período, Proyecto y Búsqueda</span>
                            </span>
                            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                                {filtros.nombrePeriodo}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
                            {/* Selector de Período */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">Período</label>
                                <select
                                    value={periodo}
                                    onChange={(e) => {
                                        setPeriodo(e.target.value);
                                        handleFilterChange({ periodo: e.target.value });
                                    }}
                                    className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                >
                                    <option value="este_mes">Mes Actual</option>
                                    <option value="mes_anterior">Mes Anterior</option>
                                    <option value="ano_actual">Año Completo</option>
                                    <option value="mensual">Seleccionar Mes/Año</option>
                                    <option value="personalizado">Rango Personalizado</option>
                                </select>
                            </div>

                            {/* Filtro Mes/Año condicional */}
                            {periodo === 'mensual' && (
                                <>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Mes</label>
                                        <select
                                            value={mes}
                                            onChange={(e) => {
                                                setMes(e.target.value);
                                                handleFilterChange({ mes: e.target.value });
                                            }}
                                            className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                        >
                                            {monthNames.map((m, idx) => (
                                                <option key={idx + 1} value={idx + 1}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Año</label>
                                        <input
                                            type="number"
                                            value={ano}
                                            onChange={(e) => setAno(e.target.value)}
                                            onBlur={() => handleFilterChange({ ano })}
                                            className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Rango Personalizado */}
                            {periodo === 'personalizado' && (
                                <>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Desde</label>
                                        <input
                                            type="date"
                                            value={fechaInicio}
                                            onChange={(e) => setFechaInicio(e.target.value)}
                                            onBlur={() => handleFilterChange({ fecha_inicio: fechaInicio })}
                                            className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Hasta</label>
                                        <input
                                            type="date"
                                            value={fechaFin}
                                            onChange={(e) => setFechaFin(e.target.value)}
                                            onBlur={() => handleFilterChange({ fecha_fin: fechaFin })}
                                            className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Filtro Tipo */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tipo Movimiento</label>
                                <select
                                    value={tipoFiltro}
                                    onChange={(e) => {
                                        setTipoFiltro(e.target.value);
                                        handleFilterChange({ tipo: e.target.value });
                                    }}
                                    className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                >
                                    <option value="todos">Todos (Ingresos + Egresos)</option>
                                    <option value="egreso">Solo Egresos</option>
                                    <option value="ingreso">Solo Ingresos</option>
                                </select>
                            </div>

                            {/* Filtro Proyecto / Fondo */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">Proyecto / Fondo</label>
                                <select
                                    value={proyectoFiltro}
                                    onChange={(e) => {
                                        setProyectoFiltro(e.target.value);
                                        handleFilterChange({ proyecto: e.target.value });
                                    }}
                                    className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                >
                                    <option value="">Todos los Proyectos</option>
                                    {proyectosUnicos.map((p, idx) => (
                                        <option key={idx} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Búsqueda por Concepto / Proyecto */}
                            <div className="sm:col-span-2 md:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">Buscar Concepto o Proyecto</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Sillas de Ruedas, Subvención, Maipú..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilterChange({ search })}
                                    className="w-full text-xs font-bold rounded-xl border-slate-200 text-slate-900 bg-slate-50 focus:border-rose-500 focus:ring-rose-500 py-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* MOVEMENTS CONTAINER (RESPONSIVE CARDS FOR MOBILE / TABLE FOR DESKTOP) */}
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 px-6 py-3.5 flex items-center justify-between text-white rounded-2xl border border-rose-950 shadow-2xs">
                            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center space-x-2">
                                <span>📊</span>
                                <span>Detalle de Movimientos Registrados ({movimientos.length})</span>
                            </h2>
                            <span className="text-[11px] font-bold bg-rose-900/80 px-3 py-1 rounded-full text-rose-100 border border-rose-700">
                                Fundación Gamboa
                            </span>
                        </div>

                        {/* 📱 MOBILE VIEW: Cards for Small & Medium Screens */}
                        <div className="block lg:hidden space-y-3">
                            {movimientos.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                                    <div className="text-slate-400 font-medium text-sm">
                                        No se encontraron registros de ingresos o egresos para los filtros seleccionados.
                                    </div>
                                </div>
                            ) : (
                                movimientos.map((m) => (
                                    <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-lg">{m.tipo === 'ingreso' ? '🟢' : '🔴'}</span>
                                                <div>
                                                    <span className="font-bold text-slate-900 text-sm block">{m.concepto}</span>
                                                    <span className="text-[11px] font-semibold text-slate-400">📅 {m.fecha_formatted}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-base font-black ${m.tipo === 'ingreso' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                    {m.tipo === 'ingreso' ? '+' : ''}{m.monto_formatted}
                                                </span>
                                            </div>
                                        </div>

                                        {m.observaciones && (
                                            <div className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                                {m.observaciones}
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                                                🏷️ {m.categoria}
                                            </span>
                                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold">
                                                📁 {m.proyecto}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                                            <div>
                                                {m.comprobante_url ? (
                                                    <button
                                                        onClick={() => setPreviewFile(m)}
                                                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1"
                                                    >
                                                        <span>📷 Ver Respaldo</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                        Sin comprobante
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleOpenEdit(m)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(m)}
                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Structured Table */}
                        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-rose-800 text-white text-xs font-black uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3.5">FECHA</th>
                                            <th className="px-6 py-3.5">CONCEPTO</th>
                                            <th className="px-6 py-3.5">CATEGORÍA</th>
                                            <th className="px-6 py-3.5">PROYECTO / FONDO</th>
                                            <th className="px-6 py-3.5 text-right">MONTO</th>
                                            <th className="px-6 py-3.5 text-center">RESPALDO</th>
                                            <th className="px-6 py-3.5 text-right">ACCIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {movimientos.map((m) => (
                                            <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-900">
                                                    {m.fecha_formatted}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <span>{m.tipo === 'ingreso' ? '🟢' : '🔴'}</span>
                                                        <div>
                                                            <span className="block">{m.concepto}</span>
                                                            {m.observaciones && (
                                                                <span className="text-[11px] font-normal text-slate-500 block leading-tight">
                                                                    {m.observaciones}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                                                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                                                        {m.categoria}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                                                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold">
                                                        {m.proyecto}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap font-bold text-sm">
                                                    <span className={m.tipo === 'ingreso' ? 'text-emerald-600 font-black' : 'text-slate-900 font-black'}>
                                                        {m.tipo === 'ingreso' ? '+' : ''}{m.monto_formatted}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    {m.comprobante_url ? (
                                                        <button
                                                            onClick={() => setPreviewFile(m)}
                                                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1 mx-auto"
                                                        >
                                                            <span>📷</span>
                                                            <span>Ver Respaldo</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                            Sin comprobante
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(m)}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors border border-slate-200"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDelete(m)}
                                                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition-colors border border-rose-200"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                        {movimientos.length === 0 && (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-medium text-sm">
                                                    No se encontraron registros de ingresos o egresos para los filtros seleccionados.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* ============================================================== */}
            {/* MODAL GESTION / CREACION DE PROYECTOS Y PRESUPUESTOS */}
            {/* ============================================================== */}
            {showProyectosModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                            <div>
                                <span className="text-xs font-black uppercase tracking-wider block text-indigo-700">
                                    📁 Gestión de Proyectos y Presupuestos Asignados
                                </span>
                                <h3 className="text-base font-bold text-slate-900">
                                    Registro de Fondos y Proyectos (Límite Máximo de Gastos)
                                </h3>
                            </div>
                            <button onClick={() => setShowProyectosModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        {/* Formulario nuevo proyecto */}
                        <form onSubmit={handleSubmitProyecto} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                            <span className="text-xs font-black text-slate-800 uppercase block">➕ Crear Nuevo Proyecto / Fondo</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Proyecto *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: Fondo GORE Ayudas Técnicas 2026"
                                        value={projData.nombre}
                                        onChange={(e) => setProjData('nombre', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-indigo-500"
                                    />
                                    {projErrors.nombre && <p className="text-red-600 text-[11px] font-bold mt-1">{projErrors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Presupuesto Máximo ($ CLP) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="Ej: 400000"
                                        value={projData.presupuesto_total}
                                        onChange={(e) => setProjData('presupuesto_total', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-indigo-500"
                                    />
                                    {projErrors.presupuesto_total && <p className="text-red-600 text-[11px] font-bold mt-1">{projErrors.presupuesto_total}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Código Identificador (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: PROY-GORE-2026"
                                        value={projData.codigo}
                                        onChange={(e) => setProjData('codigo', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Descripción / Finalidad</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Mantención técnica y repuestos de equipamiento"
                                        value={projData.descripcion}
                                        onChange={(e) => setProjData('descripcion', e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processingProj}
                                className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs"
                            >
                                Registrar Proyecto & Guardar Presupuesto
                            </button>
                        </form>

                        {/* Listado de proyectos creados */}
                        <div className="space-y-2">
                            <span className="text-xs font-black text-slate-800 uppercase block">📋 Proyectos Existentes y Límites Presupuestarios</span>
                            
                            <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100">
                                {listaProyectos.map((p, idx) => (
                                    <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs hover:bg-slate-50">
                                        <div>
                                            <span className="font-extrabold text-slate-900 block">{p.nombre}</span>
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                Presupuesto Límite: <strong className="text-slate-800 font-bold">{p.presupuesto_total_formatted}</strong> | Gastado: <strong className="text-rose-700 font-bold">{p.total_egresos_formatted}</strong>
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3 text-right">
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Saldo Disponible</span>
                                                <span className="font-black text-emerald-700">{p.saldo_disponible_formatted}</span>
                                            </div>
                                            {p.id && (
                                                <button
                                                    onClick={() => handleDeleteProyecto(p.id)}
                                                    className="text-rose-600 hover:text-rose-800 text-xs font-bold p-1"
                                                    title="Eliminar proyecto"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setShowProyectosModal(false)}
                                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                            >
                                Entendido / Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL PREVIEW DE COMPROBANTE / FOTO RESPALDO */}
            {/* ============================================================== */}
            {previewFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="text-left">
                                <span className="text-xs font-bold text-rose-600 uppercase block">Comprobante de Respaldo</span>
                                <h3 className="text-base font-bold text-slate-900">
                                    {previewFile.fecha_formatted} — {previewFile.concepto} ({previewFile.monto_formatted})
                                </h3>
                            </div>
                            <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-auto">
                            {previewFile.is_image ? (
                                <img
                                    src={previewFile.comprobante_url}
                                    alt="Comprobante de respaldo"
                                    className="max-h-[450px] w-auto rounded-xl shadow-md border border-slate-200 object-contain"
                                />
                            ) : (
                                <a
                                    href={previewFile.comprobante_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all inline-flex items-center space-x-2"
                                >
                                    <span>📄 Abrir Documento PDF de Respaldo</span>
                                </a>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setPreviewFile(null)}
                                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Cerrar Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 1: FORMULARIO INDEPENDIENTE DE INGRESO */}
            {/* ============================================================== */}
            {showIngresoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                            <div>
                                <span className="text-xs font-black uppercase tracking-wider block text-emerald-600">
                                    🟢 Registro de Ingreso (Entrada de Dinero)
                                </span>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingMovimiento ? 'Editar Registro de Ingreso' : 'Nuevo Registro de Ingreso'}
                                </h3>
                            </div>
                            <button onClick={() => setShowIngresoModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitIngreso} className="space-y-4">
                            {/* Fecha & Monto */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de la Operación *</label>
                                    <input
                                        type="date"
                                        required
                                        value={data.fecha}
                                        onChange={(e) => setData('fecha', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    {errors.fecha && <p className="text-red-600 text-xs font-bold mt-1">{errors.fecha}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Monto ($ CLP) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="Ej: 3500000"
                                        value={data.monto}
                                        onChange={(e) => setData('monto', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                    {errors.monto && <p className="text-red-600 text-xs font-bold mt-1">{errors.monto}</p>}
                                </div>
                            </div>

                            {/* Concepto */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Concepto / Glosa de Ingreso *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Subvención Municipal Anual I. Municipalidad 2026"
                                    value={data.concepto}
                                    onChange={(e) => setData('concepto', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                {errors.concepto && <p className="text-red-600 text-xs font-bold mt-1">{errors.concepto}</p>}
                            </div>

                            {/* Categoría */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Contable *</label>
                                <input
                                    type="text"
                                    required
                                    list="categorias-ingreso-list"
                                    placeholder="Selecciona o escribe una nueva categoría..."
                                    value={data.categoria}
                                    onChange={(e) => setData('categoria', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                                <datalist id="categorias-ingreso-list">
                                    {categoriasIngreso.map((c, i) => (
                                        <option key={i} value={c} />
                                    ))}
                                </datalist>
                                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                                    💡 Puedes seleccionar una categoría registrada o escribir una nueva. Se guardará automáticamente en la BD.
                                </p>
                                {errors.categoria && <p className="text-red-600 text-xs font-bold mt-1">{errors.categoria}</p>}
                            </div>

                            {/* Proyecto / Fondo (Select dinámico de proyectos registrados) */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-slate-700">Proyecto / Fondo de Destino *</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowProyectosModal(true)}
                                        className="text-[11px] text-indigo-700 font-extrabold hover:underline"
                                    >
                                        + Nuevo Proyecto
                                    </button>
                                </div>
                                <select
                                    required
                                    value={data.proyecto}
                                    onChange={(e) => setData('proyecto', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    {listaProyectos.map((p, i) => (
                                        <option key={i} value={p.nombre}>
                                            {p.nombre} {p.presupuesto_total > 0 ? `(Presupuesto: ${p.presupuesto_total_formatted})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.proyecto && <p className="text-red-600 text-xs font-bold mt-1">{errors.proyecto}</p>}
                            </div>

                            {/* Observaciones */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones / Detalles Adicionales</label>
                                <textarea
                                    rows={2}
                                    placeholder="Ej: Folio de transferencia, N° de decreto municipal, RUT de aportante..."
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                                />
                            </div>

                            {/* Archivo comprobante / Foto respaldo */}
                            <div className="p-3.5 rounded-2xl border space-y-2 bg-slate-50 border-slate-200">
                                <label className="block text-xs font-bold text-slate-800">
                                    📷 Foto / Documento Comprobante de Respaldo <span className="text-slate-400 font-normal">(Opcional para Ingreso)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setData('comprobante', e.target.files[0])}
                                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 file:border file:border-slate-200 hover:file:bg-slate-100"
                                />
                                <p className="text-[11px] text-slate-500 font-medium">
                                    🟢 Formatos soportados: PNG, JPG, WEBP o PDF. Las fotos serán adjuntadas al Libro de Respaldos PDF.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 mt-2"
                            >
                                {editingMovimiento ? 'Guardar Cambios de Ingreso' : 'Registrar Ingreso'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================== */}
            {/* MODAL 2: FORMULARIO INDEPENDIENTE DE EGRESO */}
            {/* ============================================================== */}
            {showEgresoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                            <div>
                                <span className="text-xs font-black uppercase tracking-wider block text-rose-600">
                                    🔴 Registro de Egreso (Gasto / Compra por Proyecto)
                                </span>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingMovimiento ? 'Editar Registro de Egreso' : 'Nuevo Registro de Egreso'}
                                </h3>
                            </div>
                            <button onClick={() => setShowEgresoModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitEgreso} className="space-y-4">
                            {/* Proyecto / Fondo Imputado */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-bold text-slate-700">Proyecto / Fondo a Cargar *</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowProyectosModal(true)}
                                        className="text-[11px] text-indigo-700 font-extrabold hover:underline"
                                    >
                                        + Gestionar Proyectos
                                    </button>
                                </div>
                                <select
                                    required
                                    value={data.proyecto}
                                    onChange={(e) => setData('proyecto', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                >
                                    {listaProyectos.map((p, i) => (
                                        <option key={i} value={p.nombre}>
                                            {p.nombre === 'Fondo General / Operación'
                                                ? 'Fondo General / Operación (Gasto General — Sin Proyecto)'
                                                : `${p.nombre} ${p.presupuesto_total > 0 ? `(Presupuesto: ${p.presupuesto_total_formatted})` : ''}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.proyecto && <p className="text-red-600 text-xs font-bold mt-1">{errors.proyecto}</p>}
                            </div>

                            {/* Caja de Control Presupuestario en Tiempo Real */}
                            {selectedProyectoMeta && (
                                <div className={`p-3.5 rounded-2xl border space-y-1.5 transition-colors ${maxPresupuesto === 0 ? 'bg-blue-50/70 border-blue-200' : (isExcedido ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200')}`}>
                                    {maxPresupuesto === 0 ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-1.5 font-extrabold text-blue-900 text-xs">
                                                <span>ℹ️</span>
                                                <span>Gasto Operacional General (Sin Proyecto Específico)</span>
                                            </div>
                                            <p className="text-[11px] text-blue-800 font-medium leading-normal">
                                                Este egreso corresponde a la operación continua de la Fundación. No estará sujeto a restricciones ni techos de presupuesto de proyectos específicos.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between text-xs font-black text-slate-900">
                                                <span>📊 Estado del Proyecto "{data.proyecto}":</span>
                                                <span>${maxPresupuesto.toLocaleString('es-CL')} CLP</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                                                <span>Gastado acumulado previamente:</span>
                                                <span className="text-rose-700 font-bold">${egresosAcumuladosSinActual.toLocaleString('es-CL')}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-black border-t border-slate-200/80 pt-1.5">
                                                <span>Saldo Disponible para este Egreso:</span>
                                                <span className={saldoDisponibleEst <= 0 ? 'text-red-600' : 'text-emerald-700 font-black'}>
                                                    ${saldoDisponibleEst.toLocaleString('es-CL')}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                    {isExcedido && (
                                        <div className="mt-2 text-[11px] font-extrabold text-red-700 bg-red-100 p-2.5 rounded-xl border border-red-200 flex items-start space-x-1.5">
                                            <span className="text-base leading-none">⚠️</span>
                                            <span>
                                                ¡ATENCIÓN! El monto ingresado (${montoIngresado.toLocaleString('es-CL')}) supera el saldo disponible (${saldoDisponibleEst.toLocaleString('es-CL')}). El sistema bloqueará el registro por sobrepasar el presupuesto.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Fecha & Monto */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de la Operación *</label>
                                    <input
                                        type="date"
                                        required
                                        value={data.fecha}
                                        onChange={(e) => setData('fecha', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    />
                                    {errors.fecha && <p className="text-red-600 text-xs font-bold mt-1">{errors.fecha}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Monto ($ CLP) *</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="Ej: 380000"
                                        value={data.monto}
                                        onChange={(e) => setData('monto', e.target.value)}
                                        className={`w-full px-3.5 py-2 rounded-xl border text-sm font-bold text-slate-900 focus:ring-rose-500 ${isExcedido ? 'border-red-500 bg-red-50 text-red-900' : 'border-slate-200 focus:border-rose-500'}`}
                                    />
                                    {errors.monto && <p className="text-red-600 text-xs font-bold mt-1">{errors.monto}</p>}
                                </div>
                            </div>

                            {/* Concepto */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Concepto / Glosa de Egreso *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Adquisición 4 Sillas de Ruedas Ergonómicas Plegables"
                                    value={data.concepto}
                                    onChange={(e) => setData('concepto', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {errors.concepto && <p className="text-red-600 text-xs font-bold mt-1">{errors.concepto}</p>}
                            </div>

                            {/* Categoría */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Contable *</label>
                                <input
                                    type="text"
                                    required
                                    list="categorias-egreso-list"
                                    placeholder="Selecciona o escribe una nueva categoría..."
                                    value={data.categoria}
                                    onChange={(e) => setData('categoria', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                <datalist id="categorias-egreso-list">
                                    {categoriasEgreso.map((c, i) => (
                                        <option key={i} value={c} />
                                    ))}
                                </datalist>
                                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                                    💡 Puedes seleccionar una categoría registrada o escribir una nueva. Se guardará automáticamente en la BD.
                                </p>
                                {errors.categoria && <p className="text-red-600 text-xs font-bold mt-1">{errors.categoria}</p>}
                            </div>

                            {/* Observaciones */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones / Detalles Adicionales</label>
                                <textarea
                                    rows={2}
                                    placeholder="Ej: Factura #4092 Proveedor Ortopedia, RUT de destinatario, guía de despacho..."
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            {/* Archivo comprobante / Foto respaldo OBLIGATORIO */}
                            <div className="p-3.5 rounded-2xl border space-y-2 bg-rose-50/60 border-rose-200">
                                <label className="block text-xs font-bold text-slate-800">
                                    📷 Foto / Documento Comprobante de Respaldo <span className="text-rose-600 font-extrabold">* (Obligatorio para Egreso)</span>
                                </label>
                                <input
                                    type="file"
                                    required={!editingMovimiento || !editingMovimiento.comprobante_url}
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setData('comprobante', e.target.files[0])}
                                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 file:border file:border-slate-200 hover:file:bg-slate-100"
                                />
                                {errors.comprobante && (
                                    <p className="text-rose-600 text-xs font-bold mt-1 flex items-center space-x-1">
                                        <span>⚠️</span>
                                        <span>{errors.comprobante}</span>
                                    </p>
                                )}
                                <p className="text-[11px] text-slate-500 font-medium">
                                    🔴 Todo egreso exige respaldar la operación con boleta, factura o fotografía del comprobante de transferencia para el Libro de Respaldos PDF.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || isExcedido}
                                className={`w-full py-3 text-white font-extrabold rounded-xl text-sm transition-all shadow-md mt-2 ${isExcedido ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'}`}
                            >
                                {editingMovimiento ? 'Guardar Cambios de Egreso' : 'Registrar Egreso'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL CONFIRMACION DE ELIMINACION */}
            {showDeleteModal && movimientoToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto text-3xl shadow-2xs">
                            ⚠️
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">¿Eliminar Movimiento?</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Estás a punto de borrar el registro <strong className="text-slate-900 font-bold">{movimientoToDelete.concepto}</strong> ({movimientoToDelete.monto_formatted}). Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all text-xs"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
