<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rapat extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'jenis_rapat_id',
        'kategori',
        'proker_id',
        'deskripsi',
        'tanggal',
        'waktu_mulai',
        'waktu_selesai',
        'lokasi',
        'notulensi',
        'hasil',
        'evaluasi',
        'link_dokumentasi',
        'status',
        'target_peserta',
        'target_detail',
        'created_by',
    ];

    protected $casts = [
        'tanggal' => 'datetime',
        'target_detail' => 'array',
        'hasil' => 'array',
    ];

    public function jenisRapat(): BelongsTo
    {
        return $this->belongsTo(MasterJenisRapat::class, 'jenis_rapat_id');
    }

    public function proker(): BelongsTo
    {
        return $this->belongsTo(Proker::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function presensiRapats(): HasMany
    {
        return $this->hasMany(PresensiRapat::class);
    }
}

