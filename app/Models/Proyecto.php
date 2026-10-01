<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    use HasFactory;

    protected $table = 'proyectos';

    protected $fillable = [
        'nombre',
        'codigo',
        'descripcion',
        'presupuesto_total',
        'estado',
    ];

    protected $casts = [
        'presupuesto_total' => 'float',
    ];

    public function movimientos()
    {
        return $this->hasMany(MovimientoFinanciero::class, 'proyecto', 'nombre');
    }
}
