<?php

namespace App\Http\Controllers;

use App\Models\ProductoInventario;
use App\Models\ProductoSucursalStock;
use App\Models\Sucursal;
use App\Models\TrasladoInventario;
use App\Models\UnidadProducto;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TrasladoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sucursal_origen_id' => 'required|exists:sucursales,id',
            'sucursal_destino_id' => 'required|exists:sucursales,id|different:sucursal_origen_id',
            'producto_id' => 'required|exists:productos_inventario,id',
            'tipo' => 'required|in:serializado,stock_generico',
            'unidades_ids' => 'nullable|array',
            'unidades_ids.*' => 'exists:unidades_producto,id',
            'cantidad' => 'nullable|integer|min:1',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $producto = ProductoInventario::findOrFail($validated['producto_id']);
        $origen = Sucursal::findOrFail($validated['sucursal_origen_id']);
        $destino = Sucursal::findOrFail($validated['sucursal_destino_id']);
        $userId = auth()->id() ?? 1;

        DB::beginTransaction();

        try {
            $codigoTraslado = 'TRSL-' . strtoupper(Str::random(6));

            if ($validated['tipo'] === 'serializado') {
                if (empty($validated['unidades_ids'])) {
                    return redirect()->back()->with('error', 'Debe seleccionar al menos una unidad serializada para trasladar.');
                }

                $unidades = UnidadProducto::whereIn('id', $validated['unidades_ids'])
                    ->where('sucursal_id', $origen->id)
                    ->get();

                if ($unidades->count() !== count($validated['unidades_ids'])) {
                    return redirect()->back()->with('error', 'Algunas unidades seleccionadas no pertenecen a la sucursal de origen.');
                }

                foreach ($unidades as $unidad) {
                    $unidad->update(['sucursal_id' => $destino->id]);

                    TrasladoInventario::create([
                        'codigo_traslado' => $codigoTraslado,
                        'sucursal_origen_id' => $origen->id,
                        'sucursal_destino_id' => $destino->id,
                        'producto_id' => $producto->id,
                        'unidad_producto_id' => $unidad->id,
                        'cantidad' => 1,
                        'usuario_emisor_id' => $userId,
                        'estado' => 'completado',
                        'observaciones' => $validated['observaciones'],
                    ]);

                    MovimientoInventario::create([
                        'producto_id' => $producto->id,
                        'unidad_producto_id' => $unidad->id,
                        'tipo' => 'traslado',
                        'usuario_id' => $userId,
                        'fecha' => now(),
                        'observaciones' => "Traslado de {$origen->nombre} a {$destino->nombre}. Ref: {$codigoTraslado}",
                    ]);
                }
            } else {
                $cantidad = (int) ($validated['cantidad'] ?? 1);

                $stockOrigen = ProductoSucursalStock::firstOrCreate(
                    ['producto_id' => $producto->id, 'sucursal_id' => $origen->id],
                    ['stock_total' => 0, 'stock_disponible' => 0]
                );

                if ($stockOrigen->stock_disponible < $cantidad) {
                    DB::rollBack();
                    return redirect()->back()->with('error', "Stock insuficiente en {$origen->nombre}. Disponible: {$stockOrigen->stock_disponible}.");
                }

                // Descontar origen
                $stockOrigen->decrement('stock_total', $cantidad);
                $stockOrigen->decrement('stock_disponible', $cantidad);

                // Incrementar destino
                $stockDestino = ProductoSucursalStock::firstOrCreate(
                    ['producto_id' => $producto->id, 'sucursal_id' => $destino->id],
                    ['stock_total' => 0, 'stock_disponible' => 0]
                );
                $stockDestino->increment('stock_total', $cantidad);
                $stockDestino->increment('stock_disponible', $cantidad);

                TrasladoInventario::create([
                    'codigo_traslado' => $codigoTraslado,
                    'sucursal_origen_id' => $origen->id,
                    'sucursal_destino_id' => $destino->id,
                    'producto_id' => $producto->id,
                    'unidad_producto_id' => null,
                    'cantidad' => $cantidad,
                    'usuario_emisor_id' => $userId,
                    'estado' => 'completado',
                    'observaciones' => $validated['observaciones'],
                ]);

                MovimientoInventario::create([
                    'producto_id' => $producto->id,
                    'unidad_producto_id' => null,
                    'tipo' => 'traslado',
                    'usuario_id' => $userId,
                    'fecha' => now(),
                    'observaciones' => "Traslado de {$cantidad} unidades desde {$origen->nombre} hacia {$destino->nombre}. Ref: {$codigoTraslado}",
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', "Stock trasladado exitosamente a {$destino->nombre} (Ref: {$codigoTraslado}).");
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al procesar el traslado: ' . $e->getMessage());
        }
    }
}
