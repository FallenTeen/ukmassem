<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Galeri extends Model
{
    public const JENIS_KEGIATAN = 'kegiatan';
    public const JENIS_PAGELARAN = 'pagelaran';
    public const JENIS_KARYA = 'karya';

    protected $fillable = [
        'jenis',
        'judul',
        'slug',
        'ringkasan',
        'deskripsi',
        'cover_path',
        'video_link',
        'tanggal',
        'divisi',
        'pembuat',
        'status',
        'published_at',
        'created_by',
        'approved_by',
        'catatan_admin',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'published_at' => 'datetime',
    ];

    public function fotos(): HasMany
    {
        return $this->hasMany(GaleriFoto::class);
    }

    public function carouselFotos(): HasMany
    {
        return $this->hasMany(GaleriFoto::class)
            ->where('tipe', 'carousel')
            ->orderBy('urutan');
    }

    public function dokumentasiFotos(): HasMany
    {
        return $this->hasMany(GaleriFoto::class)
            ->where('tipe', 'dokumentasi')
            ->orderBy('urutan');
    }

    public function prokers(): BelongsToMany
    {
        return $this->belongsToMany(Proker::class, 'galeri_proker');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeJenis($query, string $jenis)
    {
        return $query->where('jenis', $jenis);
    }
}
