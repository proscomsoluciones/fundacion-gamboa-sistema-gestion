<?php

namespace App\Http\Controllers;

use App\Models\MovimientoFinanciero;
use App\Models\Proyecto;
use App\Models\CategoriaFinanza;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class FinanzasController extends Controller
{
    public function index(Request $request): Response
    {
        $periodo = $request->input('periodo', 'este_mes'); // este_mes, mes_anterior, ano_actual, mensual, personalizado
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');
        $mesSel = $request->input('mes');
        $anoSel = $request->input('ano', Carbon::now()->year);
        $tipoFiltro = $request->input('tipo', 'todos'); // todos, ingreso, egreso
        $categoriaFiltro = $request->input('categoria');
        $proyectoFiltro = $request->input('proyecto');
        $search = $request->input('search');

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

        $query = MovimientoFinanciero::with('user')
            ->whereBetween('fecha', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);

        if ($tipoFiltro !== 'todos') {
            $query->where('tipo', $tipoFiltro);
        }

        if ($categoriaFiltro) {
            $query->where('categoria', $categoriaFiltro);
        }

        if ($proyectoFiltro) {
            $query->where('proyecto', $proyectoFiltro);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('concepto', 'like', "%{$search}%")
                  ->orWhere('categoria', 'like', "%{$search}%")
                  ->orWhere('proyecto', 'like', "%{$search}%")
                  ->orWhere('observaciones', 'like', "%{$search}%");
            });
        }

        $movimientos = $query->orderBy('fecha', 'desc')->orderBy('id', 'desc')->get()->map(function ($m) {
            $hasFile = !empty($m->comprobante_path) && Storage::disk('public')->exists($m->comprobante_path);
            $ext = $hasFile ? strtolower(pathinfo($m->comprobante_path, PATHINFO_EXTENSION)) : '';
            return [
                'id' => $m->id,
                'tipo' => $m->tipo,
                'concepto' => $m->concepto,
                'categoria' => $m->categoria,
                'proyecto' => $m->proyecto ?: 'Fondo General / Operación',
                'monto' => $m->monto,
                'monto_formatted' => '$' . number_format($m->monto, 0, ',', '.'),
                'fecha' => $m->fecha ? $m->fecha->format('Y-m-d') : null,
                'fecha_formatted' => $m->fecha ? $m->fecha->format('d/m/Y') : null,
                'observaciones' => $m->observaciones,
                'comprobante_url' => $hasFile ? Storage::url($m->comprobante_path) : null,
                'comprobante_original_name' => $m->comprobante_original_name,
                'is_image' => in_array($ext, ['jpg', 'jpeg', 'png', 'webp']),
                'is_pdf' => $ext === 'pdf',
                'user_name' => $m->user ? $m->user->name : 'Sistema',
            ];
        });

        // Totales en el período (filtrados si corresponde)
        $baseTotalQuery = MovimientoFinanciero::whereBetween('fecha', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
        if ($proyectoFiltro) {
            $baseTotalQuery->where('proyecto', $proyectoFiltro);
        }

        $totalIngresos = (clone $baseTotalQuery)->where('tipo', 'ingreso')->sum('monto');
        $totalEgresos = (clone $baseTotalQuery)->where('tipo', 'egreso')->sum('monto');
        $balanceNeto = $totalIngresos - $totalEgresos;

        // Cargar Categorías Financieras desde la Base de Datos
        $catIngresoDB = CategoriaFinanza::whereIn('tipo', ['ingreso', 'ambos'])->pluck('nombre');
        $catEgresoDB = CategoriaFinanza::whereIn('tipo', ['egreso', 'ambos'])->pluck('nombre');

        $usedIngresos = MovimientoFinanciero::where('tipo', 'ingreso')->distinct()->pluck('categoria');
        $usedEgresos = MovimientoFinanciero::where('tipo', 'egreso')->distinct()->pluck('categoria');

        $categoriasIngreso = $catIngresoDB->concat($usedIngresos)->unique()->values();
        $categoriasEgreso = $catEgresoDB->concat($usedEgresos)->unique()->values();
        $categoriasUnicas = $categoriasIngreso->concat($categoriasEgreso)->unique()->values();

        // Cargar Proyectos registrados con sus presupuestos y ejecuciones históricas
        $proyectosDB = Proyecto::all();
        $proyectosUnicosNames = MovimientoFinanciero::select('proyecto')->whereNotNull('proyecto')->distinct()->pluck('proyecto');

        // Combinar nombres de proyectos de la DB y de movimientos existentes
        $todosNombresProyectos = $proyectosDB->pluck('nombre')->concat($proyectosUnicosNames)->unique()->values();

        $listaProyectosCompleta = $todosNombresProyectos->map(function ($nombreProy) use ($proyectosDB) {
            $pModel = $proyectosDB->firstWhere('nombre', $nombreProy);
            $presupuestoTotal = $pModel ? (float) $pModel->presupuesto_total : 0;
            
            // Total egresos e ingresos acumulados en toda la historia para este proyecto
            $totalIngresosProy = (float) MovimientoFinanciero::where('proyecto', $nombreProy)->where('tipo', 'ingreso')->sum('monto');
            $totalEgresosProy = (float) MovimientoFinanciero::where('proyecto', $nombreProy)->where('tipo', 'egreso')->sum('monto');
            
            $limiteBase = $presupuestoTotal > 0 ? $presupuestoTotal : $totalIngresosProy;
            $saldoDisponible = max(0, $limiteBase - $totalEgresosProy);

            return [
                'id' => $pModel ? $pModel->id : null,
                'nombre' => $nombreProy,
                'codigo' => $pModel ? $pModel->codigo : null,
                'descripcion' => $pModel ? $pModel->descripcion : null,
                'presupuesto_total' => $presupuestoTotal,
                'presupuesto_total_formatted' => '$' . number_format($presupuestoTotal, 0, ',', '.'),
                'total_ingresos' => $totalIngresosProy,
                'total_ingresos_formatted' => '$' . number_format($totalIngresosProy, 0, ',', '.'),
                'total_egresos' => $totalEgresosProy,
                'total_egresos_formatted' => '$' . number_format($totalEgresosProy, 0, ',', '.'),
                'saldo_disponible' => $saldoDisponible,
                'saldo_disponible_formatted' => '$' . number_format($saldoDisponible, 0, ',', '.'),
            ];
        });

        $proyectosUnicos = $todosNombresProyectos;

        // Desglose de Gastos por Categoría
        $gastosPorCategoria = MovimientoFinanciero::selectRaw('categoria, SUM(monto) as total')
            ->whereBetween('fecha', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->where('tipo', 'egreso')
            ->groupBy('categoria')
            ->orderBy('total', 'desc')
            ->get();

        // Resumen Financiero por Proyecto (Ingresos vs Egresos por Proyecto en el período seleccionado)
        $resumenPorProyecto = MovimientoFinanciero::selectRaw('proyecto, 
            SUM(CASE WHEN tipo = "ingreso" THEN monto ELSE 0 END) as ingresos,
            SUM(CASE WHEN tipo = "egreso" THEN monto ELSE 0 END) as egresos')
            ->whereBetween('fecha', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->groupBy('proyecto')
            ->get()
            ->map(function ($item) use ($listaProyectosCompleta) {
                $ing = (float) $item->ingresos;
                $egr = (float) $item->egresos;
                $bal = $ing - $egr;
                $nom = $item->proyecto ?: 'Fondo General / Operación';
                $proyMeta = $listaProyectosCompleta->firstWhere('nombre', $nom);
                $presupuesto = $proyMeta ? $proyMeta['presupuesto_total'] : 0;
                $saldoDisp = $proyMeta ? $proyMeta['saldo_disponible'] : $bal;

                return [
                    'proyecto' => $nom,
                    'presupuesto_total' => $presupuesto,
                    'presupuesto_total_formatted' => '$' . number_format($presupuesto, 0, ',', '.'),
                    'ingresos' => $ing,
                    'ingresos_formatted' => '$' . number_format($ing, 0, ',', '.'),
                    'egresos' => $egr,
                    'egresos_formatted' => '$' . number_format($egr, 0, ',', '.'),
                    'balance' => $bal,
                    'balance_formatted' => '$' . number_format($bal, 0, ',', '.'),
                    'saldo_disponible' => $saldoDisp,
                    'saldo_disponible_formatted' => '$' . number_format($saldoDisp, 0, ',', '.'),
                ];
            });

        return Inertia::render('Finanzas/Index', [
            'movimientos' => $movimientos,
            'categoriasIngreso' => $categoriasIngreso,
            'categoriasEgreso' => $categoriasEgreso,
            'categoriasUnicas' => $categoriasUnicas,
            'proyectosUnicos' => $proyectosUnicos,
            'listaProyectos' => $listaProyectosCompleta,
            'gastosPorCategoria' => $gastosPorCategoria,
            'resumenPorProyecto' => $resumenPorProyecto,
            'totales' => [
                'ingresos' => $totalIngresos,
                'ingresos_formatted' => '$' . number_format($totalIngresos, 0, ',', '.'),
                'egresos' => $totalEgresos,
                'egresos_formatted' => '$' . number_format($totalEgresos, 0, ',', '.'),
                'balance' => $balanceNeto,
                'balance_formatted' => '$' . number_format($balanceNeto, 0, ',', '.'),
            ],
            'filtros' => [
                'periodo' => $periodo,
                'fecha_inicio' => $startDate->format('Y-m-d'),
                'fecha_fin' => $endDate->format('Y-m-d'),
                'mes' => (int) ($mesSel ?: $now->month),
                'ano' => (int) $anoSel,
                'tipo' => $tipoFiltro,
                'categoria' => $categoriaFiltro ?: '',
                'proyecto' => $proyectoFiltro ?: '',
                'search' => $search ?: '',
                'nombrePeriodo' => $nombrePeriodo,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $rules = [
            'tipo' => ['required', 'in:ingreso,egreso'],
            'concepto' => ['required', 'string', 'max:255'],
            'categoria' => ['required', 'string', 'max:255'],
            'proyecto' => ['nullable', 'string', 'max:255'],
            'monto' => ['required', 'numeric', 'min:1'],
            'fecha' => ['required', 'date'],
            'observaciones' => ['nullable', 'string'],
            'comprobante' => [$request->tipo === 'egreso' ? 'required' : 'nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
        ];

        $messages = [
            'comprobante.required' => 'El comprobante o foto de respaldo es obligatorio para todo egreso (gasto).',
        ];

        $validated = $request->validate($rules, $messages);
        $proyectoNombre = !empty($validated['proyecto']) ? $validated['proyecto'] : 'Fondo General / Operación';

        // Validación estricta de tope presupuestario por Proyecto para EGRESOS
        if ($validated['tipo'] === 'egreso') {
            $proyectoObj = Proyecto::where('nombre', $proyectoNombre)->first();
            $presupuestoLimit = $proyectoObj ? (float) $proyectoObj->presupuesto_total : 0;
            
            // Si el proyecto no tiene presupuesto explícito pero tiene ingresos asignados, usamos el total de ingresos como límite
            $totalIngresosProy = (float) MovimientoFinanciero::where('proyecto', $proyectoNombre)->where('tipo', 'ingreso')->sum('monto');
            $limiteMaximo = $presupuestoLimit > 0 ? $presupuestoLimit : $totalIngresosProy;

            if ($limiteMaximo > 0) {
                $egresosAcumulados = (float) MovimientoFinanciero::where('proyecto', $proyectoNombre)->where('tipo', 'egreso')->sum('monto');
                $saldoDisponible = $limiteMaximo - $egresosAcumulados;

                if ($validated['monto'] > $saldoDisponible) {
                    throw ValidationException::withMessages([
                        'monto' => [
                            "¡Presupuesto superado! El proyecto '{$proyectoNombre}' tiene un presupuesto disponible de $" . number_format(max(0, $saldoDisponible), 0, ',', '.') . " (Límite: $" . number_format($limiteMaximo, 0, ',', '.') . ", Gastado: $" . number_format($egresosAcumulados, 0, ',', '.') . "). No se puede registrar este egreso por $" . number_format($validated['monto'], 0, ',', '.') . "."
                        ]
                    ]);
                }
            }
        }

        $comprobantePath = null;
        $originalName = null;

        if ($request->hasFile('comprobante')) {
            $file = $request->file('comprobante');
            $originalName = $file->getClientOriginalName();
            $comprobantePath = $file->store('comprobantes', 'public');
        }

        // Auto-registrar nueva categoría en la BD si no existe previamente
        if (!empty($validated['categoria'])) {
            CategoriaFinanza::firstOrCreate(
                ['nombre' => $validated['categoria']],
                ['tipo' => $validated['tipo']]
            );
        }

        MovimientoFinanciero::create([
            'tipo' => $validated['tipo'],
            'concepto' => $validated['concepto'],
            'categoria' => $validated['categoria'],
            'proyecto' => $proyectoNombre,
            'monto' => $validated['monto'],
            'fecha' => $validated['fecha'],
            'observaciones' => $validated['observaciones'] ?? null,
            'comprobante_path' => $comprobantePath,
            'comprobante_original_name' => $originalName,
            'user_id' => $request->user()?->id,
        ]);

        return redirect()->back()->with('success', 'Movimiento financiero registrado correctamente.');
    }

    public function update(Request $request, MovimientoFinanciero $movimiento): RedirectResponse
    {
        $rules = [
            'tipo' => ['required', 'in:ingreso,egreso'],
            'concepto' => ['required', 'string', 'max:255'],
            'categoria' => ['required', 'string', 'max:255'],
            'proyecto' => ['nullable', 'string', 'max:255'],
            'monto' => ['required', 'numeric', 'min:1'],
            'fecha' => ['required', 'date'],
            'observaciones' => ['nullable', 'string'],
            'comprobante' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
        ];

        // If movement is egreso and lacks previous attachment and no new file uploaded
        if ($request->tipo === 'egreso' && empty($movimiento->comprobante_path) && !$request->hasFile('comprobante')) {
            $rules['comprobante'] = ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'];
        }

        $messages = [
            'comprobante.required' => 'El comprobante o foto de respaldo es obligatorio para todo egreso (gasto).',
        ];

        $validated = $request->validate($rules, $messages);
        $proyectoNombre = !empty($validated['proyecto']) ? $validated['proyecto'] : 'Fondo General / Operación';

        // Validación estricta de tope presupuestario por Proyecto para EGRESOS
        if ($validated['tipo'] === 'egreso') {
            $proyectoObj = Proyecto::where('nombre', $proyectoNombre)->first();
            $presupuestoLimit = $proyectoObj ? (float) $proyectoObj->presupuesto_total : 0;
            
            $totalIngresosProy = (float) MovimientoFinanciero::where('proyecto', $proyectoNombre)->where('tipo', 'ingreso')->sum('monto');
            $limiteMaximo = $presupuestoLimit > 0 ? $presupuestoLimit : $totalIngresosProy;

            if ($limiteMaximo > 0) {
                $egresosAcumulados = (float) MovimientoFinanciero::where('proyecto', $proyectoNombre)
                    ->where('tipo', 'egreso')
                    ->where('id', '!=', $movimiento->id)
                    ->sum('monto');
                
                $saldoDisponible = $limiteMaximo - $egresosAcumulados;

                if ($validated['monto'] > $saldoDisponible) {
                    throw ValidationException::withMessages([
                        'monto' => [
                            "¡Presupuesto superado! El proyecto '{$proyectoNombre}' tiene un presupuesto disponible de $" . number_format(max(0, $saldoDisponible), 0, ',', '.') . " (Límite: $" . number_format($limiteMaximo, 0, ',', '.') . ", Gastado previamente: $" . number_format($egresosAcumulados, 0, ',', '.') . "). No se puede actualizar a $" . number_format($validated['monto'], 0, ',', '.') . "."
                        ]
                    ]);
                }
            }
        }

        if ($request->hasFile('comprobante')) {
            // Delete old file if present
            if ($movimiento->comprobante_path && Storage::disk('public')->exists($movimiento->comprobante_path)) {
                Storage::disk('public')->delete($movimiento->comprobante_path);
            }

            $file = $request->file('comprobante');
            $movimiento->comprobante_original_name = $file->getClientOriginalName();
            $movimiento->comprobante_path = $file->store('comprobantes', 'public');
        }

        // Auto-registrar nueva categoría en la BD si no existe previamente
        if (!empty($validated['categoria'])) {
            CategoriaFinanza::firstOrCreate(
                ['nombre' => $validated['categoria']],
                ['tipo' => $validated['tipo']]
            );
        }

        $movimiento->tipo = $validated['tipo'];
        $movimiento->concepto = $validated['concepto'];
        $movimiento->categoria = $validated['categoria'];
        $movimiento->proyecto = $proyectoNombre;
        $movimiento->monto = $validated['monto'];
        $movimiento->fecha = $validated['fecha'];
        $movimiento->observaciones = $validated['observaciones'] ?? null;
        $movimiento->save();

        return redirect()->back()->with('success', 'Movimiento actualizado correctamente.');
    }

    public function storeProyecto(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:proyectos,nombre'],
            'codigo' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'presupuesto_total' => ['required', 'numeric', 'min:0'],
        ], [
            'nombre.unique' => 'Ya existe un proyecto registrado con este nombre.',
            'presupuesto_total.min' => 'El presupuesto total debe ser un monto mayor o igual a 0.',
        ]);

        Proyecto::create([
            'nombre' => $validated['nombre'],
            'codigo' => $validated['codigo'] ?? null,
            'descripcion' => $validated['descripcion'] ?? null,
            'presupuesto_total' => $validated['presupuesto_total'],
            'estado' => 'activo',
        ]);

        return redirect()->back()->with('success', 'Proyecto / Fondo registrado exitosamente.');
    }

    public function updateProyecto(Request $request, Proyecto $proyectoModel): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:proyectos,nombre,' . $proyectoModel->id],
            'codigo' => ['nullable', 'string', 'max:100'],
            'descripcion' => ['nullable', 'string'],
            'presupuesto_total' => ['required', 'numeric', 'min:0'],
        ]);

        $proyectoModel->update([
            'nombre' => $validated['nombre'],
            'codigo' => $validated['codigo'] ?? null,
            'descripcion' => $validated['descripcion'] ?? null,
            'presupuesto_total' => $validated['presupuesto_total'],
        ]);

        return redirect()->back()->with('success', 'Proyecto / Fondo actualizado.');
    }

    public function destroyProyecto(Proyecto $proyectoModel): RedirectResponse
    {
        $proyectoModel->delete();
        return redirect()->back()->with('success', 'Proyecto eliminado.');
    }

    public function destroy(MovimientoFinanciero $movimiento): RedirectResponse
    {
        if ($movimiento->comprobante_path && Storage::disk('public')->exists($movimiento->comprobante_path)) {
            Storage::disk('public')->delete($movimiento->comprobante_path);
        }

        $movimiento->delete();

        return redirect()->back()->with('success', 'Movimiento eliminado.');
    }

    public function downloadPdf(Request $request)
    {
        $periodo = $request->input('periodo', 'este_mes');
        $fechaInicio = $request->input('fecha_inicio');
        $fechaFin = $request->input('fecha_fin');
        $tipoFiltro = $request->input('tipo', 'todos');
        $proyectoFiltro = $request->input('proyecto');
        $nombrePeriodo = $request->input('nombre_periodo', 'Informe Financiero');

        $query = MovimientoFinanciero::query();

        if ($fechaInicio && $fechaFin) {
            $query->whereBetween('fecha', [
                Carbon::parse($fechaInicio)->startOfDay(),
                Carbon::parse($fechaFin)->endOfDay()
            ]);
        }

        if ($tipoFiltro !== 'todos') {
            $query->where('tipo', $tipoFiltro);
        }

        if ($proyectoFiltro) {
            $query->where('proyecto', $proyectoFiltro);
        }

        $movimientos = $query->orderBy('fecha', 'asc')->orderBy('id', 'asc')->get();

        $totalIngresos = $movimientos->where('tipo', 'ingreso')->sum('monto');
        $totalEgresos = $movimientos->where('tipo', 'egreso')->sum('monto');
        $balanceNeto = $totalIngresos - $totalEgresos;

        // Información de rendición por proyecto específico (si aplica)
        $proyectoInfo = null;
        if ($proyectoFiltro) {
            $pModel = Proyecto::where('nombre', $proyectoFiltro)->first();
            $presupuestoTotal = $pModel ? (float) $pModel->presupuesto_total : 0;

            // Histórico de egresos e ingresos del proyecto
            $totalIngresosHistoricos = (float) MovimientoFinanciero::where('proyecto', $proyectoFiltro)->where('tipo', 'ingreso')->sum('monto');
            $totalEgresosHistoricos = (float) MovimientoFinanciero::where('proyecto', $proyectoFiltro)->where('tipo', 'egreso')->sum('monto');

            $limiteBase = $presupuestoTotal > 0 ? $presupuestoTotal : $totalIngresosHistoricos;
            $saldoDisponible = max(0, $limiteBase - $totalEgresosHistoricos);
            $pctEjecucion = $limiteBase > 0 ? min(100, round(($totalEgresosHistoricos / $limiteBase) * 100)) : 0;

            $proyectoInfo = [
                'nombre' => $proyectoFiltro,
                'codigo' => $pModel ? $pModel->codigo : 'N/A',
                'descripcion' => $pModel ? $pModel->descripcion : null,
                'presupuesto_total' => $presupuestoTotal,
                'presupuesto_total_formatted' => '$' . number_format($presupuestoTotal, 0, ',', '.'),
                'total_ingresos_historicos' => $totalIngresosHistoricos,
                'total_ingresos_historicos_formatted' => '$' . number_format($totalIngresosHistoricos, 0, ',', '.'),
                'total_egresos_historicos' => $totalEgresosHistoricos,
                'total_egresos_historicos_formatted' => '$' . number_format($totalEgresosHistoricos, 0, ',', '.'),
                'saldo_disponible' => $saldoDisponible,
                'saldo_disponible_formatted' => '$' . number_format($saldoDisponible, 0, ',', '.'),
                'pct_ejecucion' => $pctEjecucion,
            ];
        }

        // Process images for DomPDF embedding (base64 conversion)
        foreach ($movimientos as $mov) {
            $mov->comprobante_base64 = null;
            $mov->is_image = false;

            if ($mov->comprobante_path && Storage::disk('public')->exists($mov->comprobante_path)) {
                $fullPath = Storage::disk('public')->path($mov->comprobante_path);
                $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

                if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
                    $mov->is_image = true;
                    $mime = $ext === 'png' ? 'image/png' : ($ext === 'webp' ? 'image/webp' : 'image/jpeg');
                    $data = file_get_contents($fullPath);
                    $mov->comprobante_base64 = 'data:' . $mime . ';base64,' . base64_encode($data);
                }
            }
        }

        $pdf = Pdf::loadView('pdf.reporte_finanzas', compact(
            'movimientos',
            'nombrePeriodo',
            'fechaInicio',
            'fechaFin',
            'totalIngresos',
            'totalEgresos',
            'balanceNeto',
            'proyectoFiltro',
            'proyectoInfo'
        ));

        $filename = $proyectoFiltro
            ? 'Rendicion-de-Cuentas-' . \Illuminate\Support\Str::slug($proyectoFiltro) . '.pdf'
            : 'Libro-de-Respaldo-Finanzas-Fundacion-Gamboa.pdf';

        return $pdf->stream($filename);
    }
}
