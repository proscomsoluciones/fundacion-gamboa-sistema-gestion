<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    use HasFactory;

    protected $table = 'movimientos_inventario';

    protected $fillable = [
        'producto_id',
        'unidad_producto_id',
        'tipo',
        'comodato_id',
        'usuario_id',
        'fecha',
        'observaciones',
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    public function producto()
    {
        return $this->belongsTo(ProductoInventario::class, 'producto_id');
    }

    public function unidad()
    {
        return $this->belongsTo(UnidadProducto::class, 'unidad_producto_id');
    }

    public function comodato()
    {
        return $this->belongsTo(Comodato::class, 'comodato_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
