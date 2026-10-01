<?php

namespace App\Http\Controllers;

use App\Models\Beneficiario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Barryvdh\DomPDF\Facade\Pdf;

class BeneficiarioController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Beneficiario::withCount(['comodatos']);

        if ($buscar = $request->input('buscar')) {
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                  ->orWhere('rut', 'like', "%{$buscar}%")
                  ->orWhere('comuna', 'like', "%{$buscar}%")
                  ->orWhere('sector', 'like', "%{$buscar}%")
                  ->orWhere('direccion', 'like', "%{$buscar}%")
                  ->orWhere('telefono', 'like', "%{$buscar}%")
                  ->orWhere('representante_nombre', 'like', "%{$buscar}%")
                  ->orWhere('representante_rut', 'like', "%{$buscar}%");
            });
        }

        $paginated = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        $paginated->getCollection()->transform(function ($b) {
            $hasCedula = !empty($b->cedula_path) && Storage::disk('public')->exists($b->cedula_path);
            $hasDoc = !empty($b->documento_adicional_path) && Storage::disk('public')->exists($b->documento_adicional_path);

            $extCedula = $hasCedula ? strtolower(pathinfo($b->cedula_path, PATHINFO_EXTENSION)) : '';
            $extDoc = $hasDoc ? strtolower(pathinfo($b->documento_adicional_path, PATHINFO_EXTENSION)) : '';

            $b->cedula_url = $hasCedula ? Storage::url($b->cedula_path) : null;
            $b->is_cedula_image = in_array($extCedula, ['jpg', 'jpeg', 'png', 'webp']);
            $b->is_cedula_pdf = $extCedula === 'pdf';

            $b->documento_adicional_url = $hasDoc ? Storage::url($b->documento_adicional_path) : null;
            $b->is_doc_adicional_image = in_array($extDoc, ['jpg', 'jpeg', 'png', 'webp']);
            $b->is_doc_adicional_pdf = $extDoc === 'pdf';

            return $b;
        });

        return Inertia::render('Beneficiarios/Index', [
            'beneficiarios' => $paginated,
            'filtros' => [
                'buscar' => $buscar ?? '',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'rut' => ['nullable', 'string', 'max:50'],
            'comuna' => ['nullable', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'fecha_registro' => ['required', 'date'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'contacto_adicional' => ['nullable', 'string', 'max:255'],
            'parentesco' => ['nullable', 'string', 'max:255'],
            'representante_nombre' => ['nullable', 'string', 'max:255'],
            'representante_rut' => ['nullable', 'string', 'max:50'],
            'representante_telefono' => ['nullable', 'string', 'max:50'],
            'representante_direccion' => ['nullable', 'string', 'max:255'],
            'representante_comuna' => ['nullable', 'string', 'max:255'],
            'representante_sector' => ['nullable', 'string', 'max:255'],
            'observaciones' => ['nullable', 'string'],
            'cedula_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
            'documento_adicional_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
        ]);

        $cedulaPath = null;
        $cedulaOriginalName = null;
        if ($request->hasFile('cedula_file')) {
            $file = $request->file('cedula_file');
            $cedulaOriginalName = $file->getClientOriginalName();
            $cedulaPath = $file->store('documentos_beneficiarios', 'public');
        }

        $docPath = null;
        $docOriginalName = null;
        if ($request->hasFile('documento_adicional_file')) {
            $file = $request->file('documento_adicional_file');
            $docOriginalName = $file->getClientOriginalName();
            $docPath = $file->store('documentos_beneficiarios', 'public');
        }

        Beneficiario::create(array_merge($validated, [
            'cedula_path' => $cedulaPath,
            'cedula_original_name' => $cedulaOriginalName,
            'documento_adicional_path' => $docPath,
            'documento_adicional_original_name' => $docOriginalName,
        ]));

        return redirect()->back()->with('success', 'Beneficiario, representante y documentos registrados correctamente.');
    }

    public function update(Request $request, Beneficiario $beneficiario): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'rut' => ['nullable', 'string', 'max:50'],
            'comuna' => ['nullable', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'fecha_registro' => ['required', 'date'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:50'],
            'contacto_adicional' => ['nullable', 'string', 'max:255'],
            'parentesco' => ['nullable', 'string', 'max:255'],
            'representante_nombre' => ['nullable', 'string', 'max:255'],
            'representante_rut' => ['nullable', 'string', 'max:50'],
            'representante_telefono' => ['nullable', 'string', 'max:50'],
            'representante_direccion' => ['nullable', 'string', 'max:255'],
            'representante_comuna' => ['nullable', 'string', 'max:255'],
            'representante_sector' => ['nullable', 'string', 'max:255'],
            'observaciones' => ['nullable', 'string'],
            'estado' => ['required', 'in:activo,inactivo'],
            'cedula_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
            'documento_adicional_file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
        ]);

        if ($request->hasFile('cedula_file')) {
            if ($beneficiario->cedula_path && Storage::disk('public')->exists($beneficiario->cedula_path)) {
                Storage::disk('public')->delete($beneficiario->cedula_path);
            }
            $file = $request->file('cedula_file');
            $beneficiario->cedula_original_name = $file->getClientOriginalName();
            $beneficiario->cedula_path = $file->store('documentos_beneficiarios', 'public');
        }

        if ($request->hasFile('documento_adicional_file')) {
            if ($beneficiario->documento_adicional_path && Storage::disk('public')->exists($beneficiario->documento_adicional_path)) {
                Storage::disk('public')->delete($beneficiario->documento_adicional_path);
            }
            $file = $request->file('documento_adicional_file');
            $beneficiario->documento_adicional_original_name = $file->getClientOriginalName();
            $beneficiario->documento_adicional_path = $file->store('documentos_beneficiarios', 'public');
        }

        $beneficiario->update($validated);

        return redirect()->back()->with('success', 'Datos del beneficiario y documentos actualizados.');
    }

    public function searchJson(Request $request): JsonResponse
    {
        $buscar = trim($request->input('query', ''));
        if (empty($buscar)) {
            return response()->json([]);
        }

        $cleanBuscar = preg_replace('/[^0-9kK]/', '', $buscar);

        $beneficiarios = Beneficiario::where('estado', 'activo')
            ->where(function ($q) use ($buscar, $cleanBuscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                  ->orWhere('rut', 'like', "%{$buscar}%")
                  ->orWhere('comuna', 'like', "%{$buscar}%")
                  ->orWhere('sector', 'like', "%{$buscar}%")
                  ->orWhere('representante_nombre', 'like', "%{$buscar}%")
                  ->orWhere('representante_rut', 'like', "%{$buscar}%");
                if (!empty($cleanBuscar)) {
                    $q->orWhereRaw("REPLACE(REPLACE(rut, '.', ''), '-', '') LIKE ?", ["%{$cleanBuscar}%"])
                      ->orWhereRaw("REPLACE(REPLACE(representante_rut, '.', ''), '-', '') LIKE ?", ["%{$cleanBuscar}%"]);
                }
            })
            ->take(15)
            ->get();

        return response()->json($beneficiarios);
    }

    public function downloadPdf()
    {
        $beneficiarios = Beneficiario::orderBy('nombre')->get();
        $pdf = Pdf::loadView('pdf.reporte_beneficiarios', compact('beneficiarios'));
        return $pdf->stream('Directorio-Beneficiarios-Fundacion-Gamboa.pdf');
    }

    public function exportExcel()
    {
        $beneficiarios = Beneficiario::orderBy('nombre')->get();
        $filename = "Directorio-Beneficiarios-Fundacion-Gamboa-" . date('Y-m-d') . ".xls";

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($beneficiarios) {
            echo '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
            echo '<table border="1" style="border-collapse: collapse;">';
            echo '<tr style="background-color: #be123c; color: #ffffff; font-weight: bold; text-align: left;">';
            echo '<th style="padding: 8px;">Nombre Beneficiario</th>';
            echo '<th style="padding: 8px;">RUT Beneficiario</th>';
            echo '<th style="padding: 8px;">Comuna</th>';
            echo '<th style="padding: 8px;">Sector / Población / Villa</th>';
            echo '<th style="padding: 8px;">Dirección</th>';
            echo '<th style="padding: 8px;">Teléfono Principal</th>';
            echo '<th style="padding: 8px;">Parentesco / Rol</th>';
            echo '<th style="padding: 8px;">Representante / Familiar que Retira</th>';
            echo '<th style="padding: 8px;">RUT Representante</th>';
            echo '<th style="padding: 8px;">Teléfono Representante</th>';
            echo '<th style="padding: 8px;">Fecha Registro</th>';
            echo '<th style="padding: 8px;">Estado</th>';
            echo '</tr>';

            foreach ($beneficiarios as $b) {
                echo '<tr>';
                echo '<td style="padding: 6px; font-weight: bold;">' . htmlspecialchars($b->nombre) . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->rut ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->comuna ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->sector ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->direccion ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->telefono ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->parentesco ?? 'Paciente Directo') . '</td>';
                echo '<td style="padding: 6px; font-weight: bold; color: #4338ca;">' . htmlspecialchars($b->representante_nombre ?? 'El mismo beneficiario') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->representante_rut ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->representante_telefono ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . ($b->fecha_registro ? date('d/m/Y', strtotime($b->fecha_registro)) : '-') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($b->estado) . '</td>';
                echo '</tr>';
            }

            echo '</table></body></html>';
        };

        return response()->stream($callback, 200, $headers);
    }
}
