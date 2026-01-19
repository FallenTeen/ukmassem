<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnggotaAssem extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'anggota_assem';

    protected $fillable = [
        'NIM',
        'nomor_anggota',
        'tanggal_lahir',
        'nama_panggilan',
        'status_anggota',
        'divisi',
        'angkatan',
        'alamat',
        'nomor_telepon',
        'user_id',
    ];

    protected $casts = [
        'nama_panggilan' => 'array',
        'tanggal_lahir' => 'date',
    ];

    protected $appends = [
        'nama_lengkap',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getNamaLengkapAttribute(): ?string
    {
        return $this->user?->name;
    }
}
