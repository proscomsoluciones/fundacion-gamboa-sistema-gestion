<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sucursal extends Model
{
    use HasFactory;

    protected $table = 'sucursales';

    protected $fillable = [
        'nombre',
        'codigo',
        'direccion',
        'telefono',
        'encargado_principal_id',
        'es_casa_matriz',
        'activa',
    ];

    protected $casts = [
        'es_casa_matriz' => 'boolean',
        'activa' => 'boolean',
    ];

    public function encargadoPrincipal()
    {
        return $this->belongsTo(User::class, 'encargado_principal_id');
    }

    public function usuarios()
    {
        return $this->hasMany(User::class, 'sucursal_id');
    }

    public function unidades()
    {
        return $this->hasMany(UnidadProducto::class, 'sucursal_id');
    }

    public function stocksGenericos()
    {
        return $this->hasMany(ProductoSucursalStock::class, 'sucursal_id');
    }

    public function comodatos()
    {
        return $this->hasMany(Comodato::class, 'sucursal_id');
    }

    public function beneficiarios()
    {
        return $this->hasMany(Beneficiario::class, 'sucursal_registro_id');
    }
}
