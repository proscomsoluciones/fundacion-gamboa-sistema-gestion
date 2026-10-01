<?php

namespace App\Http\Controllers;

use App\Models\ProductoInventario;
use App\Models\UnidadProducto;
use App\Models\Comodato;
use App\Models\Beneficiario;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ReporteController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. Determinar Rango de Fechas
        $periodo = $request->input('periodo', 'este_mes'); // este_mes, mes_anterior, ano_actual, mensual, personalizado
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');
        $mesSel = $request->input('mes');
        $anoSel = $request->input('ano', Carbon::now()->year);

        $now = Carbon::now();

        if ($periodo === 'este_mes') {
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();
            $nombrePeriodo = 'Mes Actual (' . ucfirst($now->locale('es')->monthName) . ' ' . $now->year . ')';
        } elseif ($periodo === 'mes_anterior') {
            $subMonth = $now->copy()->subMonth();
            $startDate = $subMonth->copy()->startOfMonth();
            $endDate = $subMonth->copy()->endOfMonth();
            $nombrePeriodo = 'Mes Anterior (' . ucfirst($subMonth->locale('es')->monthName) . ' ' . $subMonth->year . ')';
        } elseif ($periodo === 'ano_actual') {
            $startDate = Carbon::createFromDate($anoSel, 1, 1)->startOfYear();
            $endDate = Carbon::createFromDate($anoSel, 12, 31)->endOfYear();
            $nombrePeriodo = 'Año ' . $anoSel;
        } elseif ($periodo === 'mensual' && $mesSel) {
            $startDate = Carbon::createFromDate($anoSel, $mesSel, 1)->startOfMonth();
            $endDate = Carbon::createFromDate($anoSel, $mesSel, 1)->endOfMonth();
            $nombrePeriodo = ucfirst(Carbon::createFromDate($anoSel, $mesSel, 1)->locale('es')->monthName) . ' ' . $anoSel;
        } elseif ($periodo === 'personalizado' && $fechaInicio && $fechaFin) {
            $startDate = Carbon::parse($fechaInicio)->startOfDay();
            $endDate = Carbon::parse($fechaFin)->endOfDay();
            $nombrePeriodo = 'Rango del ' . $startDate->format('d/m/Y') . ' al ' . $endDate->format('d/m/Y');
        } else {
            $startDate = $now->copy()->startOfMonth();
            $endDate = $now->copy()->endOfMonth();
            $nombrePeriodo = 'Mes Actual (' . ucfirst($now->locale('es')->monthName) . ' ' . $now->year . ')';
        }

        // 2. Métricas Filtradas por Período
        $entregasPeriodo = Comodato::whereBetween('fecha_entrega', [$startDate, $endDate])->count();
        
        $devolucionesPeriodo = Comodato::where('estado', 'devuelto')
            ->whereBetween('fecha_devolucion_real', [$startDate, $endDate])
            ->count();

        $nuevosBeneficiariosPeriodo = Beneficiario::whereBetween('fecha_registro', [$startDate, $endDate])->count();

        $insumosConsumiblesEntregados = MovimientoInventario::where('tipo', 'salida')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // 3. Totales Globales
        $stockPorCategoria = ProductoInventario::selectRaw('categoria, count(*) as total_productos')
            ->groupBy('categoria')
            ->get();

        $unidadesPorEstado = UnidadProducto::selectRaw('estado, count(*) as total')
            ->groupBy('estado')
            ->get();

        $comodatosPorEstado = Comodato::selectRaw('estado, count(*) as total')
            ->groupBy('estado')
            ->get();

        $totalBeneficiarios = Beneficiario::where('estado', 'activo')->count();

        $productosMasPrestados = ProductoInventario::withCount(['movimientos' => function ($q) use ($startDate, $endDate) {
            $q->where('tipo', 'salida')
              ->whereBetween('created_at', [$startDate, $endDate]);
        }])
        ->orderBy('movimientos_count', 'desc')
        ->take(6)
        ->get();

        // Entregas detalladas en el rango
        $entregasDetalle = Comodato::with(['beneficiario', 'items.producto', 'items.unidad'])
            ->whereBetween('fecha_entrega', [$startDate, $endDate])
            ->orderBy('fecha_entrega', 'desc')
            ->take(15)
            ->get();

        return Inertia::render('Reportes/Index', [
            'filtros' => [
                'periodo' => $periodo,
                'fecha_inicio' => $startDate->format('Y-m-d'),
                'fecha_fin' => $endDate->format('Y-m-d'),
                'mes' => (int) ($mesSel ?: $now->month),
                'ano' => (int) $anoSel,
                'nombrePeriodo' => $nombrePeriodo,
            ],
            'metricasPeriodo' => [
                'nombre' => $nombrePeriodo,
                'entregas' => $entregasPeriodo,
                'devoluciones' => $devolucionesPeriodo,
                'nuevosBeneficiarios' => $nuevosBeneficiariosPeriodo,
                'insumosEntregados' => $insumosConsumiblesEntregados,
            ],
            'entregasDetalle' => $entregasDetalle,
            'stockPorCategoria' => $stockPorCategoria,
            'unidadesPorEstado' => $unidadesPorEstado,
            'comodatosPorEstado' => $comodatosPorEstado,
            'totalBeneficiarios' => $totalBeneficiarios,
            'productosMasPrestados' => $productosMasPrestados,
        ]);
    }

    public function downloadComodatosPdf(Request $request)
    {
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');
        $nombrePeriodo = $request->input('nombre_periodo', 'Reporte Histórico General');

        $query = Comodato::with(['beneficiario', 'items.producto', 'items.unidad']);

        if ($fechaInicio && $fechaFin) {
            $query->whereBetween('fecha_entrega', [
                Carbon::parse($fechaInicio)->startOfDay(),
                Carbon::parse($fechaFin)->endOfDay()
            ]);
        }

        $comodatos = $query->orderBy('id', 'desc')->get();

        $pdf = Pdf::loadView('pdf.reporte_comodatos', compact('comodatos', 'nombrePeriodo', 'fechaInicio', 'fechaFin'));

        return $pdf->stream("Reporte-Entregas-Fundacion-Gamboa.pdf");
    }
}
