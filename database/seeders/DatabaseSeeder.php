<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ProductoInventario;
use App\Models\UnidadProducto;
use App\Models\Beneficiario;
use App\Models\Categoria;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Cargar Roles y Permisos Spatie
        $this->call(RolesAndPermissionsSeeder::class);

        // Seed default categories
        $defaultCategories = [
            ['nombre' => 'Camas y Catres', 'descripcion' => 'Camas clínicas eléctricas, manuales y accesorios articulados.'],
            ['nombre' => 'Sillas de Ruedas', 'descripcion' => 'Sillas de ruedas de transporte, ergonómicas y plegables.'],
            ['nombre' => 'Colchones', 'descripcion' => 'Colchones clínicos y sistemas de aire antiescaras con compresor.'],
            ['nombre' => 'Andadores', 'descripcion' => 'Andadores de paso, burritos de aluminio regulables.'],
            ['nombre' => 'Sillas de Baño / W.C.', 'descripcion' => 'Sillas para ducha y sanitarios portátiles adaptados.'],
            ['nombre' => 'Grúas de Traslado', 'descripcion' => 'Grúas hidráulicas y eléctricas para movilidad de pacientes.'],
            ['nombre' => 'Bastones y Muletas', 'descripcion' => 'Bastones de 1 y 4 apoyos, muletas axilares y canadienses.'],
            ['nombre' => 'Insumos Kinésicos', 'descripcion' => 'Cojines ortopédicos, pesas y elementos de rehabilitación.'],
        ];

        foreach ($defaultCategories as $cat) {
            Categoria::firstOrCreate(['nombre' => $cat['nombre']], $cat);
        }

        // Internal Management Users & Roles
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@fundacion.org'],
            [
                'name' => 'Super Administrador',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
            ]
        );
        $superAdmin->assignRole('super_admin');

        $admin = User::firstOrCreate(
            ['email' => 'admin@fundacion.org'],
            [
                'name' => 'Administrador Sistema',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );
        $admin->assignRole('admin');

        $cooperador = User::firstOrCreate(
            ['email' => 'operaciones@fundacion.org'],
            [
                'name' => 'Cooperador / Operaciones',
                'password' => bcrypt('password'),
                'role' => 'cooperador',
            ]
        );
        $cooperador->assignRole('cooperador');

        // Sample Inventory Products
        $cama = ProductoInventario::firstOrCreate(
            ['codigo' => 'PROD-CAM-01'],
            [
                'nombre' => 'Cama Clínica Eléctrica 3 Posiciones',
                'categoria' => 'Camas y Catres',
                'tipo' => 'serializado',
                'descripcion' => 'Catre clínico articulado eléctrico con barandas de seguridad laterales y soporte de suero.',
                'estado' => 'activo',
                'observaciones' => 'Requiere revisión técnica semestral.',
            ]
        );

        foreach (['CAM-001', 'CAM-002', 'CAM-003', 'CAM-004'] as $idx => $code) {
            UnidadProducto::firstOrCreate(
                ['codigo_unidad' => $code],
                [
                    'producto_id' => $cama->id,
                    'estado' => $idx === 3 ? 'mantencion' : 'disponible',
                    'observaciones' => $idx === 3 ? 'Motor en mantención preventiva' : 'Excelente estado clínico',
                ]
            );
        }

        $silla = ProductoInventario::firstOrCreate(
            ['codigo' => 'PROD-SIL-01'],
            [
                'nombre' => 'Silla de Ruedas Ergonómica Plegable',
                'categoria' => 'Sillas de Ruedas',
                'tipo' => 'serializado',
                'descripcion' => 'Silla de ruedas de transporte liviana en aluminio con frenos de mano y reposapiés abatibles.',
                'estado' => 'activo',
            ]
        );

        foreach (['SIL-001', 'SIL-002', 'SIL-003', 'SIL-004'] as $code) {
            UnidadProducto::firstOrCreate(
                ['codigo_unidad' => $code],
                [
                    'producto_id' => $silla->id,
                    'estado' => 'disponible',
                    'observaciones' => 'Desinfectada y sanitizada',
                ]
            );
        }

        $colchon = ProductoInventario::firstOrCreate(
            ['codigo' => 'PROD-COL-01'],
            [
                'nombre' => 'Colchón de Aire Antiescaras con Compresor',
                'categoria' => 'Colchones',
                'tipo' => 'stock_generico',
                'descripcion' => 'Sistema de alivio de presión por aire alternante para prevención de úlceras.',
                'stock_generico_total' => 20,
                'stock_generico_disponible' => 17,
                'estado' => 'activo',
            ]
        );

        $andador = ProductoInventario::firstOrCreate(
            ['codigo' => 'PROD-AND-01'],
            [
                'nombre' => 'Andador de Aluminio Plegable (Burrito)',
                'categoria' => 'Andadores',
                'tipo' => 'serializado',
                'descripcion' => 'Andador de paso de altura regulable con empuñaduras antideslizantes.',
                'estado' => 'activo',
            ]
        );

        foreach (['AND-001', 'AND-002'] as $code) {
            UnidadProducto::firstOrCreate(
                ['codigo_unidad' => $code],
                [
                    'producto_id' => $andador->id,
                    'estado' => 'disponible',
                ]
            );
        }

        // Sample Beneficiarios with RUT, Comuna, Fecha Registro, Parentesco
        Beneficiario::firstOrCreate(
            ['nombre' => 'María Teresa Soto Morales'],
            [
                'rut' => '12.345.678-9',
                'comuna' => 'Maipú',
                'fecha_registro' => Carbon::now()->subMonths(3),
                'direccion' => 'Av. Los Olivos 432, Sector Poniente',
                'telefono' => '+56 9 8765 4321',
                'contacto_adicional' => 'Carlos Soto Morales',
                'parentesco' => 'Hijo',
                'estado' => 'activo',
            ]
        );

        Beneficiario::firstOrCreate(
            ['nombre' => 'Pedro Antonio Gómez Silva'],
            [
                'rut' => '15.678.901-2',
                'comuna' => 'Santiago Centro',
                'fecha_registro' => Carbon::now()->subMonths(2),
                'direccion' => 'Calle El Manzano 12, Sector Centro',
                'telefono' => '+56 9 7654 3210',
                'contacto_adicional' => 'Luisa Gómez Rojas',
                'parentesco' => 'Cónyuge',
                'estado' => 'activo',
            ]
        );

        Beneficiario::firstOrCreate(
            ['nombre' => 'Ana Luisa Fernández Riquelme'],
            [
                'rut' => '9.876.543-1',
                'comuna' => 'Providencia',
                'fecha_registro' => Carbon::now()->subMonth(),
                'direccion' => 'Pasaje Las Rosas 88, Sector Norte',
                'telefono' => '+56 9 6543 2109',
                'contacto_adicional' => 'Elena Fernández',
                'parentesco' => 'Cuidadora Principal',
                'estado' => 'activo',
            ]
        );

        // Run Insumos de Alta Rotación Seeder
        $this->call(InsumosConsumiblesSeeder::class);

        // Run Productos Serializados (N° de Serie Único) Seeder
        $this->call(ProductosSerializadosSeeder::class);

        // Run Beneficiarios por Sector de Catemu Seeder (4 registros por sector)
        $this->call(BeneficiariosCatemuSeeder::class);

        // Run Ampliación de Sucursales de Sectores Alejados (Cerrillos, Santa Isabel, Quebrachal, Los Corrales, Chagres)
        $this->call(SucursalesCatemuSeeder::class);
    }
}
