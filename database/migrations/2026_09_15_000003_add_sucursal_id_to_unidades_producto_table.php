<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('unidades_producto', function (Blueprint $table) {
            $table->foreignId('sucursal_id')->default(1)->after('producto_id')->constrained('sucursales')->cascadeOnDelete();
        });

        DB::table('unidades_producto')->whereNull('sucursal_id')->update(['sucursal_id' => 1]);
    }

    public function down(): void
    {
        Schema::table('unidades_producto', function (Blueprint $table) {
            $table->dropForeign(['sucursal_id']);
            $table->dropColumn('sucursal_id');
        });
    }
};
