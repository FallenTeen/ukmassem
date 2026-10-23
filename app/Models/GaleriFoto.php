<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GaleriFoto extends Model
{
    protected $fillable = [
        'galeri_id',
        'tipe',
        'path',
        'urutan',
    ];

    public function galeri(): BelongsTo
    {
        return $this->belongsTo(Galeri::class);
    }
}
