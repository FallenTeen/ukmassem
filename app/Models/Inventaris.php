<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inventaris extends Model
{
    public const KONDISI = ['bagus', 'rusak_ringan', 'rusak_berat'];

    public const STATUS = ['tersedia', 'dipinjam', 'perbaikan', 'hilang'];

    protected $table = 'inventariss';

    protected $fillable = [
        'kategori_barang_id',
        'kode',
        'nama_barang',
        'kondisi',
        'status',
        'boleh_dipinjam',
        'harga_sewa',
        'foto',
        'lokasi',
        'catatan',
        'created_by',
    ];

    protected $casts = [
        'boleh_dipinjam' => 'boolean',
        'harga_sewa' => 'decimal:0',
    ];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriBarang::class, 'kategori_barang_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(InventarisLog::class)->orderByDesc('created_at');
    }

    public function peminjamanItems(): HasMany
    {
        return $this->hasMany(PeminjamanItem::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeUntukKatalog(Builder $query): Builder
    {
        return $query->where('boleh_dipinjam', true)
            ->where('status', 'tersedia');
    }
}
