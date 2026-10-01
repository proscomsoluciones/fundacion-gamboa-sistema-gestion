<?php

namespace Database\Seeders;

use App\Models\MovimientoFinanciero;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class FinanzasSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?: User::first();

        // Sample receipt SVG / placeholder PNG created programmatically in storage if missing
        Storage::disk('public')->makeDirectory('comprobantes');
        $dummyReceiptPath = 'comprobantes/comprobante_ejemplo.png';

        if (!Storage::disk('public')->exists($dummyReceiptPath)) {
            $im = @imagecreatetruecolor(400, 300);
            if ($im) {
                $bg = imagecolorallocate($im, 248, 250, 252);
                $textColor = imagecolorallocate($im, 15, 23, 42);
                $accentColor = imagecolorallocate($im, 16, 185, 129);
                imagefill($im, 0, 0, $bg);
                imagestring($im, 5, 80, 40, "COMPROBANTE DE TRANSFERENCIA", $textColor);
                imagestring($im, 5, 100, 80, "BANCO ESTADO - CHILE", $accentColor);
                imagestring($im, 4, 60, 140, "Monto: $20.000 CLP", $textColor);
                imagestring($im, 4, 60, 170, "Destinatario: Jaime Valenzuela", $textColor);
                imagestring($im, 3, 60, 210, "Fecha: 06/08/2026 - Op #8050671", $textColor);
                ob_start();
                imagepng($im);
                $pngData = ob_get_clean();
                imagedestroy($im);
                Storage::disk('public')->put($dummyReceiptPath, $pngData);
            }
        }

        // Populate initial Proyectos with budgets
        Proyecto::truncate();
        $proyectosSeed = [
            [
                'nombre' => 'Subvención Municipal Maipú 2026',
                'codigo' => 'PROY-MAIPU-2026',
                'descripcion' => 'Fondo municipal para banco de sillas de ruedas y catres clínicos',
                'presupuesto_total' => 3500000,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Fondo GORE Ayudas Técnicas 2026',
                'codigo' => 'PROY-GORE-2026',
                'descripcion' => 'Financiamiento regional para mantención técnica y repuestos de equipamiento',
                'presupuesto_total' => 400000, // Explicit $400.000 limit for testing user requirement!
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Campaña Solidaria 2026',
                'codigo' => 'PROY-CAMP-2026',
                'descripcion' => 'Fondo recaudación actividades sociales',
                'presupuesto_total' => 1200000,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Fondo General / Operación',
                'codigo' => 'PROY-GEN-OPER',
                'descripcion' => 'Gastos operacionales generales de la Fundación (Sin proyecto asignado)',
                'presupuesto_total' => 0, // 0 = Sin límite estricto de proyecto específico
                'estado' => 'activo',
            ],
        ];

        foreach ($proyectosSeed as $p) {
            Proyecto::create($p);
        }

        // Clear old demo records to populate new foundation concepts cleanly
        MovimientoFinanciero::truncate();

        $movimientos = [
            // MOVIMIENTOS EN SEPTIEMBRE 2026 (MES ACTUAL)
            [
                'tipo' => 'egreso',
                'concepto' => 'Adquisición 4 Sillas de Ruedas Ergonómicas Plegables',
                'categoria' => 'Adquisición de Equipos Clínicos',
                'proyecto' => 'Subvención Municipal Maipú 2026',
                'monto' => 380000,
                'fecha' => '2026-09-02',
                'observaciones' => 'Factura #4092 Proveedor Ortopedia Central - Op #8050671',
                'comprobante_path' => Storage::disk('public')->exists($dummyReceiptPath) ? $dummyReceiptPath : null,
                'comprobante_original_name' => 'factura_sillas_ruedas_4092.png',
            ],
            [
                'tipo' => 'egreso',
                'concepto' => 'Compra 5 Colchones de Aire Antiescaras con Compresor',
                'categoria' => 'Insumos Kinésicos y Sanitarios',
                'proyecto' => 'Subvención Municipal Maipú 2026',
                'monto' => 145000,
                'fecha' => '2026-09-04',
                'observaciones' => 'Sistemas antiescaras para pacientes de Maipú y Providencia',
                'comprobante_path' => Storage::disk('public')->exists($dummyReceiptPath) ? $dummyReceiptPath : null,
                'comprobante_original_name' => 'boleta_colchones_antiescaras.png',
            ],
            [
                'tipo' => 'egreso',
                'concepto' => 'Mantención Técnica Semestral Camas Clínicas Eléctricas',
                'categoria' => 'Mantención y Reparación de Ayudas Técnicas',
                'proyecto' => 'Fondo GORE Ayudas Técnicas 2026',
                'monto' => 120000,
                'fecha' => '2026-09-06',
                'observaciones' => 'Servicio técnico especializado en revisión de motores y barandas',
            ],
            [
                'tipo' => 'egreso',
                'concepto' => 'Compra de Repuestos y Accesorios para Grúas de Traslado',
                'categoria' => 'Mantención y Reparación de Ayudas Técnicas',
                'proyecto' => 'Fondo GORE Ayudas Técnicas 2026',
                'monto' => 85000,
                'fecha' => '2026-09-08',
                'observaciones' => 'Arneses de sujeción y baterías de repuesto',
                'comprobante_path' => Storage::disk('public')->exists($dummyReceiptPath) ? $dummyReceiptPath : null,
                'comprobante_original_name' => 'comprobante_repuestos_gruas.png',
            ],
            [
                'tipo' => 'egreso',
                'concepto' => 'Combustible y Flete para Entrega de Camas en Terreno',
                'categoria' => 'Gastos Operativos y Logística',
                'proyecto' => 'Fondo General / Operación',
                'monto' => 45000,
                'fecha' => '2026-09-10',
                'observaciones' => 'Despacho e instalación de camas clínicas en comunas del sector poniente',
            ],
            [
                'tipo' => 'ingreso',
                'concepto' => 'Subvención Municipal Anual I. Municipalidad 2026',
                'categoria' => 'Subvención Municipal / Estatal',
                'proyecto' => 'Subvención Municipal Maipú 2026',
                'monto' => 3500000,
                'fecha' => '2026-09-01',
                'observaciones' => 'Aporte municipal para banco de ayudas técnicas y atención social',
                'comprobante_path' => Storage::disk('public')->exists($dummyReceiptPath) ? $dummyReceiptPath : null,
                'comprobante_original_name' => 'comprobante_subvencion_municipal.png',
            ],
            [
                'tipo' => 'ingreso',
                'concepto' => 'Donación Privada Empresa Colaboradora Ortopedia',
                'categoria' => 'Donaciones y Aportes de Colaboradores',
                'proyecto' => 'Fondo GORE Ayudas Técnicas 2026',
                'monto' => 850000,
                'fecha' => '2026-09-05',
                'observaciones' => 'Aporte directo para adquisición de equipamiento clínico',
            ],

            // MOVIMIENTOS EN AGOSTO 2026 (MES ANTERIOR)
            [
                'tipo' => 'egreso',
                'concepto' => 'Compra de 10 Andadores de Paso (Burritos de Aluminio)',
                'categoria' => 'Adquisición de Equipos Clínicos',
                'proyecto' => 'Subvención Municipal Maipú 2026',
                'monto' => 190000,
                'fecha' => '2026-08-18',
                'observaciones' => 'Andadores regulables en altura para beneficiarios del programa',
            ],
            [
                'tipo' => 'egreso',
                'concepto' => 'Insumos de Sanitización y Desinfección de Equipos',
                'categoria' => 'Insumos Kinésicos y Sanitarios',
                'proyecto' => 'Fondo General / Operación',
                'monto' => 32000,
                'fecha' => '2026-08-22',
                'observaciones' => 'Amonio cuaternario, pulverizadores y material de protección',
            ],
            [
                'tipo' => 'egreso',
                'concepto' => 'Compra de Bastones Canadienses y de 4 Apoyos',
                'categoria' => 'Insumos Kinésicos y Sanitarios',
                'proyecto' => 'Fondo General / Operación',
                'monto' => 68000,
                'fecha' => '2026-08-24',
                'observaciones' => 'Lote de 15 bastones ortopédicos de aluminio',
            ],
            [
                'tipo' => 'ingreso',
                'concepto' => 'Recaudación Campaña Beneficio Ayudas Técnicas',
                'categoria' => 'Eventos y Actividades de Recaudación',
                'proyecto' => 'Campaña Solidaria 2026',
                'monto' => 420000,
                'fecha' => '2026-08-22',
                'observaciones' => 'Recaudación total actividad solidaria de la Fundación',
            ],
        ];

        foreach ($movimientos as $mov) {
            MovimientoFinanciero::create(array_merge($mov, [
                'user_id' => $admin ? $admin->id : null,
            ]));
        }
    }
}
