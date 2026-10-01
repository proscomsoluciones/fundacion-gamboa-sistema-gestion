<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sucursales', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('codigo')->unique();
            $table->string('direccion')->nullable();
            $table->string('telefono')->nullable();
            $table->foreignId('encargado_principal_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('es_casa_matriz')->default(false);
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });

        // Insertar Casa Matriz inicial
        DB::table('sucursales')->insert([
            'id' => 1,
            'nombre' => 'Casa Matriz - Villa Cardenal Silva Henríquez',
            'codigo' => 'MATRIZ-VCSH',
            'direccion' => 'Villa Cardenal Silva Henríquez',
            'es_casa_matriz' => true,
            'activa' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('sucursales');
    }
};
