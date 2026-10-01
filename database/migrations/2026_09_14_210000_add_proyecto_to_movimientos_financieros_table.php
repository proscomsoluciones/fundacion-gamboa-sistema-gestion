<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('movimientos_financieros', function (Blueprint $table) {
            $table->string('proyecto')->nullable()->default('Fondo General / Operación')->after('categoria');
        });
    }

    public function down(): void
    {
        Schema::table('movimientos_financieros', function (Blueprint $table) {
            $table->dropColumn('proyecto');
        });
    }
};
