<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unidades_producto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos_inventario')->cascadeOnDelete();
            $table->string('codigo_unidad')->unique(); // e.g. CAM-001, SIL-012
            $table->enum('estado', ['disponible', 'prestado', 'mantencion', 'baja'])->default('disponible');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unidades_producto');
    }
};
