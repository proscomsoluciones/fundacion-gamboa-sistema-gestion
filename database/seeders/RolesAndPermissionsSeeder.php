<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Lista de permisos del sistema
        $permissions = [
            // Productos & Inventario
            'ver-productos',
            'crear-productos',
            'editar-productos',
            'eliminar-productos',

            // Beneficiarios
            'ver-beneficiarios',
            'crear-beneficiarios',
            'editar-beneficiarios',
            'eliminar-beneficiarios',

            // Comodatos / Ayudas Técnicas
            'ver-comodatos',
            'crear-comodatos',
            'editar-comodatos',
            'eliminar-comodatos',
            'procesar-devolucion',

            // Reportes & Indicadores
            'ver-reportes',
            'exportar-reportes',

            // Configuración
            'gestionar-configuracion',

            // Módulo de Finanzas
            'ver-finanzas',
            'crear-finanzas',
            'editar-finanzas',
            'eliminar-finanzas',
            'exportar-finanzas',

            // Gestión de Usuarios y Roles
            'gestionar-usuarios',
            'gestionar-roles',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // 1. Rol: super_admin
        $roleSuperAdmin = Role::findOrCreate('super_admin', 'web');
        $roleSuperAdmin->syncPermissions(Permission::all());

        // 2. Rol: admin
        $roleAdmin = Role::findOrCreate('admin', 'web');
        $roleAdmin->syncPermissions([
            'ver-productos', 'crear-productos', 'editar-productos', 'eliminar-productos',
            'ver-beneficiarios', 'crear-beneficiarios', 'editar-beneficiarios', 'eliminar-beneficiarios',
            'ver-comodatos', 'crear-comodatos', 'editar-comodatos', 'eliminar-comodatos', 'procesar-devolucion',
            'ver-reportes', 'exportar-reportes',
            'ver-finanzas', 'crear-finanzas', 'editar-finanzas', 'eliminar-finanzas', 'exportar-finanzas',
            'gestionar-configuracion',
        ]);

        // 3. Rol: cooperador
        $roleCooperador = Role::findOrCreate('cooperador', 'web');
        $roleCooperador->syncPermissions([
            'ver-productos', 'crear-productos', 'editar-productos',
            'ver-beneficiarios', 'crear-beneficiarios', 'editar-beneficiarios',
            'ver-comodatos', 'crear-comodatos', 'editar-comodatos', 'procesar-devolucion',
            'ver-reportes',
        ]);
    }
}
