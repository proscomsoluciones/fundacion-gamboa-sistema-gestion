<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comodato_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comodato_id')->constrained('comodatos')->cascadeOnDelete();
            $table->foreignId('producto_id')->constrained('productos_inventario');
            $table->foreignId('unidad_producto_id')->nullable()->constrained('unidades_producto');
            $table->integer('cantidad')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comodato_items');
    }
};
