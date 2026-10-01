<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Documento extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'documentos';

    protected $fillable = [
        'titulo',
        'categoria',
        'descripcion',
        'archivo_nombre_original',
        'archivo_path',
        'archivo_extension',
        'mime_type',
        'tamano_bytes',
        'fecha_documento',
        'sucursal_id',
        'user_id',
    ];

    protected $appends = [
        'tamano_formatted',
        'tipo_formato',
        'is_previewable',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sucursal()
    {
        return $this->belongsTo(Sucursal::class);
    }

    public function getTamanoFormattedAttribute()
    {
        $bytes = $this->tamano_bytes;
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1, ',', '.') . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 0, ',', '.') . ' KB';
        }
        return $bytes . ' B';
    }

    public function getTipoFormatoAttribute()
    {
        $ext = strtolower($this->archivo_extension);
        if ($ext === 'pdf') {
            return 'pdf';
        } elseif (in_array($ext, ['doc', 'docx'])) {
            return 'word';
        } elseif (in_array($ext, ['xls', 'xlsx', 'csv'])) {
            return 'excel';
        } elseif (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
            return 'imagen';
        }
        return 'otro';
    }

    public function getIsPreviewableAttribute()
    {
        return in_array($this->tipo_formato, ['pdf', 'imagen']);
    }
}
