import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import QrNfcScannerModal from '@/Components/QrNfcScannerModal';
import { showAlert } from '@/Utils/alerts';

export default function Create({ beneficiarios = [], productosSerializados = [], productosGenericos = [], sucursales = [], sucursalId = 1 }) {
    const { data, setData, post, processing, errors } = useForm({
        beneficiario_id: '',
        sucursal_id: sucursalId || (sucursales[0]?.id || 1),
        fecha_entrega: new Date().toISOString().split('T')[0],
        fecha_estimada_devolucion: '',
        observaciones_entrega: '',
        items: [],
    });

    const [selectedType, setSelectedType] = useState('serializado');
    const [selectedProdSerial, setSelectedProdSerial] = useState('');
    const [selectedUnidadSerial, setSelectedUnidadSerial] = useState('');
    
    const [selectedProdGenerico, setSelectedProdGenerico] = useState('');
    const [cantidadGenerico, setCantidadGenerico] = useState(1);

    // Mobile Scanner Modal State
    const [showScannerModal, setShowScannerModal] = useState(false);

    const handleScanQrNfc = (scannedCode) => {
        let cleanScannedCode = (scannedCode || '').trim();
        cleanScannedCode = cleanScannedCode.replace(/\/+$/, '');
        if (cleanScannedCode.includes('?')) {
            cleanScannedCode = cleanScannedCode.split('?')[0];
        }
        if (cleanScannedCode.includes('/')) {
            cleanScannedCode = cleanScannedCode.split('/').pop();
        }
        if (cleanScannedCode.toUpperCase().startsWith('FG-UNIT:')) {
            cleanScannedCode = cleanScannedCode.slice(8);
        }

        const targetLower = cleanScannedCode.toLowerCase();

        let foundProd = null;
        let foundUni = null;
        let isGeneric = false;

        // 1. Search in Serialized Product Units (by codigo_unidad, numero_serie, or unit id)
        for (const prod of (productosSerializados || [])) {
            const list = prod.unidades_disponibles || prod.unidades || [];
            const uni = list.find(
                u => (u.codigo_unidad && u.codigo_unidad.toLowerCase() === targetLower) ||
                     (u.numero_serie && u.numero_serie.toLowerCase() === targetLower) ||
                     (u.id && String(u.id) === cleanScannedCode)
            );
            if (uni) {
                foundProd = prod;
                foundUni = uni;
                break;
            }
        }

        // 2. If found in Serialized Product Units
        if (foundProd && foundUni) {
            if (foundUni.sucursal_id && parseInt(foundUni.sucursal_id) !== parseInt(data.sucursal_id)) {
                const branchName = sucursales.find(s => s.id === foundUni.sucursal_id)?.nombre || 'otra sucursal';
                showAlert({
                    title: '⚠️ Equipo Pertenece a Otra Sucursal',
                    text: `La unidad ${foundUni.codigo_unidad} está asignada a "${branchName}". Para entregarla desde esta sucursal, primero realiza un traslado de inventario.`,
                    icon: 'warning'
                });
                setShowScannerModal(false);
                return;
            }

            if (data.items.some(i => i.unidad_producto_id === foundUni.id)) {
                showAlert({
                    title: 'ℹ️ Equipo Ya Agregado',
                    text: `La unidad ${foundUni.codigo_unidad} de ${foundProd.nombre} ya está en la lista del comodato.`,
                    icon: 'warning'
                });
                setShowScannerModal(false);
                return;
            }

            const newItem = {
                producto_id: foundProd.id,
                producto_nombre: foundProd.nombre,
                unidad_producto_id: foundUni.id,
                codigo_unidad: foundUni.codigo_unidad,
                cantidad: 1,
            };

            setData('items', [...data.items, newItem]);
            showAlert({
                title: '✓ ¡Equipo Identificado!',
                text: `Se agregó ${foundProd.nombre} (${foundUni.codigo_unidad}) al comodato exitosamente.`,
                icon: 'success'
            });
            setShowScannerModal(false);
            return;
        }

        // 3. Search in Generic Products (Insumos/Stock genérico by codigo, ID, or PROD-ID)
        for (const prod of (productosGenericos || [])) {
            if (
                (prod.codigo && prod.codigo.toLowerCase() === targetLower) ||
                (`prod-${prod.id}`.toLowerCase() === targetLower) ||
                (String(prod.id) === cleanScannedCode)
            ) {
                foundProd = prod;
                isGeneric = true;
                break;
            }
        }

        if (foundProd && isGeneric) {
            const stockSuc = (foundProd.stocks_sucursales || []).find(s => s.sucursal_id === parseInt(data.sucursal_id));
            const actualStock = stockSuc ? stockSuc.stock_disponible : 0;

            const existingIndex = data.items.findIndex(i => i.producto_id === foundProd.id && !i.unidad_producto_id);
            if (existingIndex >= 0) {
                const updatedItems = [...data.items];
                if (updatedItems[existingIndex].cantidad >= actualStock) {
                    showAlert({
                        title: '⚠️ Stock Máximo de Sucursal Alcanzado',
                        text: `No hay más stock disponible de ${foundProd.nombre} en esta sucursal (Disponible: ${actualStock}).`,
                        icon: 'warning'
                    });
                    setShowScannerModal(false);
                    return;
                }
                updatedItems[existingIndex].cantidad += 1;
                setData('items', [...updatedItems]);
                showAlert({
                    title: '✓ Cantidad Incrementada',
                    text: `Se incrementó a ${updatedItems[existingIndex].cantidad} unidades de ${foundProd.nombre}.`,
                    icon: 'success'
                });
            } else {
                if (actualStock < 1) {
                    showAlert({
                        title: '⚠️ Insumo Sin Stock en Sucursal',
                        text: `No hay unidades disponibles de ${foundProd.nombre} en la sucursal seleccionada.`,
                        icon: 'warning'
                    });
                    setShowScannerModal(false);
                    return;
                }
                const newItem = {
                    producto_id: foundProd.id,
                    producto_nombre: foundProd.nombre,
                    unidad_producto_id: null,
                    codigo_unidad: null,
                    cantidad: 1,
                };
                setData('items', [...data.items, newItem]);
                showAlert({
                    title: '✓ Insumo Identificado',
                    text: `Se agregó 1 unidad de ${foundProd.nombre} al comodato.`,
                    icon: 'success'
                });
            }
            setShowScannerModal(false);
            return;
        }

        // 4. Search in Serialized Products by product code/id (picks first available unit in current branch)
        for (const prod of (productosSerializados || [])) {
            if (
                (prod.codigo && prod.codigo.toLowerCase() === targetLower) ||
                (`prod-${prod.id}`.toLowerCase() === targetLower) ||
                (String(prod.id) === cleanScannedCode)
            ) {
                const list = (prod.unidades_disponibles || prod.unidades || []).filter(u => u.sucursal_id === parseInt(data.sucursal_id));
                const firstAvailable = list.find(u => !data.items.some(i => i.unidad_producto_id === u.id));
                if (firstAvailable) {
                    const newItem = {
                        producto_id: prod.id,
                        producto_nombre: prod.nombre,
                        unidad_producto_id: firstAvailable.id,
                        codigo_unidad: firstAvailable.codigo_unidad,
                        cantidad: 1,
                    };
                    setData('items', [...data.items, newItem]);
                    showAlert({
                        title: '✓ ¡Equipo Identificado!',
                        text: `Se asignó la unidad disponible ${firstAvailable.codigo_unidad} de ${prod.nombre}.`,
                        icon: 'success'
                    });
                    setShowScannerModal(false);
                    return;
                }
            }
        }

        // 5. Not found in any product type or unit
        showAlert({
            title: '⚠️ Código No Encontrado',
            text: `No se encontró ninguna unidad o insumo disponible en esta sucursal con el código "${cleanScannedCode}".`,
            icon: 'error'
        });
        setShowScannerModal(false);
    };

    // Live search state for Beneficiario by RUT / Nombre
    const [beneficiarioSearch, setBeneficiarioSearch] = useState('');
    const [searchResults, setSearchResults] = useState(beneficiarios);
    const [isSearching, setIsSearching] = useState(false);
    const [showBeneficiarioDropdown, setShowBeneficiarioDropdown] = useState(false);
    const [selectedBeneficiarioObj, setSelectedBeneficiarioObj] = useState(null);
    const searchContainerRef = useRef(null);

    // Keep track of selected beneficiary object
    useEffect(() => {
        if (data.beneficiario_id) {
            const found = searchResults.find(b => b.id === data.beneficiario_id) || beneficiarios.find(b => b.id === data.beneficiario_id);
            if (found) setSelectedBeneficiarioObj(found);
        } else {
            setSelectedBeneficiarioObj(null);
        }
    }, [data.beneficiario_id, beneficiarios, searchResults]);

    // Live search effect: combination of fast client filter + AJAX DB query
    useEffect(() => {
        const query = beneficiarioSearch.trim();
        const searchClean = query.replace(/[^0-9kK]/g, '').toLowerCase();
        const searchLower = query.toLowerCase();

        // 1. Instant client filtering on initial prop array
        const clientFiltered = beneficiarios.filter((b) => {
            if (!query) return true;
            const nameMatch = b.nombre && b.nombre.toLowerCase().includes(searchLower);
            const rutMatch = b.rut && b.rut.toLowerCase().includes(searchLower);
            const cleanRutMatch = b.rut && searchClean && b.rut.replace(/[^0-9kK]/g, '').toLowerCase().includes(searchClean);
            const repNameMatch = b.representante_nombre && b.representante_nombre.toLowerCase().includes(searchLower);
            const repRutMatch = b.representante_rut && b.representante_rut.toLowerCase().includes(searchLower);
            const cleanRepRutMatch = b.representante_rut && searchClean && b.representante_rut.replace(/[^0-9kK]/g, '').toLowerCase().includes(searchClean);
            return nameMatch || rutMatch || cleanRutMatch || repNameMatch || repRutMatch || cleanRepRutMatch;
        });

        setSearchResults(clientFiltered);

        if (!query) {
            setIsSearching(false);
            return;
        }

        // 2. Debounced server-side AJAX query for large DB search
        setIsSearching(true);
        const timer = setTimeout(() => {
            fetch(route('beneficiarios.searchJson') + `?query=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(serverData => {
                    if (Array.isArray(serverData)) {
                        const ids = new Set(clientFiltered.map(b => b.id));
                        const combined = [...clientFiltered];
                        serverData.forEach(item => {
                            if (!ids.has(item.id)) combined.push(item);
                        });
                        setSearchResults(combined);
                    }
                    setIsSearching(false);
                })
                .catch(() => setIsSearching(false));
        }, 200);

        return () => clearTimeout(timer);
    }, [beneficiarioSearch, beneficiarios]);

    // Close search dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowBeneficiarioDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        setBeneficiarioSearch(e.target.value);
        setShowBeneficiarioDropdown(true);
    };

    const handleSelectBeneficiario = (b) => {
        setData('beneficiario_id', b.id);
        setSelectedBeneficiarioObj(b);
        setShowBeneficiarioDropdown(false);
        setBeneficiarioSearch('');
    };

    const handleClearBeneficiario = () => {
        setData('beneficiario_id', '');
        setSelectedBeneficiarioObj(null);
        setBeneficiarioSearch('');
    };

    const handleAddItemSerializado = () => {
        if (!selectedProdSerial || !selectedUnidadSerial) return;

        const prod = productosSerializados.find(p => p.id === parseInt(selectedProdSerial, 10));
        const uni = prod?.unidades_disponibles.find(u => u.id === parseInt(selectedUnidadSerial, 10));

        if (!prod || !uni) return;

        if (uni.sucursal_id && parseInt(uni.sucursal_id) !== parseInt(data.sucursal_id)) {
            const branchName = sucursales.find(s => s.id === uni.sucursal_id)?.nombre || 'otra sucursal';
            showAlert({
                title: '⚠️ Equipo de Otra Sucursal',
                text: `La unidad ${uni.codigo_unidad} está en "${branchName}". Debes hacer un traslado primero si deseas entregarla desde esta sede.`,
                icon: 'warning'
            });
            return;
        }

        if (data.items.some(i => i.unidad_producto_id === uni.id)) return;

        const newItem = {
            producto_id: prod.id,
            producto_nombre: prod.nombre,
            unidad_producto_id: uni.id,
            codigo_unidad: uni.codigo_unidad,
            cantidad: 1,
        };

        setData('items', [...data.items, newItem]);
        setSelectedUnidadSerial('');
    };

    const handleAddItemGenerico = () => {
        if (!selectedProdGenerico || cantidadGenerico < 1) return;

        const prod = productosGenericos.find(p => p.id === parseInt(selectedProdGenerico, 10));
        if (!prod) return;

        const stockSuc = (prod.stocks_sucursales || []).find(s => s.sucursal_id === parseInt(data.sucursal_id));
        const stockDisponible = stockSuc ? stockSuc.stock_disponible : 0;

        if (cantidadGenerico > stockDisponible) {
            showAlert({
                title: '⚠️ Stock Insuficiente en Sucursal',
                text: `Solo hay ${stockDisponible} unidades disponibles de ${prod.nombre} en la sucursal seleccionada.`,
                icon: 'warning'
            });
            return;
        }

        const newItem = {
            producto_id: prod.id,
            producto_nombre: prod.nombre,
            unidad_producto_id: null,
            codigo_unidad: 'Stock Genérico',
            cantidad: cantidadGenerico,
        };

        setData('items', [...data.items, newItem]);
        setSelectedProdGenerico('');
        setCantidadGenerico(1);
    };

    const handleRemoveItem = (index) => {
        const updated = [...data.items];
        updated.splice(index, 1);
        setData('items', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('comodatos.store'));
    };

    const activeProdSerialObj = productosSerializados.find(p => p.id === parseInt(selectedProdSerial, 10));

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-1">Paso a Paso</span>
                        <h1 className="text-2xl font-black text-slate-950">Emitir Nuevo Contrato de Comodato</h1>
                    </div>
                    <Link
                        href={route('comodatos.index')}
                        className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition-colors"
                    >
                        ← Volver al listado
                    </Link>
                </div>
            }
        >
            <Head title="Emitir Comodato — Sistema de Gestión Interno" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl space-y-8">
                        
                        {/* 1. Datos Generales */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">1</span>
                                    <span>Selección de Sucursal, Beneficiario y Fechas</span>
                                </div>
                                <Link
                                    href={route('beneficiarios.index')}
                                    target="_blank"
                                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center space-x-1"
                                >
                                    <span>+ Registrar Nuevo Beneficiario</span>
                                    <span>↗</span>
                                </Link>
                            </h3>

                            {/* Selector de Sucursal de Entrega */}
                            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-4a2 2 0 012-2h2a2 2 0 012 2v4m-6 0h6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-rose-950 uppercase tracking-wider">
                                            Sucursal de Entrega del Equipo *
                                        </label>
                                        <p className="text-xs text-rose-800 font-medium">
                                            El inventario y el contrato quedarán asociados a esta sede.
                                        </p>
                                    </div>
                                </div>
                                <select
                                    value={data.sucursal_id}
                                    onChange={(e) => {
                                        const newSucId = e.target.value;
                                        setData(prev => ({ ...prev, sucursal_id: newSucId, items: [] }));
                                        setSelectedProdSerial('');
                                        setSelectedUnidadSerial('');
                                        setSelectedProdGenerico('');
                                    }}
                                    className="px-4 py-2.5 rounded-xl border border-rose-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-rose-500 shadow-2xs bg-white min-w-[240px]"
                                >
                                    {sucursales.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre} {s.es_casa_matriz ? '(Sede Central)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Buscador de Beneficiario / Ficha Seleccionada */}
                                <div className="md:col-span-2 space-y-2 relative" ref={searchContainerRef}>
                                    <label className="block text-xs font-bold text-slate-700 uppercase flex items-center space-x-1.5">
                                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Buscar Beneficiario por RUT o Nombre *</span>
                                    </label>

                                    {!selectedBeneficiarioObj ? (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Digita RUT (ej: 12.345.678-9) o Nombre del paciente..."
                                                value={beneficiarioSearch}
                                                onChange={handleSearchChange}
                                                onFocus={() => setShowBeneficiarioDropdown(true)}
                                                className="w-full px-4 py-3 pl-10 pr-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 shadow-2xs"
                                            />
                                            <span className="absolute left-3.5 top-3.5 text-slate-400">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </span>

                                            {beneficiarioSearch && (
                                                <button
                                                    type="button"
                                                    onClick={() => setBeneficiarioSearch('')}
                                                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-sm font-bold"
                                                >
                                                    ✕
                                                </button>
                                            )}

                                            {showBeneficiarioDropdown && (
                                                <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-72 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
                                                    {isSearching && (
                                                        <div className="p-3 text-center text-xs font-bold text-rose-600 flex items-center justify-center space-x-2 bg-rose-50/50">
                                                            <span className="animate-spin">⏳</span>
                                                            <span>Buscando en la base de datos...</span>
                                                        </div>
                                                    )}

                                                    {searchResults.length > 0 ? (
                                                        searchResults.map((b) => (
                                                            <div
                                                                key={b.id}
                                                                onClick={() => handleSelectBeneficiario(b)}
                                                                className="p-3.5 hover:bg-rose-50/60 cursor-pointer transition-colors flex items-center justify-between group"
                                                            >
                                                                <div className="space-y-0.5">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="font-extrabold text-sm text-slate-900 group-hover:text-rose-700">
                                                                            {b.nombre}
                                                                        </span>
                                                                        {b.rut && (
                                                                            <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                                                                RUT: {b.rut}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs text-slate-500 font-medium">
                                                                        {b.comuna || 'Sin comuna'} {b.sector ? `• ${b.sector}` : ''} {b.telefono ? `| Tel: ${b.telefono}` : ''}
                                                                    </p>
                                                                    {b.representante_nombre && (
                                                                        <p className="text-[11px] text-indigo-700 font-bold">
                                                                            Retira: {b.representante_nombre} ({b.parentesco || 'Familiar'}) {b.representante_rut ? `- RUT: ${b.representante_rut}` : ''}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs font-bold text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    Seleccionar ➔
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-4 text-center space-y-2">
                                                            <p className="text-xs text-slate-500 font-bold">
                                                                No se encontraron beneficiarios coincidentes con "{beneficiarioSearch}"
                                                            </p>
                                                            <Link
                                                                href={route('beneficiarios.index')}
                                                                target="_blank"
                                                                className="inline-block px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 font-extrabold rounded-lg text-xs hover:bg-rose-100 transition-colors"
                                                            >
                                                                + Registrar Nuevo Beneficiario
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        /* Ficha de Beneficiario Seleccionado */
                                        <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl space-y-2 shadow-2xs">
                                            <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="px-2.5 py-0.5 bg-emerald-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        ✓ Beneficiario Seleccionado
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-500">ID #{selectedBeneficiarioObj.id}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleClearBeneficiario}
                                                    className="text-xs font-black text-rose-600 hover:text-rose-800 hover:underline flex items-center space-x-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    <span>Cambiar Beneficiario</span>
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Paciente Beneficiario</span>
                                                    <span className="font-black text-slate-900 text-sm">{selectedBeneficiarioObj.nombre}</span>
                                                    {selectedBeneficiarioObj.rut && (
                                                        <span className="block font-bold text-slate-600">RUT: {selectedBeneficiarioObj.rut}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Contacto y Residencia</span>
                                                    <span className="font-bold text-slate-800 block">{selectedBeneficiarioObj.telefono || 'Sin teléfono'}</span>
                                                    <span className="font-medium text-slate-600 block truncate">
                                                        {selectedBeneficiarioObj.direccion || 'Sin dirección'}, {selectedBeneficiarioObj.comuna || ''} {selectedBeneficiarioObj.sector ? `(${selectedBeneficiarioObj.sector})` : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {selectedBeneficiarioObj.representante_nombre && (
                                                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-indigo-900 font-semibold bg-white/60 p-2 rounded-xl">
                                                    <span><strong>Retira:</strong> {selectedBeneficiarioObj.representante_nombre} ({selectedBeneficiarioObj.parentesco || 'Familiar'})</span>
                                                    {selectedBeneficiarioObj.representante_rut && <span>RUT: {selectedBeneficiarioObj.representante_rut}</span>}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {errors.beneficiario_id && <p className="text-red-600 text-xs font-bold mt-1">{errors.beneficiario_id}</p>}
                                </div>

                                {/* Fecha de Entrega */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Fecha de Entrega *</label>
                                    <input
                                        type="date"
                                        required
                                        value={data.fecha_entrega}
                                        onChange={(e) => setData('fecha_entrega', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-rose-500 shadow-2xs"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Inclusión de Productos */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-slate-950 border-b border-slate-100 pb-3 flex items-center space-x-2">
                                <span className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">2</span>
                                <span>Agregar Equipos o Insumos al Comodato</span>
                            </h3>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedType('serializado')}
                                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                                selectedType === 'serializado' ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
                                            }`}
                                        >
                                            Equipo Serializado (N° Serie)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedType('generico')}
                                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                                selectedType === 'generico' ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200'
                                            }`}
                                        >
                                            Stock Genérico (Cantidad)
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowScannerModal(true)}
                                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0 animate-pulse cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                                        </svg>
                                        <span>Escanear QR / Leer NFC</span>
                                    </button>
                                </div>

                                {selectedType === 'serializado' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Producto</label>
                                            <select
                                                value={selectedProdSerial}
                                                onChange={(e) => {
                                                    setSelectedProdSerial(e.target.value);
                                                    setSelectedUnidadSerial('');
                                                }}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                                            >
                                                <option value="">-- Seleccionar --</option>
                                                {productosSerializados.map((p) => {
                                                    const unisSuc = (p.unidades_disponibles || []).filter(u => parseInt(u.sucursal_id, 10) === parseInt(data.sucursal_id, 10));
                                                    return (
                                                        <option key={p.id} value={p.id}>
                                                            {p.nombre} ({unisSuc.length} disp. en sede)
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Unidad / N° Serie Disponible</label>
                                            <select
                                                value={selectedUnidadSerial}
                                                onChange={(e) => setSelectedUnidadSerial(e.target.value)}
                                                disabled={!activeProdSerialObj}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold disabled:opacity-50"
                                            >
                                                <option value="">-- Seleccionar N° Serie --</option>
                                                {activeProdSerialObj?.unidades_disponibles
                                                    .filter(u => parseInt(u.sucursal_id, 10) === parseInt(data.sucursal_id, 10))
                                                    .map((u) => (
                                                        <option key={u.id} value={u.id}>
                                                            {u.codigo_unidad} {u.numero_serie ? `(N° Serie: ${u.numero_serie})` : ''}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddItemSerializado}
                                            disabled={!selectedUnidadSerial}
                                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs disabled:opacity-50"
                                        >
                                            + Añadir Equipo
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Producto Genérico</label>
                                            <select
                                                value={selectedProdGenerico}
                                                onChange={(e) => setSelectedProdGenerico(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                                            >
                                                <option value="">-- Seleccionar --</option>
                                                {productosGenericos.map((p) => {
                                                    const stockSuc = (p.stocks_sucursales || []).find(s => parseInt(s.sucursal_id, 10) === parseInt(data.sucursal_id, 10));
                                                    const cantSuc = stockSuc ? stockSuc.stock_disponible : 0;
                                                    return (
                                                        <option key={p.id} value={p.id}>
                                                            {p.nombre} ({cantSuc} disp. en sede)
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Cantidad</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={cantidadGenerico}
                                                onChange={(e) => setCantidadGenerico(parseInt(e.target.value, 10))}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleAddItemGenerico}
                                            disabled={!selectedProdGenerico}
                                            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-2xs disabled:opacity-50"
                                        >
                                            + Añadir Insumo
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Added Items List */}
                            <div className="space-y-2">
                                {data.items.length === 0 ? (
                                    <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center text-xs font-semibold text-slate-500">
                                        No has añadido ningún equipo o insumo al comodato todavía.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {data.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                                                <div className="flex items-center space-x-3">
                                                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-black">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <div className="font-extrabold text-slate-950 text-sm">{item.producto_nombre}</div>
                                                        <div className="text-xs font-bold text-rose-600">{item.codigo_unidad} • Cantidad: {item.cantidad}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveItem(idx)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    Quitar ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.items && <p className="text-red-600 text-xs font-bold">{errors.items}</p>}
                            </div>
                        </div>

                        {/* 3. Observaciones */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase">Observaciones Iniciales de la Entrega</label>
                            <textarea
                                rows={3}
                                value={data.observaciones_entrega}
                                onChange={(e) => setData('observaciones_entrega', e.target.value)}
                                placeholder="Condiciones físicas iniciales, requerimientos especiales o notas familiares..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing || data.items.length === 0}
                            className="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold rounded-2xl shadow-lg transition-all text-base disabled:opacity-50"
                        >
                            {processing ? 'Generando Comodato y Documento PDF...' : 'Emitir Comodato y Generar PDF'}
                        </button>

                    </form>

                </div>
            </div>

            {/* Escáner Móvil QR & NFC Modal */}
            <QrNfcScannerModal
                isOpen={showScannerModal}
                onClose={() => setShowScannerModal(false)}
                onScanSuccess={handleScanQrNfc}
                title="Escanear Código QR o Chip NFC de Equipo"
            />
        </AuthenticatedLayout>
    );
}
