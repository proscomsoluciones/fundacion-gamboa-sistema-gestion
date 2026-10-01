import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña — Fundación Gamboa" />

            <div className="space-y-1 text-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">¿Olvidaste tu Contraseña?</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Ingresa tu correo electrónico registrado y te enviaremos un enlace oficial para restablecer tu clave de acceso.
                </p>
            </div>

            {status && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 text-center">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                        Correo Electrónico *
                    </label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-3 text-slate-400 text-sm">📧</span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            value={data.email}
                            placeholder="usuario@fundacion.org"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-rose-500 transition-colors"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                    <span>Enviar Enlace de Recuperación</span>
                    <span>✉️</span>
                </button>

                <div className="text-center pt-2">
                    <Link
                        href={route('login')}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
                    >
                        ← Volver a Iniciar Sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
