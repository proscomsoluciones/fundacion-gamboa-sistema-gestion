<?php

namespace App\Http\Controllers;

use App\Models\Sucursal;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SucursalController extends Controller
{
    public function index(Request $request)
    {
        $sucursales = Sucursal::with(['encargadoPrincipal'])
            ->withCount(['usuarios', 'unidades', 'comodatos'])
            ->get();

        $usuarios = User::select('id', 'name', 'email', 'role', 'sucursal_id')->get();

        return Inertia::render('Configuracion/Sucursales/Index', [
            'sucursales' => $sucursales,
            'usuarios' => $usuarios,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'nullable|string|max:50|unique:sucursales,codigo',
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:50',
            'encargado_principal_id' => 'nullable|exists:users,id',
            'es_casa_matriz' => 'boolean',
        ]);

        if (empty($validated['codigo'])) {
            $validated['codigo'] = Str::upper(Str::slug($validated['nombre']));
        }

        Sucursal::create($validated);

        return redirect()->back()->with('success', 'Sucursal creada exitosamente.');
    }

    public function update(Request $request, Sucursal $sucursal)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string|max:50|unique:sucursales,codigo,' . $sucursal->id,
            'direccion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:50',
            'encargado_principal_id' => 'nullable|exists:users,id',
            'activa' => 'boolean',
        ]);

        $sucursal->update($validated);

        return redirect()->back()->with('success', 'Sucursal actualizada exitosamente.');
    }

    public function toggleStatus(Sucursal $sucursal)
    {
        if ($sucursal->es_casa_matriz) {
            return redirect()->back()->with('error', 'La Casa Matriz no se puede desactivar.');
        }

        $sucursal->update(['activa' => !$sucursal->activa]);

        return redirect()->back()->with('success', 'Estado de la sucursal actualizado.');
    }
}
