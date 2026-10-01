<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoProducto extends Model
{
    use HasFactory;

    protected $table = 'estados_producto';

    protected $fillable = [
        'nombre',
        'slug',
        'tipo_disponibilidad',
        'badge_color',
        'descripcion',
        'es_sistema',
        'orden',
    ];
}
