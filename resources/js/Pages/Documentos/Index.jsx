import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { showAlert, showConfirm } from '@/Utils/alerts';
import { formatDateOnly } from '@/Utils/dates';

export default function Index({ documentos, filtros, metricas, categoriasPreset, sucursales }) {
    const [showModal, setShowModal] = useState(false);
    const [editingDocumento, setEditingDocumento] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        categoria: 'General',
        descripcion: '',
        fecha_documento: new Date().toISOString().split('T')[0],
        sucursal_id: '',
        archivo: null,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('documentos.index'), filtros, { preserveState: true, replace: true });
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filtros, [key]: value };
        router.get(route('documentos.index'), newFilters, { preserveState: true, replace: true });
    };

    const handleOpenCreate = () => {
        setEditingDocumento(null);
        reset();
        setData({
            titulo: '',
            categoria: 'General',
            descripcion: '',
            fecha_documento: new Date().toISOString().split('T')[0],
            sucursal_id: '',
            archivo: null,
        });
        setShowModal(true);
    };

    const handleOpenEdit = (doc) => {
        setEditingDocumento(doc);
        setData({
            titulo: doc.titulo,
            categoria: doc.categoria,
            descripcion: doc.descripcion || '',
            fecha_documento: doc.fecha_documento || new Date().toISOString().split('T')[0],
            sucursal_id: doc.sucursal_id || '',
            archivo: null,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingDocumento) {
            router.post(route('documentos.update', editingDocumento.id), {
                _method: 'put',
                ...data,
            }, {
                onSuccess: () => {
                    showAlert({ title: '¡Documento Actualizado!', text: 'Los datos del documento fueron actualizados.', icon: 'success' });
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post(route('documentos.store'), {
                onSuccess: () => {
                    showAlert({ title: '¡Documento Subido!', text: 'El archivo ha sido almacenado e indexado correctamente.', icon: 'success' });
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (doc) => {
        showConfirm({
            title: '¿Eliminar Documento?',
            text: `¿Estás seguro de eliminar "${doc.titulo}"? Esta acción removerá el archivo del repositorio.`,
            confirmButtonText: 'Sí, eliminar',
            icon: 'warning',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('documentos.destroy', doc.id), {
                    onSuccess: () => {
                        showAlert({ title: 'Eliminado', text: 'El documento fue removido del repositorio.', icon: 'success' });
                    },
                });
            }
        });
    };

    const renderFormatBadge = (formato, extension) => {
        const extUpper = (extension || '').toUpperCase();
        if (formato === 'pdf') {
            return (
                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-black flex items-center space-x-1 shrink-0">
                    <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>{extUpper}</span>
                </span>
            );
        } else if (formato === 'word') {
            return (
                <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-black flex items-center space-x-1 shrink-0">
                    <svg className="w-3.5 h-3.5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{extUpper}</span>
                </span>
            );
        } else if (formato === 'excel') {
            return (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-black flex items-center space-x-1 shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{extUpper}</span>
                </span>
            );
        } else if (formato === 'imagen') {
            return (
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-black flex items-center space-x-1 shrink-0">
                    <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{extUpper}</span>
                </span>
            );
        }
        return (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold shrink-0">
                {extUpper}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <span className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-0.5">
                            Repositorio Institucional
                        </span>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                            Gestión Documental
                        </h1>
                    </div>

                    <button
                        onClick={handleOpenCreate}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Subir Documento</span>
                    </button>
                </div>
            }
        >
            <Head title="Gestión Documental — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Executive Summary Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Archivos</span>
                            <div className="text-3xl font-black text-slate-900">{metricas.total_documentos}</div>
                            <span className="text-xs text-slate-400 font-medium">Documentos en la plataforma</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Almacenamiento</span>
                            <div className="text-3xl font-black text-rose-600">{metricas.total_mb}</div>
                            <span className="text-xs text-slate-400 font-medium">Espacio utilizado en servidor</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 col-span-1 sm:col-span-2">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Desglose por Formato</span>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-extrabold flex items-center space-x-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>{metricas.desglose.pdf} PDF(s)</span>
                                </span>

                                <span className="px-3 py-1.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-xl text-xs font-extrabold flex items-center space-x-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>{metricas.desglose.word} Word (.docx)</span>
                                </span>

                                <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-extrabold flex items-center space-x-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>{metricas.desglose.excel} Excel (.xlsx)</span>
                                </span>

                                <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-extrabold flex items-center space-x-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{metricas.desglose.imagen} Escaneos</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filter & Toolbar Control Panel */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <form onSubmit={handleSearch} className="relative flex-1">
                                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Buscar documento por título, descripción o nombre de archivo..."
                                    value={filtros.buscar || ''}
                                    onChange={(e) => handleFilterChange('buscar', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </form>

                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    value={filtros.categoria || ''}
                                    onChange={(e) => handleFilterChange('categoria', e.target.value)}
                                    className="max-w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="">Todas las Categorías</option>
                                    {categoriasPreset.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                {sucursales.length > 0 && (
                                    <select
                                        value={filtros.sucursal_id || ''}
                                        onChange={(e) => handleFilterChange('sucursal_id', e.target.value)}
                                        className="max-w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:border-rose-500 focus:ring-rose-500"
                                    >
                                        <option value="">Todas las Sedes</option>
                                        {sucursales.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.nombre} {s.es_casa_matriz ? '(Sede Central)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {/* View Switcher */}
                                <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('table')}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-rose-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                                        title="Vista de Tabla"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-rose-600 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                                        title="Vista de Tarjetas / Grid"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Format Presets Filter Bar */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleFilterChange('formato', '')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${!filtros.formato ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                            >
                                Todos ({metricas.total_documentos})
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterChange('formato', 'pdf')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${filtros.formato === 'pdf' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100'}`}
                            >
                                <span>Documentos PDF ({metricas.desglose.pdf})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterChange('formato', 'word')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${filtros.formato === 'word' ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100'}`}
                            >
                                <span>Word (.docx) ({metricas.desglose.word})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterChange('formato', 'excel')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${filtros.formato === 'excel' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100'}`}
                            >
                                <span>Excel (.xlsx) ({metricas.desglose.excel})</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterChange('formato', 'imagen')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${filtros.formato === 'imagen' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100'}`}
                            >
                                <span>Escaneos ({metricas.desglose.imagen})</span>
                            </button>
                        </div>
                    </div>

                    {/* Documents List View */}
                    {documentos.data.length === 0 ? (
                        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-800">No se encontraron documentos</h3>
                            <p className="text-xs text-slate-500">Prueba ajustando los filtros de búsqueda o sube un nuevo archivo al repositorio.</p>
                            <button
                                onClick={handleOpenCreate}
                                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Subir Primer Documento</span>
                            </button>
                        </div>
                    ) : viewMode === 'table' ? (
                        /* TABLE VIEW */
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                    <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4">Documento / Título</th>
                                            <th className="px-6 py-4">Categoría</th>
                                            <th className="px-6 py-4">Sede / Origen</th>
                                            <th className="px-6 py-4">Formato / Tamaño</th>
                                            <th className="px-6 py-4">Fecha</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {documentos.data.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start space-x-3">
                                                        {renderFormatBadge(doc.tipo_formato, doc.archivo_extension)}
                                                        <div className="space-y-0.5 min-w-0">
                                                            <span className="font-extrabold text-slate-900 text-sm block truncate max-w-md" title={doc.titulo}>
                                                                {doc.titulo}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 font-medium block truncate max-w-md">
                                                                {doc.archivo_nombre_original}
                                                            </span>
                                                            {doc.descripcion && (
                                                                <p className="text-xs text-slate-500 font-normal line-clamp-1">
                                                                    {doc.descripcion}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200/80 text-slate-800 font-bold text-xs rounded-lg">
                                                        {doc.categoria}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-700">
                                                    {doc.sucursal ? doc.sucursal.nombre : 'Sede Central'}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                                                    {doc.tamano_formatted}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                                                    {doc.fecha_documento ? formatDateOnly(doc.fecha_documento) : 'N/A'}
                                                </td>

                                                <td className="px-6 py-4 text-right whitespace-nowrap space-x-1.5">
                                                    {doc.is_previewable && (
                                                        <button
                                                            onClick={() => setPreviewDoc(doc)}
                                                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                                                            title="Vista Previa"
                                                        >
                                                            <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span>Ver</span>
                                                        </button>
                                                    )}

                                                    <a
                                                        href={route('documentos.download', doc.id)}
                                                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition-colors border border-rose-200 inline-flex items-center space-x-1"
                                                        title="Descargar Archivo"
                                                    >
                                                        <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        <span>Descargar</span>
                                                    </a>

                                                    <button
                                                        onClick={() => handleOpenEdit(doc)}
                                                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                                                        title="Editar Datos"
                                                    >
                                                        <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(doc)}
                                                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1 border border-rose-200"
                                                        title="Eliminar Documento"
                                                    >
                                                        <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* GRID CARDS VIEW */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {documentos.data.map((doc) => (
                                <div key={doc.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            {renderFormatBadge(doc.tipo_formato, doc.archivo_extension)}
                                            <span className="text-[11px] font-bold text-slate-400">
                                                {doc.tamano_formatted}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-extrabold text-slate-900 text-base leading-snug truncate" title={doc.titulo}>
                                                {doc.titulo}
                                            </h3>
                                            <span className="text-xs text-rose-600 font-bold block mt-0.5">
                                                {doc.categoria}
                                            </span>
                                        </div>

                                        {doc.descripcion && (
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2">
                                                {doc.descripcion}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 space-y-3">
                                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                            <span>Sede: <strong>{doc.sucursal ? doc.sucursal.nombre : 'Sede Central'}</strong></span>
                                            <span>{doc.fecha_documento ? formatDateOnly(doc.fecha_documento) : ''}</span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            {doc.is_previewable ? (
                                                <button
                                                    onClick={() => setPreviewDoc(doc)}
                                                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1"
                                                >
                                                    <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span>Ver</span>
                                                </button>
                                            ) : null}

                                            <a
                                                href={route('documentos.download', doc.id)}
                                                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1 shadow-2xs"
                                            >
                                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                                <span>Descargar</span>
                                            </a>

                                            <button
                                                onClick={() => handleOpenEdit(doc)}
                                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors"
                                                title="Editar"
                                            >
                                                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleDelete(doc)}
                                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-colors border border-rose-200"
                                                title="Eliminar"
                                            >
                                                <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* MODAL: SUBIR / EDITAR DOCUMENTO */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">
                                    {editingDocumento ? 'Edición de Registro' : 'Nuevo Documento'}
                                </span>
                                <h3 className="text-lg font-black text-slate-900">
                                    {editingDocumento ? 'Editar Datos del Documento' : 'Subir Archivo al Repositorio'}
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                                    Título o Nombre del Documento *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Convenio de Cooperación Municipalidad de Catemu 2026"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {errors.titulo && <p className="text-red-600 text-xs mt-1">{errors.titulo}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                                        Categoría Institucional *
                                    </label>
                                    <select
                                        value={data.categoria}
                                        onChange={(e) => setData('categoria', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    >
                                        {categoriasPreset.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                                        Fecha del Documento
                                    </label>
                                    <input
                                        type="date"
                                        value={data.fecha_documento}
                                        onChange={(e) => setData('fecha_documento', e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                                    Sede Asociada
                                </label>
                                <select
                                    value={data.sucursal_id}
                                    onChange={(e) => setData('sucursal_id', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="">Sede Central / Toda la Fundación</option>
                                    {sucursales.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre} {s.es_casa_matriz ? '(Sede Central)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                                    Adjuntar Archivo {editingDocumento ? '(Opcional para reemplazar)' : '*'}
                                </label>
                                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-rose-400 transition-colors text-center space-y-2">
                                    <input
                                        type="file"
                                        required={!editingDocumento}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        onChange={(e) => setData('archivo', e.target.files[0])}
                                        className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-rose-600 file:text-white hover:file:bg-rose-700 cursor-pointer"
                                    />
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        Admitidos: PDF, Word (.docx), Excel (.xlsx), Imágenes. Máximo: 20 MB.
                                    </p>
                                </div>
                                {errors.archivo && <p className="text-red-600 text-xs font-bold mt-1">{errors.archivo}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                                    Descripción / Observaciones (Opcional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Agrega detalles clave o resumen del contenido del documento..."
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-md"
                                >
                                    {editingDocumento ? 'Guardar Cambios' : 'Subir Documento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: VISTA PREVIA DE DOCUMENTO (PDF / IMAGEN) */}
            {previewDoc && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] p-6 shadow-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center space-x-3">
                                {renderFormatBadge(previewDoc.tipo_formato, previewDoc.archivo_extension)}
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900">{previewDoc.titulo}</h3>
                                    <span className="text-xs text-slate-400 font-medium">{previewDoc.archivo_nombre_original}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <a
                                    href={route('documentos.download', previewDoc.id)}
                                    className="px-3 py-1.5 bg-rose-600 text-white font-extrabold text-xs rounded-xl hover:bg-rose-700 flex items-center space-x-1"
                                >
                                    <span>Descargar</span>
                                </a>
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-2">
                            {previewDoc.tipo_formato === 'pdf' ? (
                                <iframe
                                    src={route('documentos.preview', previewDoc.id)}
                                    className="w-full h-full rounded-xl"
                                    title={previewDoc.titulo}
                                />
                            ) : previewDoc.tipo_formato === 'imagen' ? (
                                <img
                                    src={route('documentos.preview', previewDoc.id)}
                                    alt={previewDoc.titulo}
                                    className="max-h-full max-w-full object-contain rounded-xl shadow-md"
                                />
                            ) : (
                                <div className="text-center p-8 space-y-2">
                                    <p className="text-xs font-bold text-slate-600">Este tipo de archivo no soporta vista previa directa.</p>
                                    <a
                                        href={route('documentos.download', previewDoc.id)}
                                        className="inline-block px-4 py-2 bg-rose-600 text-white font-extrabold text-xs rounded-xl"
                                    >
                                        Descargar para abrir
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setPreviewDoc(null)}
                                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                            >
                                Cerrar Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
