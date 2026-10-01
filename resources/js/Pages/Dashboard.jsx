import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({
    kpis = {},
    categoriasData = [],
    stockPorSucursal = [],
    tendenciaMensual = [],
    entregasRecientes = [],
    equiposMasDemandados = [],
    beneficiariosPorSector = [],
    entregasPorSector = []
}) {
    // 1. Chart Config: Tendencia Mensual (Entregas vs Devoluciones)
    const tendenciaChartData = {
        labels: tendenciaMensual.map(d => d.mes),
        datasets: [
            {
                label: 'Entregas a Beneficiarios',
                data: tendenciaMensual.map(d => d.entregas),
                backgroundColor: 'rgba(225, 29, 72, 0.85)', // Rose 600
                borderColor: '#e11d48',
                borderRadius: 8,
            },
            {
                label: 'Devoluciones Recibidas',
                data: tendenciaMensual.map(d => d.devoluciones),
                backgroundColor: 'rgba(16, 185, 129, 0.85)', // Emerald 500
                borderColor: '#10b981',
                borderRadius: 8,
            },
        ],
    };

    const tendenciaChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { family: 'inherit', size: 12, weight: 'bold' },
                    usePointStyle: true,
                    boxWidth: 8,
                },
            },
            tooltip: {
                backgroundColor: '#0f172a',
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 10,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 },
                grid: { color: '#f1f5f9' },
            },
            x: {
                grid: { display: false },
            },
        },
    };

    // 2. Chart Config: Categorías Stock (Doughnut)
    const paletteColors = [
        '#e11d48', // Rose
        '#0284c7', // Sky
        '#10b981', // Emerald
        '#8b5cf6', // Purple
        '#f59e0b', // Amber
        '#06b6d4', // Cyan
        '#64748b', // Slate
    ];

    const categoriasChartData = {
        labels: categoriasData.map(c => c.categoria),
        datasets: [
            {
                label: 'Unidades Disponibles',
                data: categoriasData.map(c => c.disponibles),
                backgroundColor: paletteColors.slice(0, categoriasData.length),
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverOffset: 6,
            },
        ],
    };

    const categoriasChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { family: 'inherit', size: 11, weight: 'bold' },
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 12,
                },
            },
            tooltip: {
                backgroundColor: '#0f172a',
                padding: 10,
                cornerRadius: 10,
            },
        },
        cutout: '65%',
    };

    // 3. Chart Config: Stock por Sucursal (Horizontal Bar)
    const sucursalesChartData = {
        labels: stockPorSucursal.map(s => s.nombre),
        datasets: [
            {
                label: 'Stock Disponible (Unidades)',
                data: stockPorSucursal.map(s => s.disponibles),
                backgroundColor: stockPorSucursal.map(s => s.es_casa_matriz ? 'rgba(225, 29, 72, 0.85)' : 'rgba(2, 132, 199, 0.85)'),
                borderRadius: 8,
            },
        ],
    };

    const sucursalesChartOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                padding: 10,
                cornerRadius: 10,
                callbacks: {
                    label: (context) => ` Stock: ${context.parsed.x} unidades disponibles`
                }
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: '← Cantidad Total de Unidades en Bodega →',
                    font: { size: 11, weight: 'bold' },
                    color: '#64748b'
                },
                ticks: { precision: 0, font: { size: 10 } },
                grid: { color: '#f1f5f9' },
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 11, weight: 'bold' } }
            },
        },
    };

    // 4. Chart Config: Cobertura Territorial por Sector / Comuna
    const sectorChartLabels = Array.from(new Set([
        ...entregasPorSector.map(s => s.sector_nombre),
        ...beneficiariosPorSector.map(s => s.sector_nombre)
    ]));

    const sectorChartData = {
        labels: sectorChartLabels,
        datasets: [
            {
                label: 'Entregas en Sector',
                data: sectorChartLabels.map(lbl => {
                    const item = entregasPorSector.find(s => s.sector_nombre === lbl);
                    return item ? item.total : 0;
                }),
                backgroundColor: 'rgba(225, 29, 72, 0.85)', // Rose
                borderRadius: 8,
            },
            {
                label: 'Beneficiarios Registrados',
                data: sectorChartLabels.map(lbl => {
                    const item = beneficiariosPorSector.find(s => s.sector_nombre === lbl);
                    return item ? item.total : 0;
                }),
                backgroundColor: 'rgba(2, 132, 199, 0.85)', // Sky
                borderRadius: 8,
            },
        ],
    };

    const sectorChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { family: 'inherit', size: 11, weight: 'bold' },
                    usePointStyle: true,
                    boxWidth: 8,
                },
            },
            tooltip: {
                backgroundColor: '#0f172a',
                padding: 10,
                cornerRadius: 10,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, precision: 0 },
                grid: { color: '#f1f5f9' },
            },
            x: {
                grid: { display: false },
            },
        },
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-0.5">Fundación Miguel Ángel Gamboa</span>
                        <h1 className="text-2xl font-bold text-slate-900">Panel Ejecutivo y Métricas en Tiempo Real</h1>
                    </div>

                    {/* Quick Access Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                        <Link
                            href={route('comodatos.create')}
                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nueva Entrega</span>
                        </Link>
                        <Link
                            href={route('productos.index')}
                            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-2xs"
                        >
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>Inventario</span>
                        </Link>
                        <Link
                            href={route('reportes.index')}
                            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-2xs"
                        >
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Centro de Reportes</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* 📊 EXECUTIVE KPI CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        
                        {/* KPI 1: Comodatos Activos */}
                        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-rose-600 uppercase tracking-wider block">Ayudas en Préstamo</span>
                                <span className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-slate-900">{kpis.comodatos_activos || 0}</div>
                                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                    En Uso
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">Sillas, camas y equipos activos</p>
                        </div>

                        {/* KPI 2: Stock Disponible Total */}
                        <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block">Stock Disponible</span>
                                <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-slate-900">{(kpis.stock_disponible_total || 0).toLocaleString('es-CL')}</div>
                                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    En Bodegas
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">Listo para libre entrega</p>
                        </div>

                        {/* KPI 3: Beneficiarios Activos */}
                        <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-sky-600 uppercase tracking-wider block">Beneficiarios Activos</span>
                                <span className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-slate-900">{kpis.total_beneficiarios || 0}</div>
                                <span className="text-xs font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                                    Familias
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">Pacientes registrados</p>
                        </div>

                        {/* KPI 4: Equipos en Taller / Devoluciones */}
                        <div className="p-6 rounded-3xl bg-white border border-amber-100 shadow-2xs relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block">En Taller / Reasig.</span>
                                <span className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-3 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-slate-900">{kpis.unidades_mantencion || 0}</div>
                                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    En Taller
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium mt-1">Devueltos este mes: <strong>{kpis.devoluciones_mes || 0}</strong></p>
                        </div>

                    </div>

                    {/* 📈 ROW 1 OF CHARTS: TENDENCIA & CATEGORÍAS */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Chart 1: Monthly Trend (8 cols) */}
                        <div className="lg:col-span-8 min-w-0 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest block">Actividad Histórica</span>
                                    <h3 className="text-base font-bold text-slate-900">Tendencia de Entregas vs Devoluciones (Últimos 6 Meses)</h3>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                                    Mensual
                                </span>
                            </div>

                            <div className="h-72 w-full pt-2">
                                <Bar data={tendenciaChartData} options={tendenciaChartOptions} />
                            </div>
                        </div>

                        {/* Chart 2: Stock by Category Donut (4 cols) */}
                        <div className="lg:col-span-4 min-w-0 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                            <div className="border-b border-slate-100 pb-4">
                                <span className="text-xs font-black text-rose-600 uppercase tracking-widest block">Composición</span>
                                <h3 className="text-base font-bold text-slate-900">Stock por Categoría</h3>
                            </div>

                            <div className="h-64 w-full flex items-center justify-center relative">
                                <Doughnut data={categoriasChartData} options={categoriasChartOptions} />
                            </div>
                        </div>

                    </div>

                    {/* 📍 ROW: COBERTURA TERRITORIAL POR SECTOR / COMUNA */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-xs font-black text-rose-600 uppercase tracking-widest block">Distribución Geográfica</span>
                                <h3 className="text-base font-bold text-slate-900">Cobertura Territorial: Entregas y Beneficiarios por Sector</h3>
                            </div>
                            <Link href={route('beneficiarios.index')} className="text-xs font-bold text-rose-600 hover:underline">
                                Directorio Beneficiarios →
                            </Link>
                        </div>

                        <div className="h-72 w-full pt-2">
                            <Bar data={sectorChartData} options={sectorChartOptions} />
                        </div>
                    </div>

                    {/* 🏢 ROW 2 OF CHARTS & RECENT ACTIVITY FEED */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Chart 3: Stock by Branch (5 cols) */}
                        <div className="lg:col-span-5 min-w-0 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs flex flex-col">
                            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
                                <div>
                                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest block">Red de Sedes Territoriales</span>
                                    <h3 className="text-base font-bold text-slate-900">Stock Disponible por Sede</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Total de unidades físicas (equipos e insumos) listas para entrega.</p>
                                </div>
                                <Link href={route('configuracion.index')} className="text-xs font-bold text-rose-600 hover:underline shrink-0">
                                    Ver Sedes →
                                </Link>
                            </div>

                            <div className="flex-1 min-h-[320px] w-full pt-4">
                                <Bar data={sucursalesChartData} options={sucursalesChartOptions} />
                            </div>
                        </div>

                        {/* Widget 4: Recent Deliveries Activity Feed (7 cols) */}
                        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest block">Novedades</span>
                                    <h3 className="text-base font-bold text-slate-900">Últimas Entregas Realizadas</h3>
                                </div>
                                <Link href={route('comodatos.index')} className="text-xs font-bold text-rose-600 hover:underline">
                                    Ver Todas ({kpis.comodatos_activos}) →
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {entregasRecientes.length === 0 ? (
                                    <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                                        No hay entregas registradas recientementes.
                                    </div>
                                ) : (
                                    entregasRecientes.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-colors gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-black text-slate-900 text-xs px-2 py-0.5 bg-white border border-slate-200 rounded-md">
                                                        {item.codigo}
                                                    </span>
                                                    <span className="font-extrabold text-slate-900 text-sm truncate">{item.beneficiario_nombre}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium mt-1 truncate">
                                                    Equipos: <strong className="text-slate-800">{item.equipos}</strong> • Sede: <strong>{item.sucursal_nombre}</strong>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                                <span className="text-[11px] font-bold text-slate-400">{item.fecha_entrega}</span>
                                                <Link
                                                    href={route('comodatos.show', item.id)}
                                                    className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-slate-200/90 shadow-2xs hover:border-rose-200"
                                                >
                                                    Ficha →
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>

                    {/* 🏆 ROW 3: EQUIPOS MÁS SOLICITADOS & LAUNCHPAD */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Ranking of Most Requested Technical Aids (7 cols) */}
                        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <span className="text-xs font-black text-rose-600 uppercase tracking-widest block">Mayor Impacto</span>
                                    <h3 className="text-base font-bold text-slate-900">Equipos de Mayor Demanda Social</h3>
                                </div>
                                <Link href={route('productos.index')} className="text-xs font-bold text-rose-600 hover:underline">
                                    Ver Catálogo Completo →
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {equiposMasDemandados.map((prod, idx) => {
                                    const maxCount = equiposMasDemandados[0]?.movimientos_count || 1;
                                    const percent = Math.round((prod.movimientos_count / maxCount) * 100);

                                    return (
                                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center space-x-2 min-w-0">
                                                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-black text-[11px] flex items-center justify-center shrink-0">
                                                        #{idx + 1}
                                                    </span>
                                                    <span className="font-extrabold text-slate-900 truncate text-sm">{prod.nombre}</span>
                                                    <span className="text-[11px] text-slate-400 font-medium shrink-0">• {prod.categoria}</span>
                                                </div>
                                                <span className="font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs shrink-0">
                                                    {prod.movimientos_count} préstamos
                                                </span>
                                            </div>

                                            <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-rose-600 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Action Launchpad (5 cols) */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-5 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">Acceso Directo</span>
                                <h3 className="text-xl font-extrabold text-white">Lanzador Rápido de Gestión</h3>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                    Accede directamente a los flujos operativos más frecuentados por el equipo de la fundación.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <Link
                                    href={route('comodatos.create')}
                                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left flex items-center space-x-3 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-white">Nueva Entrega</div>
                                        <span className="text-[10px] text-slate-300">Ficha Comodato</span>
                                    </div>
                                </Link>

                                <Link
                                    href={route('productos.index')}
                                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left flex items-center space-x-3 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-white">Ingresar Stock</div>
                                        <span className="text-[10px] text-slate-300">Donaciones</span>
                                    </div>
                                </Link>

                                <Link
                                    href={route('beneficiarios.index')}
                                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left flex items-center space-x-3 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-white">Beneficiarios</div>
                                        <span className="text-[10px] text-slate-300">Registro Pacientes</span>
                                    </div>
                                </Link>

                                <Link
                                    href={route('reportes.index')}
                                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all text-left flex items-center space-x-3 group"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs text-white">Reportes PDF</div>
                                        <span className="text-[10px] text-slate-300">Auditoría</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
