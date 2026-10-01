<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comodatos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo')->unique(); // e.g. COM-2026-0001
            $table->foreignId('beneficiario_id')->constrained('beneficiarios');
            $table->foreignId('responsable_entrega_id')->constrained('users');
            $table->date('fecha_entrega');
            $table->date('fecha_estimada_devolucion')->nullable();
            $table->date('fecha_devolucion_real')->nullable();
            $table->enum('estado', ['activo', 'devuelto', 'en_seguimiento', 'perdido'])->default('activo');
            $table->text('observaciones_entrega')->nullable();
            $table->text('observaciones_devolucion')->nullable();
            $table->string('documento_pdf_path')->nullable();
            $table->string('documento_firmado_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comodatos');
    }
};
