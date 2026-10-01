<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->string('representante_direccion')->nullable()->after('representante_telefono');
            $table->string('representante_comuna')->nullable()->after('representante_direccion');
            $table->string('representante_sector')->nullable()->after('representante_comuna');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->dropColumn(['representante_direccion', 'representante_comuna', 'representante_sector']);
        });
    }
};
