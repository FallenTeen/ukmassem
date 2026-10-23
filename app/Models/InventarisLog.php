<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventarisLog extends Model
{
    public const TIPE = ['masuk', 'pinjam', 'kembali', 'kondisi', 'perbaikan', 'hilang'];

    protected $fillable = [
        'inventaris_id',
        'peminjaman_id',
        'user_id',
        'tipe',
        'keterangan',
    ];

    public function inventaris(): BelongsTo
    {
        return $this->belongsTo(Inventaris::class, 'inventaris_id');
    }

    public function peminjaman(): BelongsTo
    {
        return $this->belongsTo(Peminjaman::class, 'peminjaman_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
