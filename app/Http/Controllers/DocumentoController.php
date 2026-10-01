<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\Sucursal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentoController extends Controller
{
    /**
     * Display a listing of the documents.
     */
    public function index(Request $request)
    {
        $query = Documento::with(['user', 'sucursal'])->latest();

        // Search text
        if ($request->filled('buscar')) {
            $search = $request->buscar;
            $query->where(function ($q) use ($search) {
                $q->where('titulo', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%")
                  ->orWhere('archivo_nombre_original', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('categoria')) {
            $query->where('categoria', $request->categoria);
        }

        // Sede filter
        if ($request->filled('sucursal_id')) {
            $query->where('sucursal_id', $request->sucursal_id);
        }

        // File format filter (pdf, word, excel, imagen)
        if ($request->filled('formato')) {
            $fmt = strtolower($request->formato);
            if ($fmt === 'pdf') {
                $query->where('archivo_extension', 'pdf');
            } elseif ($fmt === 'word') {
                $query->whereIn('archivo_extension', ['doc', 'docx']);
            } elseif ($fmt === 'excel') {
                $query->whereIn('archivo_extension', ['xls', 'xlsx', 'csv']);
            } elseif ($fmt === 'imagen') {
                $query->whereIn('archivo_extension', ['jpg', 'jpeg', 'png', 'webp']);
            }
        }

        $documentos = $query->paginate(15)->withQueryString();

        // Calculate Executive Summary Metrics
        $totalDocs = Documento::count();
        $totalBytes = Documento::sum('tamano_bytes');
        $totalMbFormatted = number_format($totalBytes / 1048576, 1, ',', '.') . ' MB';

        $desgloseFormatos = [
            'pdf' => Documento::where('archivo_extension', 'pdf')->count(),
            'word' => Documento::whereIn('archivo_extension', ['doc', 'docx'])->count(),
            'excel' => Documento::whereIn('archivo_extension', ['xls', 'xlsx', 'csv'])->count(),
            'imagen' => Documento::whereIn('archivo_extension', ['jpg', 'jpeg', 'png', 'webp'])->count(),
        ];

        $categoriasPreset = [
            'Convenios y Alianzas',
            'Estatutos y Personería',
            'Plantillas y Formularios',
            'Informes y Balances',
            'Contratos y Legal',
            'General',
        ];

        $sucursales = Sucursal::where('activa', true)->get(['id', 'nombre', 'es_casa_matriz']);

        return Inertia::render('Documentos/Index', [
            'documentos' => $documentos,
            'filtros' => $request->only(['buscar', 'categoria', 'formato', 'sucursal_id']),
            'metricas' => [
                'total_documentos' => $totalDocs,
                'total_mb' => $totalMbFormatted,
                'desglose' => $desgloseFormatos,
            ],
            'categoriasPreset' => $categoriasPreset,
            'sucursales' => $sucursales,
        ]);
    }

    /**
     * Store a newly uploaded document.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'categoria' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:1000',
            'fecha_documento' => 'nullable|date',
            'sucursal_id' => 'nullable|exists:sucursales,id',
            'archivo' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,webp|max:20480',
        ], [
            'archivo.required' => 'Debes adjuntar un archivo (PDF, Word, Excel o Imagen).',
            'archivo.mimes' => 'Formato no soportado. Formatos permitidos: PDF, Word (.doc, .docx), Excel (.xls, .xlsx) e imágenes.',
            'archivo.max' => 'El tamaño del archivo no puede exceder los 20 MB.',
        ]);

        $file = $request->file('archivo');
        $originalName = $file->getClientOriginalName();
        $extension = strtolower($file->getClientOriginalExtension());
        $mimeType = $file->getClientMimeType();
        $sizeBytes = $file->getSize();

        // Store file in storage/app/public/documentos
        $path = $file->store('documentos', 'public');

        Documento::create([
            'titulo' => $validated['titulo'],
            'categoria' => $validated['categoria'],
            'descripcion' => $validated['descripcion'] ?? null,
            'fecha_documento' => $validated['fecha_documento'] ?? now()->toDateString(),
            'archivo_nombre_original' => $originalName,
            'archivo_path' => $path,
            'archivo_extension' => $extension,
            'mime_type' => $mimeType,
            'tamano_bytes' => $sizeBytes,
            'sucursal_id' => $validated['sucursal_id'] ?? null,
            'user_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Documento subido y registrado correctamente.');
    }

    /**
     * Update an existing document metadata or replace file.
     */
    public function update(Request $request, Documento $documento)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'categoria' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:1000',
            'fecha_documento' => 'nullable|date',
            'sucursal_id' => 'nullable|exists:sucursales,id',
            'archivo' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,webp|max:20480',
        ]);

        if ($request->hasFile('archivo')) {
            // Remove old physical file if exists
            if ($documento->archivo_path && Storage::disk('public')->exists($documento->archivo_path)) {
                Storage::disk('public')->delete($documento->archivo_path);
            }

            $file = $request->file('archivo');
            $documento->archivo_nombre_original = $file->getClientOriginalName();
            $documento->archivo_extension = strtolower($file->getClientOriginalExtension());
            $documento->mime_type = $file->getClientMimeType();
            $documento->tamano_bytes = $file->getSize();
            $documento->archivo_path = $file->store('documentos', 'public');
        }

        $documento->titulo = $validated['titulo'];
        $documento->categoria = $validated['categoria'];
        $documento->descripcion = $validated['descripcion'] ?? null;
        $documento->fecha_documento = $validated['fecha_documento'] ?? $documento->fecha_documento;
        $documento->sucursal_id = $validated['sucursal_id'] ?? null;
        $documento->save();

        return redirect()->back()->with('success', 'Documento actualizado correctamente.');
    }

    /**
     * Securely download the document file.
     */
    public function download(Documento $documento)
    {
        if (!$documento->archivo_path || !Storage::disk('public')->exists($documento->archivo_path)) {
            abort(404, 'El archivo solicitado no se encuentra en el servidor.');
        }

        return Storage::disk('public')->download(
            $documento->archivo_path,
            $documento->archivo_nombre_original
        );
    }

    /**
     * Stream inline preview for PDF and image files.
     */
    public function preview(Documento $documento)
    {
        if (!$documento->archivo_path || !Storage::disk('public')->exists($documento->archivo_path)) {
            abort(404, 'El archivo solicitado no existe.');
        }

        return Storage::disk('public')->response(
            $documento->archivo_path,
            $documento->archivo_nombre_original,
            ['Content-Type' => $documento->mime_type ?: 'application/octet-stream']
        );
    }

    /**
     * Soft delete document record and physical file.
     */
    public function destroy(Documento $documento)
    {
        if ($documento->archivo_path && Storage::disk('public')->exists($documento->archivo_path)) {
            Storage::disk('public')->delete($documento->archivo_path);
        }

        $documento->delete();

        return redirect()->back()->with('success', 'Documento eliminado correctamente.');
    }
}
