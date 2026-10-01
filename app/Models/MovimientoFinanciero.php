<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimientoFinanciero extends Model
{
    use HasFactory;

    protected $table = 'movimientos_financieros';

    protected $fillable = [
        'tipo',
        'concepto',
        'categoria',
        'proyecto',
        'monto',
        'fecha',
        'observaciones',
        'comprobante_path',
        'comprobante_original_name',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'monto' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
