<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Beneficiario extends Model
{
    use HasFactory;

    protected $table = 'beneficiarios';

    protected $fillable = [
        'nombre',
        'rut',
        'comuna',
        'sector',
        'sucursal_registro_id',
        'fecha_registro',
        'direccion',
        'telefono',
        'contacto_adicional',
        'parentesco',
        'representante_nombre',
        'representante_rut',
        'representante_telefono',
        'representante_direccion',
        'representante_comuna',
        'representante_sector',
        'observaciones',
        'cedula_path',
        'cedula_original_name',
        'documento_adicional_path',
        'documento_adicional_original_name',
        'estado',
    ];

    protected $casts = [
        'fecha_registro' => 'date',
    ];

    public function sucursalRegistro()
    {
        return $this->belongsTo(Sucursal::class, 'sucursal_registro_id');
    }

    public function comodatos()
    {
        return $this->hasMany(Comodato::class, 'beneficiario_id');
    }
}
