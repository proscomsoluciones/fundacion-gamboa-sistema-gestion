<?php

namespace App\Http\Controllers;

use App\Models\ProductoInventario;
use App\Models\UnidadProducto;
use App\Models\Comodato;
use App\Models\Beneficiario;
use App\Models\Sucursal;
use App\Models\ProductoSucursalStock;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $now = Carbon::now();

        // 1. Core KPIs
        $totalBeneficiarios = Beneficiario::where('estado', 'activo')->count();
        $comodatosActivos = Comodato::where('estado', 'activo')->count();
        $devolucionesMes = Comodato::where('estado', 'devuelto')
            ->whereMonth('fecha_devolucion_real', $now->month)
            ->whereYear('fecha_devolucion_real', $now->year)
            ->count();

        $unidadesDisponiblesSerializadas = UnidadProducto::where('estado', 'disponible')->count();
        $unidadesPrestadasSerializadas = UnidadProducto::where('estado', 'prestado')->count();
        $unidadesMantencionSerializadas = UnidadProducto::where('estado', 'mantencion')->count();
        $unidadesBajaSerializadas = UnidadProducto::where('estado', 'baja')->count();

        $stockGenericoDisponible = ProductoInventario::where('tipo', 'generico')->sum('stock_generico_disponible');
        $totalStockDisponible = $unidadesDisponiblesSerializadas + $stockGenericoDisponible;

        // 2. Stock Distribution by Category (for Doughnut Chart)
        $categoriasData = ProductoInventario::select('categoria')
            ->selectRaw('count(*) as total_productos')
            ->groupBy('categoria')
            ->get()
            ->map(function ($cat) {
                // Calculate available units in this category
                $serialCount = UnidadProducto::whereHas('producto', function ($q) use ($cat) {
                    $q->where('categoria', $cat->categoria);
                })->where('estado', 'disponible')->count();

                $genericoCount = ProductoInventario::where('categoria', $cat->categoria)
                    ->where('tipo', 'generico')
                    ->sum('stock_generico_disponible');

                return [
                    'categoria' => $cat->categoria,
                    'total_productos' => $cat->total_productos,
                    'disponibles' => $serialCount + $genericoCount,
                ];
            });

        // 3. Stock Distribution by Branch (for Bar Chart)
        $sucursales = Sucursal::where('activa', true)->get();
        $stockPorSucursal = $sucursales->map(function ($suc) {
            $serialCount = UnidadProducto::where('sucursal_id', $suc->id)
                ->where('estado', 'disponible')
                ->count();

            $genericoCount = ProductoSucursalStock::where('sucursal_id', $suc->id)
                ->sum('stock_disponible');

            return [
                'id' => $suc->id,
                'nombre' => $suc->es_casa_matriz ? 'Sede Central' : $suc->nombre,
                'disponibles' => $serialCount + $genericoCount,
                'es_casa_matriz' => $suc->es_casa_matriz,
            ];
        });

        // 4. Monthly Trend Chart Data (Last 6 Months)
        $tendenciaMensual = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth();
            $monthEnd = $date->copy()->endOfMonth();

            $entregas = Comodato::whereBetween('fecha_entrega', [$monthStart, $monthEnd])->count();
            $devoluciones = Comodato::where('estado', 'devuelto')
                ->whereBetween('fecha_devolucion_real', [$monthStart, $monthEnd])
                ->count();

            $tendenciaMensual[] = [
                'mes' => ucfirst($date->locale('es')->shortMonthName) . ' ' . $date->format('y'),
                'entregas' => $entregas,
                'devoluciones' => $devoluciones,
            ];
        }

        // 5. Recent Activity Feed (Recent Comodatos)
        $entregasRecientes = Comodato::with(['beneficiario', 'items.producto', 'sucursal'])
            ->orderBy('id', 'desc')
            ->take(6)
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'codigo' => $c->codigo,
                    'beneficiario_nombre' => $c->beneficiario ? $c->beneficiario->nombre : 'Sin Beneficiario',
                    'fecha_entrega' => Carbon::parse($c->fecha_entrega)->format('d/m/Y'),
                    'estado' => $c->estado,
                    'sucursal_nombre' => $c->sucursal ? $c->sucursal->nombre : 'Sede Central',
                    'equipos' => $c->items->map(fn($i) => $i->producto ? $i->producto->nombre : 'Equipo')->implode(', '),
                ];
            });

        // 6. Top Demanded Technical Aids
        $equiposMasDemandados = ProductoInventario::withCount('movimientos')
            ->orderBy('movimientos_count', 'desc')
            ->take(5)
            ->get();

        // 7. Entregas y Beneficiarios por Sector de Catemu
        $beneficiariosPorSector = Beneficiario::selectRaw("COALESCE(NULLIF(sector, ''), 'Catemu Centro') as sector_nombre, count(*) as total")
            ->groupBy('sector_nombre')
            ->orderBy('total', 'desc')
            ->take(10)
            ->get();

        $entregasPorSector = Comodato::join('beneficiarios', 'comodatos.beneficiario_id', '=', 'beneficiarios.id')
            ->selectRaw("COALESCE(NULLIF(beneficiarios.sector, ''), 'Catemu Centro') as sector_nombre, count(comodatos.id) as total")
            ->groupBy('sector_nombre')
            ->orderBy('total', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Dashboard', [
            'kpis' => [
                'total_beneficiarios' => $totalBeneficiarios,
                'comodatos_activos' => $comodatosActivos,
                'devoluciones_mes' => $devolucionesMes,
                'stock_disponible_total' => $totalStockDisponible,
                'unidades_mantencion' => $unidadesMantencionSerializadas,
                'unidades_prestadas' => $unidadesPrestadasSerializadas,
            ],
            'categoriasData' => $categoriasData,
            'stockPorSucursal' => $stockPorSucursal,
            'tendenciaMensual' => $tendenciaMensual,
            'entregasRecientes' => $entregasRecientes,
            'equiposMasDemandados' => $equiposMasDemandados,
            'beneficiariosPorSector' => $beneficiariosPorSector,
            'entregasPorSector' => $entregasPorSector,
        ]);
    }
}
