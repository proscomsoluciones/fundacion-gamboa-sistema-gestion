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
            $table->string('cedula_path')->nullable()->after('observaciones');
            $table->string('cedula_original_name')->nullable()->after('cedula_path');
            $table->string('documento_adicional_path')->nullable()->after('cedula_original_name');
            $table->string('documento_adicional_original_name')->nullable()->after('documento_adicional_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('beneficiarios', function (Blueprint $table) {
            $table->dropColumn([
                'cedula_path',
                'cedula_original_name',
                'documento_adicional_path',
                'documento_adicional_original_name',
            ]);
        });
    }
};
