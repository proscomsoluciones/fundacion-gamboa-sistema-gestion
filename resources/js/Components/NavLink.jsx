import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all duration-150 focus:outline-hidden whitespace-nowrap select-none ' +
                (active
                    ? 'bg-rose-50 text-rose-700 font-extrabold border border-rose-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
