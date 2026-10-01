<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comodato extends Model
{
    use HasFactory;

    protected $table = 'comodatos';

    protected $fillable = [
        'codigo',
        'beneficiario_id',
        'responsable_entrega_id',
        'sucursal_id',
        'fecha_entrega',
        'fecha_estimada_devolucion',
        'fecha_devolucion_real',
        'estado',
        'observaciones_entrega',
        'observaciones_devolucion',
        'documento_pdf_path',
        'documento_firmado_path',
    ];

    protected $casts = [
        'fecha_entrega' => 'date',
        'fecha_estimada_devolucion' => 'date',
        'fecha_devolucion_real' => 'date',
    ];

    public function beneficiario()
    {
        return $this->belongsTo(Beneficiario::class, 'beneficiario_id');
    }

    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_entrega_id');
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_id');
    }

    public function items()
    {
        return $this->hasMany(ComodatoItem::class, 'comodato_id');
    }

    public function movimientos()
    {
        return $this->hasMany(MovimientoInventario::class, 'comodato_id');
    }
}
