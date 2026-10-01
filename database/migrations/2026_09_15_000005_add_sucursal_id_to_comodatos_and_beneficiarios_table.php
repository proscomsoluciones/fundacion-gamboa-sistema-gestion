<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('comodatos', function (Blueprint $table) {
            $table->foreignId('sucursal_id')->default(1)->after('responsable_entrega_id')->constrained('sucursales')->cascadeOnDelete();
        });

        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->foreignId('sucursal_registro_id')->default(1)->after('sector')->constrained('sucursales')->cascadeOnDelete();
        });

        DB::table('comodatos')->whereNull('sucursal_id')->update(['sucursal_id' => 1]);
        DB::table('beneficiarios')->whereNull('sucursal_registro_id')->update(['sucursal_registro_id' => 1]);
    }

    public function down(): void
    {
        Schema::table('comodatos', function (Blueprint $table) {
            $table->dropForeign(['sucursal_id']);
            $table->dropColumn('sucursal_id');
        });

        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->dropForeign(['sucursal_registro_id']);
            $table->dropColumn('sucursal_registro_id');
        });
    }
};
