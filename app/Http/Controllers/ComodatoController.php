<?php

namespace App\Http\Controllers;

use App\Models\Comodato;
use App\Models\ComodatoItem;
use App\Models\ProductoInventario;
use App\Models\UnidadProducto;
use App\Models\Beneficiario;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ComodatoController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Comodato::with(['beneficiario', 'responsable', 'sucursal', 'items.producto', 'items.unidad']);

        if ($buscar = $request->input('buscar')) {
            $query->where(function ($q) use ($buscar) {
                $q->where('codigo', 'like', "%{$buscar}%")
                  ->orWhereHas('beneficiario', function ($b) use ($buscar) {
                      $b->where('nombre', 'like', "%{$buscar}%")
                        ->orWhere('rut', 'like', "%{$buscar}%");
                  });
            });
        }

        if ($estado = $request->input('estado')) {
            $query->where('estado', $estado);
        }

        if ($sucursalId = $request->input('sucursal_id')) {
            $query->where('sucursal_id', $sucursalId);
        }

        $comodatos = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        $comodatosActivosQuery = Comodato::where('estado', 'activo')
            ->with(['beneficiario', 'sucursal', 'items.producto', 'items.unidad']);

        if ($sucursalId) {
            $comodatosActivosQuery->where('sucursal_id', $sucursalId);
        }

        $comodatosActivos = $comodatosActivosQuery->orderBy('id', 'desc')->get();
        $sucursales = \App\Models\Sucursal::where('activa', true)->orderBy('es_casa_matriz', 'desc')->get();

        return Inertia::render('Comodatos/Index', [
            'comodatos' => $comodatos,
            'comodatosActivos' => $comodatosActivos,
            'sucursales' => $sucursales,
            'filtros' => [
                'buscar' => $buscar ?? '',
                'estado' => $estado ?? '',
                'sucursal_id' => $sucursalId ?? '',
            ],
            'estadisticas' => [
                'totales' => Comodato::count(),
                'activos' => Comodato::where('estado', 'activo')->count(),
                'en_seguimiento' => Comodato::where('estado', 'en_seguimiento')->count(),
                'devueltos' => Comodato::where('estado', 'devuelto')->count(),
            ]
        ]);
    }

    public function create(Request $request): Response
    {
        $sucursalId = $request->input('sucursal_id') ?? auth()->user()->sucursal_id ?? 1;

        $beneficiarios = Beneficiario::where('estado', 'activo')->orderBy('nombre')->get();
        
        $productosSerializados = ProductoInventario::where('tipo', 'serializado')
            ->where('estado', 'activo')
            ->with(['unidadesDisponibles' => function ($q) use ($sucursalId) {
                if ($sucursalId) {
                    $q->where('sucursal_id', $sucursalId);
                }
            }])
            ->get();

        $productosGenericos = ProductoInventario::where('tipo', 'stock_generico')
            ->where('estado', 'activo')
            ->with(['stocksSucursales'])
            ->get();

        $sucursales = \App\Models\Sucursal::where('activa', true)->orderBy('es_casa_matriz', 'desc')->get();

        return Inertia::render('Comodatos/Create', [
            'beneficiarios' => $beneficiarios,
            'productosSerializados' => $productosSerializados,
            'productosGenericos' => $productosGenericos,
            'sucursales' => $sucursales,
            'sucursalId' => $sucursalId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'beneficiario_id' => ['required', 'exists:beneficiarios,id'],
            'sucursal_id' => ['nullable', 'exists:sucursales,id'],
            'fecha_entrega' => ['required', 'date'],
            'fecha_estimada_devolucion' => ['nullable', 'date', 'after_or_equal:fecha_entrega'],
            'observaciones_entrega' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.producto_id' => ['required', 'exists:productos_inventario,id'],
            'items.*.unidad_producto_id' => ['nullable', 'exists:unidades_producto,id'],
            'items.*.cantidad' => ['required', 'integer', 'min:1'],
        ]);

        $sucursalId = $validated['sucursal_id'] ?? auth()->user()->sucursal_id ?? 1;

        DB::beginTransaction();
        try {
            // El código definitivo se genera después de crear el registro, a partir de su
            // id autoincremental real (MAX(id)+1 puede colisionar si algún comodato fue eliminado,
            // ya que el contador de autoincremento de MySQL no reutiliza esos ids).
            $comodato = Comodato::create([
                'codigo' => 'TEMP-' . Str::uuid(),
                'beneficiario_id' => $validated['beneficiario_id'],
                'responsable_entrega_id' => auth()->id() ?? 1,
                'sucursal_id' => $sucursalId,
                'fecha_entrega' => $validated['fecha_entrega'],
                'fecha_estimada_devolucion' => $validated['fecha_estimada_devolucion'] ?? null,
                'estado' => 'activo',
                'observaciones_entrega' => $validated['observaciones_entrega'] ?? null,
            ]);

            $comodato->update([
                'codigo' => 'COM-' . date('Y') . '-' . str_pad($comodato->id, 4, '0', STR_PAD_LEFT),
            ]);

            foreach ($validated['items'] as $itemData) {
                $producto = ProductoInventario::findOrFail($itemData['producto_id']);

                if ($producto->tipo === 'serializado' && !empty($itemData['unidad_producto_id'])) {
                    $unidad = UnidadProducto::findOrFail($itemData['unidad_producto_id']);
                    $unidad->update(['estado' => 'prestado']);

                    ComodatoItem::create([
                        'comodato_id' => $comodato->id,
                        'producto_id' => $producto->id,
                        'unidad_producto_id' => $unidad->id,
                        'cantidad' => 1,
                    ]);

                    MovimientoInventario::create([
                        'producto_id' => $producto->id,
                        'unidad_producto_id' => $unidad->id,
                        'tipo' => 'salida',
                        'comodato_id' => $comodato->id,
                        'usuario_id' => auth()->id() ?? 1,
                        'fecha' => now(),
                        'observaciones' => "Entrega en Comodato {$comodato->codigo} a " . $comodato->beneficiario->nombre,
                    ]);
                } else {
                    $cantidad = (int) $itemData['cantidad'];
                    $producto->decrement('stock_generico_disponible', $cantidad);

                    // Descontar stock genérico de la sucursal específica
                    $stockSucursal = \App\Models\ProductoSucursalStock::firstOrCreate(
                        ['producto_id' => $producto->id, 'sucursal_id' => $sucursalId],
                        ['stock_total' => 0, 'stock_disponible' => 0]
                    );
                    $stockSucursal->decrement('stock_disponible', $cantidad);

                    ComodatoItem::create([
                        'comodato_id' => $comodato->id,
                        'producto_id' => $producto->id,
                        'unidad_producto_id' => null,
                        'cantidad' => $cantidad,
                    ]);

                    MovimientoInventario::create([
                        'producto_id' => $producto->id,
                        'unidad_producto_id' => null,
                        'tipo' => 'salida',
                        'comodato_id' => $comodato->id,
                        'usuario_id' => auth()->id() ?? 1,
                        'fecha' => now(),
                        'observaciones' => "Entrega de stock {$cantidad} unidades en Comodato {$comodato->codigo}",
                    ]);
                }
            }

            $comodato->load(['beneficiario', 'responsable', 'items.producto', 'items.unidad']);
            $pdf = Pdf::loadView('pdf.comodato', compact('comodato'));
            $pdfPath = 'comodatos/pdf/' . $comodato->codigo . '.pdf';
            Storage::disk('public')->put($pdfPath, $pdf->output());

            $comodato->update(['documento_pdf_path' => $pdfPath]);

            DB::commit();

            return redirect()->route('comodatos.show', $comodato->id)
                ->with('success', "¡Comodato {$comodato->codigo} registrado con éxito! El documento PDF ha sido generado.");

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al registrar el comodato: ' . $e->getMessage()]);
        }
    }

    public function show(Comodato $comodato): Response
    {
        $comodato->load(['beneficiario', 'responsable', 'sucursal', 'items.producto', 'items.unidad', 'movimientos.usuario']);

        return Inertia::render('Comodatos/Show', [
            'comodato' => $comodato,
        ]);
    }

    public function update(Request $request, Comodato $comodato): RedirectResponse
    {
        $validated = $request->validate([
            'fecha_entrega' => ['required', 'date'],
            'fecha_estimada_devolucion' => ['nullable', 'date', 'after_or_equal:fecha_entrega'],
            'observaciones_entrega' => ['nullable', 'string'],
        ]);

        $comodato->update($validated);

        return redirect()->back()->with('success', "Préstamo {$comodato->codigo} actualizado correctamente.");
    }

    public function destroy(Comodato $comodato): RedirectResponse
    {
        DB::beginTransaction();
        try {
            $comodato->load(['items.unidad', 'items.producto']);

            if ($comodato->estado === 'activo') {
                foreach ($comodato->items as $item) {
                    if ($item->unidad) {
                        $item->unidad->update(['estado' => 'disponible']);
                    } else {
                        $item->producto->increment('stock_generico_disponible', $item->cantidad);
                    }
                }
            }

            MovimientoInventario::where('comodato_id', $comodato->id)->delete();
            $comodato->items()->delete();
            $comodato->delete();

            DB::commit();

            return redirect()->route('comodatos.index')->with('success', "Comodato {$comodato->codigo} eliminado correctamente y stock restaurado.");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al eliminar el comodato: ' . $e->getMessage()]);
        }
    }

    public function downloadPdf(Comodato $comodato)
    {
        $comodato->load(['beneficiario', 'responsable', 'items.producto', 'items.unidad']);
        $pdf = Pdf::loadView('pdf.comodato', compact('comodato'));
        return $pdf->stream("Comodato-{$comodato->codigo}.pdf");
    }

    public function downloadDevolucionPdf(Comodato $comodato)
    {
        $comodato->load(['beneficiario', 'responsable', 'items.producto', 'items.unidad']);
        $pdf = Pdf::loadView('pdf.devolucion', compact('comodato'));
        return $pdf->stream("Acta-Devolucion-{$comodato->codigo}.pdf");
    }

    public function uploadSigned(Request $request, Comodato $comodato): RedirectResponse
    {
        $request->validate([
            'documento_firmado' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        if ($request->hasFile('documento_firmado')) {
            $path = $request->file('documento_firmado')->store('comodatos/firmados', 'public');
            $comodato->update(['documento_firmado_path' => $path]);
        }

        return redirect()->back()->with('success', 'Documento firmado adjuntado correctamente.');
    }

    public function devolucion(Request $request, Comodato $comodato): RedirectResponse
    {
        $validated = $request->validate([
            'fecha_devolucion_real' => ['required', 'date'],
            'observaciones_devolucion' => ['nullable', 'string'],
        ]);

        DB::beginTransaction();
        try {
            $comodato->load(['items.unidad', 'items.producto']);

            foreach ($comodato->items as $item) {
                if ($item->unidad) {
                    $item->unidad->update(['estado' => 'disponible']);

                    MovimientoInventario::create([
                        'producto_id' => $item->producto_id,
                        'unidad_producto_id' => $item->unidad_producto_id,
                        'tipo' => 'entrada',
                        'comodato_id' => $comodato->id,
                        'usuario_id' => auth()->id() ?? 1,
                        'fecha' => Carbon::parse($validated['fecha_devolucion_real']),
                        'observaciones' => "Devolución de Comodato {$comodato->codigo}",
                    ]);
                } else {
                    $item->producto->increment('stock_generico_disponible', $item->cantidad);

                    $stockSucursal = \App\Models\ProductoSucursalStock::firstOrCreate(
                        ['producto_id' => $item->producto_id, 'sucursal_id' => $comodato->sucursal_id ?? 1],
                        ['stock_total' => 0, 'stock_disponible' => 0]
                    );
                    $stockSucursal->increment('stock_disponible', $item->cantidad);

                    MovimientoInventario::create([
                        'producto_id' => $item->producto_id,
                        'unidad_producto_id' => null,
                        'tipo' => 'entrada',
                        'comodato_id' => $comodato->id,
                        'usuario_id' => auth()->id() ?? 1,
                        'fecha' => Carbon::parse($validated['fecha_devolucion_real']),
                        'observaciones' => "Devolución de {$item->cantidad} unidades de stock genérico de Comodato {$comodato->codigo}",
                    ]);
                }
            }

            $comodato->update([
                'estado' => 'devuelto',
                'fecha_devolucion_real' => $validated['fecha_devolucion_real'],
                'observaciones_devolucion' => $validated['observaciones_devolucion'] ?? null,
            ]);

            DB::commit();

            return redirect()->back()->with('success', "Comodato {$comodato->codigo} marcado como devuelto y stock restablecido.");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al procesar la devolución: ' . $e->getMessage()]);
        }
    }

    public function exportExcel()
    {
        $comodatos = Comodato::with(['beneficiario', 'items.producto', 'items.unidad'])
            ->orderBy('id', 'desc')
            ->get();

        $filename = "Prestamos-Comodatos-Fundacion-Gamboa-" . date('Y-m-d') . ".xls";

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($comodatos) {
            echo '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
            echo '<table border="1" style="border-collapse: collapse;">';
            echo '<tr style="background-color: #be123c; color: #ffffff; font-weight: bold; text-align: left;">';
            echo '<th style="padding: 8px;">Código Ficha</th>';
            echo '<th style="padding: 8px;">Beneficiario</th>';
            echo '<th style="padding: 8px;">RUT</th>';
            echo '<th style="padding: 8px;">Comuna</th>';
            echo '<th style="padding: 8px;">Teléfono</th>';
            echo '<th style="padding: 8px;">Equipos Entregados</th>';
            echo '<th style="padding: 8px;">Fecha Entrega</th>';
            echo '<th style="padding: 8px;">Fecha Est. Devolución</th>';
            echo '<th style="padding: 8px;">Estado</th>';
            echo '</tr>';

            foreach ($comodatos as $c) {
                $itemsArr = [];
                foreach ($c->items as $i) {
                    $itemsArr[] = $i->producto->nombre . ($i->unidad ? " ({$i->unidad->codigo_unidad})" : "");
                }

                echo '<tr>';
                echo '<td style="padding: 6px; font-weight: bold;">' . htmlspecialchars($c->codigo) . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($c->beneficiario->nombre) . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($c->beneficiario->rut ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($c->beneficiario->comuna ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($c->beneficiario->telefono ?? 'N/A') . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars(implode(', ', $itemsArr)) . '</td>';
                echo '<td style="padding: 6px;">' . date('d/m/Y', strtotime($c->fecha_entrega)) . '</td>';
                echo '<td style="padding: 6px;">' . ($c->fecha_estimada_devolucion ? date('d/m/Y', strtotime($c->fecha_estimada_devolucion)) : 'Indefinido') . '</td>';
                echo '<td style="padding: 6px; font-weight: bold;">' . ($c->estado === 'activo' ? 'En Préstamo' : ($c->estado === 'devuelto' ? 'Devuelto' : $c->estado)) . '</td>';
                echo '</tr>';
            }

            echo '</table></body></html>';
        };

        return response()->stream($callback, 200, $headers);
    }
}
