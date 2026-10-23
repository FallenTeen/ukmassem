<?php

namespace Database\Seeders;

use App\Models\AnggotaAssem;
use App\Models\PresensiRapat;
use App\Models\ProkerStruktur;
use App\Models\Rapat;
use App\Models\User;
use Illuminate\Database\Seeder;

class PresensiRapatSeeder extends Seeder
{
    public function run(): void
    {
        $rapats = Rapat::query()->where('status', 'selesai')->get();

        $pola = ['hadir', 'hadir', 'hadir', 'izin', 'hadir', 'hadir', 'sakit', 'hadir', 'alpa', 'hadir', 'hadir', 'izin'];

        $keterangan = [
            'hadir' => null,
            'izin' => 'Izin dengan pemberitahuan sebelum rapat',
            'sakit' => 'Sakit disertai surat dokter',
            'alpa' => 'Tanpa pemberitahuan',
        ];

        foreach ($rapats as $rapat) {
            $peserta = $this->daftarPeserta($rapat);

            foreach ($peserta as $index => $anggota) {
                $status = $pola[($rapat->id + $index) % count($pola)];

                PresensiRapat::updateOrCreate(
                    [
                        'rapat_id' => $rapat->id,
                        'anggota_id' => $anggota->id,
                    ],
                    [
                        'status_kehadiran' => $status,
                        'keterangan' => $keterangan[$status],
                    ]
                );
            }
        }
    }

    protected function daftarPeserta(Rapat $rapat)
    {
        $detail = $rapat->target_detail ?? [];

        if ($rapat->target_peserta === 'divisi') {
            $divisi = $detail['divisi'] ?? [];

            if (! is_array($divisi) || $divisi === []) {
                return collect();
            }

            return AnggotaAssem::query()->whereIn('divisi', $divisi)->orderBy('NIM')->get();
        }

        if ($rapat->target_peserta === 'role') {
            $roles = $detail['role'] ?? [];

            if (! is_array($roles) || $roles === []) {
                return collect();
            }

            $anggotaIds = User::query()->whereIn('role', $roles)
                ->with('anggotaAssem')
                ->get()
                ->pluck('anggotaAssem.id')
                ->filter()
                ->values();

            return AnggotaAssem::query()->whereIn('id', $anggotaIds)->orderBy('NIM')->get();
        }

        if ($rapat->target_peserta === 'proker_team' && $rapat->proker_id) {
            $anggotaIds = ProkerStruktur::query()
                ->where('proker_id', $rapat->proker_id)
                ->pluck('anggota_id')
                ->unique()
                ->values();

            return AnggotaAssem::query()->whereIn('id', $anggotaIds)->orderBy('NIM')->get();
        }

        if ($rapat->target_peserta === 'custom') {
            $ids = $detail['anggota_ids'] ?? [];

            if (! is_array($ids) || $ids === []) {
                return collect();
            }

            return AnggotaAssem::query()->whereIn('id', $ids)->orderBy('NIM')->get();
        }

        return AnggotaAssem::query()
            ->whereIn('status_anggota', ['calon_anggota', 'anggota_muda', 'anggota_tetap'])
            ->orderBy('NIM')
            ->get();
    }
}
