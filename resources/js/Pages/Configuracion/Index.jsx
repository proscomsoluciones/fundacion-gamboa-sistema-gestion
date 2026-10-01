import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';

export default function Index({ categorias = [], estadosProducto = [], users = [], rolesAvailable = [] }) {
    const currentUser = usePage().props.auth.user;
    const isSuperAdmin = currentUser?.is_super_admin || currentUser?.roles?.includes('super_admin');

    const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' | 'categorias' | 'estados'

    // ===============================================
    // ESTADOS DE PRODUCTO STATE & HANDLERS
    // ===============================================
    const [showModalEst, setShowModalEst] = useState(false);
    const [editingEstado, setEditingEstado] = useState(null);
    const [showModalDeleteEst, setShowModalDeleteEst] = useState(false);
    const [estadoToDelete, setEstadoToDelete] = useState(null);

    const estForm = useForm({
        nombre: '',
        tipo_disponibilidad: 'disponible',
        badge_color: 'emerald',
        descripcion: '',
    });

    const handleOpenCreateEst = () => {
        setEditingEstado(null);
        estForm.reset();
        setShowModalEst(true);
    };

    const handleOpenEditEst = (est) => {
        setEditingEstado(est);
        estForm.setData({
            nombre: est.nombre,
            tipo_disponibilidad: est.tipo_disponibilidad || 'disponible',
            badge_color: est.badge_color || 'emerald',
            descripcion: est.descripcion || '',
        });
        setShowModalEst(true);
    };

    const handleSubmitEst = (e) => {
        e.preventDefault();
        if (editingEstado) {
            estForm.put(route('configuracion.estados.update', editingEstado.id), {
                onSuccess: () => {
                    estForm.reset();
                    setShowModalEst(false);
                }
            });
        } else {
            estForm.post(route('configuracion.estados.store'), {
                onSuccess: () => {
                    estForm.reset();
                    setShowModalEst(false);
                }
            });
        }
    };

    const handleOpenDeleteModalEst = (est) => {
        setEstadoToDelete(est);
        setShowModalDeleteEst(true);
    };

    const handleConfirmDeleteEst = () => {
        if (!estadoToDelete) return;
        router.delete(route('configuracion.estados.destroy', estadoToDelete.id), {
            onSuccess: () => {
                setEstadoToDelete(null);
                setShowModalDeleteEst(false);
            }
        });
    };

    // ===============================================
    // CATEGORÍAS STATE & HANDLERS
    // ===============================================
    const [showModalCat, setShowModalCat] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState(null);
    const [showModalDeleteCat, setShowModalDeleteCat] = useState(false);
    const [categoriaToDelete, setCategoriaToDelete] = useState(null);

    const catForm = useForm({
        nombre: '',
        descripcion: '',
    });

    const handleOpenCreateCat = () => {
        setEditingCategoria(null);
        catForm.reset();
        setShowModalCat(true);
    };

    const handleOpenEditCat = (cat) => {
        setEditingCategoria(cat);
        catForm.setData({
            nombre: cat.nombre,
            descripcion: cat.descripcion || '',
        });
        setShowModalCat(true);
    };

    const handleSubmitCat = (e) => {
        e.preventDefault();
        if (editingCategoria) {
            catForm.put(route('configuracion.categorias.update', editingCategoria.id), {
                onSuccess: () => {
                    catForm.reset();
                    setShowModalCat(false);
                }
            });
        } else {
            catForm.post(route('configuracion.categorias.store'), {
                onSuccess: () => {
                    catForm.reset();
                    setShowModalCat(false);
                }
            });
        }
    };

    const handleOpenDeleteModalCat = (cat) => {
        setCategoriaToDelete(cat);
        setShowModalDeleteCat(true);
    };

    const handleConfirmDeleteCat = () => {
        if (!categoriaToDelete) return;
        router.delete(route('configuracion.categorias.destroy', categoriaToDelete.id), {
            onSuccess: () => {
                setCategoriaToDelete(null);
                setShowModalDeleteCat(false);
            }
        });
    };

    // ===============================================
    // USUARIOS STATE & HANDLERS
    // ===============================================
    const [showModalUser, setShowModalUser] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const userForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'cooperador',
    });

    const handleOpenCreateUser = () => {
        setEditingUser(null);
        userForm.reset();
        userForm.setData({
            name: '',
            email: '',
            password: '',
            role: 'cooperador',
        });
        setShowModalUser(true);
    };

    const handleOpenEditUser = (u) => {
        setEditingUser(u);
        userForm.setData({
            name: u.name,
            email: u.email,
            password: '',
            role: u.role || 'cooperador',
        });
        setShowModalUser(true);
    };

    const handleSubmitUser = (e) => {
        e.preventDefault();
        if (editingUser) {
            userForm.put(route('configuracion.usuarios.update', editingUser.id), {
                onSuccess: () => {
                    userForm.reset();
                    setShowModalUser(false);
                }
            });
        } else {
            userForm.post(route('configuracion.usuarios.store'), {
                onSuccess: () => {
                    userForm.reset();
                    setShowModalUser(false);
                }
            });
        }
    };

    const handleOpenDeleteModalUser = (u) => {
        setUserToDelete(u);
        setShowModalDeleteUser(true);
    };

    const handleConfirmDeleteUser = () => {
        if (!userToDelete) return;
        router.delete(route('configuracion.usuarios.destroy', userToDelete.id), {
            onSuccess: () => {
                setUserToDelete(null);
                setShowModalDeleteUser(false);
            }
        });
    };

    // Helper badge function for roles
    const renderRoleBadge = (roleName) => {
        switch (roleName) {
            case 'super_admin':
                return <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-purple-100 text-purple-700 border border-purple-200">Super Admin</span>;
            case 'admin':
                return <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-rose-100 text-rose-700 border border-rose-200">Administrador</span>;
            case 'cooperador':
            default:
                return <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Cooperador</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-0.5">Ajustes & Administración</span>
                        <h1 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h1>
                    </div>
                    {activeTab === 'usuarios' && (
                        <button
                            onClick={handleOpenCreateUser}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span>Crear Nuevo Usuario</span>
                        </button>
                    )}
                    {activeTab === 'categorias' && (
                        <button
                            onClick={handleOpenCreateCat}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>Crear Nueva Categoría</span>
                        </button>
                    )}
                    {activeTab === 'estados' && (
                        <button
                            onClick={handleOpenCreateEst}
                            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span>Crear Nuevo Estado Físico</span>
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Configuración — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Navigation Tabs */}
                    <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('usuarios')}
                            className={`pb-3.5 px-4 font-extrabold text-sm border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                                activeTab === 'usuarios'
                                    ? 'border-rose-600 text-rose-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>Gestión de Usuarios ({users.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('categorias')}
                            className={`pb-3.5 px-4 font-extrabold text-sm border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                                activeTab === 'categorias'
                                    ? 'border-rose-600 text-rose-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>Categorías ({categorias.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('estados')}
                            className={`pb-3.5 px-4 font-extrabold text-sm border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
                                activeTab === 'estados'
                                    ? 'border-rose-600 text-rose-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Estados Físicos ({estadosProducto.length})</span>
                        </button>
                    </div>

                    {/* TAB 3: ESTADOS FÍSICOS DE PRODUCTO */}
                    {activeTab === 'estados' && (
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start space-x-3">
                                <span className="text-xl">⚙️</span>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-slate-900">Tabla de Estados Físicos de Productos y Donaciones</h3>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                        Personaliza y administra las condiciones físicas registrables en la fundación (ej: <em>Nuevo, Usado en buen estado, Reacondicionado, En Taller, Dado de baja</em>). 
                                        Cada estado se mapea a una regla de disponibilidad operativa del inventario.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Estados Registrados ({estadosProducto.length})</h3>
                                    <button
                                        onClick={handleOpenCreateEst}
                                        className="px-3.5 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-colors shadow-2xs"
                                    >
                                        + Nuevo Estado Físico
                                    </button>
                                </div>

                                {/* 📱 MOBILE VIEW: Cards for Estados */}
                                <div className="block lg:hidden space-y-3">
                                    {estadosProducto.map((est) => (
                                        <div key={est.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                <div className="font-bold text-slate-900 text-sm">{est.nombre}</div>
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-lg border border-slate-200">
                                                    {est.tipo_disponibilidad}
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-500 font-medium">
                                                {est.descripcion || 'Sin descripción'}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
                                                <span className="text-slate-400 font-semibold">{est.productos_count || 0} producto(s)</span>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleOpenEditEst(est)}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
                                                    >
                                                        Editar
                                                    </button>
                                                    {!est.es_sistema && est.productos_count === 0 && (
                                                        <button
                                                            onClick={() => handleOpenDeleteModalEst(est)}
                                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 🖥️ DESKTOP VIEW: Table for Estados */}
                                <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-600">
                                            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-3.5">Nombre del Estado Físico</th>
                                                    <th className="px-6 py-3.5">Clasificación Operativa</th>
                                                    <th className="px-6 py-3.5">Descripción</th>
                                                    <th className="px-6 py-3.5">Equipos</th>
                                                    <th className="px-6 py-3.5 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {estadosProducto.map((est) => (
                                                    <tr key={est.id} className="hover:bg-slate-50/70 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                                                            {est.nombre}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-lg border border-slate-200">
                                                                {est.tipo_disponibilidad}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 text-xs">
                                                            {est.descripcion || 'Sin descripción'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-lg">
                                                                {est.productos_count || 0} equipo(s)
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                                            <button
                                                                onClick={() => handleOpenEditEst(est)}
                                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors border border-slate-200"
                                                            >
                                                                Editar
                                                            </button>
                                                            {!est.es_sistema && est.productos_count === 0 && (
                                                                <button
                                                                    onClick={() => handleOpenDeleteModalEst(est)}
                                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition-colors border border-rose-200"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 1: USUARIOS & ROLES */}
                    {activeTab === 'usuarios' && (
                        <div className="space-y-6">
                            {/* Explanatory Help Card for Users */}
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start space-x-3">
                                <span className="text-xl">🛡️</span>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-slate-900">Niveles de Acceso y Roles de Usuario</h3>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                        Administra los usuarios con acceso a la plataforma. 
                                        <strong className="text-purple-700"> Super Admin</strong> posee control ilimitado del sistema; 
                                        <strong className="text-rose-700"> Administrador</strong> puede gestionar inventario, beneficiarios, comodatos y reportes; y 
                                        <strong className="text-emerald-700"> Cooperador</strong> posee acceso operativo diario para registrar préstamos y entregas en terreno.
                                    </p>
                                </div>
                            </div>

                            {/* CONTAINER FOR USERS: MOBILE CARDS & DESKTOP TABLE */}
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Usuarios Registrados en el Sistema ({users.length})</h3>
                                    <button
                                        onClick={handleOpenCreateUser}
                                        className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700"
                                    >
                                        + Nuevo Usuario
                                    </button>
                                </div>

                                {/* 📱 MOBILE VIEW: Cards for Users */}
                                <div className="block lg:hidden space-y-3">
                                    {users.map((u) => (
                                        <div key={u.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="block font-bold text-slate-900 text-sm">{u.name}</span>
                                                        <span className="text-xs text-slate-500 font-medium">{u.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs pt-1">
                                                <div>{renderRoleBadge(u.role)}</div>
                                                <span className="text-slate-400 font-medium text-[11px]">Reg: {u.created_at || 'N/A'}</span>
                                            </div>

                                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleOpenEditUser(u)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                {u.id !== currentUser.id && (
                                                    <button
                                                        onClick={() => handleOpenDeleteModalUser(u)}
                                                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Table for Users */}
                                <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-600">
                                            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-3.5">Usuario / Nombre</th>
                                                    <th className="px-6 py-3.5">Correo Electrónico</th>
                                                    <th className="px-6 py-3.5">Rol Asignado</th>
                                                    <th className="px-6 py-3.5">Fecha de Registro</th>
                                                    <th className="px-6 py-3.5 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {users.map((u) => (
                                                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                                                    {u.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <span className="block font-bold text-slate-900">{u.name}</span>
                                                                    {u.id === currentUser.id && (
                                                                        <span className="text-[10px] font-extrabold text-rose-600 uppercase">(Tu Cuenta Sesión Activa)</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-slate-700 text-xs">
                                                            {u.email}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {renderRoleBadge(u.role)}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs font-medium text-slate-500 whitespace-nowrap">
                                                            {u.created_at || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                                            <button
                                                                onClick={() => handleOpenEditUser(u)}
                                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors border border-slate-200"
                                                            >
                                                                Editar
                                                            </button>
                                                            {u.id !== currentUser.id && (
                                                                <button
                                                                    onClick={() => handleOpenDeleteModalUser(u)}
                                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition-colors border border-rose-200"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CATEGORÍAS */}
                    {activeTab === 'categorias' && (
                        <div className="space-y-6">
                            {/* Explanatory Help Card */}
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start space-x-3">
                                <span className="text-xl">💡</span>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-slate-900">¿Para qué sirve el Menú de Categorías?</h3>
                                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                                        Aquí puedes crear y administrar todas las <strong>Categorías de Equipos</strong> (ej: <em>Sillas de Ruedas</em>, <em>Camas Clínicas</em>, <em>Colchones Antiescaras</em>, <em>Sillas de Baño</em>, etc.). Al crear una categoría aquí, automáticamente estará disponible cuando registres nuevos productos.
                                    </p>
                                </div>
                            </div>

                            {/* 🔒 Data Protection Law (Ley N° 19.628 / 21.719) Compliance Banner */}
                            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-sm space-y-2 border border-slate-800">
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">🔒</span>
                                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest">Cumplimiento de Protección de Datos Personales (Ley N° 19.628 & Ley N° 21.719)</h3>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                    El sistema de la <strong>Fundación Miguel Ángel Gamboa</strong> aplica estándares strictly confidenciales de protección de datos. Todos los datos de beneficiarios e integrantes están resguardados adecuadamente.
                                </p>
                            </div>

                            {/* CONTAINER FOR CATEGORIES: MOBILE CARDS & DESKTOP TABLE */}
                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Categorías de Inventario Registradas ({categorias.length})</h3>
                                    <button
                                        onClick={handleOpenCreateCat}
                                        className="px-3 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700"
                                    >
                                        + Nueva Categoría
                                    </button>
                                </div>

                                {/* 📱 MOBILE VIEW: Cards for Categories */}
                                <div className="block lg:hidden space-y-3">
                                    {categorias.map((cat) => (
                                        <div key={cat.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                                <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                                                    <span>🏷️</span>
                                                    <span>{cat.nombre}</span>
                                                </div>
                                                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-lg">
                                                    {cat.productos_count || 0} equipo(s)
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-600 font-medium">
                                                {cat.descripcion || 'Sin descripción'}
                                            </div>

                                            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleOpenEditCat(cat)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                {cat.productos_count === 0 && (
                                                    <button
                                                        onClick={() => handleOpenDeleteModalCat(cat)}
                                                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200"
                                                    >
                                                        🗑️ Eliminar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Table for Categories */}
                                <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-600">
                                            <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-3.5">Nombre de la Categoría</th>
                                                    <th className="px-6 py-3.5">Descripción Explicativa</th>
                                                    <th className="px-6 py-3.5">Equipos Asignados</th>
                                                    <th className="px-6 py-3.5 text-right">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {categorias.map((cat) => (
                                                    <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                                                        <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                                                            <div className="flex items-center space-x-2">
                                                                <span>🏷️</span>
                                                                <span>{cat.nombre}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 text-xs">
                                                            {cat.descripcion || 'Sin descripción'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-lg">
                                                                {cat.productos_count || 0} equipo(s)
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                                                            <button
                                                                onClick={() => handleOpenEditCat(cat)}
                                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors border border-slate-200"
                                                            >
                                                                Editar
                                                            </button>
                                                            {cat.productos_count === 0 && (
                                                                <button
                                                                    onClick={() => handleOpenDeleteModalCat(cat)}
                                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-lg transition-colors border border-rose-200"
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ============================================================== */}
            {/* MODAL CREAR / EDITAR USUARIO */}
            {/* ============================================================== */}
            {showModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase block">Acceso de Usuarios</span>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                                </h3>
                            </div>
                            <button onClick={() => setShowModalUser(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Carlos Manuel Rojas"
                                    value={userForm.data.name}
                                    onChange={(e) => userForm.setData('name', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {userForm.errors.name && <p className="text-red-600 text-xs font-bold mt-1">{userForm.errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ejemplo@fundacion.org"
                                    value={userForm.data.email}
                                    onChange={(e) => userForm.setData('email', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {userForm.errors.email && <p className="text-red-600 text-xs font-bold mt-1">{userForm.errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {editingUser ? 'Nueva Contraseña (dejar en blanco si no deseas cambiarla)' : 'Contraseña de Acceso *'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    placeholder={editingUser ? '••••••••' : 'Mínimo 8 caracteres'}
                                    value={userForm.data.password}
                                    onChange={(e) => userForm.setData('password', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {userForm.errors.password && <p className="text-red-600 text-xs font-bold mt-1">{userForm.errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Rol y Nivel de Permisos *</label>
                                <select
                                    value={userForm.data.role}
                                    onChange={(e) => userForm.setData('role', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500 bg-white"
                                >
                                    <option value="cooperador">Cooperador (Operativo en Terreno)</option>
                                    <option value="admin">Administrador (Gestión Completa)</option>
                                    {isSuperAdmin && (
                                        <option value="super_admin">Super Administrador (Control Total)</option>
                                    )}
                                </select>
                                {userForm.errors.role && <p className="text-red-600 text-xs font-bold mt-1">{userForm.errors.role}</p>}
                                {!isSuperAdmin && (
                                    <p className="text-[11px] text-slate-500 mt-1 font-medium italic">
                                        💡 Para crear o asignar cuentas de Super Administrador, requiere permisos de Super Admin.
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={userForm.processing}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs mt-2"
                            >
                                {editingUser ? 'Guardar Cambios de Usuario' : 'Crear Usuario'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR USUARIO */}
            {showModalDeleteUser && userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto text-3xl shadow-2xs">
                            ⚠️
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">¿Eliminar Usuario?</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Estás a punto de revocar el acceso y eliminar a <strong className="text-slate-900 font-bold">{userToDelete.name}</strong> ({userToDelete.email}). Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModalDeleteUser(false)}
                                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteUser}
                                className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all text-xs"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CREAR / EDITAR CATEGORÍA */}
            {showModalCat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase block">Categoría de Inventario</span>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                                </h3>
                            </div>
                            <button onClick={() => setShowModalCat(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitCat} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Categoría *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Sillas de Baño / W.C."
                                    value={catForm.data.nombre}
                                    onChange={(e) => catForm.setData('nombre', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {catForm.errors.nombre && <p className="text-red-600 text-xs font-bold mt-1">{catForm.errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción / Para qué se usa</label>
                                <textarea
                                    rows={3}
                                    placeholder="Ej: Equipamiento adaptado para higiene personal y ducha de pacientes."
                                    value={catForm.data.descripcion}
                                    onChange={(e) => catForm.setData('descripcion', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={catForm.processing}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs"
                            >
                                {editingCategoria ? 'Guardar Cambios' : 'Crear Categoría'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR CATEGORÍA */}
            {showModalDeleteCat && categoriaToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto text-3xl shadow-2xs">
                            ⚠️
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">¿Eliminar Categoría?</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Estás a punto de borrar la categoría <strong className="text-slate-900 font-bold">{categoriaToDelete.nombre}</strong>. Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModalDeleteCat(false)}
                                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteCat}
                                className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all text-xs"
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CREAR / EDITAR ESTADO FÍSICO */}
            {showModalEst && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase block">Estados Físicos de Inventario</span>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingEstado ? 'Editar Estado Físico' : 'Nuevo Estado Físico'}
                                </h3>
                            </div>
                            <button onClick={() => setShowModalEst(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitEst} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Estado *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Reacondicionado Taller o Usado 90%"
                                    value={estForm.data.nombre}
                                    onChange={(e) => estForm.setData('nombre', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {estForm.errors.nombre && <p className="text-red-600 text-xs font-bold mt-1">{estForm.errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Clasificación Operativa de Disponibilidad *</label>
                                <select
                                    value={estForm.data.tipo_disponibilidad}
                                    onChange={(e) => estForm.setData('tipo_disponibilidad', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="disponible">🟢 Disponible en Bodega (Apto para entrega)</option>
                                    <option value="prestado">🤝 En Comodato (Prestado a paciente)</option>
                                    <option value="mantencion">🔧 En Mantención / Taller (En revisión)</option>
                                    <option value="baja">⚠️ Dado de Baja (Retirado / Descartado)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción de la Condición</label>
                                <textarea
                                    rows={2}
                                    placeholder="Ej: Equipos revisados técnicamente y desinfectados en bodega."
                                    value={estForm.data.descripcion}
                                    onChange={(e) => estForm.setData('descripcion', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={estForm.processing}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs"
                            >
                                {editingEstado ? 'Guardar Cambios' : 'Crear Estado Físico'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ELIMINAR ESTADO FÍSICO */}
            {showModalDeleteEst && estadoToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center space-y-5">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 flex items-center justify-center mx-auto text-3xl shadow-2xs">
                            ⚠️
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900">¿Eliminar Estado Físico?</h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Estás a punto de borrar el estado <strong className="text-slate-900 font-bold">{estadoToDelete.nombre}</strong>. Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowModalDeleteEst(false)}
                                className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDeleteEst}
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
