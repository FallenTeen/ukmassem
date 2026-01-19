<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PresensiRapat extends Model
{
    use HasFactory;

    protected $fillable = [
        'rapat_id',
        'anggota_id',
        'status_kehadiran',
        'keterangan',
    ];

    public function rapat(): BelongsTo
    {
        return $this->belongsTo(Rapat::class);
    }

    public function anggota(): BelongsTo
    {
        return $this->belongsTo(AnggotaAssem::class, 'anggota_id');
    }
}

