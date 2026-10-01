import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Dropdown from '@/Components/Dropdown';
import ModalTraslado from '@/Components/ModalTraslado';
import { Head, useForm, router } from '@inertiajs/react';

export default function Index({ productos, stats, filtros, categorias, estados, sucursales = [], trasladosRecientes = [] }) {
    const [showModalProduct, setShowModalProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showModalTraslado, setShowModalTraslado] = useState(false);
    const [showModalHistorialTraslados, setShowModalHistorialTraslados] = useState(false);

    const [selectedProducto, setSelectedProducto] = useState(null);
    const [showModalUnidadesList, setShowModalUnidadesList] = useState(false);
    const [qrModalData, setQrModalData] = useState(null);

    const [showModalAddUnidad, setShowModalAddUnidad] = useState(false);
    const [showModalStockGenerico, setShowModalStockGenerico] = useState(false);

    const [showModalBatchQr, setShowModalBatchQr] = useState(false);
    const [selectedBatchUnidades, setSelectedBatchUnidades] = useState([]);

    const allUnitsList = React.useMemo(() => {
        if (!productos || !productos.data) return [];
        const list = [];
        productos.data.forEach(prod => {
            // ONLY SERIALIZED PRODUCTS (EQUIPMENT WITH INDIVIDUAL UNITS)
            if (prod.tipo === 'serializado' && prod.unidades && prod.unidades.length > 0) {
                prod.unidades.forEach(u => {
                    list.push({
                        id: `u-${u.id}`,
                        codigo_unidad: u.codigo_unidad,
                        producto_nombre: prod.nombre,
                        categoria: prod.categoria,
                    });
                });
            }
        });
        return list;
    }, [productos]);

    const handleOpenBatchQrModal = () => {
        setSelectedBatchUnidades(allUnitsList.map(u => u.id));
        setShowModalBatchQr(true);
    };

    const handleToggleSelectAllBatch = () => {
        if (selectedBatchUnidades.length === allUnitsList.length) {
            setSelectedBatchUnidades([]);
        } else {
            setSelectedBatchUnidades(allUnitsList.map(u => u.id));
        }
    };

    const handleToggleBatchItem = (id) => {
        if (selectedBatchUnidades.includes(id)) {
            setSelectedBatchUnidades(selectedBatchUnidades.filter(item => item !== id));
        } else {
            setSelectedBatchUnidades([...selectedBatchUnidades, id]);
        }
    };

    const handlePrintBatchSheet = () => {
        if (selectedBatchUnidades.length === 0) return;
        const selectedItems = allUnitsList.filter(u => selectedBatchUnidades.includes(u.id));

        const win = window.open('', '_blank');
        const itemsHtml = selectedItems.map(item => `
            <div class="sticker-card">
                <div class="header">FUNDACIÓN MIGUEL ÁNGEL GAMBOA</div>
                <div class="qr-container">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(item.codigo_unidad)}" alt="QR ${item.codigo_unidad}" />
                </div>
                <div class="code-pill">
                    <span class="code-label">N° SERIE / CÓDIGO DE UNIDAD</span>
                    <span class="unit-code">${item.codigo_unidad}</span>
                </div>
            </div>
        `).join('');

        win.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Pliego Masivo de Etiquetas QR - Fundación Gamboa</title>
                    <style>
                        @page { size: A4; margin: 8mm; }
                        * { box-sizing: border-box; }
                        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; background: #fff; }
                        .grid-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
                        .sticker-card { border: 2px solid #0f172a; border-radius: 16px; padding: 10px 10px 12px 10px; text-align: center; page-break-inside: avoid; background: #fff; }
                        .header { font-size: 7.5px; font-weight: 800; text-transform: uppercase; color: #e11d48; letter-spacing: 0.6px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; margin-bottom: 8px; text-align: center; }
                        .qr-container { display: flex; justify-content: center; align-items: center; margin: 4px 0 8px 0; }
                        img { width: 34mm; height: 34mm; display: block; margin: 0 auto; border-radius: 12px; border: 1px solid #f1f5f9; padding: 2px; }
                        .code-pill { background: #f1f5f9; border-radius: 10px; padding: 6px 4px; margin-top: 4px; text-align: center; }
                        .code-label { display: block; font-size: 7px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
                        .unit-code { display: block; font-family: inherit; font-size: 13px; font-weight: 900; color: #be123c; letter-spacing: 0.5px; }
                    </style>
                </head>
                <body onload="setTimeout(function() { window.print(); }, 400);">
                    <div class="grid-container">
                        ${itemsHtml}
                    </div>
                </body>
            </html>
        `);
        win.document.close();
    };

    const [showModalIngresarStockModulo, setShowModalIngresarStockModulo] = useState(false);
    const [selectedModuloProdId, setSelectedModuloProdId] = useState('');

    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState('');

    const [isCustomEstado, setIsCustomEstado] = useState(false);
    const [customEstadoName, setCustomEstadoName] = useState('');

    const { data: dataProd, setData: setDataProd, post: postProd, put: putProd, processing: procProd, errors: errProd, reset: resetProd } = useForm({
        codigo: '',
        nombre: '',
        categoria: categorias[0] || 'Camas y Catres',
        estado_fisico: 'Nuevo',
        tipo: 'serializado',
        descripcion: '',
        stock_generico_total: 1,
        observaciones: '',
        estado: 'activo',
    });

    const { data: dataGen, setData: setDataGen, post: postGen, processing: procGen, errors: errGen, reset: resetGen } = useForm({
        stock_generico_total: 0,
        motivo: '',
    });

    const { data: dataUni, setData: setDataUni, post: postUni, processing: procUni, errors: errUni, reset: resetUni } = useForm({
        codigo_unidad: '',
        estado: 'disponible',
        estado_fisico: 'Nuevo',
        observaciones: '',
    });

    const { data: dataMod, setData: setDataMod, post: postMod, processing: procMod, errors: errMod, reset: resetMod } = useForm({
        cantidad: 1,
        codigo_base: '',
        observaciones: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('productos.index'), { buscar: filtros.buscar, categoria: filtros.categoria, estado: filtros.estado }, { preserveState: true, replace: true });
    };

    const handleOpenCreateProduct = () => {
        setEditingProduct(null);
        resetProd();
        setIsCustomCategory(false);
        setCustomCategoryName('');
        setIsCustomEstado(false);
        setCustomEstadoName('');
        setShowModalProduct(true);
    };

    const handleOpenEditProduct = (prod) => {
        setEditingProduct(prod);
        setDataProd({
            codigo: prod.codigo,
            nombre: prod.nombre,
            categoria: prod.categoria,
            estado_fisico: prod.estado_fisico || 'Nuevo',
            tipo: prod.tipo,
            descripcion: prod.descripcion || '',
            stock_generico_total: prod.stock_generico_total || 0,
            observaciones: prod.observaciones || '',
            estado: prod.estado || 'activo',
        });
        setIsCustomCategory(false);
        setCustomCategoryName('');
        setIsCustomEstado(false);
        setCustomEstadoName('');
        setShowModalProduct(true);
    };

    const handleSubmitProduct = (e) => {
        e.preventDefault();
        const catFinal = isCustomCategory ? customCategoryName.trim() : dataProd.categoria;
        const estFinal = isCustomEstado ? customEstadoName.trim() : dataProd.estado_fisico;
        
        if (!catFinal) return;

        const payload = { ...dataProd, categoria: catFinal, estado_fisico: estFinal || 'Nuevo' };

        if (editingProduct) {
            putProd(route('productos.update', editingProduct.id), {
                data: payload,
                onSuccess: () => {
                    resetProd();
                    setShowModalProduct(false);
                }
            });
        } else {
            postProd(route('productos.store'), {
                data: payload,
                onSuccess: () => {
                    resetProd();
                    setIsCustomCategory(false);
                    setCustomCategoryName('');
                    setIsCustomEstado(false);
                    setCustomEstadoName('');
                    setShowModalProduct(false);
                }
            });
        }
    };

    const handleStockGenericoSubmit = (e) => {
        e.preventDefault();
        if (!selectedProducto) return;

        postGen(route('productos.stock.update', selectedProducto.id), {
            onSuccess: () => {
                resetGen();
                setShowModalStockGenerico(false);
            }
        });
    };

    const handleAddUnidadSubmit = (e) => {
        e.preventDefault();
        if (!selectedProducto) return;

        postUni(route('productos.unidades.store', selectedProducto.id), {
            onSuccess: () => {
                resetUni();
                setShowModalAddUnidad(false);
                const updatedProd = productos.data.find(p => p.id === selectedProducto.id);
                if (updatedProd) setSelectedProducto(updatedProd);
            }
        });
    };

    const handleIngresarStockModuloSubmit = (e) => {
        e.preventDefault();
        if (!selectedModuloProdId) return;

        postMod(route('productos.stock.modulo.ingresar', selectedModuloProdId), {
            onSuccess: () => {
                resetMod();
                setSelectedModuloProdId('');
                setShowModalIngresarStockModulo(false);
            }
        });
    };

    const handleUpdateUnidadEstado = (unidadId, nuevoEstado) => {
        router.patch(route('unidades.estado.update', unidadId), { estado: nuevoEstado }, {
            preserveState: true,
            onSuccess: () => {
                if (selectedProducto) {
                    setSelectedProducto(prev => ({
                        ...prev,
                        unidades: prev.unidades.map(u => u.id === unidadId ? { ...u, estado: nuevoEstado } : u)
                    }));
                }
            }
        });
    };

    const selectedModuloProd = productos.data.find(p => p.id === parseInt(selectedModuloProdId, 10));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-0.5">Control de Inventario</span>
                        <h1 className="text-2xl font-bold text-slate-900">Catálogo de Equipos e Insumos</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full xl:w-auto">
                        {/* 🌟 PRIMARY CALL TO ACTION BUTTON */}
                        <button
                            onClick={handleOpenCreateProduct}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Nuevo Equipo / Insumo</span>
                        </button>

                        {/* Operational Actions Group */}
                        <button
                            onClick={() => {
                                const defaultId = productos.data.length > 0 ? productos.data[0].id : '';
                                setSelectedModuloProdId(defaultId);
                                const defaultProd = productos.data.find(p => p.id === parseInt(defaultId, 10));
                                setDataMod({
                                    cantidad: 1,
                                    codigo_base: defaultProd ? defaultProd.codigo : '',
                                    observaciones: '',
                                });
                                setShowModalIngresarStockModulo(true);
                            }}
                            className="px-3.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-2xs cursor-pointer"
                            title="Ingresar stock de donación o compra"
                        >
                            <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>Ingresar Stock</span>
                        </button>

                        <button
                            onClick={() => setShowModalTraslado(true)}
                            className="px-3.5 py-2.5 bg-white hover:bg-rose-50 text-rose-800 border border-rose-200/80 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-2xs cursor-pointer"
                            title="Trasladar unidades o stock genérico a otra sede territorial"
                        >
                            <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span>Trasladar entre Sedes</span>
                        </button>

                        <button
                            onClick={() => setShowModalHistorialTraslados(true)}
                            className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/80 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-2xs cursor-pointer"
                            title="Ver historial de traslados de inventario"
                        >
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Historial ({trasladosRecientes.length})</span>
                        </button>

                        <button
                            onClick={handleOpenBatchQrModal}
                            className="px-3.5 py-2.5 bg-white hover:bg-indigo-50 text-indigo-800 border border-indigo-200/80 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-2xs cursor-pointer"
                            title="Imprimir Pliego Masivo de Etiquetas QR"
                        >
                            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Pliego QR</span>
                        </button>

                        {/* Integrated Export Pill Bar */}
                        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs shrink-0">
                            <a
                                href={route('productos.reporte.pdf')}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-all flex items-center space-x-1.5"
                                title="Descargar Reporte PDF"
                            >
                                <svg className="w-3.5 h-3.5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>PDF</span>
                            </a>
                            <a
                                href={route('productos.export.excel')}
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
            <Head title="Inventario — Fundación Gamboa" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* 📊 Summary KPI Banner of Physical Product States */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs min-w-0">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block truncate">Catálogo Total</span>
                            <div className="text-xl font-black text-slate-900 mt-1 flex items-baseline justify-between gap-1">
                                <span>{stats?.total_productos || 0}</span>
                                <span className="text-xs text-slate-400 font-medium shrink-0">Equipos</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs min-w-0">
                            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block truncate">🟢 Disponibles</span>
                            <div className="text-xl font-black text-emerald-800 mt-1 flex items-baseline justify-between gap-1">
                                <span>{(stats?.unidades_disponibles || 0).toLocaleString('es-CL')}</span>
                                <span className="text-xs text-emerald-600 font-semibold shrink-0">En Bodega</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 shadow-2xs min-w-0">
                            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block truncate">🤝 En Préstamo</span>
                            <div className="text-xl font-black text-amber-900 mt-1 flex items-baseline justify-between gap-1">
                                <span>{(stats?.unidades_prestadas || 0).toLocaleString('es-CL')}</span>
                                <span className="text-xs text-amber-700 font-semibold shrink-0">En Comodato</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-sky-200/80 bg-sky-50/20 shadow-2xs min-w-0">
                            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block truncate">🔧 En Mantención</span>
                            <div className="text-xl font-black text-sky-900 mt-1 flex items-baseline justify-between gap-1">
                                <span>{(stats?.unidades_mantencion || 0).toLocaleString('es-CL')}</span>
                                <span className="text-xs text-sky-700 font-semibold shrink-0">En Taller</span>
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-300 bg-slate-50/50 shadow-2xs min-w-0">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">⚠️ Dados de Baja</span>
                            <div className="text-xl font-black text-slate-700 mt-1 flex items-baseline justify-between gap-1">
                                <span>{(stats?.unidades_baja || 0).toLocaleString('es-CL')}</span>
                                <span className="text-xs text-slate-500 font-semibold shrink-0">Retirados</span>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row flex-1 gap-3 w-full">
                            <div className="relative flex-1">
                                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar equipo por nombre o categoría..."
                                    value={filtros.buscar || ''}
                                    onChange={(e) => router.get(route('productos.index'), { ...filtros, buscar: e.target.value }, { preserveState: true, replace: true })}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                                {sucursales.length > 0 && (
                                    <select
                                        value={filtros.sucursal_id || ''}
                                        onChange={(e) => router.get(route('productos.index'), { ...filtros, sucursal_id: e.target.value }, { preserveState: true, replace: true })}
                                        className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/50 text-sm text-rose-900 font-semibold focus:border-rose-500 focus:ring-rose-500"
                                    >
                                        <option value="">🏢 Todas las Sucursales</option>
                                        {sucursales.map((suc) => (
                                            <option key={suc.id} value={suc.id}>
                                                🏢 {suc.nombre} {suc.es_casa_matriz ? '(Casa Matriz)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <select
                                    value={filtros.categoria || ''}
                                    onChange={(e) => router.get(route('productos.index'), { ...filtros, categoria: e.target.value }, { preserveState: true, replace: true })}
                                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="">Todas las Categorías</option>
                                    {categorias.map((cat, i) => (
                                        <option key={i} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <select
                                    value={filtros.estado || ''}
                                    onChange={(e) => router.get(route('productos.index'), { ...filtros, estado: e.target.value }, { preserveState: true, replace: true })}
                                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="">Todos los Estados</option>
                                    <optgroup label="Disponibilidad Operativa">
                                        <option value="disponible">🟢 Stock Disponible</option>
                                        <option value="prestado">🤝 En Préstamo</option>
                                        <option value="mantencion">🔧 En Mantención / Taller</option>
                                        <option value="baja">⚠️ Dado de Baja</option>
                                    </optgroup>
                                    {estados && estados.length > 0 && (
                                        <optgroup label="Estado Físico / Condición">
                                            {estados.map((est) => (
                                                <option key={est.id} value={est.nombre}>
                                                    🏷️ {est.nombre}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                            </div>
                        </form>
                    </div>

                    {/* 📱 MOBILE VIEW: Cards for Small & Medium Screens */}
                    <div className="block lg:hidden space-y-4">
                        {productos.data.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                                <div className="text-slate-400 font-medium text-sm">No se encontraron productos en el catálogo.</div>
                                <button
                                    onClick={handleOpenCreateProduct}
                                    className="inline-block mt-3 px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl"
                                >
                                    + Crear Primer Equipo
                                </button>
                            </div>
                        ) : (
                            productos.data.map((prod) => {
                                const sucursalFiltroId = filtros.sucursal_id ? parseInt(filtros.sucursal_id, 10) : null;
                                const unidadesFiltradas = sucursalFiltroId 
                                    ? (prod.unidades || []).filter(u => parseInt(u.sucursal_id, 10) === sucursalFiltroId)
                                    : (prod.unidades || []);

                                const dispCount = prod.tipo === 'serializado' 
                                    ? unidadesFiltradas.filter(u => u.estado === 'disponible').length 
                                    : (sucursalFiltroId 
                                        ? ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_disponible || 0)
                                        : prod.stock_generico_disponible);

                                const prestCount = prod.tipo === 'serializado'
                                    ? unidadesFiltradas.filter(u => u.estado === 'prestado').length
                                    : (sucursalFiltroId
                                        ? Math.max(0, ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_total || 0) - ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_disponible || 0))
                                        : Math.max(0, prod.stock_generico_total - prod.stock_generico_disponible));

                                const mantCount = prod.tipo === 'serializado'
                                    ? unidadesFiltradas.filter(u => u.estado === 'mantencion').length
                                    : 0;

                                const bajaCount = prod.tipo === 'serializado'
                                    ? unidadesFiltradas.filter(u => u.estado === 'baja').length
                                    : 0;

                                const totalCount = prod.tipo === 'serializado' 
                                    ? unidadesFiltradas.length 
                                    : (sucursalFiltroId 
                                        ? ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_total || 0)
                                        : prod.stock_generico_total);

                                return (
                                    <div key={prod.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="font-bold text-slate-900 text-base break-words">{prod.nombre}</div>
                                                <span className="inline-flex items-center space-x-1 mt-1 px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded-md border border-indigo-200 max-w-full">
                                                    <span>🏷️</span>
                                                    <span className="truncate">Estado Físico: {prod.estado_fisico || 'Nuevo'}</span>
                                                </span>
                                            </div>
                                            <span className="shrink-0 px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200">
                                                {prod.categoria}
                                            </span>
                                        </div>

                                        <div className="flex flex-col space-y-1.5 text-xs pt-1">
                                            <div className="flex items-center justify-between text-slate-500">
                                                <span>Control: <strong>{prod.tipo === 'serializado' ? 'Por Unidad' : 'Por Cantidad'}</strong></span>
                                                <span className="text-[11px] text-slate-400 font-bold">Total: {totalCount}</span>
                                            </div>

                                            {/* Physical Status Badges */}
                                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                {dispCount > 0 && (
                                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-lg border border-emerald-200">
                                                        🟢 {dispCount.toLocaleString('es-CL')} en Bodega
                                                    </span>
                                                )}

                                                {dispCount === 0 && totalCount > 0 && (
                                                    <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-lg border border-rose-200">
                                                        🔴 Sin Stock Disponible
                                                    </span>
                                                )}

                                                {prestCount > 0 && (
                                                    <span className="px-2.5 py-1 bg-amber-50 text-amber-900 font-bold text-xs rounded-lg border border-amber-200">
                                                        🤝 {prestCount.toLocaleString('es-CL')} prestados
                                                    </span>
                                                )}

                                                {mantCount > 0 && (
                                                    <span className="px-2.5 py-1 bg-sky-50 text-sky-900 font-bold text-xs rounded-lg border border-sky-200">
                                                        🔧 {mantCount.toLocaleString('es-CL')} mantención
                                                    </span>
                                                )}

                                                {bajaCount > 0 && (
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg border border-slate-300">
                                                        ⚠️ {bajaCount.toLocaleString('es-CL')} de baja
                                                    </span>
                                                )}
                                            </div>

                                            {/* Branch Stock Breakdown Badges */}
                                            {sucursales.length > 0 && (
                                                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100 mt-2">
                                                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block sm:inline">🏢 Stock por Sede:</span>
                                                    {sucursales.map(suc => {
                                                        let branchDisp = 0;
                                                        if (prod.tipo === 'serializado') {
                                                            branchDisp = (prod.unidades || []).filter(u => parseInt(u.sucursal_id, 10) === parseInt(suc.id, 10) && u.estado === 'disponible').length;
                                                        } else {
                                                            const st = (prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === parseInt(suc.id, 10));
                                                            branchDisp = st ? st.stock_disponible : 0;
                                                        }
                                                        return (
                                                            <span
                                                                key={suc.id}
                                                                className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${
                                                                    branchDisp > 0 ? 'bg-rose-50/60 text-rose-900 border-rose-200/80 font-black' : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                                                                }`}
                                                            >
                                                                {suc.nombre}: <strong>{branchDisp} disp.</strong>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile Action Buttons */}
                                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                                            {/* Direct QR Print Button on Mobile */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (prod.tipo === 'serializado') {
                                                        if (prod.unidades && prod.unidades.length === 1) {
                                                            setQrModalData({ producto: prod, unidad: prod.unidades[0] });
                                                        } else {
                                                            setSelectedProducto(prod);
                                                            setShowModalUnidadesList(true);
                                                        }
                                                    } else {
                                                        setQrModalData({ producto: prod, unidad: { codigo_unidad: prod.codigo, observaciones: 'Insumo por Cantidad' } });
                                                    }
                                                }}
                                                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center space-x-1 cursor-pointer"
                                                title="Ver e Imprimir Código QR"
                                            >
                                                <span>📱</span>
                                                <span>Imprimir QR</span>
                                            </button>

                                            {prod.tipo === 'serializado' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedProducto(prod);
                                                        setShowModalUnidadesList(true);
                                                    }}
                                                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 text-center"
                                                >
                                                    🏷️ Unidades ({prod.unidades.length})
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleOpenEditProduct(prod)}
                                                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200"
                                            >
                                                ✏️ Editar
                                            </button>

                                            {prod.tipo === 'serializado' ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedProducto(prod);
                                                        setShowModalAddUnidad(true);
                                                    }}
                                                    className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl"
                                                >
                                                    + Nueva Unidad
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSelectedProducto(prod);
                                                        setDataGen({ stock_generico_total: prod.stock_generico_total, motivo: '' });
                                                        setShowModalStockGenerico(true);
                                                    }}
                                                    className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl"
                                                >
                                                    ✏️ Stock
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* 🖥️ DESKTOP & NOTEBOOK VIEW: Structured 5-Column Table */}
                    <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3.5">Equipo / Insumo</th>
                                        <th className="px-6 py-3.5">Categoría</th>
                                        <th className="px-6 py-3.5">Estado Operativo</th>
                                        <th className="px-6 py-3.5">Stock por Sede</th>
                                        <th className="px-6 py-3.5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {productos.data.map((prod) => {
                                        const sucursalFiltroId = filtros.sucursal_id ? parseInt(filtros.sucursal_id, 10) : null;
                                        const unidadesFiltradas = sucursalFiltroId 
                                            ? (prod.unidades || []).filter(u => parseInt(u.sucursal_id, 10) === sucursalFiltroId)
                                            : (prod.unidades || []);

                                        const dispCount = prod.tipo === 'serializado' 
                                            ? unidadesFiltradas.filter(u => u.estado === 'disponible').length 
                                            : (sucursalFiltroId 
                                                ? ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_disponible || 0)
                                                : prod.stock_generico_disponible);

                                        const prestCount = prod.tipo === 'serializado'
                                            ? unidadesFiltradas.filter(u => u.estado === 'prestado').length
                                            : (sucursalFiltroId
                                                ? Math.max(0, ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_total || 0) - ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_disponible || 0))
                                                : Math.max(0, prod.stock_generico_total - prod.stock_generico_disponible));

                                        const mantCount = prod.tipo === 'serializado'
                                            ? unidadesFiltradas.filter(u => u.estado === 'mantencion').length
                                            : 0;

                                        const bajaCount = prod.tipo === 'serializado'
                                            ? unidadesFiltradas.filter(u => u.estado === 'baja').length
                                            : 0;

                                        const totalCount = prod.tipo === 'serializado' 
                                            ? unidadesFiltradas.length 
                                            : (sucursalFiltroId 
                                                ? ((prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === sucursalFiltroId)?.stock_total || 0)
                                                : prod.stock_generico_total);

                                        return (
                                            <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                                                
                                                {/* Equipo */}
                                                <td className="px-6 py-4">
                                                    <div className="font-extrabold text-slate-900 text-sm">{prod.nombre}</div>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                                        <span className="text-[11px] text-slate-400 font-medium">
                                                            {prod.tipo === 'serializado' ? 'Serializado' : 'Insumo por Cantidad'}
                                                        </span>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                                                            🏷️ {prod.estado_fisico || 'Nuevo'}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Categoría */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200">
                                                        {prod.categoria}
                                                    </span>
                                                </td>

                                                {/* Estado Operativo */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col space-y-1">
                                                        {dispCount > 0 ? (
                                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-black text-xs rounded-lg border border-emerald-200 inline-flex items-center space-x-1.5 w-fit">
                                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                                <span>{dispCount.toLocaleString('es-CL')} en Bodega</span>
                                                            </span>
                                                        ) : (
                                                            <span className="px-2.5 py-1 bg-rose-50 text-rose-800 font-black text-xs rounded-lg border border-rose-200 inline-flex items-center space-x-1.5 w-fit">
                                                                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                                                <span>Sin Stock</span>
                                                            </span>
                                                        )}

                                                        {prestCount > 0 && (
                                                            <span className="text-[11px] font-bold text-amber-800">
                                                                🤝 {prestCount.toLocaleString('es-CL')} prestados
                                                            </span>
                                                        )}
                                                        {mantCount > 0 && (
                                                            <span className="text-[11px] font-bold text-sky-800">
                                                                🔧 {mantCount.toLocaleString('es-CL')} mantención
                                                            </span>
                                                        )}
                                                        {bajaCount > 0 && (
                                                            <span className="text-[11px] font-bold text-slate-500">
                                                                ⚠️ {bajaCount.toLocaleString('es-CL')} de baja
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                 {/* Stock por Sede */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col space-y-1.5 min-w-[170px]">
                                                        {sucursales.map(suc => {
                                                            let branchDisp = 0;
                                                            if (prod.tipo === 'serializado') {
                                                                branchDisp = (prod.unidades || []).filter(u => parseInt(u.sucursal_id, 10) === parseInt(suc.id, 10) && u.estado === 'disponible').length;
                                                            } else {
                                                                const st = (prod.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === parseInt(suc.id, 10));
                                                                branchDisp = st ? st.stock_disponible : 0;
                                                            }
                                                            const shortName = suc.es_casa_matriz ? 'Casa Matriz' : suc.nombre;

                                                            return (
                                                                <div key={suc.id} className="flex items-center justify-between gap-2 text-xs bg-slate-50/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                                                                    <div className="flex items-center space-x-1.5 min-w-0">
                                                                        <span className={`w-2 h-2 rounded-full shrink-0 ${branchDisp > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                                                        <span className="font-bold text-slate-700 truncate text-[11px]" title={suc.nombre}>{shortName}</span>
                                                                    </div>
                                                                    <span className={`font-black text-[11px] px-2 py-0.5 rounded-md shrink-0 ${
                                                                        branchDisp > 0 ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300/60' : 'bg-slate-200/50 text-slate-400 border border-slate-200/60'
                                                                    }`}>
                                                                        {branchDisp} disp.
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>

                                                {/* Acciones */}
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {prod.tipo === 'serializado' && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedProducto(prod);
                                                                    setShowModalUnidadesList(true);
                                                                }}
                                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors border border-slate-200 whitespace-nowrap"
                                                            >
                                                                Ver Unidades ({prod.unidades.length})
                                                            </button>
                                                        )}

                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <button
                                                                    type="button"
                                                                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors inline-flex items-center space-x-1 whitespace-nowrap"
                                                                >
                                                                    <span>Opciones</span>
                                                                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </Dropdown.Trigger>

                                                            <Dropdown.Content align="right" width="48">
                                                                <button
                                                                    onClick={() => handleOpenEditProduct(prod)}
                                                                    className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium"
                                                                >
                                                                    ✏️ Editar Nombre / Categoría
                                                                </button>

                                                                {prod.tipo === 'serializado' ? (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedProducto(prod);
                                                                            setShowModalAddUnidad(true);
                                                                        }}
                                                                        className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium border-t border-slate-100"
                                                                    >
                                                                        ➕ Añadir N° de Serie
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedProducto(prod);
                                                                            setDataGen({
                                                                                stock_generico_total: prod.stock_generico_total,
                                                                                motivo: '',
                                                                            });
                                                                            setShowModalStockGenerico(true);
                                                                        }}
                                                                        className="block w-full text-left px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-bold border-t border-slate-100"
                                                                    >
                                                                        ✏️ Cambiar Cantidad Stock
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => {
                                                                        if (prod.tipo === 'serializado' && prod.unidades.length > 0) {
                                                                            setSelectedProducto(prod);
                                                                            setShowModalUnidadesList(true);
                                                                        } else {
                                                                            setQrModalData({
                                                                                producto: prod,
                                                                                unidad: { codigo_unidad: prod.codigo || `PROD-${prod.id}` }
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="block w-full text-left px-4 py-2 text-xs text-rose-700 font-bold hover:bg-rose-50 border-t border-slate-100"
                                                                >
                                                                    📱 Ver / Imprimir Etiquetas QR
                                                                </button>
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Módulo de Ingreso de Stock Ingestión Rápida */}
            {showModalIngresarStockModulo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase block">Ingreso de Equipos y Donaciones</span>
                                <h3 className="text-base font-bold text-slate-900">Módulo de Ingreso de Stock</h3>
                            </div>
                            <button onClick={() => setShowModalIngresarStockModulo(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleIngresarStockModuloSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Selecciona el Equipo al que llegó Stock *</label>
                                <select
                                    required
                                    value={selectedModuloProdId}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSelectedModuloProdId(val);
                                        const prod = productos.data.find(p => p.id === parseInt(val, 10));
                                        if (prod) setDataMod('codigo_base', prod.codigo);
                                    }}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="">-- Seleccionar Equipo o Insumo --</option>
                                    {productos.data.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nombre} ({p.categoria}) — {p.tipo === 'serializado' ? 'Control por N° Serie' : 'Control por Cantidad'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedModuloProd && (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">¿Cuántas Unidades llegaron a la Fundación? *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={dataMod.cantidad}
                                            onChange={(e) => setDataMod('cantidad', parseInt(e.target.value, 10) || 1)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-base font-black text-emerald-700 focus:border-emerald-500 focus:ring-emerald-500"
                                        />
                                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                                            Escribe la cantidad física que se va a sumar al inventario (ej: 1, 3, 5, 10).
                                        </p>
                                    </div>

                                    {selectedModuloProd.tipo === 'serializado' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1">Prefijo o Código Base de Serie</label>
                                            <input
                                                type="text"
                                                placeholder="Ej: CAM o SIL"
                                                value={dataMod.codigo_base}
                                                onChange={(e) => setDataMod('codigo_base', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                            />
                                            <p className="text-[11px] text-slate-500 mt-1">
                                                El sistema generará automáticamente {dataMod.cantidad || 1} código(s) de serie continuos (ej: {dataMod.codigo_base || 'SERIE'}-001, {dataMod.codigo_base || 'SERIE'}-002...).
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1">Origen o Motivo del Ingreso</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Donación de la familia Soto / Compra municipal"
                                            value={dataMod.observaciones}
                                            onChange={(e) => setDataMod('observaciones', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={procMod || !selectedModuloProdId}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs disabled:opacity-50"
                            >
                                Confirmar e Ingresar ({dataMod.cantidad || 1} unidades) al Inventario
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Cambiar Stock Genérico */}
            {showModalStockGenerico && selectedProducto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-emerald-600 uppercase block">Actualizar Cantidad</span>
                                <h3 className="text-base font-bold text-slate-900">{selectedProducto.nombre}</h3>
                            </div>
                            <button onClick={() => setShowModalStockGenerico(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleStockGenericoSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nueva Cantidad Total en Inventario *</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={dataGen.stock_generico_total}
                                    onChange={(e) => setDataGen('stock_generico_total', parseInt(e.target.value, 10))}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Stock actual: {selectedProducto.stock_generico_total} unidades ({selectedProducto.stock_generico_disponible} disponibles).
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Motivo del Ajuste</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Recepción de donación de 5 unidades"
                                    value={dataGen.motivo}
                                    onChange={(e) => setDataGen('motivo', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={procGen}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs"
                            >
                                Guardar Nuevo Stock
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Ver Unidades Serializadas */}
            {showModalUnidadesList && selectedProducto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase block">Unidades Grabadas</span>
                                <h3 className="text-base font-bold text-slate-900">{selectedProducto.nombre}</h3>
                            </div>
                            <button onClick={() => setShowModalUnidadesList(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                            {selectedProducto.unidades.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                                    No hay unidades registradas para este equipo.
                                </div>
                            ) : (
                                selectedProducto.unidades.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                            <span className="font-bold text-slate-900">🏷️ {u.codigo_unidad}</span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-900 border border-rose-200/80">
                                                🏢 {u.sucursal ? u.sucursal.nombre : 'Casa Matriz'}
                                            </span>
                                            {u.observaciones && <span className="text-slate-500 font-medium">({u.observaciones})</span>}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setQrModalData({ producto: selectedProducto, unidad: u })}
                                                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-lg text-[11px] flex items-center space-x-1 shadow-2xs cursor-pointer"
                                                title="Ver e Imprimir Código QR para Etiqueta Adhesiva"
                                            >
                                                <span>📱</span>
                                                <span>QR</span>
                                            </button>

                                            <select
                                                value={u.estado}
                                                onChange={(e) => handleUpdateUnidadEstado(u.id, e.target.value)}
                                                className="text-xs font-bold py-1 px-2.5 rounded-lg border-slate-200 focus:ring-rose-500"
                                            >
                                                <option value="disponible">🟢 Disponible</option>
                                                <option value="prestado">🔴 Prestado</option>
                                                <option value="mantencion">🟡 Mantención</option>
                                                <option value="baja">⚪ Baja</option>
                                            </select>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                            <button
                                onClick={() => {
                                    setShowModalUnidadesList(false);
                                    setShowModalAddUnidad(true);
                                }}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg transition-colors border border-rose-200"
                            >
                                + Agregar Otra Unidad
                            </button>
                            <button
                                onClick={() => setShowModalUnidadesList(false)}
                                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Crear/Editar Producto */}
            {showModalProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase block">Inventario</span>
                                <h3 className="text-base font-bold text-slate-900">{editingProduct ? 'Editar Equipo' : 'Nuevo Equipo'}</h3>
                            </div>
                            <button onClick={() => setShowModalProduct(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleSubmitProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Equipo o Insumo *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Cama Clínica Eléctrica 3 Posiciones"
                                    value={dataProd.nombre}
                                    onChange={(e) => setDataProd('nombre', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Código Único *</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!!editingProduct}
                                        placeholder="Ej: CAMA-01"
                                        value={dataProd.codigo}
                                        onChange={(e) => setDataProd('codigo', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 disabled:bg-slate-100"
                                    />
                                    {errProd.codigo && <p className="text-red-600 text-xs mt-1">{errProd.codigo}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Categoría *</label>
                                    {isCustomCategory ? (
                                        <div className="space-y-1">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ej: Sillas de Baño..."
                                                value={customCategoryName}
                                                onChange={(e) => setCustomCategoryName(e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl border border-rose-300 ring-2 ring-rose-500/20 text-sm font-semibold text-slate-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsCustomCategory(false)}
                                                className="text-xs font-bold text-rose-600 hover:underline"
                                            >
                                                ← Elegir de la lista
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            value={dataProd.categoria}
                                            onChange={(e) => {
                                                if (e.target.value === '__NEW__') {
                                                    setIsCustomCategory(true);
                                                } else {
                                                    setDataProd('categoria', e.target.value);
                                                }
                                            }}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                        >
                                            {categorias.map((cat, i) => (
                                                <option key={i} value={cat}>{cat}</option>
                                            ))}
                                            <option value="__NEW__">➕ Escribir Nueva Categoría...</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            {!editingProduct && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">¿Cómo se controla este equipo? *</label>
                                    <select
                                        value={dataProd.tipo}
                                        onChange={(e) => setDataProd('tipo', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    >
                                        <option value="serializado">🏷️ Por Unidad Individual (Camas, Sillas, Andadores)</option>
                                        <option value="stock_generico">📦 Por Cantidad General (Colchones, Pañales)</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Estado Físico / Condición *</label>
                                {isCustomEstado ? (
                                    <div className="space-y-1">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ej: Reacondicionado Taller, Usado 90%..."
                                            value={customEstadoName}
                                            onChange={(e) => setCustomEstadoName(e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-xl border border-rose-300 ring-2 ring-rose-500/20 text-sm font-semibold text-slate-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomEstado(false)}
                                            className="text-xs font-bold text-rose-600 hover:underline"
                                        >
                                            ← Elegir de la lista
                                        </button>
                                    </div>
                                ) : (
                                    <select
                                        value={dataProd.estado_fisico || 'Nuevo'}
                                        onChange={(e) => {
                                            if (e.target.value === '__NEW_ESTADO__') {
                                                setIsCustomEstado(true);
                                            } else {
                                                setDataProd('estado_fisico', e.target.value);
                                            }
                                        }}
                                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                    >
                                        {estados && estados.length > 0 ? (
                                            estados.map((est) => (
                                                <option key={est.id} value={est.nombre}>{est.nombre}</option>
                                            ))
                                        ) : (
                                            <>
                                                <option value="Nuevo">🟢 Nuevo</option>
                                                <option value="Usado (Excelente Estado)">🟢 Usado (Excelente Estado)</option>
                                                <option value="Usado (Buen Estado)">🟢 Usado (Buen Estado)</option>
                                                <option value="Usado (Regular)">🟡 Usado (Regular)</option>
                                                <option value="Reacondicionado">🔵 Reacondicionado</option>
                                                <option value="En Mantención / Taller">🔧 En Mantención / Taller</option>
                                                <option value="Dado de Baja / Descartado">⚠️ Dado de Baja</option>
                                            </>
                                        )}
                                        <option value="__NEW_ESTADO__">➕ Escribir Nuevo Estado Físico...</option>
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Notas o Descripción</label>
                                <textarea
                                    rows={2}
                                    value={dataProd.descripcion}
                                    onChange={(e) => setDataProd('descripcion', e.target.value)}
                                    placeholder="Indicaciones de uso o características..."
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={procProd}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs"
                            >
                                {editingProduct ? 'Actualizar Cambios' : 'Guardar Equipo'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Agregar Unidad Serializada */}
            {showModalAddUnidad && selectedProducto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase block">Agregar Unidad</span>
                                <h3 className="text-base font-bold text-slate-900">{selectedProducto.nombre}</h3>
                            </div>
                            <button onClick={() => setShowModalAddUnidad(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <form onSubmit={handleAddUnidadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Código o N° de Serie Grabado *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: CAM-005 o SIL-010"
                                    value={dataUni.codigo_unidad}
                                    onChange={(e) => setDataUni('codigo_unidad', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                {errUni.codigo_unidad && <p className="text-red-600 text-xs mt-1">{errUni.codigo_unidad}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Estado Físico Inicial del Equipo *</label>
                                <select
                                    value={dataUni.estado}
                                    onChange={(e) => setDataUni('estado', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="disponible">🟢 Disponible en Bodega (Listo para Préstamo)</option>
                                    <option value="mantencion">🔧 En Mantención / Taller (Requiere Reparación)</option>
                                    <option value="baja">⚠️ Dado de Baja (Defectuoso / Descartado)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Notas de Estado u Origen</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Donación recibida sanitizada y en buen estado"
                                    value={dataUni.observaciones}
                                    onChange={(e) => setDataUni('observaciones', e.target.value)}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={procUni}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-2xs"
                            >
                                Registrar Unidad de Serie
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Previsualización e Impresión de Etiqueta QR / NFC */}
            {qrModalData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                                Etiqueta Adhesiva QR & NFC
                            </span>
                            <button onClick={() => setQrModalData(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        {/* Printable Tag Container */}
                        <div id="printable-qr-label" className="p-4 bg-white border-2 border-slate-900 rounded-3xl space-y-3 text-center shadow-xs">
                            <div className="border-b border-slate-200 pb-2">
                                <span className="text-[10px] font-extrabold uppercase text-rose-600 block tracking-widest">
                                    FUNDACIÓN MIGUEL ÁNGEL GAMBOA
                                </span>
                            </div>

                            <div className="flex justify-center py-1">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalData.unidad.codigo_unidad)}`}
                                    alt={`QR Code ${qrModalData.unidad.codigo_unidad}`}
                                    className="w-36 h-36 border border-slate-100 p-1.5 rounded-2xl shadow-2xs"
                                />
                            </div>

                            <div className="bg-slate-100/90 p-3 rounded-2xl text-center">
                                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">N° SERIE / CÓDIGO DE UNIDAD</span>
                                <span className="text-base font-black text-rose-700 block tracking-wide mt-0.5">{qrModalData.unidad.codigo_unidad}</span>
                            </div>
                        </div>

                        {/* Indicación de Grabado NFC */}
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 text-left space-y-1">
                            <span className="font-extrabold text-slate-800 flex items-center space-x-1">
                                <span>📡</span>
                                <span>¿Cómo grabar un Chip/Tag NFC adhesivo?</span>
                            </span>
                            <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                                En una App gratuita (ej: <strong>NFC Tools</strong>) ➔ Elige <strong>Escribir ➔ Texto</strong> ➔ Digita exactamente: <strong className="text-rose-700 font-mono">{qrModalData.unidad.codigo_unidad}</strong> y acerca el sticker NFC al celular.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    const win = window.open('', '_blank');
                                    win.document.write(`
                                        <!DOCTYPE html>
                                        <html>
                                            <head>
                                                <title>Etiqueta QR - ${qrModalData.unidad.codigo_unidad}</title>
                                                <style>
                                                    * { box-sizing: border-box; }
                                                    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; }
                                                    .sticker-card { width: 65mm; border: 2px solid #0f172a; border-radius: 16px; padding: 12px 14px; text-align: center; background: #fff; }
                                                    .header { font-size: 8px; font-weight: 800; text-transform: uppercase; color: #e11d48; letter-spacing: 0.6px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; margin-bottom: 10px; }
                                                    .qr-container { display: flex; justify-content: center; margin: 4px 0 10px 0; }
                                                    img { width: 34mm; height: 34mm; border-radius: 12px; border: 1px solid #f1f5f9; padding: 2px; display: block; margin: 0 auto; }
                                                    .code-pill { background: #f1f5f9; border-radius: 12px; padding: 8px 6px; text-align: center; }
                                                    .code-label { font-size: 7.5px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 2px; }
                                                    .unit-code { font-family: inherit; font-size: 14px; font-weight: 900; color: #be123c; letter-spacing: 0.5px; display: block; }
                                                </style>
                                            </head>
                                            <body onload="setTimeout(function() { window.print(); }, 400);">
                                                <div class="sticker-card">
                                                    <div class="header">FUNDACIÓN MIGUEL ÁNGEL GAMBOA</div>
                                                    <div class="qr-container">
                                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrModalData.unidad.codigo_unidad)}" alt="QR" />
                                                    </div>
                                                    <div class="code-pill">
                                                        <span class="code-label">N° SERIE / CÓDIGO DE UNIDAD</span>
                                                        <span class="unit-code">${qrModalData.unidad.codigo_unidad}</span>
                                                    </div>
                                                </div>
                                            </body>
                                        </html>
                                    `);
                                    win.document.close();
                                }}
                                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                            >
                                <span>🖨️</span>
                                <span>Imprimir Etiqueta Adhesiva</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Impresión Masiva de Etiquetas QR & NFC */}
            {showModalBatchQr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block">Ahorro de Papel & Adhesivos</span>
                                <h3 className="text-base font-bold text-slate-900">🖨️ Impresión Masiva de Etiquetas QR</h3>
                            </div>
                            <button onClick={() => setShowModalBatchQr(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start space-x-2.5">
                            <span className="text-base">💡</span>
                            <div className="space-y-0.5">
                                <strong className="block font-bold">¿Cómo funciona la Impresión Masiva?</strong>
                                <p className="text-indigo-800 text-[11px] leading-relaxed">
                                    Selecciona todas las etiquetas que desees imprimir juntas. El sistema organizará automáticamente las etiquetas en un pliego (3 etiquetas por fila) para que las imprimas todas en una sola hoja de adhesivos sin malgastar papel.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                            <button
                                type="button"
                                onClick={handleToggleSelectAllBatch}
                                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-lg shadow-2xs"
                            >
                                {selectedBatchUnidades.length === allUnitsList.length ? '◻️ Deseleccionar Todos' : '☑️ Seleccionar Todos'}
                            </button>
                            <span className="font-extrabold text-slate-700">
                                {selectedBatchUnidades.length} de {allUnitsList.length} etiqueta(s) seleccionada(s)
                            </span>
                        </div>

                        <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1 border border-slate-100 p-2 rounded-2xl">
                            {allUnitsList.length === 0 ? (
                                <div className="p-6 text-center text-xs text-slate-500">No hay productos ni unidades registradas para imprimir.</div>
                            ) : (
                                allUnitsList.map((item) => (
                                    <label
                                        key={item.id}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                                            selectedBatchUnidades.includes(item.id)
                                                ? 'bg-indigo-50/50 border-indigo-300 font-bold text-slate-900'
                                                : 'bg-white border-slate-200 text-slate-600 opacity-70'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedBatchUnidades.includes(item.id)}
                                                onChange={() => handleToggleBatchItem(item.id)}
                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                            />
                                            <div>
                                                <span className="block font-bold text-slate-900">{item.producto_nombre}</span>
                                                <span className="text-[11px] text-slate-500 font-mono">Código Identificador: <strong>{item.codigo_unidad}</strong></span>
                                            </div>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>

                        <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setShowModalBatchQr(false)}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={handlePrintBatchSheet}
                                disabled={selectedBatchUnidades.length === 0}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                            >
                                <span>🖨️</span>
                                <span>Imprimir Pliego ({selectedBatchUnidades.length} Etiquetas)</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Traslado de Inventario entre Sucursales */}
            <ModalTraslado
                isOpen={showModalTraslado}
                onClose={() => setShowModalTraslado(false)}
                productos={productos.data || []}
                sucursales={sucursales}
            />

            {/* Modal Historial de Traslados de Inventario */}
            {showModalHistorialTraslados && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <div>
                                <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">Trazabilidad de Movimientos</span>
                                <h3 className="text-lg font-bold text-slate-900">📜 Historial de Traslados entre Sucursales</h3>
                            </div>
                            <button onClick={() => setShowModalHistorialTraslados(false)} className="text-slate-400 hover:text-slate-600 p-1 font-bold">✕</button>
                        </div>

                        <div>
                            {trasladosRecientes.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                                    No hay movimientos de traslado registrados aún entre sucursales.
                                </div>
                            ) : (
                                <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-slate-200">
                                    <table className="w-full text-left text-xs text-slate-700">
                                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider sticky top-0">
                                            <tr>
                                                <th className="p-3">Ref / Fecha</th>
                                                <th className="p-3">Origen ➔ Destino</th>
                                                <th className="p-3">Producto / Serie</th>
                                                <th className="p-3 text-center">Cantidad</th>
                                                <th className="p-3">Emisor</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {trasladosRecientes.map(t => (
                                                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="p-3">
                                                        <span className="font-mono font-bold text-slate-900 block">{t.codigo_traslado}</span>
                                                        <span className="text-[11px] text-slate-400">{new Date(t.created_at).toLocaleString('es-CL')}</span>
                                                    </td>
                                                    <td className="p-3 font-medium">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-semibold">{t.origen?.nombre || 'Casa Matriz'}</span>
                                                            <span>➔</span>
                                                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 text-[11px] font-bold">{t.destino?.nombre}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="font-bold text-slate-800 block">{t.producto?.nombre}</span>
                                                        {t.unidad && (
                                                            <span className="text-[11px] font-mono text-rose-600 block">N° Serie: {t.unidad.codigo_unidad}</span>
                                                        )}
                                                        {t.observaciones && (
                                                            <span className="text-[11px] text-slate-400 block italic">{t.observaciones}</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3 text-center font-bold text-slate-900 text-sm">
                                                        {t.cantidad}
                                                    </td>
                                                    <td className="p-3 text-slate-600">
                                                        {t.usuario_emisor?.name || 'Sistema'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setShowModalHistorialTraslados(false)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                            >
                                Cerrar Historial
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
