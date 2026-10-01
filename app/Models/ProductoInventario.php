<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductoInventario extends Model
{
    use HasFactory;

    protected $table = 'productos_inventario';

    protected $fillable = [
        'codigo',
        'nombre',
        'categoria',
        'estado_fisico',
        'tipo',
        'descripcion',
        'stock_generico_total',
        'stock_generico_disponible',
        'estado',
        'observaciones',
    ];

    public function unidades()
    {
        return $this->hasMany(UnidadProducto::class, 'producto_id');
    }

    public function unidadesDisponibles()
    {
        return $this->hasMany(UnidadProducto::class, 'producto_id')->where('estado', 'disponible');
    }

    public function stocksSucursales()
    {
        return $this->hasMany(ProductoSucursalStock::class, 'producto_id');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class, 'producto_id');
    }
}
