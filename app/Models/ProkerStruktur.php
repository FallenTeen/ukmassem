<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProkerStruktur extends Model
{
    use HasFactory;

    protected $fillable = [
        'proker_id',
        'anggota_id',
        'jabatan',
        'divisi_proker',
    ];

    public function proker(): BelongsTo
    {
        return $this->belongsTo(Proker::class);
    }

    public function anggota(): BelongsTo
    {
        return $this->belongsTo(AnggotaAssem::class, 'anggota_id');
    }
}

