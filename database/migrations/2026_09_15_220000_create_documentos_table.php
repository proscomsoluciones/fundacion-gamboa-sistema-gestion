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
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('categoria')->default('General');
            $table->text('descripcion')->nullable();
            $table->string('archivo_nombre_original');
            $table->string('archivo_path');
            $table->string('archivo_extension', 10);
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('tamano_bytes')->default(0);
            $table->date('fecha_documento')->nullable();
            $table->foreignId('sucursal_id')->nullable()->constrained('sucursales')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['categoria', 'archivo_extension']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos');
    }
};
