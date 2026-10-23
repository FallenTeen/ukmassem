<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Peminjaman extends Model
{
    public const STATUS = ['menunggu', 'dipinjam', 'selesai', 'ditolak', 'batal'];

    public const SIFAT = ['anggota_amikom', 'eksternal'];

    protected $fillable = [
        'kode',
        'sifat',
        'nama_peminjam',
        'asal_organisasi',
        'kontak',
        'tanggal_pinjam',
        'rencana_kembali',
        'dikembalikan',
        'status',
        'catatan',
        'catatan_rt',
        'diajukan_oleh',
        'disetujui_oleh',
    ];

    protected $casts = [
        'tanggal_pinjam' => 'date',
        'rencana_kembali' => 'date',
        'dikembalikan' => 'date',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PeminjamanItem::class);
    }

    public function pengaju(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diajukan_oleh');
    }

    public function penyetuju(): BelongsTo
    {
        return $this->belongsTo(User::class, 'disetujui_oleh');
    }
}
