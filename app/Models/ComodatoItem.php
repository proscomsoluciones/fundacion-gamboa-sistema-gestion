<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComodatoItem extends Model
{
    use HasFactory;

    protected $table = 'comodato_items';

    protected $fillable = [
        'comodato_id',
        'producto_id',
        'unidad_producto_id',
        'cantidad',
    ];

    public function comodato()
    {
        return $this->belongsTo(Comodato::class, 'comodato_id');
    }

    public function producto()
    {
        return $this->belongsTo(ProductoInventario::class, 'producto_id');
    }

    public function unidad()
    {
        return $this->belongsTo(UnidadProducto::class, 'unidad_producto_id');
    }
}
