<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    'is_super_admin' => $user->isSuperAdmin(),
                    'is_admin' => $user->isAdmin(),
                    'is_cooperador' => $user->isCooperador(),
                    'sucursal' => $user->sucursal ? [
                        'id' => $user->sucursal->id,
                        'nombre' => $user->sucursal->nombre,
                        'codigo' => $user->sucursal->codigo,
                        'es_casa_matriz' => $user->sucursal->es_casa_matriz,
                    ] : null,
                ]) : null,
            ],
        ];
    }
}
