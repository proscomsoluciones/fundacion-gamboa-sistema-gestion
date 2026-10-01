<?php

namespace App\Http\Controllers;

use App\Models\ProductoInventario;
use App\Models\UnidadProducto;
use App\Models\MovimientoInventario;
use App\Models\EstadoProducto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $query = ProductoInventario::with(['unidades.sucursal', 'stocksSucursales.sucursal']);

        $sucursalId = $request->input('sucursal_id');

        if ($buscar = $request->input('buscar')) {
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                  ->orWhere('codigo', 'like', "%{$buscar}%")
                  ->orWhere('categoria', 'like', "%{$buscar}%")
                  ->orWhere('estado_fisico', 'like', "%{$buscar}%");
            });
        }

        if ($categoria = $request->input('categoria')) {
            $query->where('categoria', $categoria);
        }

        if ($estado = $request->input('estado')) {
            if ($estado === 'disponible') {
                $query->where(function ($q) {
                    $q->whereHas('unidades', fn($u) => $u->where('estado', 'disponible'))
                      ->orWhere('stock_generico_disponible', '>', 0);
                });
            } elseif ($estado === 'prestado') {
                $query->whereHas('unidades', fn($u) => $u->where('estado', 'prestado'));
            } elseif ($estado === 'mantencion') {
                $query->whereHas('unidades', fn($u) => $u->where('estado', 'mantencion'));
            } elseif ($estado === 'baja') {
                $query->whereHas('unidades', fn($u) => $u->where('estado', 'baja'));
            } else {
                $query->where('estado_fisico', $estado);
            }
        }

        if ($sucursalId) {
            $query->where(function ($q) use ($sucursalId) {
                $q->whereHas('unidades', fn($u) => $u->where('sucursal_id', $sucursalId))
                  ->orWhereHas('stocksSucursales', fn($s) => $s->where('sucursal_id', $sucursalId)->where('stock_total', '>', 0));
            });
        }

        $productos = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();

        // Calculate total stats across ALL products for top KPI summary
        $allProductos = ProductoInventario::with(['unidades', 'stocksSucursales'])->get();
        $stats = [
            'total_productos' => $allProductos->count(),
            'unidades_disponibles' => 0,
            'unidades_prestadas' => 0,
            'unidades_mantencion' => 0,
            'unidades_baja' => 0,
        ];

        foreach ($allProductos as $p) {
            if ($p->tipo === 'serializado') {
                $unidadesQuery = $p->unidades;
                if ($sucursalId) {
                    $unidadesQuery = $unidadesQuery->where('sucursal_id', $sucursalId);
                }
                $stats['unidades_disponibles'] += $unidadesQuery->where('estado', 'disponible')->count();
                $stats['unidades_prestadas'] += $unidadesQuery->where('estado', 'prestado')->count();
                $stats['unidades_mantencion'] += $unidadesQuery->where('estado', 'mantencion')->count();
                $stats['unidades_baja'] += $unidadesQuery->where('estado', 'baja')->count();
            } else {
                if ($sucursalId) {
                    $st = $p->stocksSucursales->firstWhere('sucursal_id', $sucursalId);
                    if ($st) {
                        $stats['unidades_disponibles'] += $st->stock_disponible;
                        $stats['unidades_prestadas'] += max(0, $st->stock_total - $st->stock_disponible);
                    }
                } else {
                    $stats['unidades_disponibles'] += $p->stock_generico_disponible;
                    $stats['unidades_prestadas'] += max(0, $p->stock_generico_total - $p->stock_generico_disponible);
                }
            }
        }

        $defaultCategorias = [
            'Camas y Catres', 
            'Sillas de Ruedas', 
            'Colchones', 
            'Andadores', 
            'Sillas de Baño / W.C.',
            'Grúas de Traslado',
            'Bastones y Muletas',
            'Insumos Kinésicos'
        ];
        
        $dbCategorias = ProductoInventario::distinct()->pluck('categoria')->filter()->toArray();
        $categorias = array_values(array_unique(array_merge($defaultCategorias, $dbCategorias)));

        // Dynamic physical states list from database
        $estados = EstadoProducto::orderBy('orden')->orderBy('nombre')->get();
        $sucursales = \App\Models\Sucursal::where('activa', true)->orderBy('es_casa_matriz', 'desc')->get();

        $trasladosRecientes = \App\Models\TrasladoInventario::with(['origen', 'destino', 'producto', 'unidad', 'usuarioEmisor'])
            ->orderBy('id', 'desc')
            ->limit(30)
            ->get();

        return Inertia::render('Inventario/Productos/Index', [
            'productos' => $productos,
            'stats' => $stats,
            'filtros' => [
                'buscar' => $buscar ?? '',
                'categoria' => $categoria ?? '',
                'estado' => $estado ?? '',
                'sucursal_id' => $sucursalId ?? '',
            ],
            'categorias' => $categorias,
            'estados' => $estados,
            'sucursales' => $sucursales,
            'trasladosRecientes' => $trasladosRecientes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'codigo' => ['required', 'string', 'max:50', 'unique:productos_inventario,codigo'],
            'nombre' => ['required', 'string', 'max:255'],
            'categoria' => ['required', 'string', 'max:255'],
            'estado_fisico' => ['nullable', 'string', 'max:255'],
            'tipo' => ['required', 'in:serializado,stock_generico'],
            'descripcion' => ['nullable', 'string'],
            'stock_generico_total' => ['nullable', 'integer', 'min:0'],
            'observaciones' => ['nullable', 'string'],
        ]);

        $estadoFisico = trim($validated['estado_fisico'] ?? 'Nuevo');
        if (empty($estadoFisico)) {
            $estadoFisico = 'Nuevo';
        }

        // Ensure dynamic state exists in DB table
        if (!EstadoProducto::where('nombre', $estadoFisico)->exists()) {
            EstadoProducto::create([
                'nombre' => $estadoFisico,
                'slug' => Str::slug($estadoFisico),
                'tipo_disponibilidad' => 'disponible',
                'badge_color' => 'emerald',
                'descripcion' => 'Estado creado dinámicamente',
                'es_sistema' => false,
            ]);
        }

        $validated['estado_fisico'] = $estadoFisico;

        if ($validated['tipo'] === 'stock_generico') {
            $validated['stock_generico_disponible'] = $validated['stock_generico_total'] ?? 0;
        }

        $prod = ProductoInventario::create($validated);
        $sucursalId = $request->input('sucursal_id') ?? auth()->user()->sucursal_id ?? 1;

        if ($prod->tipo === 'stock_generico' && $prod->stock_generico_total > 0) {
            \App\Models\ProductoSucursalStock::create([
                'producto_id' => $prod->id,
                'sucursal_id' => $sucursalId,
                'stock_total' => $prod->stock_generico_total,
                'stock_disponible' => $prod->stock_generico_disponible,
            ]);

            MovimientoInventario::create([
                'producto_id' => $prod->id,
                'unidad_producto_id' => null,
                'tipo' => 'entrada',
                'comodato_id' => null,
                'usuario_id' => auth()->id() ?? 1,
                'fecha' => now(),
                'observaciones' => "Ingreso inicial de stock ({$prod->stock_generico_total} unidades) - Estado: {$estadoFisico}",
            ]);
        }

        return redirect()->back()->with('success', 'Producto registrado correctamente en el inventario.');
    }

    public function update(Request $request, ProductoInventario $producto): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'categoria' => ['required', 'string', 'max:255'],
            'estado_fisico' => ['nullable', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'observaciones' => ['nullable', 'string'],
        ]);

        if (!empty($validated['estado_fisico'])) {
            $estadoFisico = trim($validated['estado_fisico']);
            if (!EstadoProducto::where('nombre', $estadoFisico)->exists()) {
                EstadoProducto::create([
                    'nombre' => $estadoFisico,
                    'slug' => Str::slug($estadoFisico),
                    'tipo_disponibilidad' => 'disponible',
                    'badge_color' => 'emerald',
                    'descripcion' => 'Estado creado dinámicamente',
                    'es_sistema' => false,
                ]);
            }
            $validated['estado_fisico'] = $estadoFisico;
        }

        $producto->update($validated);

        $producto->update($validated);

        return redirect()->back()->with('success', 'Datos del producto actualizados correctamente.');
    }

    public function updateStock(Request $request, ProductoInventario $producto): RedirectResponse
    {
        $validated = $request->validate([
            'stock_generico_total' => ['required', 'integer', 'min:0'],
            'motivo' => ['nullable', 'string'],
        ]);

        $anteriorTotal = $producto->stock_generico_total;
        $nuevoTotal = (int) $validated['stock_generico_total'];
        $diferencia = $nuevoTotal - $anteriorTotal;

        $nuevoDisponible = max(0, $producto->stock_generico_disponible + $diferencia);

        $producto->update([
            'stock_generico_total' => $nuevoTotal,
            'stock_generico_disponible' => $nuevoDisponible,
        ]);

        MovimientoInventario::create([
            'producto_id' => $producto->id,
            'unidad_producto_id' => null,
            'tipo' => $diferencia >= 0 ? 'entrada' : 'ajuste',
            'comodato_id' => null,
            'usuario_id' => auth()->id() ?? 1,
            'fecha' => now(),
            'observaciones' => "Ajuste manual de stock de {$anteriorTotal} a {$nuevoTotal} unidades. " . ($validated['motivo'] ?? ''),
        ]);

        return redirect()->back()->with('success', "Stock actualizado correctamente de {$anteriorTotal} a {$nuevoTotal} unidades.");
    }

    public function ingresarStockModulo(Request $request, ProductoInventario $producto): RedirectResponse
    {
        $validated = $request->validate([
            'cantidad' => ['required', 'integer', 'min:1'],
            'codigo_base' => ['nullable', 'string', 'max:50'],
            'sucursal_id' => ['nullable', 'exists:sucursales,id'],
            'observaciones' => ['nullable', 'string'],
        ]);

        $cantidad = (int) $validated['cantidad'];
        $observaciones = $validated['observaciones'] ?? 'Ingreso de stock / donación recibida';
        $sucursalId = $validated['sucursal_id'] ?? auth()->user()->sucursal_id ?? 1;

        DB::beginTransaction();
        try {
            if ($producto->tipo === 'serializado') {
                $prefix = trim($validated['codigo_base'] ?? '');
                if (empty($prefix)) {
                    $prefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $producto->nombre), 0, 3));
                }

                $existentesCount = $producto->unidades()->count();

                for ($i = 1; $i <= $cantidad; $i++) {
                    $numStr = str_pad($existentesCount + $i, 3, '0', STR_PAD_LEFT);
                    $codigoUnidad = $prefix . '-' . $numStr;

                    while (UnidadProducto::where('codigo_unidad', $codigoUnidad)->exists()) {
                        $existentesCount++;
                        $numStr = str_pad($existentesCount + $i, 3, '0', STR_PAD_LEFT);
                        $codigoUnidad = $prefix . '-' . $numStr;
                    }

                    $unidad = $producto->unidades()->create([
                        'codigo_unidad' => $codigoUnidad,
                        'sucursal_id' => $sucursalId,
                        'estado' => 'disponible',
                        'observaciones' => $observaciones,
                    ]);

                    MovimientoInventario::create([
                        'producto_id' => $producto->id,
                        'unidad_producto_id' => $unidad->id,
                        'tipo' => 'entrada',
                        'comodato_id' => null,
                        'usuario_id' => auth()->id() ?? 1,
                        'fecha' => now(),
                        'observaciones' => "Ingreso de unidad {$unidad->codigo_unidad}. {$observaciones}",
                    ]);
                }
            } else {
                $producto->increment('stock_generico_total', $cantidad);
                $producto->increment('stock_generico_disponible', $cantidad);

                $stockSucursal = \App\Models\ProductoSucursalStock::firstOrCreate(
                    ['producto_id' => $producto->id, 'sucursal_id' => $sucursalId],
                    ['stock_total' => 0, 'stock_disponible' => 0]
                );
                $stockSucursal->increment('stock_total', $cantidad);
                $stockSucursal->increment('stock_disponible', $cantidad);

                MovimientoInventario::create([
                    'producto_id' => $producto->id,
                    'unidad_producto_id' => null,
                    'tipo' => 'entrada',
                    'comodato_id' => null,
                    'usuario_id' => auth()->id() ?? 1,
                    'fecha' => now(),
                    'observaciones' => "Ingreso de {$cantidad} unidades de stock genérico. {$observaciones}",
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', "Se ingresaron {$cantidad} unidades correctamente al inventario.");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al ingresar el stock: ' . $e->getMessage()]);
        }
    }

    public function storeUnidad(Request $request, ProductoInventario $producto): RedirectResponse
    {
        $validated = $request->validate([
            'codigo_unidad' => ['required', 'string', 'max:50', 'unique:unidades_producto,codigo_unidad'],
            'sucursal_id' => ['nullable', 'exists:sucursales,id'],
            'estado' => ['nullable', 'in:disponible,prestado,mantencion,baja'],
            'observaciones' => ['nullable', 'string'],
        ]);

        $sucursalId = $validated['sucursal_id'] ?? auth()->user()->sucursal_id ?? 1;

        $unidad = $producto->unidades()->create([
            'codigo_unidad' => $validated['codigo_unidad'],
            'sucursal_id' => $sucursalId,
            'estado' => $validated['estado'] ?? 'disponible',
            'observaciones' => $validated['observaciones'] ?? null,
        ]);

        MovimientoInventario::create([
            'producto_id' => $producto->id,
            'unidad_producto_id' => $unidad->id,
            'tipo' => 'entrada',
            'comodato_id' => null,
            'usuario_id' => auth()->id() ?? 1,
            'fecha' => now(),
            'observaciones' => "Ingreso de nueva unidad de serie {$unidad->codigo_unidad}",
        ]);

        return redirect()->back()->with('success', 'Unidad de producto registrada con éxito.');
    }

    public function updateUnidadEstado(Request $request, UnidadProducto $unidad): RedirectResponse
    {
        $validated = $request->validate([
            'estado' => ['required', 'in:disponible,prestado,mantencion,baja'],
            'observaciones' => ['nullable', 'string'],
        ]);

        $estadoAnterior = $unidad->estado;
        $unidad->update($validated);

        if ($estadoAnterior !== $validated['estado']) {
            MovimientoInventario::create([
                'producto_id' => $unidad->producto_id,
                'unidad_producto_id' => $unidad->id,
                'tipo' => 'ajuste',
                'comodato_id' => null,
                'usuario_id' => auth()->id() ?? 1,
                'fecha' => now(),
                'observaciones' => "Cambio de estado de unidad {$unidad->codigo_unidad} de {$estadoAnterior} a {$validated['estado']}",
            ]);
        }

        return redirect()->back()->with('success', 'Estado de la unidad actualizado.');
    }

    public function downloadReportePdf()
    {
        $productos = ProductoInventario::with(['unidades'])->get();

        $totalProductos = $productos->count();
        $unidadesDisponibles = 0;
        $unidadesPrestadas = 0;
        $unidadesMantencion = 0;
        $unidadesBaja = 0;

        foreach ($productos as $p) {
            if ($p->tipo === 'serializado') {
                $unidadesDisponibles += $p->unidades->where('estado', 'disponible')->count();
                $unidadesPrestadas += $p->unidades->where('estado', 'prestado')->count();
                $unidadesMantencion += $p->unidades->where('estado', 'mantencion')->count();
                $unidadesBaja += $p->unidades->where('estado', 'baja')->count();
            } else {
                $unidadesDisponibles += $p->stock_generico_disponible;
                $unidadesPrestadas += max(0, $p->stock_generico_total - $p->stock_generico_disponible);
            }
        }

        $pdf = Pdf::loadView('pdf.reporte_stock', compact(
            'productos',
            'totalProductos',
            'unidadesDisponibles',
            'unidadesPrestadas',
            'unidadesMantencion',
            'unidadesBaja'
        ));

        return $pdf->stream('Reporte-Stock-Inventario-Fundacion-Gamboa.pdf');
    }

    public function exportExcel()
    {
        $productos = ProductoInventario::with(['unidades'])->get();
        $filename = "Inventario-Fundacion-Gamboa-" . date('Y-m-d') . ".xls";

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($productos) {
            echo '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>';
            echo '<table border="1" style="border-collapse: collapse;">';
            echo '<tr style="background-color: #be123c; color: #ffffff; font-weight: bold; text-align: left;">';
            echo '<th style="padding: 8px;">Código</th>';
            echo '<th style="padding: 8px;">Nombre del Equipo</th>';
            echo '<th style="padding: 8px;">Categoría</th>';
            echo '<th style="padding: 8px;">Tipo Control</th>';
            echo '<th style="padding: 8px;">Stock Total</th>';
            echo '<th style="padding: 8px;">Disponibles</th>';
            echo '<th style="padding: 8px;">En Préstamo</th>';
            echo '<th style="padding: 8px;">En Mantención</th>';
            echo '<th style="padding: 8px;">De Baja</th>';
            echo '</tr>';

            foreach ($productos as $p) {
                if ($p->tipo === 'serializado') {
                    $disp = $p->unidades->where('estado', 'disponible')->count();
                    $prest = $p->unidades->where('estado', 'prestado')->count();
                    $mant = $p->unidades->where('estado', 'mantencion')->count();
                    $baja = $p->unidades->where('estado', 'baja')->count();
                    $total = $p->unidades->count();
                } else {
                    $disp = $p->stock_generico_disponible;
                    $prest = max(0, $p->stock_generico_total - $p->stock_generico_disponible);
                    $mant = 0;
                    $baja = 0;
                    $total = $p->stock_generico_total;
                }

                echo '<tr>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($p->codigo) . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($p->nombre) . '</td>';
                echo '<td style="padding: 6px;">' . htmlspecialchars($p->categoria) . '</td>';
                echo '<td style="padding: 6px;">' . ($p->tipo === 'serializado' ? 'N° de Serie' : 'Stock Genérico') . '</td>';
                echo '<td style="padding: 6px; text-align: center;">' . $total . '</td>';
                echo '<td style="padding: 6px; text-align: center; color: green; font-weight: bold;">' . $disp . '</td>';
                echo '<td style="padding: 6px; text-align: center; color: red;">' . $prest . '</td>';
                echo '<td style="padding: 6px; text-align: center; color: orange;">' . $mant . '</td>';
                echo '<td style="padding: 6px; text-align: center; color: gray;">' . $baja . '</td>';
                echo '</tr>';
            }

            echo '</table></body></html>';
        };

        return response()->stream($callback, 200, $headers);
    }

    public function consultarQrJson(string $codigo)
    {
        $cleanCode = trim($codigo);
        $cleanCode = rtrim($cleanCode, '/');
        if (str_contains($cleanCode, '?')) {
            $cleanCode = explode('?', $cleanCode)[0];
        }
        if (str_contains($cleanCode, '/')) {
            $cleanCode = basename($cleanCode);
        }
        if (str_starts_with(strtoupper($cleanCode), 'FG-UNIT:')) {
            $cleanCode = substr($cleanCode, 8);
        }

        $targetLower = strtolower($cleanCode);

        // 1. Search in UnidadProducto (serialized item)
        $unidad = UnidadProducto::with(['producto'])
            ->whereRaw('LOWER(codigo_unidad) = ?', [$targetLower])
            ->orWhereRaw('LOWER(numero_serie) = ?', [$targetLower])
            ->orWhere('id', $cleanCode)
            ->first();

        if ($unidad) {
            $comodatoItem = \App\Models\ComodatoItem::with(['comodato.beneficiario', 'comodato.responsable'])
                ->where('unidad_producto_id', $unidad->id)
                ->whereHas('comodato', function ($q) {
                    $q->where('estado', 'activo');
                })
                ->orderBy('id', 'desc')
                ->first();

            return response()->json([
                'encontrado' => true,
                'tipo_item' => 'unidad',
                'codigo_buscado' => $cleanCode,
                'producto' => $unidad->producto,
                'unidad' => $unidad,
                'estado_actual' => $unidad->estado,
                'comodato_activo' => $comodatoItem ? $comodatoItem->comodato : null,
            ]);
        }

        // 2. Search in ProductoInventario (generic insumo / product code)
        $producto = ProductoInventario::whereRaw('LOWER(codigo) = ?', [$targetLower])
            ->orWhereRaw('LOWER(CONCAT("prod-", id)) = ?', [$targetLower])
            ->orWhere('id', $cleanCode)
            ->first();

        if ($producto) {
            $comodatoItems = \App\Models\ComodatoItem::with(['comodato.beneficiario'])
                ->where('producto_id', $producto->id)
                ->whereHas('comodato', function ($q) {
                    $q->where('estado', 'activo');
                })
                ->get();

            return response()->json([
                'encontrado' => true,
                'tipo_item' => 'producto',
                'codigo_buscado' => $cleanCode,
                'producto' => $producto,
                'unidad' => null,
                'estado_actual' => $producto->tipo === 'serializado' ? 'catalogado' : ($producto->stock_generico_disponible > 0 ? 'disponible' : 'agotado'),
                'comodatos_activos' => $comodatoItems->map(fn($item) => $item->comodato)->unique('id')->values(),
            ]);
        }

        return response()->json([
            'encontrado' => false,
            'codigo_buscado' => $cleanCode,
            'mensaje' => "No se encontró ningún artículo o unidad registrada con el código '{$cleanCode}'.",
        ], 404);
    }

    public function downloadEtiquetasMasivasPdf(Request $request)
    {
        $itemsData = $request->input('items', []);

        $getQrBase64 = function ($code) {
            $qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($code);
            try {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $qrUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 4);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                $imgData = curl_exec($ch);
                curl_close($ch);

                if ($imgData && strlen($imgData) > 100) {
                    return 'data:image/png;base64,' . base64_encode($imgData);
                }
            } catch (\Throwable $e) {
                // Ignore exception
            }
            return 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' . urlencode($code);
        };
        
        $etiquetas = [];
        if (!empty($itemsData)) {
            foreach ($itemsData as $item) {
                if (str_starts_with($item, 'u-')) {
                    $uId = substr($item, 2);
                    $u = UnidadProducto::with('producto')->find($uId);
                    if ($u) {
                        $code = $u->codigo_unidad;
                        $etiquetas[] = [
                            'producto_nombre' => $u->producto->nombre ?? 'Equipo',
                            'codigo_unidad' => $code,
                            'qr_base64' => $getQrBase64($code),
                            'estado_fisico' => $u->estado_fisico ?? $u->producto->estado_fisico ?? 'Nuevo',
                        ];
                    }
                } else {
                    $pId = str_replace('p-', '', $item);
                    $p = ProductoInventario::find($pId);
                    if ($p) {
                        $code = $p->codigo;
                        $etiquetas[] = [
                            'producto_nombre' => $p->nombre,
                            'codigo_unidad' => $code,
                            'qr_base64' => $getQrBase64($code),
                            'estado_fisico' => $p->estado_fisico ?? 'Nuevo',
                        ];
                    }
                }
            }
        } else {
            $unidades = UnidadProducto::with('producto')->get();
            foreach ($unidades as $u) {
                $code = $u->codigo_unidad;
                $etiquetas[] = [
                    'producto_nombre' => $u->producto->nombre ?? 'Equipo',
                    'codigo_unidad' => $code,
                    'qr_base64' => $getQrBase64($code),
                    'estado_fisico' => $u->estado_fisico ?? 'Nuevo',
                ];
            }
        }

        $pdf = Pdf::loadView('pdf.etiquetas_masivas', ['etiquetas' => $etiquetas]);
        $pdf->setOption(['isRemoteEnabled' => true, 'isHtml5ParserEnabled' => true]);
        return $pdf->stream('Etiquetas_Masivas_QR_Fundacion_Gamboa.pdf');
    }
}
