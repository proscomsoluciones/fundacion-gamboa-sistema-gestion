<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductoSucursalStock extends Model
{
    use HasFactory;

    protected $table = 'producto_sucursal_stock';

    protected $fillable = [
        'producto_id',
        'sucursal_id',
        'stock_total',
        'stock_disponible',
    ];

    protected $casts = [
        'producto_id' => 'integer',
        'sucursal_id' => 'integer',
        'stock_total' => 'integer',
        'stock_disponible' => 'integer',
    ];

    public function producto()
    {
        return $this->belongsTo(ProductoInventario::class, 'producto_id');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }
}
