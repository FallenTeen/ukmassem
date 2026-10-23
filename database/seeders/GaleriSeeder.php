<?php

namespace Database\Seeders;

use App\Models\Galeri;
use App\Models\GaleriFoto;
use App\Models\Proker;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GaleriSeeder extends Seeder
{
    public function run(): void
    {
        $dm = User::where('email', 'dm@assem.id')->first();
        $humas = User::where('email', 'humas@assem.id')->first();
        $creator = $humas ?? $dm ?? User::where('role', 'rajawebsite')->first() ?? User::first();

        if (! $creator) {
            return;
        }

        $slugLama = [
            'latihan-bersama-mingguan-divisi-musik',
            'karya-sinar-pagi',
            'karya-ritme-nagari',
            'karya-monolog-restu',
        ];

        foreach ($slugLama as $slug) {
            $lama = Galeri::query()->where('slug', $slug)->first();

            if (! $lama) {
                continue;
            }

            GaleriFoto::query()->where('galeri_id', $lama->id)->delete();
            $lama->prokers()->detach();
            $lama->delete();
        }

        $this->siapkanGambarSeed();

        $this->seedKegiatan($creator, $dm);
        $this->seedPagelaran($creator, $dm);
        $this->seedKarya($creator, $dm);
    }

    protected function siapkanGambarSeed(): void
    {
        $peta = [
            'galeri/seed/kunjungan-cover.jpg' => 'AOS-1.jpg',
            'galeri/seed/kunjungan-carousel-1.jpg' => 'AOS-2.jpg',
            'galeri/seed/kunjungan-dok-1.jpg' => 'AOS-3.jpg',
            'galeri/seed/kunjungan-dok-2.jpg' => 'FISMA-1.jpg',
            'galeri/seed/musik-cover.jpg' => 'RC-MAIN.JPG',
            'galeri/seed/musik-carousel-1.jpg' => 'RC-1.JPG',
            'galeri/seed/musik-carousel-2.jpg' => 'PENPRO-1.JPG',
            'galeri/seed/musik-dok-1.jpg' => 'RC-2.JPG',
            'galeri/seed/musik-dok-2.jpg' => 'RC-3.JPG',
            'galeri/seed/tari-cover.jpg' => 'Tari-1.jpg',
            'galeri/seed/tari-carousel-1.jpg' => 'Tari-2.jpg',
            'galeri/seed/tari-dok-1.jpg' => 'Tari-3.jpg',
            'galeri/seed/tari-dok-2.jpg' => 'Tari-4.jpg',
            'galeri/seed/aos-cover.jpg' => 'AOS-1.jpg',
            'galeri/seed/aos-carousel-1.jpg' => 'AOS-2.jpg',
            'galeri/seed/aos-carousel-2.jpg' => 'AOS-3.jpg',
            'galeri/seed/aos-carousel-3.jpg' => 'PENPRO-1.JPG',
            'galeri/seed/aos-dok-1.jpg' => 'FISMA-1.jpg',
            'galeri/seed/aos-dok-2.jpg' => 'FISMA-2.JPG',
            'galeri/seed/penpro-cover.jpg' => 'PENPRO-1.JPG',
            'galeri/seed/penpro-carousel-1.jpg' => 'AVE-1.JPG',
            'galeri/seed/penpro-carousel-2.jpg' => 'AVE-2.JPG',
            'galeri/seed/penpro-dok-1.jpg' => 'AVE-3.JPG',
            'galeri/seed/penpro-dok-2.jpg' => 'FISMA-2.JPG',
            'galeri/seed/rc-cover.jpg' => 'RC-MAIN.JPG',
            'galeri/seed/rc-carousel-1.jpg' => 'RC-1.JPG',
            'galeri/seed/rc-dok-1.jpg' => 'RC-2.JPG',
            'galeri/seed/rc-dok-2.jpg' => 'RC-3.JPG',
            'galeri/seed/karya-musik-cover.jpg' => 'AOS-MAIN.JPG',
            'galeri/seed/karya-musik-carousel-1.jpg' => 'RC-1.JPG',
            'galeri/seed/karya-musik-dok-1.jpg' => 'RC-2.JPG',
            'galeri/seed/karya-tari-cover.jpg' => 'Tari-1.jpg',
            'galeri/seed/karya-tari-carousel-1.jpg' => 'Tari-2.jpg',
            'galeri/seed/karya-tari-dok-1.jpg' => 'Tari-3.jpg',
            'galeri/seed/karya-tari-dok-2.jpg' => 'Tari-4.jpg',
            'galeri/seed/karya-teater-cover.jpg' => 'Teater-1.jpg',
            'galeri/seed/karya-teater-carousel-1.jpg' => 'Teater-2.jpg',
            'galeri/seed/karya-teater-dok-1.jpg' => 'Teater-3.jpg',
            'galeri/seed/karya-foto-cover.jpg' => 'PENPRO-1.JPG',
        ];

        $disk = Storage::disk('public');

        foreach ($peta as $target => $sumber) {
            $targetPath = $disk->path($target);

            if ($disk->exists($target)) {
                continue;
            }

            $sumberPath = $this->cariSumber($sumber);

            if (! $sumberPath) {
                continue;
            }

            File::ensureDirectoryExists(dirname($targetPath));
            File::copy($sumberPath, $targetPath);
        }
    }

    protected function cariSumber(string $nama): ?string
    {
        $kandidat = [
            public_path('images/proker/' . $nama),
            public_path('images/' . $nama),
            Storage::disk('public')->path('main-proker/' . $nama),
            Storage::disk('public')->path('images/' . $nama),
        ];

        foreach ($kandidat as $path) {
            if (is_file($path)) {
                return $path;
            }
        }

        return null;
    }

    protected function seedKegiatan(User $creator, ?User $dm): void
    {
        $items = [
            [
                'judul' => 'Kunjungan Edukatif Anggota ke Terminal Agro Setra',
                'slug' => 'kunjungan-edukatif-terminal-agro-setra',
                'tanggal' => now()->subDays(14)->toDateString(),
                'ringkasan' => 'Perutusan anggota UKM ASSEM mengikuti program kunjungan edukatif ke Terminal Agro Setra untuk mempelajari tata kelola operasional dan budaya kerja.',
                'deskripsi' => "Sebanyak 24 anggota UKM ASSEM turut serta pada program kunjungan edukatif ke Terminal Agro Setra. Kegiatan ini menjadi bagian pengembangan soft skill anggota, khususnya pemahaman kerja sama tim, disiplin, dan tata kelola operasional.\n\nSelama kunjungan, anggota menyaksikan langsung proses bongkar muat dan manajemen armada, dilanjutkan sesi diskusi bersama pengelola terminal mengenai budaya kerja di dunia industri. Kegiatan ditutup dengan refleksi bersama dan kesepakatan untuk menerapkan nilai kerja tersebut pada latihan rutin UKM.",
                'video_link' => null,
                'cover' => 'galeri/seed/kunjungan-cover.jpg',
                'carousel' => ['galeri/seed/kunjungan-carousel-1.jpg'],
                'dokumentasi' => ['galeri/seed/kunjungan-dok-1.jpg', 'galeri/seed/kunjungan-dok-2.jpg'],
            ],
            [
                'judul' => 'Red Carpet 2023: Wild West',
                'slug' => 'red-carpet-2023-wild-west',
                'main' => 'REDCARPET',
                'tanggal' => '2023-11-17',
                'ringkasan' => 'Malam gala Red Carpet 2023 bertema Wild West untuk pemutaran perdana film pendek produksi divisi film UKM ASSEM.',
                'deskripsi' => "Red Carpet 2023 digelar dengan tema Wild West sebagai malam pemutaran perdana sekaligus apresiasi film pendek produksi divisi film UKM ASSEM.\n\nPanggung gala dihias nuansa barat klasik, penghadang datang dengan kostum bertema, dan rangkaian acara mencakup pemutaran karya, sesi tanya jawab bersama tim kreatif, hingga pemberian penghargaan kategori terbaik.",
                'video_link' => null,
                'cover' => 'galeri/seed/musik-cover.jpg',
                'carousel' => ['galeri/seed/musik-carousel-1.jpg', 'galeri/seed/musik-carousel-2.jpg'],
                'dokumentasi' => ['galeri/seed/musik-dok-1.jpg', 'galeri/seed/musik-dok-2.jpg'],
            ],
            [
                'judul' => 'Silaturahmi Keluarga Besar Divisi Tari',
                'slug' => 'silaturahmi-keluarga-besar-divisi-tari',
                'tanggal' => now()->subDays(21)->toDateString(),
                'ringkasan' => 'Silaturahmi divisi tari untuk merangkul anggota baru dan menyusun rencana karya tahun berjalan.',
                'deskripsi' => "Divisi tari menyelenggarakan silaturahmi keluarga besar sebagai ajang merangkul anggota baru dan menjalin keakraban antar angkatan.\n\nKegiatan diisi sesi berbagi pengalaman, makan bersama, dan penyusunan rencana karya divisi. Hasil utama: divisi sepakat mengangkat tema tari rakyat lokal sebagai material latihan lanjutan dan menyiapkan kolaborasi untuk pagelaran penutup tahun angkatanan.",
                'video_link' => null,
                'cover' => 'galeri/seed/tari-cover.jpg',
                'carousel' => ['galeri/seed/tari-carousel-1.jpg'],
                'dokumentasi' => ['galeri/seed/tari-dok-1.jpg', 'galeri/seed/tari-dok-2.jpg'],
            ],
        ];

        foreach ($items as $item) {
            $galeri = Galeri::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'jenis' => 'kegiatan',
                    'judul' => $item['judul'],
                    'ringkasan' => $item['ringkasan'],
                    'deskripsi' => $item['deskripsi'],
                    'video_link' => $item['video_link'],
                    'tanggal' => $item['tanggal'],
                    'status' => 'published',
                    'published_at' => now(),
                    'created_by' => $creator->id,
                    'approved_by' => $dm?->id,
                ]
            );

            if (! empty($item['main'])) {
                $proker = Proker::query()
                    ->whereHas('mainProker', fn ($q) => $q->where('nama_proker', $item['main']))
                    ->first();

                if ($proker) {
                    $galeri->prokers()->syncWithoutDetaching([$proker->id]);
                }
            }

            $this->simpanFoto($galeri, $item);
        }
    }

    protected function seedPagelaran(User $creator, ?User $dm): void
    {
        $items = [
            [
                'main' => 'AOS',
                'judul' => 'Assem On Stage',
                'tahun' => 2023,
                'slug' => 'assem-on-stage-dokumentasi',
                'tanggal' => '2023-11-24',
                'ringkasan' => 'Pagelaran musik tahunan UKM ASSEM edisi 2023 menampilkan sejumlah formasi band dan kolaborasi lintas divisi.',
                'deskripsi' => "Assem On Stage 2023 adalah panggung tahunan divisi musik bersama seluruh anggota ASSEM dan puncak dari latihan satu semester.\n\nRangkaian acara terdiri dari showcase band, penampilan kolaborasi dengan divisi tari dan teater, serta sesi interaksi dengan penonton. List proker terkait di bawah memuat dokumentasi dan catatan pelaksanaan tiap tahap.",
                'video_link' => null,
                'cover' => 'galeri/seed/aos-cover.jpg',
                'carousel' => ['galeri/seed/aos-carousel-1.jpg', 'galeri/seed/aos-carousel-2.jpg', 'galeri/seed/aos-carousel-3.jpg'],
                'dokumentasi' => ['galeri/seed/aos-dok-1.jpg', 'galeri/seed/aos-dok-2.jpg'],
            ],
            [
                'main' => 'PENPRO',
                'judul' => 'Pentas Produksi 5: Nayara',
                'tahun' => 2021,
                'slug' => 'pentas-produksi-dokumentasi',
                'tanggal' => '2021-12-18',
                'ringkasan' => 'Pagelaran produksi ke-5 UKM ASSEM tahun 2021 mengusung judul besar Nayara dan menampilkan tari, teater, serta musik dalam satu malam pertunjukan.',
                'deskripsi' => "Pentas Produksi 5 (2021) menjadi puncak latihan bagi divisi tari, teater, dan musik dengan judul besar Nayara. Setiap divisi tampil membawa konsep panggung penuh hasil bimbingan latihan rutin.\n\nSelain itu, penataan panggung, pencahayaan, dan dokumentasi visual ditangani divisi film dan foto sebagai bentuk kolaborasi lintas divisi.",
                'video_link' => null,
                'cover' => 'galeri/seed/penpro-cover.jpg',
                'carousel' => ['galeri/seed/penpro-carousel-1.jpg', 'galeri/seed/penpro-carousel-2.jpg'],
                'dokumentasi' => ['galeri/seed/penpro-dok-1.jpg', 'galeri/seed/penpro-dok-2.jpg'],
            ],
            [
                'main' => 'REDCARPET',
                'judul' => 'Red Carpet',
                'tahun' => 2023,
                'slug' => 'red-carpet-dokumentasi',
                'tanggal' => '2023-11-17',
                'ringkasan' => 'Malam gala prospek film produksi divisi film UKM ASSEM pada Red Carpet 2023 dengan tema Wild West.',
                'deskripsi' => "Red Carpet 2023 adalah malam apresiasi divisi film dengan pemutaran perdana film pendek hasil produksi internal bertema Wild West dan pemberian penghargaan kategori terbaik.\n\nFilm pendek yang diputar terpilih dari kumpulan karya produksi internal dan ditampilkan bekerja sama dengan rangkaian pagelaran pertunjukan utama UKM.",
                'video_link' => null,
                'cover' => 'galeri/seed/rc-cover.jpg',
                'carousel' => ['galeri/seed/rc-carousel-1.jpg'],
                'dokumentasi' => ['galeri/seed/rc-dok-1.jpg', 'galeri/seed/rc-dok-2.jpg'],
            ],
        ];

        foreach ($items as $item) {
            $proker = Proker::query()
                ->whereHas('mainProker', fn ($q) => $q->where('nama_proker', $item['main']))
                ->where('tahun', (int) now()->format('Y'))
                ->first();

            if (! $proker) {
                continue;
            }

            $galeri = Galeri::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'jenis' => 'pagelaran',
                    'judul' => $item['judul'] . ' ' . $item['tahun'],
                    'ringkasan' => $item['ringkasan'],
                    'deskripsi' => $item['deskripsi'],
                    'video_link' => $item['video_link'],
                    'tanggal' => $item['tanggal'],
                    'status' => 'published',
                    'published_at' => now(),
                    'created_by' => $creator->id,
                    'approved_by' => $dm?->id,
                ]
            );

            $galeri->prokers()->syncWithoutDetaching([$proker->id]);

            $this->simpanFoto($galeri, $item);
        }
    }

    protected function seedKarya(User $creator, ?User $dm): void
    {
        $karya = [
            [
                'judul' => 'AOS 2023: "Soulful Sound"',
                'slug' => 'karya-soulful-sound',
                'main' => 'AOS',
                'pembuat' => 'Gilang Ramadhan',
                'divisi' => 'musik',
                'tanggal' => '2023-11-24',
                'status' => 'published',
                'ringkasan' => 'Album mini tiga lagu original beraliran pop akustik yang dibawakan pada pagelaran Assem On Stage 2023.',
                'deskripsi' => 'Karya berisi tiga lagu original dari seri bengkel penulisan lagu divisi musik dan dibawakan pada pagelaran Assem On Stage 2023. Seluruh instrumen direkam di mini studio sekretariat dan telah dilakukan penataan akhir.',
                'video_link' => null,
                'cover' => 'galeri/seed/karya-musik-cover.jpg',
                'carousel' => ['galeri/seed/karya-musik-carousel-1.jpg'],
                'dokumentasi' => ['galeri/seed/karya-musik-dok-1.jpg'],
                'creator_email' => 'gilang@assem.id',
                'approved' => $dm?->id,
            ],
            [
                'judul' => 'Dance Competition',
                'slug' => 'karya-dance-competition',
                'main' => 'PENPRO',
                'pembuat' => 'Putri Nazwa',
                'divisi' => 'tari',
                'tanggal' => now()->subDays(9)->toDateString(),
                'status' => 'published',
                'ringkasan' => 'Karya tari yang dilombakan pada ajang dance competition dengan komposisi gerak modern.',
                'deskripsi' => 'Koreografi tari Lampung dengan penggunaan kostum tradisional serta komposisi gerak yang disesuaikan selera penikmat modern.'
                    . ' Karya dibawakan pada ajang dance competition dan dipraktikkan pada latihan divisi tari.',
                'video_link' => null,
                'cover' => 'galeri/seed/karya-tari-cover.jpg',
                'carousel' => ['galeri/seed/karya-tari-carousel-1.jpg'],
                'dokumentasi' => ['galeri/seed/karya-tari-dok-1.jpg', 'galeri/seed/karya-tari-dok-2.jpg'],
                'creator_email' => 'putri@assem.id',
                'approved' => $dm?->id,
            ],
            [
                'judul' => 'Pentas Produksi #6: Kain Kusam',
                'slug' => 'karya-kain-kusam',
                'main' => 'PENPRO',
                'pembuat' => 'Ilham Arfan',
                'divisi' => 'teater',
                'tanggal' => now()->subDays(12)->toDateString(),
                'status' => 'published',
                'ringkasan' => 'Naskah monolog satu karakter tentang relasi ibu dan anak yang dibawakan pada Pentas Produksi 6 "Kain Kusam".',
                'deskripsi' => 'Monolog "Kain Kusam" berdurasi 20 menit yang ditampilkan pada Pentas Produksi ke-6 divisi teater. Naskah ditulis sendiri oleh anggota terkait.',
                'video_link' => null,
                'cover' => 'galeri/seed/karya-teater-cover.jpg',
                'carousel' => ['galeri/seed/karya-teater-carousel-1.jpg'],
                'dokumentasi' => ['galeri/seed/karya-teater-dok-1.jpg'],
                'creator_email' => 'ilham@assem.id',
                'approved' => $dm?->id,
            ],
            [
                'judul' => 'Ilustrasi Digital "Senjakala"',
                'slug' => 'karya-senjakala',
                'pembuat' => 'Chelsea Nadine',
                'divisi' => 'foto',
                'tanggal' => now()->toDateString(),
                'status' => 'menunggu',
                'ringkasan' => 'Ilustrasi digital pemandangan senjakala pantai.',
                'deskripsi' => 'Ilustrasi digital lukisan lanskap matahari terbenam di pantai dengan tone senja.',
                'video_link' => null,
                'cover' => 'galeri/seed/karya-foto-cover.jpg',
                'carousel' => [],
                'dokumentasi' => [],
                'creator_email' => 'chelsea@assem.id',
                'approved' => null,
            ],
        ];

        foreach ($karya as $item) {
            $pembuat = User::where('email', $item['creator_email'])->first();

            $galeri = Galeri::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'jenis' => 'karya',
                    'judul' => $item['judul'],
                    'ringkasan' => $item['ringkasan'],
                    'deskripsi' => $item['deskripsi'],
                    'video_link' => $item['video_link'],
                    'tanggal' => $item['tanggal'],
                    'divisi' => $item['divisi'],
                    'pembuat' => $item['pembuat'],
                    'status' => $item['status'],
                    'published_at' => $item['status'] === 'published' ? now() : null,
                    'created_by' => $pembuat?->id ?? $creator->id,
                    'approved_by' => $item['approved'],
                ]
            );

            $this->simpanFoto($galeri, $item);

            if (! empty($item['main'])) {
                $prokerKarya = Proker::query()
                    ->whereHas('mainProker', fn ($q) => $q->where('nama_proker', $item['main']))
                    ->first();

                if ($prokerKarya) {
                    $galeri->prokers()->syncWithoutDetaching([$prokerKarya->id]);
                }
            }
        }
    }

    protected function simpanFoto(Galeri $galeri, array $item): void
    {
        GaleriFoto::query()->where('galeri_id', $galeri->id)->delete();

        $disk = Storage::disk('public');

        if (! empty($item['cover']) && $disk->exists($item['cover'])) {
            $galeri->update(['cover_path' => $item['cover']]);
        }

        foreach ($item['carousel'] ?? [] as $index => $path) {
            if ($disk->exists($path)) {
                GaleriFoto::create([
                    'galeri_id' => $galeri->id,
                    'tipe' => 'carousel',
                    'path' => $path,
                    'urutan' => $index,
                ]);
            }
        }

        foreach ($item['dokumentasi'] ?? [] as $index => $path) {
            if ($disk->exists($path)) {
                GaleriFoto::create([
                    'galeri_id' => $galeri->id,
                    'tipe' => 'dokumentasi',
                    'path' => $path,
                    'urutan' => $index,
                ]);
            }
        }
    }
}
