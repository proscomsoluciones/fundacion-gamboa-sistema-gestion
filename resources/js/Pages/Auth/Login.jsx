import React, { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión — Fundación Gamboa" />

            <div className="space-y-1 text-center">
                <h2 className="text-xl font-extrabold text-slate-900">Iniciar Sesión</h2>
                <p className="text-xs text-slate-500 font-medium">Ingresa tus credenciales para acceder a la plataforma</p>
            </div>

            {status && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                
                {/* Correo Electrónico (Sin Ícono) */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Correo Electrónico *
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        required
                        value={data.email}
                        placeholder="usuario@fundacion.org"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-rose-500 transition-colors"
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Contraseña (Con botón Ojo Ver/Ocultar) */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">
                            Contraseña *
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-rose-600 hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={data.password}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-rose-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors text-sm rounded-lg"
                            title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.122-.463c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.28-6.28a3 3 0 11-4.243-4.243M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Recordar Sesión */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-lg text-rose-600 focus:ring-rose-500 border-slate-300"
                        />
                        <span className="ms-2 text-xs font-bold text-slate-600">
                            Recordar mi sesión en este equipo
                        </span>
                    </label>
                </div>

                {/* Botón de Ingreso */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                    <span>Ingresar al Sistema</span>
                    <span className="text-base">→</span>
                </button>
            </form>
        </GuestLayout>
    );
}
