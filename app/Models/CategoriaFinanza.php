<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaFinanza extends Model
{
    use HasFactory;

    protected $table = 'categorias_finanzas';

    protected $fillable = [
        'nombre',
        'tipo',
    ];
}
