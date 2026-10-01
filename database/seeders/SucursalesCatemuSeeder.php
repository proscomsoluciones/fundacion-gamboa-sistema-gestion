<?php

namespace Database\Seeders;

use App\Models\Sucursal;
use App\Models\ProductoInventario;
use App\Models\ProductoSucursalStock;
use App\Models\UnidadProducto;
use App\Models\Beneficiario;
use App\Models\Comodato;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SucursalesCatemuSeeder extends Seeder
{
    public function run(): void
    {
        $adminUser = User::first();
        $adminId = $adminUser ? $adminUser->id : 1;

        // Clean duplicates if present
        $duplicates = [8, 9, 10, 11, 12];
        foreach ($duplicates as $dupId) {
            ProductoSucursalStock::where('sucursal_id', $dupId)->delete();
            Sucursal::where('id', $dupId)->delete();
        }

        // Update Casa Matriz and Sede Cobre
        $casaMatriz = Sucursal::where('es_casa_matriz', true)->first();
        if ($casaMatriz) {
            $casaMatriz->update([
                'nombre' => 'Sede Central - Villa Cardenal Silva Henríquez',
                'codigo' => 'SEDE-CENTRAL',
            ]);
        }

        $sucursalCobre = Sucursal::where('id', 2)->orWhere('codigo', 'SUC-COBRE')->first();
        if ($sucursalCobre) {
            $sucursalCobre->update([
                'nombre' => 'Sede El Cobre',
                'codigo' => 'SEDE-ELCOBRE',
            ]);
        }

        // Update 5 remote sedes
        $sedes = [
            3 => ['nombre' => 'Sede Cerrillos', 'codigo' => 'SEDE-CERRILLOS', 'sector' => 'Cerrillos', 'direccion' => 'Av. Principal Cerrillos N° 450, Sector Cerrillos, Catemu', 'telefono' => '+56 34 245 1001'],
            4 => ['nombre' => 'Sede Santa Isabel', 'codigo' => 'SEDE-SANTAISABEL', 'sector' => 'Santa Isabel', 'direccion' => 'Camino Rural Santa Isabel N° 88, Sector Santa Isabel, Catemu', 'telefono' => '+56 34 245 1002'],
            5 => ['nombre' => 'Sede Quebrachal', 'codigo' => 'SEDE-QUEBRACHAL', 'sector' => 'Quebrachal', 'direccion' => 'Sector El Quebrachal Lote 12, Catemu', 'telefono' => '+56 34 245 1003'],
            6 => ['nombre' => 'Sede Los Corrales', 'codigo' => 'SEDE-LOSCORRALES', 'sector' => 'Los Corrales', 'direccion' => 'Pasaje Los Corrales N° 18, Sector Los Corrales, Catemu', 'telefono' => '+56 34 245 1004'],
            7 => ['nombre' => 'Sede Chagres', 'codigo' => 'SEDE-CHAGRES', 'sector' => 'Chagres', 'direccion' => 'Ruta 60 Sector Chagres N° 102, Catemu', 'telefono' => '+56 34 245 1005'],
        ];

        $sucursalesCreadas = [];

        foreach ($sedes as $id => $info) {
            $sucursal = Sucursal::find($id);
            if (!$sucursal) {
                $sucursal = Sucursal::create([
                    'id' => $id,
                    'nombre' => $info['nombre'],
                    'codigo' => $info['codigo'],
                    'direccion' => $info['direccion'],
                    'telefono' => $info['telefono'],
                    'encargado_principal_id' => $adminId,
                    'es_casa_matriz' => false,
                    'activa' => true,
                ]);
            } else {
                $sucursal->update([
                    'nombre' => $info['nombre'],
                    'codigo' => $info['codigo'],
                    'direccion' => $info['direccion'],
                    'telefono' => $info['telefono'],
                ]);
            }
            $sucursalesCreadas[$info['sector']] = $sucursal;
        }

        // Assign/Distribute Generic Inventory Stock to new branches
        $productosGenericos = ProductoInventario::where('tipo', 'stock_generico')->get();

        foreach ($sucursalesCreadas as $sector => $sucursal) {
            foreach ($productosGenericos as $prod) {
                ProductoSucursalStock::firstOrCreate(
                    [
                        'producto_id' => $prod->id,
                        'sucursal_id' => $sucursal->id,
                    ],
                    [
                        'stock_total' => rand(4, 12),
                        'stock_disponible' => rand(3, 10),
                    ]
                );
            }
        }

        // Link existing Beneficiaries & Comodatos from these sectors to their respective local Branch
        foreach ($sucursalesCreadas as $sector => $sucursal) {
            $beneficiariosSector = Beneficiario::where('sector', $sector)->get();

            foreach ($beneficiariosSector as $ben) {
                $ben->update(['sucursal_registro_id' => $sucursal->id]);

                Comodato::where('beneficiario_id', $ben->id)
                    ->update(['sucursal_id' => $sucursal->id]);
            }
        }
    }
}
