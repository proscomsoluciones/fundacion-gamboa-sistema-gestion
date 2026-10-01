import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const canManageConfig = user?.is_super_admin || user?.is_admin || user?.permissions?.includes('gestionar-configuracion');

    let roleBadge = null;
    if (user?.is_super_admin || user?.roles?.includes('super_admin')) {
        roleBadge = <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-purple-100 text-purple-700 border border-purple-200 shrink-0">Super Admin</span>;
    } else if (user?.is_admin || user?.roles?.includes('admin')) {
        roleBadge = <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-rose-100 text-rose-700 border border-rose-200 shrink-0">Admin</span>;
    } else {
        roleBadge = <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">Cooperador</span>;
    }

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased">
            {/* Top Bar Navigation */}
            <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-2xs">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between items-center">
                        
                        {/* Logo & Main Navigation */}
                        <div className="flex items-center space-x-3 xl:space-x-6">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="flex items-center space-x-3 group">
                                    <ApplicationLogo className="h-9 w-auto transition-transform group-hover:scale-105" />
                                    <div className="hidden 2xl:block text-left border-l border-slate-200 pl-3">
                                        <span className="block text-[10px] font-black text-rose-600 uppercase tracking-widest">Fundación Gamboa</span>
                                        <span className="block text-xs font-bold text-slate-900">Gestión Operativa</span>
                                    </div>
                                </Link>
                            </div>

                            {/* Nav Links with Executive Clean Icons */}
                            <div className="hidden space-x-1 sm:-my-px xl:flex items-center">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Inicio</span>
                                </NavLink>

                                <NavLink href={route('comodatos.index')} active={route().current('comodatos.*')}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                                    </svg>
                                    <span>Ayudas Técnicas</span>
                                </NavLink>

                                <NavLink href={route('productos.index')} active={route().current('productos.*')}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span>Inventario</span>
                                </NavLink>

                                <NavLink href={route('beneficiarios.index')} active={route().current('beneficiarios.*')}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Beneficiarios</span>
                                </NavLink>

                                <NavLink href={route('reportes.index')} active={route().current('reportes.*')}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>Reportes</span>
                                </NavLink>

                                <NavLink href={route('documentos.index')} active={route().current('documentos.*')}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    <span>Documentos</span>
                                </NavLink>

                                {canManageConfig && (
                                    <NavLink href={route('finanzas.index')} active={route().current('finanzas.*')}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Finanzas</span>
                                    </NavLink>
                                )}

                                {canManageConfig && (
                                    <NavLink href={route('configuracion.index')} active={route().current('configuracion.*') || route().current('sucursales.*')}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Configuración</span>
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        {/* User Profile (Desktop View) */}
                        <div className="hidden xl:flex xl:items-center xl:space-x-3">
                            <div className="relative flex items-center space-x-2">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 transition focus:outline-hidden whitespace-nowrap cursor-pointer shadow-2xs group"
                                        >
                                            <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs group-hover:bg-rose-600 transition-colors">
                                                {user?.name?.charAt(0)}
                                            </span>
                                            <div className="text-left hidden sm:block">
                                                <span className="block font-extrabold text-slate-900 leading-snug max-w-[140px] truncate">{user?.name}</span>
                                                <span className="block text-[10px] font-bold text-rose-600 leading-none max-w-[140px] truncate">
                                                    {user?.sucursal?.nombre || 'Sede Central'}
                                                </span>
                                            </div>
                                            <svg className="ms-0.5 h-4 w-4 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 text-slate-800 text-xs space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="font-extrabold text-slate-900 truncate">{user?.name}</div>
                                                {roleBadge}
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-medium truncate">{user?.email}</div>
                                            <div className="mt-2 flex items-center gap-1.5 font-extrabold text-[11px] text-rose-800 bg-rose-50/80 px-2.5 py-1 rounded-lg border border-rose-200/80">
                                                <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="truncate">{user?.sucursal?.nombre || 'Sede Central'}</span>
                                            </div>
                                        </div>

                                        {canManageConfig && (
                                            <Dropdown.Link href={route('sucursales.index')} className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span>Red de Sedes Territoriales</span>
                                            </Dropdown.Link>
                                        )}

                                        <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Mi Perfil</span>
                                        </Dropdown.Link>

                                        {canManageConfig && (
                                            <Dropdown.Link href={route('finanzas.index')} className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Módulo de Finanzas</span>
                                            </Dropdown.Link>
                                        )}

                                        <Dropdown.Link href={route('reportes.index')} className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <span>Centro de Reportes</span>
                                        </Dropdown.Link>

                                        {canManageConfig && (
                                            <Dropdown.Link href={route('configuracion.index')} className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>Configuración del Sistema</span>
                                            </Dropdown.Link>
                                        )}

                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-rose-700">
                                            <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Cerrar Sesión</span>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Menu Button (< lg) */}
                        <div className="-me-2 flex items-center space-x-2 xl:hidden">
                            {roleBadge}
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 focus:outline-hidden transition-colors"
                                aria-label="Abrir menú de navegación"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown (< lg) */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' xl:hidden border-t border-slate-200 bg-white p-4 space-y-2 shadow-xl animate-fade-in'}>
                    <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Inicio
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('comodatos.index')} active={route().current('comodatos.*')}>
                        Ayudas Técnicas
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('productos.index')} active={route().current('productos.*')}>
                        Inventario
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('beneficiarios.index')} active={route().current('beneficiarios.*')}>
                        Beneficiarios
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('reportes.index')} active={route().current('reportes.*')}>
                        Reportes & Indicadores
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('documentos.index')} active={route().current('documentos.*')}>
                        Gestión Documental
                    </ResponsiveNavLink>
                    {canManageConfig && (
                        <ResponsiveNavLink href={route('finanzas.index')} active={route().current('finanzas.*')}>
                            Finanzas
                        </ResponsiveNavLink>
                    )}
                    {canManageConfig && (
                        <ResponsiveNavLink href={route('configuracion.index')} active={route().current('configuracion.*')}>
                            Configuración & Sedes
                        </ResponsiveNavLink>
                    )}
                    <div className="border-t border-slate-200 pt-3 space-y-1">
                        <ResponsiveNavLink href={route('profile.edit')}>
                            Mi Perfil
                        </ResponsiveNavLink>
                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                            Cerrar Sesión
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {/* Header Bar */}
            {header && (
                <header className="bg-white border-b border-slate-200 shadow-2xs">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="pb-24 xl:pb-8">{children}</main>

            {/* 📱 FIXED MOBILE BOTTOM TAB BAR (NATIVE APP FEEL FOR SMARTPHONES & TABLETS) */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 xl:hidden shadow-lg px-2 py-2 flex items-center justify-around select-none">
                <Link
                    href={route('dashboard')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                        route().current('dashboard')
                            ? 'text-rose-600 font-extrabold scale-105'
                            : 'text-slate-500 hover:text-slate-800 font-bold'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px] mt-1 tracking-tight">Inicio</span>
                </Link>

                <Link
                    href={route('comodatos.index')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                        route().current('comodatos.*')
                            ? 'text-rose-600 font-extrabold scale-105'
                            : 'text-slate-500 hover:text-slate-800 font-bold'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                    </svg>
                    <span className="text-[10px] mt-1 tracking-tight">Ayudas</span>
                </Link>

                <Link
                    href={route('productos.index')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                        route().current('productos.*')
                            ? 'text-rose-600 font-extrabold scale-105'
                            : 'text-slate-500 hover:text-slate-800 font-bold'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-[10px] mt-1 tracking-tight">Inventario</span>
                </Link>

                <Link
                    href={route('beneficiarios.index')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                        route().current('beneficiarios.*')
                            ? 'text-rose-600 font-extrabold scale-105'
                            : 'text-slate-500 hover:text-slate-800 font-bold'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-[10px] mt-1 tracking-tight">Beneficiarios</span>
                </Link>

                <Link
                    href={route('reportes.index')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                        route().current('reportes.*')
                            ? 'text-rose-600 font-extrabold scale-105'
                            : 'text-slate-500 hover:text-slate-800 font-bold'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-[10px] mt-1 tracking-tight">Reportes</span>
                </Link>

                <Link
                    href={route('documentos.index')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                        route().current('documentos.*')
                            ? 'text-rose-600 font-extrabold scale-105'
                            : 'text-slate-500 hover:text-slate-800 font-bold'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="text-[10px] mt-1 tracking-tight">Archivos</span>
                </Link>

                {canManageConfig && (
                    <Link
                        href={route('configuracion.index')}
                        className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                            route().current('configuracion.*') || route().current('finanzas.*')
                                ? 'text-rose-600 font-extrabold scale-105'
                                : 'text-slate-500 hover:text-slate-800 font-bold'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-[10px] mt-1 tracking-tight">Ajustes</span>
                    </Link>
                )}
            </nav>

            {/* Footer with Developer Credit */}
            <footer className="mt-16 py-6 bg-white border-t border-slate-200 text-xs text-slate-500 font-medium">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div>
                        &copy; {new Date().getFullYear()} Fundación Miguel Ángel Gamboa — Todos los derechos reservados.
                    </div>
                    <div className="font-bold text-slate-400">
                        Sistema desarrollado por{' '}
                        <a
                            href="https://proscom.cl"
                            target="_blank"
                            rel="noreferrer"
                            className="font-extrabold text-slate-800 hover:text-rose-600 tracking-wider uppercase transition-colors underline decoration-slate-300 hover:decoration-rose-500"
                        >
                            PROSCOM
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
