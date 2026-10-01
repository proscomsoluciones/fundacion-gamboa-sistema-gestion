<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_financieros', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['ingreso', 'egreso'])->default('egreso');
            $table->string('concepto');
            $table->string('categoria');
            $table->decimal('monto', 12, 2);
            $table->date('fecha');
            $table->text('observaciones')->nullable();
            $table->string('comprobante_path')->nullable();
            $table->string('comprobante_original_name')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_financieros');
    }
};
