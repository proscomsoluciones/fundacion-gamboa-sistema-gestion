import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
            <div className="w-full max-w-md space-y-6">
                
                {/* Official Header & Logo */}
                <div className="text-center space-y-4">
                    <Link href="/" className="inline-block group">
                        <ApplicationLogo className="h-20 sm:h-24 w-auto object-contain mx-auto group-hover:scale-105 transition-transform" />
                    </Link>
                    <div>
                        <span className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-0.5">Fundación Miguel Ángel Gamboa</span>
                        <h1 className="text-xl font-extrabold text-slate-900">Sistema de Gestión de Ayudas Técnicas</h1>
                    </div>
                </div>

                {/* Pure White Clean Login Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6 animate-scale-up">
                    {children}
                </div>

                {/* Footer Copy & Developer Credit with Web Link */}
                <div className="text-center space-y-1">
                    <div className="text-xs text-slate-500 font-medium">
                        &copy; {new Date().getFullYear()} Fundación Miguel Ángel Gamboa — Todos los derechos reservados.
                    </div>
                    <div className="text-[11px] font-bold text-slate-400">
                        Sistema desarrollado por{' '}
                        <a
                            href="https://proscom.cl"
                            target="_blank"
                            rel="noreferrer"
                            className="font-extrabold text-slate-700 hover:text-rose-600 tracking-wider uppercase transition-colors underline decoration-slate-300 hover:decoration-rose-500"
                        >
                            PROSCOM
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
