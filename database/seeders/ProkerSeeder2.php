<?php

namespace Database\Seeders;

use App\Models\AnggotaAssem;
use App\Models\Proker;
use App\Models\ProkerStruktur;
use Illuminate\Database\Seeder;

class ProkerSeeder2 extends Seeder
{
    public function run(): void
    {
        $anggota = AnggotaAssem::query()->orderBy('NIM')->get()->values();

        if ($anggota->isEmpty()) {
            return;
        }

        $totalAnggota = $anggota->count();

        $jabatan = [
            'Ketua Pelaksana' => null,
            'Wakil Ketua Pelaksana' => null,
            'Sekretaris Pelaksana' => null,
            'Bendahara Pelaksana' => null,
            'Kadiv Musik' => 'musik',
            'Kadiv Tari' => 'tari',
            'Kadiv Film' => 'film',
            'Kadiv Foto' => 'foto',
            'Kadiv Teater' => 'teater',
        ];

        $prokers = Proker::query()->with('ketuaPelaksana')->orderBy('tahun')->get();

        foreach ($prokers as $prokerIndex => $proker) {
            $offset = $prokerIndex * 3;

            foreach ($jabatan as $jabatanNama => $divisiProker) {
                $anggotaIndex = ($offset + array_search($jabatanNama, array_keys($jabatan), true)) % $totalAnggota;

                $anggotaId = $jabatanNama === 'Ketua Pelaksana' && $proker->ketua_pelaksana_id
                    ? $proker->ketua_pelaksana_id
                    : $anggota->get($anggotaIndex)?->id;

                if (! $anggotaId) {
                    continue;
                }

                ProkerStruktur::updateOrCreate(
                    [
                        'proker_id' => $proker->id,
                        'anggota_id' => $anggotaId,
                        'jabatan' => $jabatanNama,
                    ],
                    [
                        'divisi_proker' => $divisiProker,
                    ]
                );
            }
        }
    }
}
