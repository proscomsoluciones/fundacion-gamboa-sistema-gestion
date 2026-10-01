<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\ProductoInventario;
use App\Models\UnidadProducto;
use App\Models\MovimientoInventario;
use Illuminate\Database\Seeder;

class ProductosSerializadosSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Asegurar categorías del sistema
        $defaultCategories = [
            ['nombre' => 'Camas y Catres', 'descripcion' => 'Camas clínicas eléctricas, manuales y accesorios articulados.'],
            ['nombre' => 'Sillas de Ruedas', 'descripcion' => 'Sillas de ruedas de transporte, ergonómicas y plegables.'],
            ['nombre' => 'Colchones', 'descripcion' => 'Colchones clínicos y sistemas de aire antiescaras con compresor.'],
            ['nombre' => 'Andadores', 'descripcion' => 'Andadores de paso, burritos de aluminio regulables.'],
            ['nombre' => 'Sillas de Baño / W.C.', 'descripcion' => 'Sillas para ducha y sanitarios portátiles adaptados.'],
            ['nombre' => 'Grúas de Traslado', 'descripcion' => 'Grúas hidráulicas y eléctricas para movilidad de pacientes.'],
            ['nombre' => 'Bastones y Muletas', 'descripcion' => 'Bastones de 1 y 4 apoyos, muletas axilares y canadienses.'],
        ];

        foreach ($defaultCategories as $cat) {
            Categoria::firstOrCreate(['nombre' => $cat['nombre']], $cat);
        }

        // 2. Definición de Productos Serializados con sus Números de Serie Únicos
        $productosSerializados = [
            [
                'codigo' => 'PROD-CAM-01',
                'nombre' => 'Cama Clínica Eléctrica 3 Posiciones',
                'categoria' => 'Camas y Catres',
                'estado_fisico' => 'Nuevo',
                'tipo' => 'serializado',
                'descripcion' => 'Catre clínico articulado eléctrico con barandas de seguridad laterales, control remoto y soporte de suero.',
                'estado' => 'activo',
                'observaciones' => 'Equipos de alta demanda para pacientes postrados.',
                'unidades' => [
                    [
                        'codigo_unidad' => 'CAM-2026-001',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Nuevo',
                        'observaciones' => 'Ingresada por donación corporativa. 100% operativa.',
                    ],
                    [
                        'codigo_unidad' => 'CAM-2026-002',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Excelente Estado)',
                        'observaciones' => 'Revisión técnica al día. Sanitizada.',
                    ],
                    [
                        'codigo_unidad' => 'CAM-2026-003',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Buen Estado)',
                        'observaciones' => 'Pequeño detalle estético en pintura. Funcionamiento impecable.',
                    ],
                    [
                        'codigo_unidad' => 'CAM-2026-004',
                        'estado' => 'mantencion',
                        'estado_fisico' => 'En Mantención / Taller',
                        'observaciones' => 'En taller para cambio de cable de control y engrase de motor.',
                    ],
                    [
                        'codigo_unidad' => 'CAM-2026-005',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Reacondicionado',
                        'observaciones' => 'Reacondicionada con motores nuevos.',
                    ],
                ]
            ],
            [
                'codigo' => 'PROD-SIL-01',
                'nombre' => 'Silla de Ruedas Ergonómica Plegable',
                'categoria' => 'Sillas de Ruedas',
                'estado_fisico' => 'Nuevo',
                'tipo' => 'serializado',
                'descripcion' => 'Silla de ruedas liviana de estructura de aluminio, frenos bilaterales de mano y reposapiés abatibles.',
                'estado' => 'activo',
                'observaciones' => 'Facilita traslado diario de beneficiarios.',
                'unidades' => [
                    [
                        'codigo_unidad' => 'SIL-2026-001',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Nuevo',
                        'observaciones' => 'En caja sellada de bodega.',
                    ],
                    [
                        'codigo_unidad' => 'SIL-2026-002',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Excelente Estado)',
                        'observaciones' => 'Ruedas y tapiz impecables.',
                    ],
                    [
                        'codigo_unidad' => 'SIL-2026-003',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Buen Estado)',
                        'observaciones' => 'Uso normal. Cojín antiescaras incluido.',
                    ],
                    [
                        'codigo_unidad' => 'SIL-2026-004',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Regular)',
                        'observaciones' => 'Requiere ajuste leve en freno izquierdo.',
                    ],
                    [
                        'codigo_unidad' => 'SIL-2026-005',
                        'estado' => 'baja',
                        'estado_fisico' => 'Dado de Baja / Descartado',
                        'observaciones' => 'Estructura fisurada. Retirada de uso por seguridad.',
                    ],
                ]
            ],
            [
                'codigo' => 'PROD-GRU-01',
                'nombre' => 'Grúa de Traslado Pacientes Hidráulica',
                'categoria' => 'Grúas de Traslado',
                'estado_fisico' => 'Nuevo',
                'tipo' => 'serializado',
                'descripcion' => 'Grúa médica de transferencia con arnés universal acolchado para levantar y mover pacientes de hasta 150 kg.',
                'estado' => 'activo',
                'observaciones' => 'Evita lesiones en cuidadores.',
                'unidades' => [
                    [
                        'codigo_unidad' => 'GRU-2026-001',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Nuevo',
                        'observaciones' => 'Con arnés talla L completamente nuevo.',
                    ],
                    [
                        'codigo_unidad' => 'GRU-2026-002',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Excelente Estado)',
                        'observaciones' => 'Pistón hidráulico probado con carga.',
                    ],
                    [
                        'codigo_unidad' => 'GRU-2026-003',
                        'estado' => 'mantencion',
                        'estado_fisico' => 'En Mantención / Taller',
                        'observaciones' => 'Cambio de sellos hidráulicos preventivo.',
                    ],
                ]
            ],
            [
                'codigo' => 'PROD-BAN-01',
                'nombre' => 'Silla de Ducha con Ruedas y W.C. Adaptado',
                'categoria' => 'Sillas de Baño / W.C.',
                'estado_fisico' => 'Nuevo',
                'tipo' => 'serializado',
                'descripcion' => 'Silla multipropósito inoxidable para higiene en ducha y depósito bacín extraíble.',
                'estado' => 'activo',
                'observaciones' => 'Resistente al agua e insumos de aseo.',
                'unidades' => [
                    [
                        'codigo_unidad' => 'BAN-2026-001',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Nuevo',
                        'observaciones' => 'Nuevo ingreso en bodega.',
                    ],
                    [
                        'codigo_unidad' => 'BAN-2026-002',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Excelente Estado)',
                        'observaciones' => 'Sanitizado clínicamente.',
                    ],
                    [
                        'codigo_unidad' => 'BAN-2026-003',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Buen Estado)',
                        'observaciones' => 'Incluye receptáculo completo.',
                    ],
                ]
            ],
            [
                'codigo' => 'PROD-AND-01',
                'nombre' => 'Andador de Aluminio Plegable (Burrito)',
                'categoria' => 'Andadores',
                'estado_fisico' => 'Nuevo',
                'tipo' => 'serializado',
                'descripcion' => 'Andador de paso ultraliviano regulable en altura con regatones de goma antideslizantes.',
                'estado' => 'activo',
                'observaciones' => 'Liviano y fácil de transportar en vehículo.',
                'unidades' => [
                    [
                        'codigo_unidad' => 'AND-2026-001',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Nuevo',
                        'observaciones' => '0 km, en envoltorio.',
                    ],
                    [
                        'codigo_unidad' => 'AND-2026-002',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Excelente Estado)',
                        'observaciones' => 'Regatones nuevos instalados.',
                    ],
                    [
                        'codigo_unidad' => 'AND-2026-003',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Reacondicionado',
                        'observaciones' => 'Ajustes mecánicos al día.',
                    ],
                    [
                        'codigo_unidad' => 'AND-2026-004',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Regular)',
                        'observaciones' => 'Marcas menores de uso.',
                    ],
                ]
            ],
            [
                'codigo' => 'PROD-BAS-01',
                'nombre' => 'Bastón Canadiense de Aluminio Regulable (Par)',
                'categoria' => 'Bastones y Muletas',
                'estado_fisico' => 'Nuevo',
                'tipo' => 'serializado',
                'descripcion' => 'Par de bastones de apoyo antebraquial ergonómicos de altura ajustable.',
                'estado' => 'activo',
                'observaciones' => 'Soporta hasta 120 kg.',
                'unidades' => [
                    [
                        'codigo_unidad' => 'BAS-2026-001',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Nuevo',
                        'observaciones' => 'Par sin uso.',
                    ],
                    [
                        'codigo_unidad' => 'BAS-2026-002',
                        'estado' => 'disponible',
                        'estado_fisico' => 'Usado (Excelente Estado)',
                        'observaciones' => 'Empuñaduras en perfecto estado.',
                    ],
                ]
            ],
        ];

        foreach ($productosSerializados as $item) {
            $unidadesData = $item['unidades'];
            unset($item['unidades']);

            $producto = ProductoInventario::updateOrCreate(
                ['codigo' => $item['codigo']],
                $item
            );

            foreach ($unidadesData as $uData) {
                UnidadProducto::updateOrCreate(
                    ['codigo_unidad' => $uData['codigo_unidad']],
                    array_merge($uData, ['producto_id' => $producto->id])
                );
            }
        }
    }
}
