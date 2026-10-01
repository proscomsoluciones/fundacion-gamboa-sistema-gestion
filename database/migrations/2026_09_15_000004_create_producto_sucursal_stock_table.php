<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('producto_sucursal_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos_inventario')->cascadeOnDelete();
            $table->foreignId('sucursal_id')->constrained('sucursales')->cascadeOnDelete();
            $table->integer('stock_total')->default(0);
            $table->integer('stock_disponible')->default(0);
            $table->timestamps();

            $table->unique(['producto_id', 'sucursal_id']);
        });

        // Población inicial: Todo producto genérico existente asigna su stock total/disponible a Casa Matriz (id = 1)
        $productosGenericos = DB::table('productos_inventario')->where('tipo', 'stock_generico')->get();
        foreach ($productosGenericos as $prod) {
            DB::table('producto_sucursal_stock')->insert([
                'producto_id' => $prod->id,
                'sucursal_id' => 1,
                'stock_total' => $prod->stock_generico_total ?? 0,
                'stock_disponible' => $prod->stock_generico_disponible ?? 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('producto_sucursal_stock');
    }
};
