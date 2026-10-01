<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrasladoInventario extends Model
{
    use HasFactory;

    protected $table = 'traslados_inventario';

    protected $fillable = [
        'codigo_traslado',
        'sucursal_origen_id',
        'sucursal_destino_id',
        'producto_id',
        'unidad_producto_id',
        'cantidad',
        'usuario_emisor_id',
        'estado',
        'observaciones',
    ];

    public function origen()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_origen_id');
    }

    public function destino()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_destino_id');
    }

    public function producto()
    {
        return $this->belongsTo(ProductoInventario::class, 'producto_id');
    }

    public function unidad()
    {
        return $this->belongsTo(UnidadProducto::class, 'unidad_producto_id');
    }

    public function usuarioEmisor()
    {
        return $this->belongsTo(User::class, 'usuario_emisor_id');
    }
}
