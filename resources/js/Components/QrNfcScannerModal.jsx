import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QrNfcScannerModal({ isOpen, onClose, onScanSuccess, title = "Escáner Móvil QR / Tag NFC" }) {
    const [manualCode, setManualCode] = useState('');
    const [isNfcActive, setIsNfcActive] = useState(false);
    const [nfcError, setNfcError] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [scannedResult, setScannedResult] = useState(null);

    const html5QrcodeRef = useRef(null);
    const isScanningRef = useRef(false);

    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            setScannedResult(null);
            setManualCode('');
            return;
        }

        // Start QR Camera Scanner
        startCamera();

        // Start NFC Reader if supported on Android / Mobile Chrome
        if ('NDEFReader' in window) {
            try {
                const ndef = new window.NDEFReader();
                ndef.scan().then(() => {
                    setIsNfcActive(true);
                    ndef.onreading = (event) => {
                        const decoder = new TextDecoder();
                        for (const record of event.message.records) {
                            const text = decoder.decode(record.data);
                            if (text) {
                                handleCodeDetected(text, 'NFC');
                                break;
                            }
                        }
                    };
                }).catch((err) => {
                    setNfcError('NFC no activo o sin permisos en este navegador.');
                });
            } catch (err) {
                setNfcError('Error al iniciar lectura NFC.');
            }
        } else {
            setNfcError('NFC disponible en navegadores móviles Android.');
        }

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const startCamera = async () => {
        setCameraError(null);
        try {
            const element = document.getElementById("qr-reader-container");
            if (!element) return;

            if (!html5QrcodeRef.current) {
                html5QrcodeRef.current = new Html5Qrcode("qr-reader-container");
            }
            const html5Qrcode = html5QrcodeRef.current;

            const config = { fps: 15, qrbox: { width: 250, height: 250 } };

            try {
                // Try rear camera first (mobile)
                await html5Qrcode.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        handleCodeDetected(decodedText, 'QR');
                    },
                    () => {}
                );
            } catch (envErr) {
                // Fallback to front webcam (laptops / desktops)
                await html5Qrcode.start(
                    { facingMode: "user" },
                    config,
                    (decodedText) => {
                        handleCodeDetected(decodedText, 'QR');
                    },
                    () => {}
                );
            }
            isScanningRef.current = true;
        } catch (err) {
            console.error("Camera error:", err);
            setCameraError("No se pudo acceder a la cámara. Asegúrate de otorgar permisos de cámara o prueba subir una imagen.");
        }
    };

    const stopCamera = async () => {
        if (html5QrcodeRef.current && isScanningRef.current) {
            try {
                await html5QrcodeRef.current.stop();
                await html5QrcodeRef.current.clear();
            } catch (err) {
                console.log("Camera cleanup error:", err);
            }
            isScanningRef.current = false;
        }
    };

    const handleCodeDetected = (code, type = 'QR') => {
        if (!code) return;
        let cleanCode = code.trim();

        // Sanitize code if it's a URL or prefixed identifier
        cleanCode = cleanCode.replace(/\/+$/, '');
        if (cleanCode.includes('?')) {
            cleanCode = cleanCode.split('?')[0];
        }
        if (cleanCode.includes('/')) {
            cleanCode = cleanCode.split('/').pop();
        }
        if (cleanCode.toUpperCase().startsWith('FG-UNIT:')) {
            cleanCode = cleanCode.slice(8);
        }

        setScannedResult({ code: cleanCode, type });

        // Play subtle success audio feedback if browser allows
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            // Audio context fallback
        }

        // Trigger parent callback
        if (onScanSuccess) {
            onScanSuccess(cleanCode);
        }

        stopCamera();
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualCode.trim()) {
            handleCodeDetected(manualCode.trim(), 'Manual');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="text-left">
                        <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block flex items-center space-x-1">
                            <svg className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                            </svg>
                            <span>Módulo Móvil Terreno</span>
                        </span>
                        <h3 className="text-base font-black text-slate-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Scanned Success Display */}
                {scannedResult ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 animate-fade-in">
                        <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto shadow-md">
                            ✓
                        </div>
                        <h4 className="text-sm font-black text-emerald-950">
                            ¡Código Identificado ({scannedResult.type})!
                        </h4>
                        <div className="p-2 bg-white rounded-xl border border-emerald-200 font-mono font-black text-rose-700 text-sm">
                            {scannedResult.code}
                        </div>
                        <p className="text-xs text-emerald-800 font-semibold">
                            Cargando datos del equipo en el comodato...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Camera Container */}
                        <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 min-h-[260px] flex items-center justify-center">
                            <div id="qr-reader-container" className="w-full text-white text-xs"></div>
                            
                            {cameraError && (
                                <div className="absolute inset-0 p-4 bg-slate-900/95 text-white flex flex-col items-center justify-center space-y-2 text-center">
                                    <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-xs font-bold text-rose-400">{cameraError}</p>
                                    <p className="text-[11px] text-slate-400">
                                        Usa la entrada manual a continuación para ingresar el código.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* NFC Status Indicator */}
                        <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                            <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 010-7.778M12.354 19.349a9.5 9.5 0 000-13.628M16.596 22.293a13.5 13.5 0 000-19.47" />
                                </svg>
                                <span>Lector NFC:</span>
                            </div>
                            {isNfcActive ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-full border border-emerald-200 animate-pulse">
                                    Aproxima el Chip NFC
                                </span>
                            ) : (
                                <span className="text-slate-500 font-medium">
                                    {nfcError || 'Disponible en Android Chrome con NFC'}
                                </span>
                            )}
                        </div>

                        {/* Manual Code Input Fallback */}
                        <form onSubmit={handleManualSubmit} className="space-y-2 pt-1 border-t border-slate-100">
                            <label className="block text-[11px] font-bold text-slate-600 uppercase text-left flex items-center space-x-1">
                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m0 14v1m8-8h-1M5 12H4m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                                </svg>
                                <span>Entrada Manual / Escáner de Código de Barras</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ej: PROD-CAM-01-005"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-900 focus:border-rose-500 focus:ring-rose-500"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition-all shrink-0"
                                >
                                    Ingresar
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                    >
                        Cerrar Escáner
                    </button>
                </div>

            </div>
        </div>
    );
}
