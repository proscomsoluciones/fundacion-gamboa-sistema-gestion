<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categorias_finanzas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->enum('tipo', ['ingreso', 'egreso', 'ambos'])->default('ambos');
            $table->timestamps();
        });

        // Seed initial standard financial categories
        $ingresos = [
            'Subvención Municipal / Estatal',
            'Donaciones y Aportes de Colaboradores',
            'Eventos y Actividades de Recaudación',
            'Aportes de Benefactores Particulares',
            'Convenios e Instituciones',
            'Otros Ingresos Operativos',
        ];

        foreach ($ingresos as $cat) {
            DB::table('categorias_finanzas')->insertOrIgnore([
                'nombre' => $cat,
                'tipo' => 'ingreso',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $egresos = [
            'Adquisición de Equipos Clínicos',
            'Insumos Kinésicos y Sanitarios',
            'Mantención y Reparación de Ayudas Técnicas',
            'Gastos Operativos y Logística',
            'Combustible y Fletes de Entrega',
            'Servicios Básicos y Operación',
            'Viáticos y Traslados de Personal',
        ];

        foreach ($egresos as $cat) {
            DB::table('categorias_finanzas')->insertOrIgnore([
                'nombre' => $cat,
                'tipo' => 'egreso',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categorias_finanzas');
    }
};
