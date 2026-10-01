import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-center border-l-4 py-2.5 pe-4 ps-3 rounded-r-xl ${
                active
                    ? 'border-rose-600 bg-rose-50 text-rose-700 font-extrabold'
                    : 'border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 font-bold'
            } text-sm transition-all duration-150 focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
