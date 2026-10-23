<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KatalogPublikController extends Controller
{
    public const WA_NAMA = 'peminjaman_wa_nama';

    public const WA_NOMOR = 'peminjaman_wa_nomor';

    public function katalog(Request $request): Response
    {
        $cari = $request->string('cari')->toString();

        $barang = Inventaris::query()
            ->untukKatalog()
            ->with('kategori:id,kode,nama')
            ->when($cari !== '', fn ($q) => $q->where('nama_barang', 'like', "%{$cari}%")
                ->orWhere('kode', 'like', "%{$cari}%"))
            ->orderBy('nama_barang')
            ->get(['id', 'kode', 'nama_barang', 'kondisi', 'harga_sewa', 'lokasi', 'foto', 'catatan']);

        return Inertia::render('RtPublik/Katalog', [
            'barang' => $barang,
            'pricelistAktif' => SiteSetting::aktif(SiteSetting::INVENTARIS_PRICELIST, true),
            'waNama' => SiteSetting::nilai(self::WA_NAMA),
            'waNomor' => SiteSetting::nilai(self::WA_NOMOR),
            'filters' => [
                'cari' => $cari,
            ],
        ]);
    }
}
