<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('traslados_inventario', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_traslado')->unique();
            $table->foreignId('sucursal_origen_id')->constrained('sucursales')->cascadeOnDelete();
            $table->foreignId('sucursal_destino_id')->constrained('sucursales')->cascadeOnDelete();
            $table->foreignId('producto_id')->constrained('productos_inventario')->cascadeOnDelete();
            $table->foreignId('unidad_producto_id')->nullable()->constrained('unidades_producto')->nullOnDelete();
            $table->integer('cantidad')->default(1);
            $table->foreignId('usuario_emisor_id')->constrained('users')->cascadeOnDelete();
            $table->string('estado')->default('completado');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('traslados_inventario');
    }
};
