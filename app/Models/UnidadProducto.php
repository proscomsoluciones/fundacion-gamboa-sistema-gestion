<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnidadProducto extends Model
{
    use HasFactory;

    protected $table = 'unidades_producto';

    protected $fillable = [
        'producto_id',
        'sucursal_id',
        'codigo_unidad',
        'estado',
        'estado_fisico',
        'observaciones',
    ];

    protected $casts = [
        'producto_id' => 'integer',
        'sucursal_id' => 'integer',
    ];

    public function producto()
    {
        return $this->belongsTo(ProductoInventario::class, 'producto_id');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class, 'unidad_producto_id');
    }
}
