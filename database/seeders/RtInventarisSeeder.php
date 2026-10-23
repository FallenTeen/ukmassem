<?php

namespace Database\Seeders;

use App\Models\Inventaris;
use App\Http\Controllers\KatalogPublikController;
use App\Models\KategoriBarang;
use App\Models\Peminjaman;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RtInventarisSeeder extends Seeder
{
    public function run(): void
    {
        $rajawebsite = User::query()->firstOrCreate(
            ['email' => 'testadmin@gmail.com'],
            [
                'name' => 'Hanafi Dana Bastyan',
                'password' => Hash::make('12345678'),
                'role' => 'rajawebsite',
            ]
        );

        $rt = User::query()->firstOrCreate(
            ['email' => 'rt@gmail.com'],
            [
                'name' => 'Fajar Kerumahtanggaan',
                'password' => Hash::make('12345678'),
                'role' => 'rt',
            ]
        );

        KategoriBarang::query()->delete();
        Inventaris::query()->delete();
        Peminjaman::query()->delete();

        $kategoriA = KategoriBarang::create([
            'kode' => 'A',
            'nama' => 'Kapital & Sound',
            'keterangan' => 'Sound system, kapital panggung, ampere',
        ]);

        $kategoriB = KategoriBarang::create([
            'kode' => 'B',
            'nama' => 'Fotografi & Film',
            'keterangan' => 'Kamera, lensa, drone',
        ]);

        $kategoriC = KategoriBarang::create([
            'kode' => 'C',
            'nama' => 'Tari & Teater',
            'keterangan' => 'Kostum, properti, alat panggung',
        ]);

        $kategoriD = KategoriBarang::create([
            'kode' => 'D',
            'nama' => 'Perkakas Kecil',
            'keterangan' => 'Alat kecil sekretariat & produksi',
        ]);

        $unit = [
            [$kategoriA->id, 'A', 'Motor e Bowo', 'bagus', true, 5000000, 'Parkiran AORA'],
            [$kategoriA->id, 'A', 'Speaker Aktif Portable', 'bagus', true, 50000, 'Rak A1 Sekretariat'],
            [$kategoriA->id, 'A', 'Mixing Board 8 Chanel', 'bagus', true, 30000, 'Rak A1 Sekretariat'],
            [$kategoriA->id, 'A', 'Mikrofon Wired', 'bagus', true, 10000, 'Rak A2 Sekretariat'],
            [$kategoriA->id, 'A', 'Mikrofon Wireless', 'bagus', true, 20000, 'Rak A2 Sekretariat'],
            [$kategoriA->id, 'A', 'Ampere AVR', 'rusak_ringan', false, null, 'Rak A3 Sekretariat'],
            [$kategoriA->id, 'A', 'Kapital Panggung Modular', 'bagus', true, 150000, 'Gudang Panggung'],
            [$kategoriB->id, 'B', 'Kamera Mirrorless', 'bagus', true, 40000, 'Rak B1 Sekretariat'],
            [$kategoriB->id, 'B', 'Tripod Kamera', 'bagus', true, 5000, 'Rak B1 Sekretariat'],
            [$kategoriB->id, 'B', 'Lensa 50mm', 'bagus', true, 15000, 'Rak B1 Sekretariat'],
            [$kategoriB->id, 'B', 'Gimbal Handheld', 'bagus', true, 25000, 'Rak B2 Sekretariat'],
            [$kategoriB->id, 'B', 'Flash Kamera', 'bagus', true, 10000, 'Rak B2 Sekretariat'],
            [$kategoriC->id, 'C', 'Kostum Tari Jawa', 'bagus', true, 20000, 'Lemari C1 Sekretariat'],
            [$kategoriC->id, 'C', 'Kostum Teater Kepala Desa', 'rusak_ringan', true, null, 'Lemari C1 Sekretariat'],
            [$kategoriC->id, 'C', 'Properti Panggung Elektrik', 'bagus', true, 25000, 'Gudang Kostum'],
            [$kategoriC->id, 'C', 'Bendera Event', 'bagus', true, 5000, 'Gudang Kostum'],
            [$kategoriD->id, 'D', 'Gerinda Tangan', 'bagus', true, 10000, 'Rak D1 Sekretariat'],
            [$kategoriD->id, 'D', 'Bor Listrik + Mata Bor', 'bagus', true, 10000, 'Rak D1 Sekretariat'],
            [$kategoriD->id, 'D', 'Toolbox Isi Alat Kecil', 'bagus', true, 5000, 'Rak D2 Sekretariat'],
        ];

        $nomor = [];
        $ids = [];
        foreach ($unit as $data) {
            [$kategoriId, $prefiks, $nama, $kondisi, $boleh, $sewa, $lokasi] = $data;

            $nomor[$prefiks] = ($nomor[$prefiks] ?? 0) + 1;
            $kode = $prefiks.'-'.str_pad((string) $nomor[$prefiks], 3, '0', STR_PAD_LEFT);

            $ids[] = Inventaris::create([
                'kategori_barang_id' => $kategoriId,
                'kode' => $kode,
                'nama_barang' => $nama,
                'kondisi' => $kondisi,
                'status' => 'tersedia',
                'boleh_dipinjam' => $boleh,
                'harga_sewa' => $sewa,
                'lokasi' => $lokasi,
                'created_by' => $rajawebsite->id,
            ])->id;
        }

        SiteSetting::set(SiteSetting::INVENTARIS_PRICELIST, '1');
        SiteSetting::set(KatalogPublikController::WA_NAMA, 'Ito');
        SiteSetting::set(KatalogPublikController::WA_NOMOR, '081234567890');

        Peminjaman::create([
            'kode' => 'PJM-0001',
            'sifat' => 'anggota_amikom',
            'nama_peminjam' => 'Sansan',
            'asal_organisasi' => 'HIMIT',
            'kontak' => '085712341234',
            'tanggal_pinjam' => now()->addDay(),
            'rencana_kembali' => now()->addDays(3),
            'status' => 'menunggu',
            'catatan' => 'AOS 2026, kami selesai pameran jam 1 malam.',
            'diajukan_oleh' => $rajawebsite->id,
        ])->items()->create([
            'inventaris_id' => $ids[6],
        ]);

        $pinjaman = Peminjaman::create([
            'kode' => 'PJM-0002',
            'sifat' => 'eksternal',
            'nama_peminjam' => 'Wijaya',
            'asal_organisasi' => 'Komunitas Pemuda Panti',
            'kontak' => '085922335555',
            'tanggal_pinjam' => now()->subDay(),
            'rencana_kembali' => now()->addDay(),
            'status' => 'dipinjam',
            'catatan' => 'Pentas akbar akhir bulan.',
            'diajukan_oleh' => $rt->id,
            'disetujui_oleh' => $rajawebsite->id,
        ]);

        $pinjaman->items()->create([
            'inventaris_id' => $ids[3],
        ]);

        Inventaris::query()->whereKey($ids[3])->update(['status' => 'dipinjam']);
    }
}
