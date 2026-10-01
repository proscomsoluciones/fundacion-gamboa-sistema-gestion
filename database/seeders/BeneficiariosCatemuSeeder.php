<?php

namespace Database\Seeders;

use App\Models\Beneficiario;
use App\Models\Comodato;
use App\Models\ComodatoItem;
use App\Models\ProductoInventario;
use App\Models\UnidadProducto;
use App\Models\Sucursal;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BeneficiariosCatemuSeeder extends Seeder
{
    public function run(): void
    {
        $sectoresCatemu = [
            'Catemu Centro',
            'El Arrayán',
            'Chagres',
            'Colonia El Cobre',
            'Seco Alto',
            'Seco Bajo',
            'La Cuadra',
            'Las Varillas',
            'Compuertas',
            'Ñilhue',
            'La Poza',
            'Las Marías',
            'Cerrillos',
            'San Carlos Alto',
            'San Carlos Bajo',
            'Santa Margarita',
            'San José',
            'Reinoso',
            'Santa Isabel',
            'El Carmelo',
            'Los Corrales',
            'Santa Rosa',
            'Quebrachal',
            'La Redonda',
        ];

        $nombresHombre = ['Juan Carlos', 'José Luis', 'Pedro Antonio', 'Héctor Manuel', 'Luis Alberto', 'Carlos Eduardo', 'Fernando José', 'Guillermo Enrique', 'Mario Esteban', 'Roberto Alejandro', 'Francisco Javier', 'Ricardo Andrés'];
        $nombresMujer = ['María Elena', 'Rosa Amelia', 'Carmen Gloria', 'Ana Luisa', 'Teresa del Carmen', 'Margarita Rosa', 'Patricia Elizabeth', 'Verónica Isabel', 'Silvia Eugenia', 'Lucía Fernanda', 'Olga Patricia', 'Marta Alicia'];
        $apellidos = ['Tapia', 'Araya', 'González', 'Pérez', 'Silva', 'Fuentes', 'Vergara', 'Contreras', 'Rojas', 'Morales', 'Gallardo', 'Espinoza', 'Bravo', 'Soto', 'Campos', 'Olivares', 'Salinas', 'Bustos', 'Carrasco', 'Muñoz'];

        $parentescos = ['Hijo/a', 'Cónyuge / Esposo(a)', 'Madre / Padre', 'Hermano/a', 'Tutor Legal / Curador', 'Cuidador/a Responsable', 'Beneficiario Directo (El mismo paciente retira)'];

        $sucursales = Sucursal::where('activa', true)->get();
        $casaMatriz = $sucursales->where('es_casa_matriz', true)->first() ?: $sucursales->first();
        $sucursalCobre = $sucursales->where('es_casa_matriz', false)->first() ?: $casaMatriz;

        $productos = ProductoInventario::with('unidades')->get();

        $maxId = (Comodato::max('id') ?: 0) + 10;
        $counterRUT = 10123450 + rand(100, 999);
        $beneficiarioIdGlobal = 1;

        foreach ($sectoresCatemu as $sIdx => $sector) {
            for ($i = 1; $i <= 4; $i++) {
                $isWoman = ($i % 2 === 0);
                $nombreNombre = $isWoman ? $nombresMujer[array_rand($nombresMujer)] : $nombresHombre[array_rand($nombresHombre)];
                $apellido1 = $apellidos[array_rand($apellidos)];
                $apellido2 = $apellidos[array_rand($apellidos)];
                $nombreCompleto = "{$nombreNombre} {$apellido1} {$apellido2}";

                $rutNum = $counterRUT++;
                $dv = ($rutNum % 9) . ($rutNum % 2 === 0 ? 'K' : '');
                $rutFormat = number_format($rutNum, 0, '', '.') . '-' . ($dv === '0K' ? 'K' : ($rutNum % 9));

                $subDays = rand(5, 180);
                $fechaReg = Carbon::now()->subDays($subDays);

                $repIsWoman = ($i % 3 === 0);
                $repNombre = ($repIsWoman ? $nombresMujer[array_rand($nombresMujer)] : $nombresHombre[array_rand($nombresHombre)]) . ' ' . $apellido1 . ' ' . $apellidos[array_rand($apellidos)];

                $repRutNum = $counterRUT++;
                $repRutFormat = number_format($repRutNum, 0, '', '.') . '-' . ($repRutNum % 9);

                $beneficiario = Beneficiario::create([
                    'nombre' => $nombreCompleto,
                    'rut' => $rutFormat,
                    'comuna' => 'Catemu',
                    'sector' => $sector,
                    'sucursal_registro_id' => ($sIdx % 4 === 0) ? ($sucursalCobre ? $sucursalCobre->id : $casaMatriz->id) : $casaMatriz->id,
                    'fecha_registro' => $fechaReg,
                    'direccion' => "Calle Principal N° " . rand(10, 450) . ", {$sector}",
                    'telefono' => "+56 9 " . rand(50000000, 99999999),
                    'contacto_adicional' => "+56 9 " . rand(50000000, 99999999),
                    'parentesco' => $parentescos[array_rand($parentescos)],
                    'representante_nombre' => $repNombre,
                    'representante_rut' => $repRutFormat,
                    'representante_telefono' => "+56 9 " . rand(50000000, 99999999),
                    'representante_direccion' => "Calle Principal N° " . rand(10, 450) . ", {$sector}",
                    'representante_comuna' => 'Catemu',
                    'representante_sector' => $sector,
                    'observaciones' => "Paciente residente en sector {$sector} de Catemu. Registro completo.",
                    'estado' => 'activo',
                ]);

                // Create realistic Comodato loan for ~60% of beneficiaries
                if ($i <= 3 && $productos->count() > 0) {
                    $fechaEntrega = $fechaReg->copy()->addDays(rand(1, 5));
                    $isDevuelto = ($i === 3 && $subDays > 40);
                    $fechaDevolucion = $isDevuelto ? $fechaEntrega->copy()->addDays(rand(15, 30)) : null;

                    $sucursalComodato = ($sIdx % 4 === 0 && $sucursalCobre) ? $sucursalCobre : $casaMatriz;
                    $codigoNum = $maxId + $beneficiarioIdGlobal;

                    $comodato = Comodato::create([
                        'codigo' => 'COM-' . Carbon::now()->format('Y') . '-' . str_pad($codigoNum, 4, '0', STR_PAD_LEFT),
                        'beneficiario_id' => $beneficiario->id,
                        'sucursal_id' => $sucursalComodato->id,
                        'responsable_entrega_id' => 1,
                        'fecha_entrega' => $fechaEntrega,
                        'fecha_estimada_devolucion' => $fechaEntrega->copy()->addMonths(6),
                        'fecha_devolucion_real' => $fechaDevolucion,
                        'observaciones_entrega' => 'Entrega de equipo en comodato gratuito Fundación Gamboa.',
                        'estado' => $isDevuelto ? 'devuelto' : 'activo',
                    ]);

                    // Attach 1 to 2 items
                    $randomProd = $productos->random();
                    $unidadesDisponibles = $randomProd->unidades ? $randomProd->unidades->where('estado', 'disponible') : collect();
                    $targetUnidad = $unidadesDisponibles->first();

                    if ($targetUnidad && !$isDevuelto) {
                        $targetUnidad->update([
                            'estado' => 'prestado',
                            'sucursal_id' => $sucursalComodato->id,
                        ]);
                    }

                    ComodatoItem::create([
                        'comodato_id' => $comodato->id,
                        'producto_id' => $randomProd->id,
                        'unidad_producto_id' => $targetUnidad ? $targetUnidad->id : null,
                        'cantidad' => 1,
                    ]);
                }

                $beneficiarioIdGlobal++;
            }
        }
    }
}
