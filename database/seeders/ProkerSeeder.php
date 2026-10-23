<?php

namespace Database\Seeders;

use App\Models\AnggotaAssem;
use App\Models\MainProker;
use App\Models\Proker;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProkerSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedPersonil();
        $this->seedMainProker();
        $this->seedProker();
    }

    protected function seedPersonil(): void
    {
        $personil = [
            [
                'email' => 'dm@assem.id',
                'name' => 'Dhimas Arya Nugraha',
                'role' => 'dm',
                'NIM' => '20SA11A005',
                'nomor_anggota' => 'NA.20.IL.0001',
                'tanggal_lahir' => '2002-05-08',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'film',
                'angkatan' => 2020,
                'nomor_telepon' => '081234567099',
            ],
            [
                'email' => 'humas@assem.id',
                'name' => 'Hana Putri Maysa',
                'role' => 'humas',
                'NIM' => '21SA11A011',
                'nomor_anggota' => 'NA.21.FO.0002',
                'tanggal_lahir' => '2003-01-30',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'foto',
                'angkatan' => 2021,
                'nomor_telepon' => '081234567098',
            ],
            [
                'email' => 'ketum@assem.id',
                'name' => 'Bintang Prakoso',
                'role' => 'ketum_waketum',
                'NIM' => '21SA11A012',
                'nomor_anggota' => 'NA.21.MU.0001',
                'tanggal_lahir' => '2003-03-14',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'musik',
                'angkatan' => 2021,
                'nomor_telepon' => '081234567001',
            ],
            [
                'email' => 'sekretaris@assem.id',
                'name' => 'Nadira Ayu Larasati',
                'role' => 'sekretaris',
                'NIM' => '21SA11A013',
                'nomor_anggota' => 'NA.21.TA.0002',
                'tanggal_lahir' => '2003-05-02',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'tari',
                'angkatan' => 2021,
                'nomor_telepon' => '081234567002',
            ],
            [
                'email' => 'bendahara@assem.id',
                'name' => 'Fajar Nugroho',
                'role' => 'bendahara',
                'NIM' => '21SA11A014',
                'nomor_anggota' => 'NA.21.FI.0003',
                'tanggal_lahir' => '2003-07-21',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'film',
                'angkatan' => 2021,
                'nomor_telepon' => '081234567003',
            ],
            [
                'email' => 'kad_mus@assem.id',
                'name' => 'Dimas Aditya',
                'role' => 'kad_mus',
                'NIM' => '22SA11A021',
                'nomor_anggota' => 'NA.22.MU.0004',
                'tanggal_lahir' => '2004-02-11',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'musik',
                'angkatan' => 2022,
                'nomor_telepon' => '081234567004',
            ],
            [
                'email' => 'kad_tar@assem.id',
                'name' => 'Kirana Salsabila',
                'role' => 'kad_tar',
                'NIM' => '22SA11A022',
                'nomor_anggota' => 'NA.22.TA.0005',
                'tanggal_lahir' => '2004-04-19',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'tari',
                'angkatan' => 2022,
                'nomor_telepon' => '081234567005',
            ],
            [
                'email' => 'kad_fil@assem.id',
                'name' => 'Rizky Maulana',
                'role' => 'kad_fil',
                'NIM' => '22SA11A023',
                'nomor_anggota' => 'NA.22.FI.0006',
                'tanggal_lahir' => '2004-06-08',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'film',
                'angkatan' => 2022,
                'nomor_telepon' => '081234567006',
            ],
            [
                'email' => 'kad_fot@assem.id',
                'name' => 'Alif Hidayat',
                'role' => 'kad_fot',
                'NIM' => '22SA11A024',
                'nomor_anggota' => 'NA.22.FO.0007',
                'tanggal_lahir' => '2004-08-27',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'foto',
                'angkatan' => 2022,
                'nomor_telepon' => '081234567007',
            ],
            [
                'email' => 'kad_tea@assem.id',
                'name' => 'Sarah Amelia',
                'role' => 'kad_tea',
                'NIM' => '22SA11A025',
                'nomor_anggota' => 'NA.22.TE.0008',
                'tanggal_lahir' => '2004-10-15',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'teater',
                'angkatan' => 2022,
                'nomor_telepon' => '081234567008',
            ],
            [
                'email' => 'gilang@assem.id',
                'name' => 'Gilang Ramadhan',
                'role' => 'anggota',
                'NIM' => '23SA11A101',
                'nomor_anggota' => 'NA.23.MU.0009',
                'tanggal_lahir' => '2005-01-09',
                'status_anggota' => 'anggota_muda',
                'divisi' => 'musik',
                'angkatan' => 2023,
                'nomor_telepon' => '081234567009',
            ],
            [
                'email' => 'putri@assem.id',
                'name' => 'Putri Nazwa',
                'role' => 'anggota',
                'NIM' => '23SA11A102',
                'nomor_anggota' => 'NA.23.TA.0010',
                'tanggal_lahir' => '2005-02-23',
                'status_anggota' => 'anggota_muda',
                'divisi' => 'tari',
                'angkatan' => 2023,
                'nomor_telepon' => '081234567010',
            ],
            [
                'email' => 'bayu@assem.id',
                'name' => 'Bayu Setiawan',
                'role' => 'anggota',
                'NIM' => '23SA11A103',
                'nomor_anggota' => 'NA.23.FI.0011',
                'tanggal_lahir' => '2005-04-04',
                'status_anggota' => 'anggota_muda',
                'divisi' => 'film',
                'angkatan' => 2023,
                'nomor_telepon' => '081234567011',
            ],
            [
                'email' => 'chelsea@assem.id',
                'name' => 'Chelsea Nadine',
                'role' => 'anggota',
                'NIM' => '23SA11A104',
                'nomor_anggota' => 'NA.23.FO.0012',
                'tanggal_lahir' => '2005-05-30',
                'status_anggota' => 'anggota_muda',
                'divisi' => 'foto',
                'angkatan' => 2023,
                'nomor_telepon' => '081234567012',
            ],
            [
                'email' => 'ilham@assem.id',
                'name' => 'Ilham Arfan',
                'role' => 'anggota',
                'NIM' => '23SA11A105',
                'nomor_anggota' => 'NA.23.TE.0013',
                'tanggal_lahir' => '2005-07-12',
                'status_anggota' => 'anggota_muda',
                'divisi' => 'teater',
                'angkatan' => 2023,
                'nomor_telepon' => '081234567013',
            ],
            [
                'email' => 'vanya@assem.id',
                'name' => 'Vanya Kirana',
                'role' => 'anggota',
                'NIM' => '24SA11A201',
                'nomor_anggota' => 'NA.24.MU.0014',
                'tanggal_lahir' => '2006-03-17',
                'status_anggota' => 'calon_anggota',
                'divisi' => 'musik',
                'angkatan' => 2024,
                'nomor_telepon' => '081234567014',
            ],
            [
                'email' => 'rafa@assem.id',
                'name' => 'Rafa Pratama',
                'role' => 'anggota',
                'NIM' => '24SA11A202',
                'nomor_anggota' => 'NA.24.FI.0015',
                'tanggal_lahir' => '2006-05-25',
                'status_anggota' => 'calon_anggota',
                'divisi' => 'film',
                'angkatan' => 2024,
                'nomor_telepon' => '081234567015',
            ],
        ];

        foreach ($personil as $person) {
            $user = User::updateOrCreate(
                ['email' => $person['email']],
                [
                    'name' => $person['name'],
                    'password' => Hash::make('password'),
                    'role' => $person['role'],
                ]
            );

            AnggotaAssem::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'NIM' => $person['NIM'],
                    'nomor_anggota' => $person['nomor_anggota'],
                    'tanggal_lahir' => $person['tanggal_lahir'],
                    'nama_panggilan' => [$person['name']],
                    'status_anggota' => $person['status_anggota'],
                    'divisi' => $person['divisi'],
                    'angkatan' => $person['angkatan'],
                    'alamat' => 'Jl. Contoh No. ' . substr($person['NIM'], -2) . ', Yogyakarta',
                    'nomor_telepon' => $person['nomor_telepon'],
                ]
            );
        }
    }

    protected function seedMainProker(): void
    {
        $mainProkers = [
            ['nama_proker' => 'FISMA', 'deskripsi' => 'Festival Seniman Muda', 'gambar' => 'main-proker/FISMA-MAIN.jpg'],
            ['nama_proker' => 'AVE', 'deskripsi' => 'Assem Visual Exhibition', 'gambar' => 'main-proker/AVE-MAIN.JPG'],
            ['nama_proker' => 'AOS', 'deskripsi' => 'Assem On Stage', 'gambar' => 'main-proker/AOS-MAIN.JPG'],
            ['nama_proker' => 'MISTIK', 'deskripsi' => 'Malam Istimewa Assem Assik', 'gambar' => 'main-proker/default.svg'],
            ['nama_proker' => 'LEBARAN', 'deskripsi' => 'Assem Lebaran', 'gambar' => 'main-proker/default.svg'],
            ['nama_proker' => 'PENPRO', 'deskripsi' => 'Pentas Produksi', 'gambar' => 'main-proker/PENPRO-1.JPG'],
            ['nama_proker' => 'REDCARPET', 'deskripsi' => 'Red Carpet', 'gambar' => 'main-proker/RC-MAIN.JPG'],
            ['nama_proker' => 'LDOA', 'deskripsi' => 'Latihan Dasar Organisasi ASSEM', 'gambar' => 'main-proker/default.svg'],
            ['nama_proker' => 'Lainnya', 'deskripsi' => 'Proker di luar kolom utama', 'gambar' => 'main-proker/default.svg'],
        ];

        foreach ($mainProkers as $item) {
            MainProker::updateOrCreate(
                ['nama_proker' => $item['nama_proker']],
                [
                    'deskripsi' => $item['deskripsi'] . ', program kerja unggulan UKM ASSEM yang menjadi wadah pengembangan bakat dan prestasi anggota.',
                    'gambar' => $item['gambar'],
                ]
            );
        }
    }

    protected function seedProker(): void
    {
        $ketuaByEmail = [
            'kad_tea@assem.id', 'kad_fot@assem.id', 'kad_fil@assem.id', 'kad_tar@assem.id',
            'sekretaris@assem.id', 'kad_mus@assem.id', 'bendahara@assem.id', 'ketum@assem.id',
        ];

        $mainProkers = MainProker::all()->keyBy('nama_proker');

        $prokerData = [
            ['main' => 'LDOA', 'status' => 'selesai', 'mulai' => -150, 'selesai' => -120],
            ['main' => 'LEBARAN', 'status' => 'selesai', 'mulai' => -110, 'selesai' => -95],
            ['main' => 'FISMA', 'status' => 'selesai', 'mulai' => -75, 'selesai' => -20],
            ['main' => 'AVE', 'status' => 'aktif', 'mulai' => -40, 'selesai' => 45],
            ['main' => 'AOS', 'status' => 'aktif', 'mulai' => -30, 'selesai' => 60],
            ['main' => 'MISTIK', 'status' => 'aktif', 'mulai' => -15, 'selesai' => 80],
            ['main' => 'PENPRO', 'status' => 'aktif', 'mulai' => -10, 'selesai' => 100],
            ['main' => 'REDCARPET', 'status' => 'dibatalkan', 'mulai' => -5, 'selesai' => -1],
            ['main' => 'Lainnya', 'status' => 'draft', 'mulai' => 20, 'selesai' => 120],
        ];

        foreach ($prokerData as $i => $item) {
            $main = $mainProkers->get($item['main']);
            if (! $main) {
                continue;
            }

            $tahun = (int) now()->format('Y');
            $namaLengkap = $item['main'] === 'Lainnya'
                ? 'Proker Kolaborasi ASSEM ' . $tahun
                : $this->namaLengkap($item['main'], $tahun);

            $ketuaEmail = $ketuaByEmail[$i % count($ketuaByEmail)];
            $ketua = User::where('email', $ketuaEmail)->first()?->anggotaAssem;

            $tanggalMulai = now()->copy()->addDays($item['mulai'])->startOfDay();
            $tanggalSelesai = now()->copy()->addDays($item['selesai'])->startOfDay();

            if ($item['status'] === 'selesai') {
                $tanggalMulai = $tanggalSelesai->copy()->subDays(30);
            }

            Proker::updateOrCreate(
                [
                    'nama_lengkap' => $namaLengkap,
                    'tahun' => $tahun,
                ],
                [
                    'main_proker_id' => $main->id,
                    'deskripsi' => $this->deskripsiProker($item['main'], $tahun),
                    'tanggal_mulai' => $tanggalMulai,
                    'tanggal_selesai' => $tanggalSelesai,
                    'status' => $item['status'],
                    'ketua_pelaksana_id' => $ketua?->id,
                    'ketua_pelaksana_history' => [
                        [
                            'anggota_id' => $ketua?->id,
                            'nama' => $ketua?->user?->name,
                            'mulai' => $tanggalMulai->toDateString(),
                        ],
                    ],
                ]
            );
        }

        $tahunLalu = $tahun - 1;

        $histori = [
            ['main' => 'FISMA', 'ketua' => 'kad_tea@assem.id'],
            ['main' => 'AOS', 'ketua' => 'kad_fil@assem.id'],
            ['main' => 'PENPRO', 'ketua' => 'kad_fot@assem.id'],
        ];

        foreach ($histori as $item) {
            $main = $mainProkers->get($item['main']);
            if (! $main) {
                continue;
            }

            $ketua = User::where('email', $item['ketua'])->first()?->anggotaAssem;

            Proker::updateOrCreate(
                [
                    'nama_lengkap' => $this->namaLengkap($item['main'], $tahunLalu),
                    'tahun' => $tahunLalu,
                ],
                [
                    'main_proker_id' => $main->id,
                    'deskripsi' => $this->deskripsiProker($item['main'], $tahunLalu),
                    'tanggal_mulai' => now()->copy()->subYear()->subDays(60),
                    'tanggal_selesai' => now()->copy()->subYear()->addDays(30),
                    'status' => 'selesai',
                    'ketua_pelaksana_id' => $ketua?->id,
                    'ketua_pelaksana_history' => [
                        [
                            'anggota_id' => $ketua?->id,
                            'nama' => $ketua?->user?->name,
                            'mulai' => now()->copy()->subYear()->subDays(60)->toDateString(),
                        ],
                    ],
                ]
            );
        }
    }

    protected function namaLengkap(string $main, int $tahun): string
    {
        $judul = [
            'FISMA' => 'Festival Seniman Muda',
            'AVE' => 'Assem Visual Exhibition',
            'AOS' => 'Assem On Stage',
            'MISTIK' => 'Malam Istimewa Assem Assik',
            'LEBARAN' => 'Assem Lebaran',
            'PENPRO' => 'Pentas Produksi',
            'REDCARPET' => 'Red Carpet',
            'LDOA' => 'Latihan Dasar Organisasi ASSEM',
        ];

        return ($judul[$main] ?? $main) . ' ' . $tahun;
    }

    protected function deskripsiProker(string $main, int $tahun): string
    {
        $deskripsi = [
            'FISMA' => "Festival Seniman Muda {$tahun} membawa tema larik seni lokal dengan rangkaian perlombaan seni musik, teater, dan tari di tingkat kota.",
            'AVE' => "Assem Visual Exhibition {$tahun} menyajikan pameran karya visual hasil kerja divisi film dan foto selama satu tahun.",
            'AOS' => "Assem On Stage {$tahun} adalah pagelaran musik tahunan ASSEM yang menampilkan perpaduan bahan showcase dan kolaborasi lintas divisi.",
            'MISTIK' => "Malam Istimewa Assem Assik {$tahun} merupakan acara malam penghargaan dan apresiasi terhadap keberhasilan seluruh anggota.",
            'LEBARAN' => "Assem Lebaran {$tahun} mempertemukan seluruh anggota untuk silaturahmi, saling memaafkan, dan berbagi segar pada momen raya.",
            'PENPRO' => "Pentas Produksi {$tahun} adalah tahapan produktif dari segala latihan divisi tari, teater, dan musik dalam satu panggung besar.",
            'REDCARPET' => "Red Carpet {$tahun} berfokus pada pemandangan gala penyegaran film pendek karya divisi film.",
            'LDOA' => "Latihan Dasar Organisasi ASSEM {$tahun} membekali anggota baru dengan materi organisasi, kepemimpinan, dan kekayaan klasik ASSEM.",
            'Lainnya' => "Seri proker kolaborasi small group {$tahun} yang meliputi bengkel seni, kunjungan edukatif, dan proyek kolaborasi lintas seni.",
        ];

        return $deskripsi[$main];
    }
}
