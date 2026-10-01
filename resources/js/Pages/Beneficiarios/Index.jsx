import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { showAlert, showConfirm } from '@/Utils/alerts';

const SECTORES_CATEMU = [
    'Catemu Centro',
    'El Arrayán',
    'Chagres',
    'Colonia El Cobre',
    'Seco Alto',
    'Seco Bajo',
    'La Cuadra',
    'Las Varillas',
    'Compuertas',
    'Ñilhue',
    'La Poza',
    'Las Marías',
    'Cerrillos',
    'San Carlos Alto',
    'San Carlos Bajo',
    'Santa Margarita',
    'San José',
    'Reinoso',
    'Santa Isabel',
    'El Carmelo',
    'Los Corrales',
    'Santa Rosa',
    'Quebrachal',
    'La Redonda',
];

export default function Index({ beneficiarios, filtros }) {
    const [showModal, setShowModal] = useState(false);
    const [editingBeneficiario, setEditingBeneficiario] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);
    const [customParentesco, setCustomParentesco] = useState('');
    const [useCustomParentesco, setUseCustomParentesco] = useState(false);

    const parentescoOpciones = [
        'Hijo/a',
        'Cónyuge / Esposo(a)',
        'Madre / Padre',
        'Hermano/a',
        'Tutor Legal / Curador',
        'Cuidador/a Responsable',
        'Beneficiario Directo (El mismo paciente retira)',
        'Otro (Escribir personalizado...)',
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        rut: '',
        direccion: '',
        comuna: '',
        sector: '',
        telefono: '',
        contacto_adicional: '',
        parentesco: 'Hijo/a',
        representante_nombre: '',
        representante_rut: '',
        representante_telefono: '',
        representante_direccion: '',
        representante_comuna: '',
        representante_sector: '',
        misma_direccion_rep: true,
        fecha_registro: new Date().toISOString().split('T')[0],
        observaciones: '',
        estado: 'activo',
        cedula_file: null,
        documento_adicional_file: null,
    });

    const [currentStep, setCurrentStep] = useState(1);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('beneficiarios.index'), { buscar: filtros.buscar }, { preserveState: true, replace: true });
    };

    const handleOpenCreate = () => {
        setEditingBeneficiario(null);
        reset();
        setCurrentStep(1);
        setUseCustomParentesco(false);
        setCustomParentesco('');
        setData({
            nombre: '',
            rut: '',
            direccion: '',
            comuna: '',
            sector: '',
            telefono: '',
            contacto_adicional: '',
            parentesco: 'Hijo/a',
            representante_nombre: '',
            representante_rut: '',
            representante_telefono: '',
            representante_direccion: '',
            representante_comuna: '',
            representante_sector: '',
            misma_direccion_rep: true,
            fecha_registro: new Date().toISOString().split('T')[0],
            observaciones: '',
            estado: 'activo',
            cedula_file: null,
            documento_adicional_file: null,
        });
        setShowModal(true);
    };

    const handleOpenEdit = (b) => {
        setEditingBeneficiario(b);
        setCurrentStep(1);
        const p = b.parentesco || 'Hijo/a';
        const isStandard = parentescoOpciones.includes(p) && p !== 'Otro (Escribir personalizado...)';
        if (!isStandard) {
            setUseCustomParentesco(true);
            setCustomParentesco(p);
        } else {
            setUseCustomParentesco(false);
            setCustomParentesco('');
        }

        const tieneDirDiferente = !!(b.representante_direccion || b.representante_comuna || b.representante_sector);

        setData({
            nombre: b.nombre || '',
            rut: b.rut || '',
            direccion: b.direccion || '',
            comuna: b.comuna || '',
            sector: b.sector || '',
            telefono: b.telefono || '',
            contacto_adicional: b.contacto_adicional || '',
            parentesco: p,
            representante_nombre: b.representante_nombre || '',
            representante_rut: b.representante_rut || '',
            representante_telefono: b.representante_telefono || '',
            representante_direccion: b.representante_direccion || '',
            representante_comuna: b.representante_comuna || '',
            representante_sector: b.representante_sector || '',
            misma_direccion_rep: !tieneDirDiferente,
            fecha_registro: b.fecha_registro ? b.fecha_registro.split('T')[0] : new Date().toISOString().split('T')[0],
            observaciones: b.observaciones || '',
            estado: b.estado || 'activo',
            cedula_file: null,
            documento_adicional_file: null,
        });
        setShowModal(true);
    };

    const handleParentescoChange = (val) => {
        if (val === 'Otro (Escribir personalizado...)') {
            setUseCustomParentesco(true);
            setData('parentesco', customParentesco || 'Otro / Familiar');
        } else {
            setUseCustomParentesco(false);
            setData('parentesco', val);
        }
    };

    const handleCustomParentescoInputChange = (val) => {
        setCustomParentesco(val);
        setData('parentesco', val);
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        if (!data.nombre || !data.comuna) {
            showAlert({
                title: 'Datos Incompletos',
                text: 'Por favor complete al menos el Nombre Completo del Beneficiario y la Comuna antes de avanzar a los documentos.',
                icon: 'warning',
            });
            return;
        }
        setCurrentStep(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingBeneficiario) {
            router.post(route('beneficiarios.update', editingBeneficiario.id), {
                _method: 'put',
                ...data,
            }, {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                }
            });
        } else {
            post(route('beneficiarios.store'), {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                }
            });
        }
    };


    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-0.5">Comunidad & Familias</span>
                        <h1 className="text-2xl font-bold text-slate-900">Directorio de Beneficiarios & Apoderados</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
                        <button
                            onClick={handleOpenCreate}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nuevo Beneficiario</span>
                        </button>

                        {/* Integrated Export Pill Bar */}
                        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs shrink-0">
                            <a
                                href={route('beneficiarios.pdf')}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-all flex items-center space-x-1.5"
                                title="Descargar Directorio PDF"
                            >
                                <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>PDF</span>
                            </a>
                            <a
                                href={route('beneficiarios.export.excel')}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all flex items-center space-x-1.5 border-l border-slate-100"
                                title="Descargar Planilla Excel"
                            >
                                <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Excel</span>
                            </a>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Beneficiarios — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3.5 top-2.5 text-slate-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre beneficiario, RUT, apoderado/familiar que retira, comuna..."
                                    value={filtros.buscar || ''}
                                    onChange={(e) => router.get(route('beneficiarios.index'), { buscar: e.target.value }, { preserveState: true, replace: true })}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-rose-500 font-medium"
                                />
                            </div>
                        </form>
                    </div>

                    {/* 📱 MOBILE VIEW: Cards for Small & Medium Screens */}
                    <div className="block lg:hidden space-y-4">
                        {beneficiarios.data.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                                <div className="text-slate-400 font-medium text-sm">No se encontraron beneficiarios registrados.</div>
                                <button
                                    onClick={handleOpenCreate}
                                    className="inline-block mt-3 px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl"
                                >
                                    + Registrar Primer Beneficiario
                                </button>
                            </div>
                        ) : (
                            beneficiarios.data.map((b) => (
                                <div key={b.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Paciente Beneficiario</span>
                                            <div className="font-bold text-slate-900 text-base">{b.nombre}</div>
                                        </div>
                                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 shrink-0">
                                            {b.comodatos_count || 0} préstamo(s)
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-slate-400 font-bold block">RUT Beneficiario:</span>
                                            <span className="font-bold text-rose-700">{b.rut || 'No informado'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 font-bold block">Comuna & Sector:</span>
                                            <span className="font-semibold text-slate-800">{b.comuna || 'Sin comuna'}{b.sector ? ` (${b.sector})` : ''}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-slate-400 font-bold block">Dirección:</span>
                                            <span className="font-medium text-slate-700">{b.direccion || 'Sin dirección'}</span>
                                        </div>
                                    </div>

                                    {/* Apoderado / Familiar Autorizado */}
                                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1 text-xs">
                                        <div className="font-extrabold text-indigo-950 flex items-center justify-between">
                                            <span className="flex items-center space-x-1">
                                                <svg className="w-3.5 h-3.5 text-indigo-600 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <span>Apoderado / Familiar que Retira:</span>
                                            </span>
                                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] rounded-full font-bold">
                                                {b.parentesco || 'Paciente Directo'}
                                            </span>
                                        </div>
                                        <div className="font-bold text-indigo-900">
                                            {b.representante_nombre ? b.representante_nombre : 'El mismo paciente (Beneficiario Directo)'}
                                        </div>
                                        {b.representante_rut && (
                                            <div className="text-indigo-700 text-[11px] font-semibold">
                                                RUT Apoderado: {b.representante_rut} {b.representante_telefono ? `| Tel: ${b.representante_telefono}` : ''}
                                            </div>
                                        )}
                                    </div>

                                    {/* Documentos de Respaldo */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {b.cedula_url ? (
                                            <button
                                                onClick={() => setPreviewDoc({ title: `Cédula — ${b.nombre}`, url: b.cedula_url, is_image: b.is_cedula_image })}
                                                className="px-2.5 py-1 bg-slate-900 text-white font-bold text-[11px] rounded-lg flex items-center space-x-1"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" />
                                                </svg>
                                                <span>Ver Cédula</span>
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Sin Cédula</span>
                                        )}

                                        {b.documento_adicional_url ? (
                                            <button
                                                onClick={() => setPreviewDoc({ title: `Doc. Adicional — ${b.nombre}`, url: b.documento_adicional_url, is_image: b.is_doc_adicional_image })}
                                                className="px-2.5 py-1 bg-indigo-700 text-white font-bold text-[11px] rounded-lg flex items-center space-x-1"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <span>Doc. Adicional</span>
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Sin Doc. Adicional</span>
                                        )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-100">
                                        <button
                                            onClick={() => handleOpenEdit(b)}
                                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center space-x-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            <span>Editar Datos & Documentos</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Structured Table */}
                    <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Beneficiario (Paciente)</th>
                                        <th className="px-6 py-3.5">Comuna / Dirección</th>
                                        <th className="px-6 py-3.5">Familiar / Apoderado Autorizado</th>
                                        <th className="px-6 py-3.5">Parentesco</th>
                                        <th className="px-6 py-3.5 text-center">Documentos Digitados</th>
                                        <th className="px-6 py-3.5">Préstamos</th>
                                        <th className="px-6 py-3.5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {beneficiarios.data.map((b) => (
                                        <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-sm">{b.nombre}</div>
                                                <div className="text-xs text-rose-600 font-bold">RUT: {b.rut || 'No informado'}</div>
                                                {b.telefono && <div className="text-[11px] text-slate-400 font-medium">{b.telefono}</div>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800 text-xs">{b.comuna || 'Sin comuna'}</div>
                                                {b.sector && <div className="text-[11px] font-bold text-rose-700">{b.sector}</div>}
                                                <div className="text-xs text-slate-400 font-medium">{b.direccion || 'Sin dirección registrada'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-extrabold text-indigo-950 text-xs">
                                                    {b.representante_nombre ? b.representante_nombre : 'El mismo beneficiario'}
                                                </div>
                                                {b.representante_rut ? (
                                                    <div className="text-xs text-indigo-700 font-semibold">
                                                        RUT: {b.representante_rut} {b.representante_telefono ? `| Tel: ${b.representante_telefono}` : ''}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-slate-400 font-medium">Paciente retira personalmente</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-800 font-bold text-xs rounded-lg border border-indigo-200/80">
                                                    {b.parentesco || 'Paciente Directo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap space-x-1.5">
                                                {b.cedula_url ? (
                                                    <button
                                                        onClick={() => setPreviewDoc({ title: `Cédula de Identidad — ${b.nombre}`, url: b.cedula_url, is_image: b.is_cedula_image })}
                                                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                                                        title="Ver Cédula de Identidad"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" />
                                                        </svg>
                                                        <span>Cédula</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        Sin Cédula
                                                    </span>
                                                )}

                                                {b.documento_adicional_url ? (
                                                    <button
                                                        onClick={() => setPreviewDoc({ title: `Documento Adicional — ${b.nombre}`, url: b.documento_adicional_url, is_image: b.is_doc_adicional_image })}
                                                        className="px-2 py-1 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-lg transition-colors inline-flex items-center space-x-1"
                                                        title="Ver Documento Adicional de Respaldo"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>Doc. Alt</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                        Sin Doc Alt
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-lg border border-rose-200">
                                                    {b.comodatos_count || 0} préstamo(s)
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleOpenEdit(b)}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors border border-slate-200 inline-flex items-center space-x-1"
                                                >
                                                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span>Editar</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Preview Documento */}
            {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-base font-bold text-slate-900">{previewDoc.title}</h3>
                            <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">✕</button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-auto">
                            {previewDoc.is_image ? (
                                <img
                                    src={previewDoc.url}
                                    alt="Documento de respaldo"
                                    className="max-h-[450px] w-auto rounded-xl shadow-md border border-slate-200 object-contain"
                                />
                            ) : (
                                <a
                                    href={previewDoc.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all inline-flex items-center space-x-2"
                                >
                                    <span>📄 Abrir Documento PDF de Respaldo</span>
                                </a>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={() => setPreviewDoc(null)}
                                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                            >
                                Cerrar Vista Previa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Crear / Editar Beneficiario (Wizard de 2 Pasos) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[92vh] overflow-y-auto">
                        
                        {/* Cabecera del Modal */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-black uppercase tracking-wider block text-rose-600">
                                    Comunidad & Familias
                                </span>
                                <h3 className="text-base font-bold text-slate-900">
                                    {editingBeneficiario ? 'Editar Registro de Beneficiario' : 'Registro de Nuevo Beneficiario'}
                                </h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        {/* Indicador Visual de Pasos (Step Indicator Bar) */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-extrabold">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                                    currentStep === 1
                                        ? 'bg-white text-rose-700 shadow-xs border border-rose-200'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
                                <span className="truncate">Datos & Apoderado</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (data.nombre && data.comuna) setCurrentStep(2);
                                }}
                                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                                    currentStep === 2
                                        ? 'bg-white text-rose-700 shadow-xs border border-rose-200'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <span className={`w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center ${
                                    currentStep === 2 ? 'bg-rose-600 text-white' : 'bg-slate-300 text-slate-700'
                                }`}>2</span>
                                <span className="truncate">Documentos Digitados</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* PASO 1: DATOS DEL PACIENTE Y APODERADO / FAMILIAR QUE RETIRA */}
                            {currentStep === 1 && (
                                <div className="space-y-4 animate-fade-in">
                                    
                                    {/* Subsección A: Beneficiario (Paciente) */}
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                                        <span className="text-xs font-black text-slate-800 uppercase block tracking-wider flex items-center space-x-1.5">
                                            <span>👤</span>
                                            <span>Datos del Beneficiario (Paciente Principal)</span>
                                        </span>

                                        {/* 1. RUT Beneficiario & Fecha Registro */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">RUT Beneficiario</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: 12.345.678-9"
                                                    value={data.rut}
                                                    onChange={(e) => setData('rut', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                                />
                                                {errors.rut && <p className="text-red-600 text-xs font-bold mt-1">{errors.rut}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">Fecha Registro *</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={data.fecha_registro}
                                                    onChange={(e) => setData('fecha_registro', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                                />
                                            </div>
                                        </div>

                                        {/* 2. Nombre Completo */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo del Beneficiario *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ej: Ana María González Pérez"
                                                value={data.nombre}
                                                onChange={(e) => setData('nombre', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                            />
                                            {errors.nombre && <p className="text-red-600 text-xs font-bold mt-1">{errors.nombre}</p>}
                                        </div>

                                        {/* 3. Dirección Completa */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Completa</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Av. Los Leones 123, Depto 402"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                            />
                                        </div>

                                         {/* 4. Sector & 5. Comuna */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">Sector (Catemu) 📍</label>
                                                <input
                                                    type="text"
                                                    list="sectores-catemu-list"
                                                    placeholder="Seleccionar sector..."
                                                    value={data.sector}
                                                    onChange={(e) => setData('sector', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                                />
                                                <datalist id="sectores-catemu-list">
                                                    {SECTORES_CATEMU.map((sec, i) => (
                                                        <option key={i} value={sec} />
                                                    ))}
                                                </datalist>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">Comuna *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Ej: Maipú, Santiago, Providencia"
                                                    value={data.comuna}
                                                    onChange={(e) => setData('comuna', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Teléfono Beneficiario */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Beneficiario</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: +56 9 1234 5678"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Subsección B: Apoderado / Familiar que Retira */}
                                    <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200 space-y-3">
                                        <span className="text-xs font-black text-indigo-950 uppercase block tracking-wider flex items-center space-x-1.5">
                                            <span>👨‍👩‍👧</span>
                                            <span>Apoderado / Familiar Autorizado a Retirar</span>
                                        </span>

                                        {/* 1. RUT y Teléfono de quien retira */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">1. RUT de Quien Retira</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: 16.543.210-K"
                                                    value={data.representante_rut}
                                                    onChange={(e) => setData('representante_rut', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono Directo</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: +56 9 8765 4321"
                                                    value={data.representante_telefono}
                                                    onChange={(e) => setData('representante_telefono', e.target.value)}
                                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                                />
                                            </div>
                                        </div>

                                        {/* 2. Nombre Completo de quien retira */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">2. Nombre Completo de Quien Retira</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Carlos Eduardo González (Hijo del paciente)"
                                                value={data.representante_nombre}
                                                onChange={(e) => setData('representante_nombre', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                            />
                                        </div>

                                        {/* 3. Parentesco / Relación */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">3. Parentesco / Relación con el Beneficiario *</label>
                                            <select
                                                value={useCustomParentesco ? 'Otro (Escribir personalizado...)' : data.parentesco}
                                                onChange={(e) => handleParentescoChange(e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 bg-white"
                                            >
                                                {parentescoOpciones.map((op, idx) => (
                                                    <option key={idx} value={op}>{op}</option>
                                                ))}
                                            </select>

                                            {useCustomParentesco && (
                                                <div className="mt-2 animate-fade-in">
                                                    <label className="block text-[11px] font-extrabold text-indigo-900 mb-1">
                                                        ✍️ Escribir Nuevo Parentesco / Relación Personalizada:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Ej: Sobrino/a, Nuera, Yerno, Vecino/a Colaborador/a..."
                                                        value={data.parentesco}
                                                        onChange={(e) => handleCustomParentescoInputChange(e.target.value)}
                                                        className="w-full px-3.5 py-2 rounded-xl border-2 border-indigo-400 text-sm font-bold text-indigo-950 bg-white focus:border-indigo-600 focus:ring-indigo-600"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* 4. Opción Domicilio / Dirección del Apoderado */}
                                        <div className="pt-1 border-t border-indigo-100/80">
                                            <label className="flex items-center space-x-2 text-xs font-extrabold text-indigo-950 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={data.misma_direccion_rep}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        setData(prev => ({
                                                            ...prev,
                                                            misma_direccion_rep: isChecked,
                                                            representante_direccion: isChecked ? '' : prev.representante_direccion,
                                                            representante_comuna: isChecked ? '' : prev.representante_comuna,
                                                            representante_sector: isChecked ? '' : prev.representante_sector,
                                                        }));
                                                    }}
                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span>🏡 Misma dirección y sector que el beneficiario</span>
                                            </label>

                                            {!data.misma_direccion_rep && (
                                                <div className="mt-3 space-y-3 bg-white p-3.5 rounded-xl border border-indigo-200 animate-fade-in">
                                                    <span className="text-[11px] font-black text-indigo-900 uppercase block tracking-wider">
                                                        📍 Domicilio Particular de Quien Retira (Diferente)
                                                    </span>

                                                    <div>
                                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Dirección del Apoderado</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Pasaje Las Margaritas 456"
                                                            value={data.representante_direccion}
                                                            onChange={(e) => setData('representante_direccion', e.target.value)}
                                                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Sector / Villa Apoderado 📍</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Ej: Población Central"
                                                                value={data.representante_sector}
                                                                onChange={(e) => setData('representante_sector', e.target.value)}
                                                                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Comuna Apoderado</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Ej: Pudahuel, Cerrillos"
                                                                value={data.representante_comuna}
                                                                onChange={(e) => setData('representante_comuna', e.target.value)}
                                                                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botón Navegación a Paso 2 */}
                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center space-x-2"
                                        >
                                            <span>Siguiente: Cargar Documentos</span>
                                            <span>➡️</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PASO 2: DOCUMENTACIÓN Y RESPALDOS DIGITALES */}
                            {currentStep === 2 && (
                                <div className="space-y-5 animate-fade-in">
                                    
                                    <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                                        <div>
                                            <span className="text-xs font-black text-rose-600 uppercase tracking-wider block mb-0.5">
                                                📁 Carga de Documentación de Respaldo
                                            </span>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Adjunta los archivos o fotos en formato JPG, PNG o PDF (Máximo 10 MB por archivo).
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Documento 1: Cédula de Identidad */}
                                            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                                                        <span className="text-base">🪪</span>
                                                        <span>Cédula de Identidad</span>
                                                    </span>
                                                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full border border-rose-100 uppercase">
                                                        Recomendado
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-snug font-medium">
                                                    Fotografía o copia en PDF del carnet de identidad (Beneficiario o Apoderado).
                                                </p>
                                                
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => setData('cedula_file', e.target.files[0])}
                                                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                                                />

                                                {data.cedula_file && (
                                                    <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] font-bold flex items-center space-x-1.5">
                                                        <span>📄</span>
                                                        <span className="truncate">Seleccionado: {data.cedula_file.name}</span>
                                                    </div>
                                                )}

                                                {editingBeneficiario && editingBeneficiario.cedula_url && !data.cedula_file && (
                                                    <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-[11px] font-bold flex items-center justify-between">
                                                        <span className="flex items-center space-x-1">
                                                            <span>✓</span>
                                                            <span>Cédula cargada previamente</span>
                                                        </span>
                                                        <a
                                                            href={editingBeneficiario.cedula_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-emerald-700 hover:underline font-extrabold text-[10px]"
                                                        >
                                                            Ver 👁️
                                                        </a>
                                                    </div>
                                                )}
                                                {errors.cedula_file && <p className="text-red-600 text-xs font-bold">{errors.cedula_file}</p>}
                                            </div>

                                            {/* Documento 2: Respaldo Adicional */}
                                            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 hover:border-slate-300 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                                                        <span className="text-base">📑</span>
                                                        <span>Documento Adicional</span>
                                                    </span>
                                                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200 uppercase">
                                                        Opcional
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 leading-snug font-medium">
                                                    Informe Médico, Registro Social de Hogares (RSH) o Ficha Social.
                                                </p>
                                                
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => setData('documento_adicional_file', e.target.files[0])}
                                                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200 cursor-pointer"
                                                />

                                                {data.documento_adicional_file && (
                                                    <div className="p-2 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200 text-[11px] font-bold flex items-center space-x-1.5">
                                                        <span>📄</span>
                                                        <span className="truncate">Seleccionado: {data.documento_adicional_file.name}</span>
                                                    </div>
                                                )}

                                                {editingBeneficiario && editingBeneficiario.documento_adicional_url && !data.documento_adicional_file && (
                                                    <div className="p-2 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200 text-[11px] font-bold flex items-center justify-between">
                                                        <span className="flex items-center space-x-1">
                                                            <span>✓</span>
                                                            <span>Documento Adicional previo</span>
                                                        </span>
                                                        <a
                                                            href={editingBeneficiario.documento_adicional_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-indigo-700 hover:underline font-extrabold text-[10px]"
                                                        >
                                                            Ver 👁️
                                                        </a>
                                                    </div>
                                                )}
                                                {errors.documento_adicional_file && <p className="text-red-600 text-xs font-bold">{errors.documento_adicional_file}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Observaciones confidenciales */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones / Ficha Clínica o Notas Internas</label>
                                        <textarea
                                            rows={2}
                                            placeholder="Ej: Paciente encamado. Su hijo retira la silla de ruedas y firma comodato..."
                                            value={data.observaciones}
                                            onChange={(e) => setData('observaciones', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                        />
                                    </div>

                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-medium">
                                        🔒 <strong>Protección de Datos Personales (Ley N° 19.628 / 21.719):</strong> Los datos del paciente, su apoderado y cédulas adjuntas son estrictamente confidenciales para comodatos de la Fundación Miguel Ángel Gamboa.
                                    </div>

                                    {/* Botones de Navegación del Paso 2 */}
                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5"
                                        >
                                            <span>⬅️</span>
                                            <span>Volver a Paso 1</span>
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-rose-600/20"
                                        >
                                            {editingBeneficiario ? '💾 Guardar Cambios' : '💾 Registrar Beneficiario & Documentos'}
                                        </button>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
