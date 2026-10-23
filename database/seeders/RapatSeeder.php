<?php

namespace Database\Seeders;

use App\Models\MasterJenisRapat;
use App\Models\Proker;
use App\Models\Rapat;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class RapatSeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::where('email', 'vlamingvlaming0@gmail.com')->first()
            ?? User::where('role', 'ketum_waketum')->first()
            ?? User::first();

        if (! $creator) {
            return;
        }

        $jenisRapats = $this->seedJenisRapat();

        $this->seedRapat($creator, $jenisRapats);
    }

    protected function seedJenisRapat(): array
    {
        $jenis = [
            ['nama' => 'Rapat Rutin', 'deskripsi' => 'Rapat rutin badan pengurus yang berlangsung setiap pekan.'],
            ['nama' => 'Rapat Koordinasi Proker', 'deskripsi' => 'Rapat koordinasi pelaksanaan proker bersama ketua pelaksana.'],
            ['nama' => 'Rapat Divisi', 'deskripsi' => 'Rapat internal per divisi untuk diskusi latihan dan karya.'],
            ['nama' => 'Rapat Teknis', 'deskripsi' => 'Rapat pembahasan teknis untuk penyiapan acara.'],
            ['nama' => 'Rapat Evaluasi', 'deskripsi' => 'Rapat evaluasi program kerja dan seluruh pengelolaan.'],
            ['nama' => 'Rapat Internal', 'deskripsi' => 'Rapat internal pengurus inti tanpa seluruh anggota.'],
        ];

        $result = [];

        foreach ($jenis as $item) {
            $model = MasterJenisRapat::updateOrCreate(
                ['nama' => $item['nama']],
                ['deskripsi' => $item['deskripsi']]
            );

            $result[$item['nama']] = $model->id;
        }

        return $result;
    }

    protected function seedRapat(User $creator, array $jenisRapats): array
    {
        $prokers = Proker::query()->where('tahun', (int) now()->format('Y'))->orderBy('id')->get();

        $prokerByMain = $this->keyByMain($prokers);

        $today = Carbon::today();

        $definitions = [
            ['judul' => 'Rapat Pembukaan LDOA ' . $today->copy()->subDays(20)->year,
                'jenis' => 'Rapat Koordinasi Proker', 'tanggal' => $today->copy()->subDays(20)->setTime(19, 0),
                'status' => 'selesai', 'kategori' => 'proker', 'main' => 'LDOA', 'target' => 'proker_team',
                'waktu_mulai' => '19:00', 'waktu_selesai' => '21:00', 'lokasi' => 'Sekretariat ASSEM',
                'deskripsi' => 'Rapat koordinasi awal bersama tim pelaksana LDOA untuk menyusun rundown dan pembagian tugas.'],
            ['judul' => 'Rapat Divisi Musik Mingguan', 'jenis' => 'Rapat Divisi', 'tanggal' => $today->copy()->subDays(12)->setTime(20, 0),
                'status' => 'selesai', 'kategori' => 'non_proker', 'main' => null, 'target' => 'divisi',
                'target_detail' => ['divisi' => ['musik']],
                'waktu_mulai' => '20:00', 'waktu_selesai' => '21:30', 'lokasi' => 'Ruang Latihan Musik',
                'deskripsi' => 'Diskusi seluruh bahan latihan untuk tonjakan pengembangan anggota musik.'],
            ['judul' => 'Rapat Evaluasi FISMA', 'jenis' => 'Rapat Evaluasi', 'tanggal' => $today->copy()->subDays(7)->setTime(19, 30),
                'status' => 'selesai', 'kategori' => 'proker', 'main' => 'FISMA', 'target' => 'semua',
                'waktu_mulai' => '19:30', 'waktu_selesai' => '21:00', 'lokasi' => 'Aula Sekretariat',
                'deskripsi' => 'Evaluasi perencanaan FISMA bersama seluruh pengurus.'],
            ['judul' => 'Rapat Rutin Badan Pengurus Oktober', 'jenis' => 'Rapat Rutin', 'tanggal' => $today->copy()->subDays(4)->setTime(19, 0),
                'status' => 'selesai', 'kategori' => 'non_proker', 'main' => null, 'target' => 'semua',
                'waktu_mulai' => '19:00', 'waktu_selesai' => '20:30', 'lokasi' => 'Aula Sekretariat',
                'deskripsi' => 'Rapat rutin pekan ini untuk memantau seluruh proker aktif.'],
            ['judul' => 'Rapat Teknis HUT ASSEM', 'jenis' => 'Rapat Teknis', 'tanggal' => $today->copy()->subDays(10)->setTime(16, 0),
                'status' => 'ditunda', 'kategori' => 'non_proker', 'main' => null, 'target' => 'semua',
                'waktu_mulai' => '16:00', 'waktu_selesai' => '18:00', 'lokasi' => 'Sekretariat ASSEM',
                'deskripsi' => 'Rapat teknis penyiapan acara HUT ASSEM, ditunda menunggu pemulihan ruangan.'],
            ['judul' => 'Rapat Galery Red Carpet', 'jenis' => 'Rapat Koordinasi Proker', 'tanggal' => $today->copy()->subDays(5)->setTime(19, 0),
                'status' => 'dibatalkan', 'kategori' => 'proker', 'main' => 'REDCARPET', 'target' => 'proker_team',
                'waktu_mulai' => '19:00', 'waktu_selesai' => '20:00', 'lokasi' => 'Sekretariat ASSEM',
                'deskripsi' => 'Rapat galery Red Carpet dibatalkan mengingat proker dibatalkan.'],
            ['judul' => 'Rapat Persiapan Assem Visual Exhibition', 'jenis' => 'Rapat Koordinasi Proker', 'tanggal' => $today->setTime(19, 0),
                'status' => 'akan_datang', 'kategori' => 'proker', 'main' => 'AVE', 'target' => 'semua',
                'waktu_mulai' => '19:00', 'waktu_selesai' => '21:00', 'lokasi' => 'Aula Sekretariat',
                'deskripsi' => 'Rapat persiapan pameran visual AVE bersama seluruh anggota.'],
            ['judul' => 'Rapat Divisi Tari Bulanan', 'jenis' => 'Rapat Divisi', 'tanggal' => $today->copy()->addDays(3)->setTime(20, 0),
                'status' => 'akan_datang', 'kategori' => 'non_proker', 'main' => null, 'target' => 'divisi',
                'target_detail' => ['divisi' => ['tari']],
                'waktu_mulai' => '20:00', 'waktu_selesai' => '21:00', 'lokasi' => 'Ruang Latihan Tari',
                'deskripsi' => 'Rapat rutin divisi tari untuk evaluasi dan latihan.'],
            ['judul' => 'Rapat Evaluasi AOS Bulan Ini', 'jenis' => 'Rapat Evaluasi', 'tanggal' => $today->copy()->addDays(5)->setTime(19, 30),
                'status' => 'akan_datang', 'kategori' => 'proker', 'main' => 'AOS', 'target' => 'semua',
                'waktu_mulai' => '19:30', 'waktu_selesai' => '21:00', 'lokasi' => 'Aula Sekretariat',
                'deskripsi' => 'Evaluasi perencanaan Assem On Stage bersama seluruh pengurus.'],
            ['judul' => 'Rapat Teknis Pentas Produksi', 'jenis' => 'Rapat Teknis', 'tanggal' => $today->copy()->addDays(8)->setTime(18, 30),
                'status' => 'akan_datang', 'kategori' => 'proker', 'main' => 'PENPRO', 'target' => 'proker_team',
                'waktu_mulai' => '18:30', 'waktu_selesai' => '20:00', 'lokasi' => 'Sekretariat ASSEM',
                'deskripsi' => 'Rapat teknis persiapan pentas produksi bersama tim pelaksana.'],
            ['judul' => 'Rapat Rutin Badan Pengurus November', 'jenis' => 'Rapat Rutin', 'tanggal' => $today->copy()->addDays(13)->setTime(19, 0),
                'status' => 'akan_datang', 'kategori' => 'non_proker', 'main' => null, 'target' => 'semua',
                'waktu_mulai' => '19:00', 'waktu_selesai' => '20:30', 'lokasi' => 'Aula Sekretariat',
                'deskripsi' => 'Rapat rutin pemberitahuan untuk bulan November.'],
            ['judul' => 'Rapat Koordinasi Panggung Penpro', 'jenis' => 'Rapat Koordinasi Proker', 'tanggal' => $today->copy()->addDays(14)->setTime(15, 30),
                'status' => 'akan_datang', 'kategori' => 'proker', 'main' => 'PENPRO', 'target' => 'proker_team',
                'waktu_mulai' => '15:30', 'waktu_selesai' => '17:30', 'lokasi' => 'Gedung Pertunjukan',
                'deskripsi' => 'Rapat koordinasi teknis panggung untuk pentas produksi.'],
            ['judul' => 'Rapat Internal Penjajakan Bendahara', 'jenis' => 'Rapat Internal', 'tanggal' => $today->copy()->addDays(20)->setTime(19, 0),
                'status' => 'draft', 'kategori' => 'non_proker', 'main' => null, 'target' => 'semua',
                'waktu_mulai' => '19:00', 'waktu_selesai' => '20:00', 'lokasi' => 'Sekretariat ASSEM',
                'deskripsi' => 'Rapat internal penjajakan bendahara.'],
        ];

        $rapatMap = [];

        foreach ($definitions as $def) {
            $prokerId = null;

            if ($def['main']) {
                $prokerId = $prokerByMain[$def['main']] ?? null;

                if (! $prokerId) {
                    continue;
                }
            }

            $selesai = $def['status'] === 'selesai';

            $rapat = Rapat::updateOrCreate(
                ['judul' => $def['judul']],
                [
                    'jenis_rapat_id' => $jenisRapats[$def['jenis']] ?? null,
                    'kategori' => $def['kategori'],
                    'proker_id' => $prokerId,
                    'deskripsi' => $def['deskripsi'],
                    'tanggal' => $def['tanggal'],
                    'waktu_mulai' => $def['waktu_mulai'],
                    'waktu_selesai' => $def['waktu_selesai'],
                    'lokasi' => $def['lokasi'],
                    'notulensi' => $selesai
                        ? 'Rapat berlangsung dengan agenda terpenuhi seluruhnya. Keputusan utama dibagikan kepada ketua pelaksana dan kadiv terkait untuk ditindaklanjuti.'
                        : null,
                    'hasil' => $selesai
                        ? [
                            'Susun ulang struktur pelaksana dua pekan ke depan',
                            'Cairkan dana ke panitia pelaksana pada pekan berikutnya',
                            'Kumpulkan berkas terkait proker paling lambat H-7',
                        ]
                        : null,
                    'evaluasi' => $selesai ? 'Rapat tuntas tepat waktu, perlu kontrol progres paling lambat 3 hari setelah rapat.' : null,
                    'link_dokumentasi' => $selesai ? 'https://drive.google.com/assem/dokumentasi-rapat' : null,
                    'status' => $def['status'],
                    'target_peserta' => $def['target'],
                    'target_detail' => $def['target_detail'] ?? null,
                    'created_by' => $creator->id,
                ]
            );

            $rapatMap[$def['judul']] = $rapat;
        }

        return $rapatMap;
    }

    protected function keyByMain($prokers): array
    {
        $mapping = [
            'FISMA' => 'Festival Seniman Muda',
            'AVE' => 'Assem Visual Exhibition',
            'AOS' => 'Assem On Stage',
            'MISTIK' => 'Malam Istimewa Assem Assik',
            'ASLEB' => 'Assem Lebaran',
            'PENPRO' => 'Pentas Produksi',
            'REDCARPET' => 'Red Carpet',
            'LDOA' => 'Latihan Dasar Organisasi ASSEM',
        ];

        $result = [];

        foreach ($prokers as $proker) {
            foreach ($mapping as $main => $nama) {
                if (str_starts_with($proker->nama_lengkap, $nama)) {
                    $result[$main] = $proker->id;
                    break;
                }
            }
        }

        return $result;
    }
}
