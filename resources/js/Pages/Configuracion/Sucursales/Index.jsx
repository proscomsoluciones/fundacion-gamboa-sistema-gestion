import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function SucursalesIndex({ auth, sucursales = [], usuarios = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingSucursal, setEditingSucursal] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        codigo: '',
        direccion: '',
        telefono: '',
        encargado_principal_id: '',
        es_casa_matriz: false,
    });

    const openCreateModal = () => {
        setEditingSucursal(null);
        reset();
        setShowModal(true);
    };

    const openEditModal = (sucursal) => {
        setEditingSucursal(sucursal);
        setData({
            nombre: sucursal.nombre || '',
            codigo: sucursal.codigo || '',
            direccion: sucursal.direccion || '',
            telefono: sucursal.telefono || '',
            encargado_principal_id: sucursal.encargado_principal_id || '',
            es_casa_matriz: sucursal.es_casa_matriz || false,
            activa: sucursal.activa ?? true,
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSucursal) {
            put(route('sucursales.update', editingSucursal.id), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                }
            });
        } else {
            post(route('sucursales.store'), {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                }
            });
        }
    };

    const toggleStatus = (sucursal) => {
        if (confirm(`¿Está seguro de cambiar el estado de la sucursal "${sucursal.nombre}"?`)) {
            router.patch(route('sucursales.status', sucursal.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="font-semibold text-xl text-slate-800 leading-tight flex items-center gap-2.5">
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            Red de Sedes Territoriales y Centros Comunitarios
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Administración de la Sede Central y sedes comunitarias para asignación de ayudas técnicas y entregas.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Nueva Sede</span>
                    </button>
                </div>
            }
        >
            <Head title="Sedes Territoriales — Fundación Gamboa" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Grid de Sucursales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sucursales.map((sucursal) => (
                        <div
                            key={sucursal.id}
                            className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md overflow-hidden ${
                                sucursal.es_casa_matriz ? 'border-rose-300 ring-2 ring-rose-500/20' : 'border-slate-200'
                            }`}
                        >
                            {/* Card Header */}
                            <div className={`p-5 border-b ${sucursal.es_casa_matriz ? 'bg-rose-50/60 border-rose-100' : 'bg-slate-50/50 border-slate-100'}`}>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 font-mono">
                                        {sucursal.codigo}
                                    </span>
                                    {sucursal.es_casa_matriz ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            SEDE CENTRAL
                                        </span>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            sucursal.activa ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {sucursal.activa ? 'Activa' : 'Inactiva'}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                    {sucursal.nombre}
                                </h3>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-3.5 text-sm text-slate-600">
                                <div className="flex items-start gap-2.5">
                                    <svg className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{sucursal.direccion || 'Sin dirección registrada'}</span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>{sucursal.telefono || 'Sin teléfono'}</span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div>
                                        <span className="text-xs text-slate-400 block">Encargado Principal</span>
                                        <span className="font-medium text-slate-800">
                                            {sucursal.encargado_principal ? sucursal.encargado_principal.name : 'Sin asignar'}
                                        </span>
                                    </div>
                                </div>

                                {/* Metricas breves */}
                                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <span className="text-xs text-slate-400 block">Usuarios</span>
                                        <span className="font-bold text-slate-800 text-base">{sucursal.usuarios_count || 0}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <span className="text-xs text-slate-400 block">Unidades</span>
                                        <span className="font-bold text-rose-600 text-base">{sucursal.unidades_count || 0}</span>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded-lg">
                                        <span className="text-xs text-slate-400 block">Comodatos</span>
                                        <span className="font-bold text-indigo-600 text-base">{sucursal.comodatos_count || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Actions */}
                            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => openEditModal(sucursal)}
                                    className="px-3 py-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 font-bold text-xs"
                                    title="Editar Sede"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span>Editar</span>
                                </button>
                                {!sucursal.es_casa_matriz && (
                                    <button
                                        onClick={() => toggleStatus(sucursal)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                            sucursal.activa 
                                                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' 
                                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                        }`}
                                    >
                                        {sucursal.activa ? 'Desactivar' : 'Activar'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Crear / Editar Sucursal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editingSucursal ? 'Editar Sucursal' : 'Nueva Sucursal / Sede'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nombre de la Sucursal <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Sucursal Sector Norte"
                                    className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                                />
                                {errors.nombre && <p className="text-rose-600 text-xs mt-1">{errors.nombre}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Código Identificador
                                    </label>
                                    <input
                                        type="text"
                                        value={data.codigo}
                                        onChange={(e) => setData('codigo', e.target.value)}
                                        placeholder="Ej: SUC-NORTE"
                                        className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm font-mono"
                                    />
                                    {errors.codigo && <p className="text-rose-600 text-xs mt-1">{errors.codigo}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Teléfono de Contacto
                                    </label>
                                    <input
                                        type="text"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        placeholder="+56 9 1234 5678"
                                        className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Dirección Física
                                </label>
                                <input
                                    type="text"
                                    value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)}
                                    placeholder="Calle, Número, Comuna"
                                    className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Encargado Principal de la Sede
                                </label>
                                <select
                                    value={data.encargado_principal_id}
                                    onChange={(e) => setData('encargado_principal_id', e.target.value)}
                                    className="w-full rounded-xl border-slate-300 focus:border-rose-500 focus:ring-rose-500 text-sm"
                                >
                                    <option value="">-- Seleccionar Usuario --</option>
                                    {usuarios.map((usr) => (
                                        <option key={usr.id} value={usr.id}>
                                            {usr.name} ({usr.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
                                >
                                    {editingSucursal ? 'Guardar Cambios' : 'Crear Sucursal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
