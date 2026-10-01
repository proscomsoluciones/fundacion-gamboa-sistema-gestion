<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_inventario', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos_inventario');
            $table->foreignId('unidad_producto_id')->nullable()->constrained('unidades_producto');
            $table->enum('tipo', ['salida', 'entrada', 'ajuste', 'baja']);
            $table->foreignId('comodato_id')->nullable()->constrained('comodatos');
            $table->foreignId('usuario_id')->constrained('users');
            $table->dateTime('fecha');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_inventario');
    }
};
