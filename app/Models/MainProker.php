<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MainProker extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_proker',
        'deskripsi',
        'gambar',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function prokers(): HasMany
    {
        return $this->hasMany(Proker::class);
    }
}

