<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proker extends Model
{
    use HasFactory;

    protected $fillable = [
        'main_proker_id',
        'nama_lengkap',
        'tahun',
        'tanggal_mulai',
        'tanggal_selesai',
        'deskripsi',
        'status',
        'ketua_pelaksana_id',
        'ketua_pelaksana_history',
    ];

    protected $casts = [
        'ketua_pelaksana_history' => 'array',
        'tahun' => 'integer',
    ];

    public function mainProker(): BelongsTo
    {
        return $this->belongsTo(MainProker::class);
    }

    public function ketuaPelaksana(): BelongsTo
    {
        return $this->belongsTo(AnggotaAssem::class, 'ketua_pelaksana_id');
    }

    public function prokerStrukturs(): HasMany
    {
        return $this->hasMany(ProkerStruktur::class);
    }

    public function rapats(): HasMany
    {
        return $this->hasMany(Rapat::class);
    }
}

