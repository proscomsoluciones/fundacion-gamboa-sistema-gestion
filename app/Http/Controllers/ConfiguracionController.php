<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\EstadoProducto;
use App\Models\ProductoInventario;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class ConfiguracionController extends Controller
{
    public function index(): Response
    {
        $categorias = Categoria::orderBy('nombre')->get()->map(function ($cat) {
            $cat->productos_count = ProductoInventario::where('categoria', $cat->nombre)->count();
            return $cat;
        });

        $estadosProducto = EstadoProducto::orderBy('orden')->orderBy('nombre')->get()->map(function ($est) {
            $est->productos_count = ProductoInventario::where('estado_fisico', $est->nombre)->count();
            return $est;
        });

        $users = User::with(['roles', 'sucursal'])->orderBy('name')->get()->map(function ($u) {
            $roleName = $u->roles->first()?->name ?? $u->role ?? 'cooperador';
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $roleName,
                'sucursal_id' => $u->sucursal_id,
                'sucursal_nombre' => $u->sucursal?->nombre ?? 'Sin sucursal',
                'created_at' => $u->created_at ? $u->created_at->format('d/m/Y H:i') : null,
            ];
        });

        $rolesAvailable = Role::all()->pluck('name');
        $sucursales = \App\Models\Sucursal::where('activa', true)->get();

        return Inertia::render('Configuracion/Index', [
            'categorias' => $categorias,
            'estadosProducto' => $estadosProducto,
            'users' => $users,
            'rolesAvailable' => $rolesAvailable,
            'sucursales' => $sucursales,
        ]);
    }

    public function storeUser(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', 'in:super_admin,admin,cooperador'],
            'sucursal_id' => ['nullable', 'exists:sucursales,id'],
        ]);

        $currentUser = $request->user();

        // Security check: non-super-admins cannot assign super_admin role
        if ($validated['role'] === 'super_admin' && !$currentUser->isSuperAdmin()) {
            return redirect()->back()->withErrors([
                'role' => 'Solo un Super Administrador puede crear o asignar la cuenta de Super Admin.'
            ]);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'sucursal_id' => $validated['sucursal_id'] ?? 1,
        ]);

        $user->assignRole($validated['role']);

        return redirect()->back()->with('success', 'Usuario creado exitosamente.');
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['required', 'string', 'in:super_admin,admin,cooperador'],
            'sucursal_id' => ['nullable', 'exists:sucursales,id'],
        ]);

        $currentUser = $request->user();

        // Security check: cannot modify a super_admin unless you are super_admin
        if ($user->hasRole('super_admin') && !$currentUser->isSuperAdmin()) {
            return redirect()->back()->withErrors([
                'role' => 'No tienes permisos para modificar la cuenta de un Super Administrador.'
            ]);
        }

        // Security check: cannot elevate to super_admin unless you are super_admin
        if ($validated['role'] === 'super_admin' && !$currentUser->isSuperAdmin()) {
            return redirect()->back()->withErrors([
                'role' => 'Solo un Super Administrador puede otorgar el rol de Super Admin.'
            ]);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];
        if (isset($validated['sucursal_id'])) {
            $user->sucursal_id = $validated['sucursal_id'];
        }

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();
        $user->syncRoles([$validated['role']]);

        return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroyUser(Request $request, User $user): RedirectResponse
    {
        $currentUser = $request->user();

        if ($user->id === $currentUser->id) {
            return redirect()->back()->withErrors([
                'error' => 'No puedes eliminar tu propia cuenta de usuario en uso.'
            ]);
        }

        if ($user->hasRole('super_admin') && !$currentUser->isSuperAdmin()) {
            return redirect()->back()->withErrors([
                'error' => 'No tienes permisos para eliminar un usuario Super Administrador.'
            ]);
        }

        $user->delete();

        return redirect()->back()->with('success', 'Usuario eliminado correctamente.');
    }

    public function storeCategoria(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:categorias,nombre'],
            'descripcion' => ['nullable', 'string'],
        ]);

        Categoria::create($validated);

        return redirect()->back()->with('success', 'Categoría creada exitosamente.');
    }

    public function updateCategoria(Request $request, Categoria $categoria): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:categorias,nombre,' . $categoria->id],
            'descripcion' => ['nullable', 'string'],
        ]);

        $oldNombre = $categoria->nombre;
        $categoria->update($validated);

        // Update all existing products in this category if name changed
        if ($oldNombre !== $validated['nombre']) {
            ProductoInventario::where('categoria', $oldNombre)->update(['categoria' => $validated['nombre']]);
        }

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroyCategoria(Categoria $categoria): RedirectResponse
    {
        $count = ProductoInventario::where('categoria', $categoria->nombre)->count();
        if ($count > 0) {
            return redirect()->back()->withErrors(['error' => "No se puede eliminar la categoría '{$categoria->nombre}' porque existen {$count} equipo(s) asignado(s) a ella."]);
        }

        $categoria->delete();

        return redirect()->back()->with('success', 'Categoría eliminada.');
    }

    public function storeEstadoProducto(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:estados_producto,nombre'],
            'tipo_disponibilidad' => ['required', 'in:disponible,prestado,mantencion,baja'],
            'badge_color' => ['nullable', 'string', 'max:50'],
            'descripcion' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['nombre']);
        $validated['badge_color'] = $validated['badge_color'] ?? 'emerald';

        EstadoProducto::create($validated);

        return redirect()->back()->with('success', 'Estado físico de producto registrado correctamente.');
    }

    public function updateEstadoProducto(Request $request, EstadoProducto $estadoProducto): RedirectResponse
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:estados_producto,nombre,' . $estadoProducto->id],
            'tipo_disponibilidad' => ['required', 'in:disponible,prestado,mantencion,baja'],
            'badge_color' => ['nullable', 'string', 'max:50'],
            'descripcion' => ['nullable', 'string'],
        ]);

        $oldNombre = $estadoProducto->nombre;
        $validated['slug'] = Str::slug($validated['nombre']);
        $estadoProducto->update($validated);

        if ($oldNombre !== $validated['nombre']) {
            ProductoInventario::where('estado_fisico', $oldNombre)->update(['estado_fisico' => $validated['nombre']]);
        }

        return redirect()->back()->with('success', 'Estado físico de producto actualizado correctamente.');
    }

    public function destroyEstadoProducto(EstadoProducto $estadoProducto): RedirectResponse
    {
        if ($estadoProducto->es_sistema) {
            return redirect()->back()->withErrors(['error' => "No se puede eliminar el estado del sistema '{$estadoProducto->nombre}'."]);
        }

        $count = ProductoInventario::where('estado_fisico', $estadoProducto->nombre)->count();
        if ($count > 0) {
            return redirect()->back()->withErrors(['error' => "No se puede eliminar el estado '{$estadoProducto->nombre}' porque existen {$count} equipo(s) con este estado."]);
        }

        $estadoProducto->delete();

        return redirect()->back()->with('success', 'Estado físico eliminado.');
    }
}
