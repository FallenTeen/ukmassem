<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriBarang extends Model
{
    protected $fillable = ['kode', 'nama', 'keterangan'];

    public function inventariss(): HasMany
    {
        return $this->hasMany(Inventaris::class, 'kategori_barang_id');
    }
}
