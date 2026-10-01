<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estados_producto', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('slug')->unique();
            $table->enum('tipo_disponibilidad', ['disponible', 'prestado', 'mantencion', 'baja'])->default('disponible');
            $table->string('badge_color')->default('emerald'); // emerald, blue, amber, sky, rose, slate
            $table->text('descripcion')->nullable();
            $table->boolean('es_sistema')->default(false);
            $table->integer('orden')->default(0);
            $table->timestamps();
        });

        // Insert default initial states
        DB::table('estados_producto')->insert([
            [
                'nombre' => 'Nuevo',
                'slug' => 'nuevo',
                'tipo_disponibilidad' => 'disponible',
                'badge_color' => 'emerald',
                'descripcion' => 'Equipo sin uso previa donación o compra.',
                'es_sistema' => true,
                'orden' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Usado (Excelente Estado)',
                'slug' => 'usado_excelente',
                'tipo_disponibilidad' => 'disponible',
                'badge_color' => 'emerald',
                'descripcion' => 'Equipo usado en excelentes condiciones operativas.',
                'es_sistema' => false,
                'orden' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Usado (Buen Estado)',
                'slug' => 'usado_bueno',
                'tipo_disponibilidad' => 'disponible',
                'badge_color' => 'emerald',
                'descripcion' => 'Equipo usado operativo con marcas menores de uso.',
                'es_sistema' => false,
                'orden' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Usado (Regular)',
                'slug' => 'usado_regular',
                'tipo_disponibilidad' => 'disponible',
                'badge_color' => 'amber',
                'descripcion' => 'Equipo usado operativo con desgaste visible.',
                'es_sistema' => false,
                'orden' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Reacondicionado',
                'slug' => 'reacondicionado',
                'tipo_disponibilidad' => 'disponible',
                'badge_color' => 'sky',
                'descripcion' => 'Equipo reparado o restaurado técnicamente por la fundación.',
                'es_sistema' => false,
                'orden' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'En Comodato (Prestado)',
                'slug' => 'prestado',
                'tipo_disponibilidad' => 'prestado',
                'badge_color' => 'amber',
                'descripcion' => 'Equipo entregado a beneficiario en comodato activo.',
                'es_sistema' => true,
                'orden' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'En Mantención / Taller',
                'slug' => 'mantencion',
                'tipo_disponibilidad' => 'mantencion',
                'badge_color' => 'sky',
                'descripcion' => 'Equipo en reparación, sanitización o revisión técnica.',
                'es_sistema' => true,
                'orden' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Dado de Baja / Descartado',
                'slug' => 'baja',
                'tipo_disponibilidad' => 'baja',
                'badge_color' => 'slate',
                'descripcion' => 'Equipo no reparable o destruido fuera de servicio.',
                'es_sistema' => true,
                'orden' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Add estado_fisico column to productos_inventario and unidades_producto
        if (!Schema::hasColumn('productos_inventario', 'estado_fisico')) {
            Schema::table('productos_inventario', function (Blueprint $table) {
                $table->string('estado_fisico')->default('Nuevo')->after('categoria');
            });
        }

        if (!Schema::hasColumn('unidades_producto', 'estado_fisico')) {
            Schema::table('unidades_producto', function (Blueprint $table) {
                $table->string('estado_fisico')->default('Nuevo')->after('estado');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('productos_inventario', 'estado_fisico')) {
            Schema::table('productos_inventario', function (Blueprint $table) {
                $table->dropColumn('estado_fisico');
            });
        }

        if (Schema::hasColumn('unidades_producto', 'estado_fisico')) {
            Schema::table('unidades_producto', function (Blueprint $table) {
                $table->dropColumn('estado_fisico');
            });
        }

        Schema::dropIfExists('estados_producto');
    }
};
