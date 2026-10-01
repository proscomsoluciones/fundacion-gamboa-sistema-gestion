<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\ProductoInventario;
use App\Models\MovimientoInventario;
use Illuminate\Database\Seeder;

class InsumosConsumiblesSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Asegurar categorías de insumos de alta rotación
        $categoriasInsumos = [
            ['nombre' => 'Insumos Desechables y Pañales', 'descripcion' => 'Pañales de adulto, sabanillas de cama y compresas de higiene personal.'],
            ['nombre' => 'Protección y Sanitarios', 'descripcion' => 'Guantes de nitrilo/látex, mascarillas, pecheras y elementos de aseo.'],
            ['nombre' => 'Nutrición y Cuidados Clínicos', 'descripcion' => 'Apósitos de curación, suplementos alimenticios y sueros.'],
        ];

        foreach ($categoriasInsumos as $cat) {
            Categoria::firstOrCreate(['nombre' => $cat['nombre']], $cat);
        }

        // 2. Catálogo de Insumos Consumibles (Stock Genérico por Cantidad)
        $insumos = [
            [
                'codigo' => 'INSU-PAN-M',
                'nombre' => 'Pañales Adulto Talla M (Paquete 10 Unidades)',
                'categoria' => 'Insumos Desechables y Pañales',
                'tipo' => 'stock_generico',
                'descripcion' => 'Pañales anatómicos para adulto con barrera antidesbordes y gel súper absorbente (Talla M).',
                'stock_generico_total' => 150,
                'stock_generico_disponible' => 120,
                'estado' => 'activo',
                'observaciones' => 'Donaciones frecuentes de laboratorios y particulares. Alta rotación mensual.',
            ],
            [
                'codigo' => 'INSU-PAN-L',
                'nombre' => 'Pañales Adulto Talla L (Paquete 10 Unidades)',
                'categoria' => 'Insumos Desechables y Pañales',
                'tipo' => 'stock_generico',
                'descripcion' => 'Pañales para adulto de alta absorción nocturna y cintas reajustables (Talla L).',
                'stock_generico_total' => 200,
                'stock_generico_disponible' => 165,
                'estado' => 'activo',
                'observaciones' => 'El insumo más solicitado por familias de pacientes postrados.',
            ],
            [
                'codigo' => 'INSU-PAN-XL',
                'nombre' => 'Pañales Adulto Talla XL (Paquete 10 Unidades)',
                'categoria' => 'Insumos Desechables y Pañales',
                'tipo' => 'stock_generico',
                'descripcion' => 'Pañales extra grandes anatómicos para adultos de alta densidad y mayor capacidad.',
                'stock_generico_total' => 100,
                'stock_generico_disponible' => 85,
                'estado' => 'activo',
                'observaciones' => 'Uso en pacientes con requerimiento especial.',
            ],
            [
                'codigo' => 'INSU-SAB-01',
                'nombre' => 'Sabanillas Clínicas Desechables 60x90cm (Paquete 10u)',
                'categoria' => 'Insumos Desechables y Pañales',
                'tipo' => 'stock_generico',
                'descripcion' => 'Sabanillas protectoras impermeables de colchón 60x90cm para mudanza e higiene.',
                'stock_generico_total' => 180,
                'stock_generico_disponible' => 140,
                'estado' => 'activo',
                'observaciones' => 'Complemento indispensable para camas clínicas.',
            ],
            [
                'codigo' => 'INSU-APO-01',
                'nombre' => 'Apósitos Multiuso Clínicos (Caja 20 Unidades)',
                'categoria' => 'Nutrición y Cuidados Clínicos',
                'tipo' => 'stock_generico',
                'descripcion' => 'Apósitos de curación altamente absorbentes para protección cutánea y curación de escaras.',
                'stock_generico_total' => 90,
                'stock_generico_disponible' => 75,
                'estado' => 'activo',
                'observaciones' => 'Para curaciones en domicilio por parte de familiares o enfermería.',
            ],
            [
                'codigo' => 'INSU-GUA-L',
                'nombre' => 'Guantes de Examen Nitrilo Talla L (Caja 100 Unidades)',
                'categoria' => 'Protección y Sanitarios',
                'tipo' => 'stock_generico',
                'descripcion' => 'Guantes clínicos libres de látex para curación, mudanza e higiene de pacientes.',
                'stock_generico_total' => 60,
                'stock_generico_disponible' => 50,
                'estado' => 'activo',
                'observaciones' => 'Insumo de protección personal.',
            ],
        ];

        foreach ($insumos as $ins) {
            $producto = ProductoInventario::firstOrCreate(
                ['codigo' => $ins['codigo']],
                $ins
            );

            // Registrar movimiento inicial de stock si es nuevo
            MovimientoInventario::firstOrCreate(
                [
                    'producto_id' => $producto->id,
                    'tipo' => 'entrada',
                    'observaciones' => 'Stock inicial registrado por Seeder de Insumos de Alta Rotación',
                ],
                [
                    'usuario_id' => 1,
                    'fecha' => now()->subDays(5),
                ]
            );
        }
    }
}
