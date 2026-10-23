<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['kunci', 'nilai'];

    public const INVENTARIS_PRICELIST = 'inventaris_pricelist';

    public static function nilai(string $kunci, ?string $default = null): ?string
    {
        $setting = static::query()->where('kunci', $kunci)->first();

        return $setting ? $setting->nilai : $default;
    }

    public static function aktif(string $kunci, bool $default = true): bool
    {
        return Cache::rememberForever("site_setting:{$kunci}", function () use ($kunci, $default) {
            $nilai = static::nilai($kunci);

            return $nilai === null ? $default : $nilai === '1';
        });
    }

    public static function set(string $kunci, string $nilai): void
    {
        static::query()->updateOrCreate(['kunci' => $kunci], ['nilai' => $nilai]);
        Cache::forget("site_setting:{$kunci}");
    }
}
