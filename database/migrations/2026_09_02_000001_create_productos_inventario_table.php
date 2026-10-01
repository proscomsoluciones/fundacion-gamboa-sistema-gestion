<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos_inventario', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique();
            $table->string('nombre');
            $table->string('categoria'); // Camas Clínicas, Sillas de Ruedas, Colchones, Andadores, Insumos
            $table->enum('tipo', ['serializado', 'stock_generico'])->default('serializado');
            $table->text('descripcion')->nullable();
            $table->integer('stock_generico_total')->default(0); // Para insumos no serializados
            $table->integer('stock_generico_disponible')->default(0);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos_inventario');
    }
};
