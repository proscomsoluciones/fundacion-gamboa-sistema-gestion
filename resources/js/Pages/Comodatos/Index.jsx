import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import { Head, Link, useForm, router } from '@inertiajs/react';
import QrNfcScannerModal from '@/Components/QrNfcScannerModal';
import { showAlert } from '@/Utils/alerts';
import { formatDateOnly } from '@/Utils/dates';

export default function Index({ comodatos, comodatosActivos = [], sucursales = [], filtros, estadisticas }) {
    const [showModalDevolucion, setShowModalDevolucion] = useState(false);
    const [selectedComodatoId, setSelectedComodatoId] = useState('');
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [scannedReturnInfo, setScannedReturnInfo] = useState(null);

    // Live RUT & Name search state for Devoluciones
    const [searchReturnQuery, setSearchReturnQuery] = useState('');
    const [showReturnDropdown, setShowReturnDropdown] = useState(false);
    const [selectedComodatoObj, setSelectedComodatoObj] = useState(null);
    const returnSearchRef = useRef(null);

    useEffect(() => {
        if (selectedComodatoId) {
            const found = comodatosActivos.find(c => String(c.id) === String(selectedComodatoId));
            if (found) setSelectedComodatoObj(found);
        } else {
            setSelectedComodatoObj(null);
        }
    }, [selectedComodatoId, comodatosActivos]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (returnSearchRef.current && !returnSearchRef.current.contains(e.target)) {
                setShowReturnDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredActivos = (comodatosActivos || []).filter((c) => {
        if (!searchReturnQuery.trim()) return true;
        const q = searchReturnQuery.toLowerCase().trim();
        const cleanQ = q.replace(/[^0-9kK]/g, '');

        const bName = (c.beneficiario?.nombre || '').toLowerCase();
        const bRut = (c.beneficiario?.rut || '').toLowerCase();
        const cleanBRut = bRut.replace(/[^0-9kK]/g, '');

        const rName = (c.beneficiario?.representante_nombre || '').toLowerCase();
        const rRut = (c.beneficiario?.representante_rut || '').toLowerCase();
        const cleanRRut = rRut.replace(/[^0-9kK]/g, '');

        const code = (c.codigo || '').toLowerCase();

        const itemsMatch = (c.items || []).some(i => 
            (i.producto?.nombre || '').toLowerCase().includes(q) ||
            (i.unidad?.codigo_unidad || '').toLowerCase().includes(q)
        );

        return bName.includes(q) ||
               (cleanQ && cleanBRut.includes(cleanQ)) ||
               bRut.includes(q) ||
               rName.includes(q) ||
               (cleanQ && cleanRRut.includes(cleanQ)) ||
               rRut.includes(q) ||
               code.includes(q) ||
               itemsMatch;
    });

    const [showModalEdit, setShowModalEdit] = useState(false);
    const [editingComodato, setEditingComodato] = useState(null);

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [comodatoToDelete, setComodatoToDelete] = useState(null);

    const { data: dataDev, setData: setDataDev, post: postDev, processing: procDev, errors: errDev, reset: resetDev } = useForm({
        fecha_devolucion_real: new Date().toISOString().split('T')[0],
        observaciones_devolucion: '',
    });

    const handleScanQrNfcReturn = (scannedCode) => {
        let cleanCode = (scannedCode || '').trim();
        cleanCode = cleanCode.replace(/\/+$/, '');
        if (cleanCode.includes('?')) cleanCode = cleanCode.split('?')[0];
        if (cleanCode.includes('/')) cleanCode = cleanCode.split('/').pop();
        if (cleanCode.toUpperCase().startsWith('FG-UNIT:')) {
            cleanCode = cleanCode.slice(8);
        }

        const targetLower = cleanCode.toLowerCase();
        let foundComodato = null;
        let foundItem = null;

        for (const com of (comodatosActivos || [])) {
            for (const item of (com.items || [])) {
                const u = item.unidad;
                const p = item.producto;

                if (u && (
                    (u.codigo_unidad && u.codigo_unidad.toLowerCase() === targetLower) ||
                    (u.numero_serie && u.numero_serie.toLowerCase() === targetLower) ||
                    (u.id && String(u.id) === cleanCode)
                )) {
                    foundComodato = com;
                    foundItem = { productoNombre: p ? p.nombre : 'Equipo', codigoUnidad: u.codigo_unidad, tipo: 'Serializado' };
                    break;
                }

                if (!u && p && (
                    (p.codigo && p.codigo.toLowerCase() === targetLower) ||
                    (`prod-${p.id}`.toLowerCase() === targetLower) ||
                    (String(p.id) === cleanCode)
                )) {
                    foundComodato = com;
                    foundItem = { productoNombre: p.nombre, codigoUnidad: p.codigo || 'Stock Genérico', tipo: 'Genérico' };
                    break;
                }
            }
            if (foundComodato) break;
        }

        if (foundComodato && foundItem) {
            setSelectedComodatoId(foundComodato.id);
            setScannedReturnInfo({
                beneficiarioNombre: foundComodato.beneficiario?.nombre,
                codigoFicha: foundComodato.codigo,
                equipoNombre: foundItem.productoNombre,
                codigoUnidad: foundItem.codigoUnidad
            });
            setShowModalDevolucion(true);
            setShowScannerModal(false);

            showAlert({
                title: '✓ ¡Equipo Identificado para Devolución!',
                text: `Se encontró "${foundItem.productoNombre}" en uso por ${foundComodato.beneficiario?.nombre} (Ficha ${foundComodato.codigo}).`,
                icon: 'success'
            });
        } else {
            showAlert({
                title: 'ℹ️ Equipo No Encontrado en Uso',
                text: `No se encontró ningún comodato activo para el código "${cleanCode}". Verifica si el equipo ya fue devuelto a bodega o si pertenece a otro registro.`,
                icon: 'warning'
            });
            setShowScannerModal(false);
        }
    };

    const handleDevolucionSubmit = (e) => {
        e.preventDefault();
        if (!selectedComodatoId) return;

        postDev(route('comodatos.devolucion', selectedComodatoId), {
            onSuccess: () => {
                resetDev();
                setSelectedComodatoId('');
                setScannedReturnInfo(null);
                setShowModalDevolucion(false);
            }
        });
    };

    const handleOpenEdit = (c) => {
        setEditingComodato(c);
        setDataEdit({
            fecha_entrega: c.fecha_entrega ? c.fecha_entrega.split('T')[0] : '',
            fecha_estimada_devolucion: c.fecha_estimada_devolucion ? c.fecha_estimada_devolucion.split('T')[0] : '',
            observaciones_entrega: c.observaciones_entrega || '',
        });
        setShowModalEdit(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingComodato) return;

        putEdit(route('comodatos.update', editingComodato.id), {
            onSuccess: () => {
                resetEdit();
                setEditingComodato(null);
                setShowModalEdit(false);
            }
        });
    };

    const handleOpenDeleteModal = (c) => {
        setComodatoToDelete(c);
        setShowModalDelete(true);
    };

    const handleConfirmDelete = () => {
        if (!comodatoToDelete) return;
        router.delete(route('comodatos.destroy', comodatoToDelete.id), {
            onSuccess: () => {
                setComodatoToDelete(null);
                setShowModalDelete(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-0.5">Banco de Ayudas Técnicas</span>
                        <h1 className="text-2xl font-bold text-slate-900">Entregas & Ayudas Técnicas</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
                        {/* 🌟 PRIMARY CALL TO ACTION BUTTON */}
                        <Link
                            href={route('comodatos.create')}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nueva Entrega</span>
                        </Link>

                        {/* Secondary Action Button */}
                        <button
                            onClick={() => {
                                setSelectedComodatoId('');
                                setSelectedComodatoObj(null);
                                setScannedReturnInfo(null);
                                setSearchReturnQuery('');
                                setShowModalDevolucion(true);
                            }}
                            className="px-3.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-xs rounded-xl shadow-2xs transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Registrar Devolución</span>
                        </button>

                        {/* Integrated Export Pill Bar */}
                        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs shrink-0">
                            <a
                                href={route('reportes.comodatos.pdf')}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-all flex items-center space-x-1.5"
                                title="Descargar Reporte PDF"
                            >
                                <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>PDF</span>
                            </a>
                            <a
                                href={route('comodatos.export.excel')}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center space-x-1.5 border-l border-slate-100"
                                title="Descargar Planilla Excel"
                            >
                                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Excel</span>
                            </a>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Ayudas Técnicas — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Explanatory Banner */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start space-x-3">
                        <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-bold text-slate-900">¿Cómo funciona la gestión?</span> Para <strong>entregar</strong> una cama o silla a un beneficiario, haz clic en <span className="font-semibold text-rose-600">+ Nueva Entrega</span>. Puedes usar el menú desplegable <span className="font-semibold text-slate-900">Opciones ▾</span> en cada fila para ver la ficha, descargar el contrato PDF, editar o registrar la recepción del equipo.
                        </div>
                    </div>

                    {/* Clean Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        <button
                            onClick={() => router.get(route('comodatos.index'), {}, { preserveState: true })}
                            className={`p-5 rounded-2xl border text-left transition-all shadow-2xs ${
                                !filtros.estado ? 'bg-white border-rose-500 ring-2 ring-rose-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Históricos</div>
                            <div className="text-3xl font-extrabold text-slate-900 mt-2">{estadisticas.totales}</div>
                        </button>

                        <button
                            onClick={() => router.get(route('comodatos.index'), { estado: 'activo' }, { preserveState: true })}
                            className={`p-5 rounded-2xl border text-left transition-all shadow-2xs ${
                                filtros.estado === 'activo' ? 'bg-rose-50/50 border-rose-500 ring-2 ring-rose-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">En Uso en Domicilio</span>
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                            </div>
                            <div className="text-3xl font-extrabold text-rose-600 mt-2">{estadisticas.activos}</div>
                        </button>

                        <button
                            onClick={() => router.get(route('comodatos.index'), { estado: 'en_seguimiento' }, { preserveState: true })}
                            className={`p-5 rounded-2xl border text-left transition-all shadow-2xs ${
                                filtros.estado === 'en_seguimiento' ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">En Seguimiento</span>
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            </div>
                            <div className="text-3xl font-extrabold text-amber-600 mt-2">{estadisticas.en_seguimiento}</div>
                        </button>

                        <button
                            onClick={() => router.get(route('comodatos.index'), { estado: 'devuelto' }, { preserveState: true })}
                            className={`p-5 rounded-2xl border text-left transition-all shadow-2xs ${
                                filtros.estado === 'devuelto' ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Devueltos a Taller</span>
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            </div>
                            <div className="text-3xl font-extrabold text-emerald-600 mt-2">{estadisticas.devueltos}</div>
                        </button>

                    </div>

                    {/* Search Bar & Branch Filter */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-1 w-full">
                            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar por nombre del beneficiario, RUT o código..."
                                value={filtros.buscar || ''}
                                onChange={(e) => router.get(route('comodatos.index'), { ...filtros, buscar: e.target.value }, { preserveState: true, replace: true })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-rose-500"
                            />
                        </div>

                        {sucursales.length > 0 && (
                            <select
                                value={filtros.sucursal_id || ''}
                                onChange={(e) => router.get(route('comodatos.index'), { ...filtros, sucursal_id: e.target.value }, { preserveState: true })}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-rose-500 shadow-2xs cursor-pointer"
                            >
                                <option value="">Todas las Sedes</option>
                                {sucursales.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.nombre} {s.es_casa_matriz ? '(Sede Central)' : ''}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* 📱 MOBILE VIEW: Cards for Small & Medium Screens */}
                    <div className="block lg:hidden space-y-4">
                        {comodatos.data.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                                <div className="text-slate-400 font-medium text-sm">No se encontraron entregas registradas.</div>
                                <Link
                                    href={route('comodatos.create')}
                                    className="inline-block mt-3 px-6 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl"
                                >
                                    + Registrar Nueva Entrega
                                </Link>
                            </div>
                        ) : (
                            comodatos.data.map((c) => (
                                <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-900 font-extrabold text-xs rounded-lg border border-slate-200">
                                            {c.codigo}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                            c.estado === 'activo' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                            c.estado === 'devuelto' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {c.estado === 'activo' ? 'En Uso' : c.estado === 'devuelto' ? 'Devuelto' : c.estado}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Beneficiario</span>
                                        <div className="font-bold text-slate-900 text-base">{c.beneficiario.nombre}</div>
                                        <div className="text-xs text-slate-500">
                                            RUT: {c.beneficiario.rut || 'N/A'} • {c.beneficiario.comuna || 'Sin comuna'}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Equipos Entregados</span>
                                        <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            {c.items.map((item, idx) => (
                                                <div key={idx} className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                                                    <span>• {item.producto.nombre}</span>
                                                    {item.unidad && (
                                                        <span className="text-rose-600 font-bold ml-2">({item.unidad.codigo_unidad})</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-3">
                                        <span>Fecha Entrega: <strong>{formatDateOnly(c.fecha_entrega)}</strong></span>
                                    </div>

                                    {/* Mobile Action Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                                        <Link
                                            href={route('comodatos.show', c.id)}
                                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center border border-slate-200"
                                        >
                                            👁️ Ficha
                                        </Link>

                                        <a
                                            href={route('comodatos.pdf', c.id)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl text-center"
                                            title="PDF Contrato Entrega"
                                        >
                                            📄 Contrato
                                        </a>

                                        {c.estado === 'devuelto' && (
                                            <a
                                                href={route('comodatos.devolucion.pdf', c.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-3 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl text-center"
                                                title="PDF Comprobante Devolución"
                                            >
                                                📄 Acta
                                            </a>
                                        )}

                                        {c.estado === 'activo' && (
                                            <button
                                                onClick={() => {
                                                    setSelectedComodatoId(c.id);
                                                    setSelectedComodatoObj(c);
                                                    setScannedReturnInfo(null);
                                                    setShowModalDevolucion(true);
                                                }}
                                                className="px-3 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl text-center"
                                            >
                                                🔄 Devolución
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleOpenEdit(c)}
                                            className="px-3 py-2 bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl"
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            onClick={() => handleOpenDeleteModal(c)}
                                            className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Structured Table with Clean "Opciones ▾" Dropdown */}
                    <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-visible">
                        <div className="overflow-visible">
                            <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Ficha / Código</th>
                                        <th className="px-6 py-3.5">Beneficiario</th>
                                        <th className="px-6 py-3.5">Equipo Entregado</th>
                                        <th className="px-6 py-3.5">Fecha Entrega</th>
                                        <th className="px-6 py-3.5">Estado</th>
                                        <th className="px-6 py-3.5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comodatos.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="text-slate-400 font-medium text-sm">
                                                    No se encontraron entregas registradas en el sistema.
                                                </div>
                                                <Link
                                                    href={route('comodatos.create')}
                                                    className="inline-block mt-3 px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all"
                                                >
                                                    + Registrar Nueva Entrega
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        comodatos.data.map((c) => (
                                            <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-200 block w-fit">
                                                        {c.codigo}
                                                    </span>
                                                    {c.sucursal && (
                                                        <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 inline-flex items-center gap-1 mt-1">
                                                            <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            <span>{c.sucursal.nombre}</span>
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-900 text-sm">{c.beneficiario.nombre}</div>
                                                    <div className="text-xs text-slate-400 font-medium">
                                                        RUT: {c.beneficiario.rut || 'N/A'} • {c.beneficiario.comuna || 'Sin comuna'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {c.items.map((item, idx) => (
                                                            <div key={idx} className="text-xs font-semibold text-slate-800 flex items-center space-x-1">
                                                                <span>• {item.producto.nombre}</span>
                                                                {item.unidad && (
                                                                    <span className="text-rose-600 font-bold">({item.unidad.codigo_unidad})</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">
                                                    {formatDateOnly(c.fecha_entrega)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                                                        c.estado === 'activo' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                        c.estado === 'devuelto' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {c.estado === 'activo' ? 'En Uso' : c.estado === 'devuelto' ? 'Devuelto' : c.estado}
                                                    </span>
                                                </td>
                                                
                                                {/* 🎨 CLEAN "OPCIONES ▾" DROPDOWN MENU */}
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={route('comodatos.show', c.id)}
                                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
                                                        >
                                                            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>Ficha</span>
                                                        </Link>

                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <button
                                                                    type="button"
                                                                    className="px-3.5 py-1.5 bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl transition-all shadow-2xs inline-flex items-center space-x-1.5 cursor-pointer"
                                                                >
                                                                    <span>Opciones</span>
                                                                    <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </Dropdown.Trigger>

                                                            <Dropdown.Content align="right" width="48">
                                                                <Link
                                                                    href={route('comodatos.show', c.id)}
                                                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-slate-800 font-bold hover:bg-slate-100 transition-colors"
                                                                >
                                                                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    <span>Ver Ficha Completa</span>
                                                                </Link>

                                                                <a
                                                                    href={route('comodatos.pdf', c.id)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-rose-700 font-bold hover:bg-rose-50 transition-colors border-t border-slate-100"
                                                                >
                                                                    <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <span>Contrato de Entrega (PDF)</span>
                                                                </a>

                                                                {c.estado === 'devuelto' && (
                                                                    <a
                                                                        href={route('comodatos.devolucion.pdf', c.id)}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-emerald-700 font-bold hover:bg-emerald-50 transition-colors border-t border-slate-100"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                        </svg>
                                                                        <span>Acta de Devolución (PDF)</span>
                                                                    </a>
                                                                )}

                                                                {c.estado === 'activo' && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedComodatoId(c.id);
                                                                            setShowModalDevolucion(true);
                                                                        }}
                                                                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-emerald-700 font-bold hover:bg-emerald-50 transition-colors border-t border-slate-100 cursor-pointer"
                                                                    >
                                                                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                                        </svg>
                                                                        <span>Registrar Devolución</span>
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => handleOpenEdit(c)}
                                                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-amber-800 font-bold hover:bg-amber-50 transition-colors border-t border-slate-100 cursor-pointer"
                                                                >
                                                                    <svg className="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                    </svg>
                                                                    <span>Editar Fecha / Notas</span>
                                                                </button>

                                                                <button
                                                                    onClick={() => handleOpenDeleteModal(c)}
                                                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-xs text-rose-600 font-bold hover:bg-rose-50 transition-colors border-t border-slate-100 cursor-pointer"
                                                                >
                                                                    <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    <span>Eliminar Ficha</span>
                                                                </button>
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* ⚠️ MODAL MODERNO DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {showModalDelete && comodatoToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5 animate-scale-up">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto text-3xl shadow-2xs">
                            ⚠️
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">¿Eliminar esta Ficha de Entrega?</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Estás a punto de borrar permanentemente la ficha <strong className="text-slate-900 font-bold">{comodatoToDelete.codigo}</strong> asignada a <strong className="text-slate-900 font-bold">{comodatoToDelete.beneficiario.nombre}</strong>.
                            </p>
                            {comodatoToDelete.estado === 'activo' && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-bold text-left mt-2">
                                    💡 Se liberarán los equipos asignados y su stock volverá automáticamente a estar disponible en el inventario.
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModalDelete(false)}
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

            {/* Modal Editar Préstamo */}
            {showModalEdit && editingComodato && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase block">Editar Entrega</span>
                                <h3 className="text-base font-bold text-slate-900">{editingComodato.codigo} — {editingComodato.beneficiario.nombre}</h3>
                            </div>
                            <button onClick={() => setShowModalEdit(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Entrega *</label>
                                <input
                                    type="date"
                                    required
                                    value={dataEdit.fecha_entrega}
                                    onChange={(e) => setDataEdit('fecha_entrega', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Estimada de Devolución</label>
                                <input
                                    type="date"
                                    value={dataEdit.fecha_estimada_devolucion}
                                    onChange={(e) => setDataEdit('fecha_estimada_devolucion', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones de Entrega</label>
                                <textarea
                                    rows={3}
                                    placeholder="Notas de entrega o estado del paciente..."
                                    value={dataEdit.observaciones_entrega}
                                    onChange={(e) => setDataEdit('observaciones_entrega', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={procEdit}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs"
                            >
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Devolución Rápida de Equipo */}
            {showModalDevolucion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase block">Recepción de Equipos</span>
                                <h3 className="text-base font-bold text-slate-900">Registrar Devolución</h3>
                            </div>
                            <button onClick={() => { setShowModalDevolucion(false); setScannedReturnInfo(null); }} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        {/* Scanner trigger button inside modal */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-center">
                            <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">📱 Escaneo Rápido Móvil Terreno</span>
                            <button
                                type="button"
                                onClick={() => setShowScannerModal(true)}
                                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                            >
                                <span>📷 Escanear QR / Leer Chip NFC</span>
                            </button>
                        </div>

                        {scannedReturnInfo && (
                            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1 text-xs text-emerald-950 font-semibold animate-fade-in">
                                <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700">✓ Equipo Identificado por Escáner</div>
                                <div className="text-sm font-black text-slate-900">{scannedReturnInfo.equipoNombre} ({scannedReturnInfo.codigoUnidad})</div>
                                <div className="text-slate-600">Comodatario: <strong>{scannedReturnInfo.beneficiarioNombre}</strong> — Ficha: <span className="font-mono">{scannedReturnInfo.codigoFicha}</span></div>
                            </div>
                        )}

                        {comodatosActivos.length === 0 ? (
                            <div className="p-6 text-center text-xs font-medium text-slate-500 bg-slate-50 rounded-xl">
                                Actualmente no hay ningún equipo en uso registrado para recibir devolución.
                            </div>
                        ) : (
                            <form onSubmit={handleDevolucionSubmit} className="space-y-4">
                                
                                {/* Selected Loan Card vs Live RUT Search Input */}
                                {selectedComodatoObj ? (
                                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                                                ✓ Entrega Seleccionada para Devolución
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedComodatoId('');
                                                    setSelectedComodatoObj(null);
                                                    setScannedReturnInfo(null);
                                                    setSearchReturnQuery('');
                                                }}
                                                className="text-rose-600 hover:text-rose-800 font-bold text-xs underline"
                                            >
                                                ✕ Cambiar Selección
                                            </button>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="text-sm font-black text-slate-900">
                                                {selectedComodatoObj.beneficiario?.nombre}
                                            </div>
                                            <div className="text-slate-600 font-medium">
                                                RUT: <strong className="font-mono text-slate-900">{selectedComodatoObj.beneficiario?.rut || 'No registrado'}</strong> — Ficha: <strong className="font-mono text-rose-700">{selectedComodatoObj.codigo}</strong>
                                            </div>
                                            <div className="pt-2 border-t border-emerald-200/80 mt-1">
                                                <span className="font-bold text-slate-700 block mb-1">📦 Equipos / Insumos a devolver:</span>
                                                <ul className="list-disc list-inside text-slate-800 font-medium space-y-0.5">
                                                    {selectedComodatoObj.items?.map((item) => (
                                                        <li key={item.id}>
                                                            <strong>{item.producto?.nombre}</strong>
                                                            {item.unidad ? (
                                                                <span className="font-mono text-rose-700 ml-1">({item.unidad.codigo_unidad})</span>
                                                            ) : (
                                                                <span className="text-slate-500 ml-1">x{item.cantidad} (Stock Genérico)</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative" ref={returnSearchRef}>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">
                                            🔍 Buscar por RUT de Beneficiario, Nombre o Ficha *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Escribe RUT (ej: 9.876.543-1), Nombre o Ficha..."
                                            value={searchReturnQuery}
                                            onChange={(e) => {
                                                setSearchReturnQuery(e.target.value);
                                                setShowReturnDropdown(true);
                                            }}
                                            onFocus={() => setShowReturnDropdown(true)}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-emerald-500 focus:ring-emerald-500 shadow-xs"
                                        />

                                        {showReturnDropdown && (
                                            <div className="absolute z-20 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl divide-y divide-slate-100 text-xs">
                                                {filteredActivos.length === 0 ? (
                                                    <div className="p-3 text-slate-500 text-center font-medium">
                                                        No se encontraron entregas activas con esos datos.
                                                    </div>
                                                ) : (
                                                    filteredActivos.map((com) => {
                                                        const itemsStr = com.items?.map(i => i.producto?.nombre + (i.unidad ? ` (${i.unidad.codigo_unidad})` : '')).join(', ');
                                                        return (
                                                            <button
                                                                key={com.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedComodatoId(com.id);
                                                                    setSelectedComodatoObj(com);
                                                                    setShowReturnDropdown(false);
                                                                    setSearchReturnQuery('');
                                                                }}
                                                                className="w-full text-left p-3 hover:bg-emerald-50 transition-colors flex flex-col space-y-0.5"
                                                            >
                                                                <div className="flex items-center justify-between font-bold text-slate-900">
                                                                    <span>{com.beneficiario?.nombre}</span>
                                                                    <span className="font-mono text-rose-700">{com.codigo}</span>
                                                                </div>
                                                                <div className="text-[11px] text-slate-600 font-medium">
                                                                    RUT: <span className="font-mono font-bold text-slate-900">{com.beneficiario?.rut || 'Sin RUT'}</span>
                                                                </div>
                                                                <div className="text-[11px] text-emerald-800 font-bold truncate">
                                                                    📦 {itemsStr}
                                                                </div>
                                                            </button>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Real de Recepción / Devolución *</label>
                                    <input
                                        type="date"
                                        required
                                        value={dataDev.fecha_devolucion_real}
                                        onChange={(e) => setDataDev('fecha_devolucion_real', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Estado de Recepción del Equipo</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Ej: Recibido desinfectado y completo en taller. Excelente estado."
                                        value={dataDev.observaciones_devolucion}
                                        onChange={(e) => setDataDev('observaciones_devolucion', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={procDev || !selectedComodatoId}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs disabled:opacity-50"
                                >
                                    Confirmar Devolución y Restablecer a Stock
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Escáner Móvil QR & NFC Modal para Devoluciones */}
            <QrNfcScannerModal
                isOpen={showScannerModal}
                onClose={() => setShowScannerModal(false)}
                onScanSuccess={handleScanQrNfcReturn}
                title="Escanear Equipo para Registrar Devolución"
            />

        </AuthenticatedLayout>
    );
}
