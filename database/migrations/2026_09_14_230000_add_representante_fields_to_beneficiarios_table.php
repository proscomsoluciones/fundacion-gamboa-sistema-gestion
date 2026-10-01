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
            $table->string('representante_nombre')->nullable()->after('parentesco');
            $table->string('representante_rut')->nullable()->after('representante_nombre');
            $table->string('representante_telefono')->nullable()->after('representante_rut');
            $table->text('observaciones')->nullable()->after('representante_telefono');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->dropColumn(['representante_nombre', 'representante_rut', 'representante_telefono', 'observaciones']);
        });
    }
};
