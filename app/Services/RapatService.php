<?php

namespace App\Services;

use App\Models\AnggotaAssem;
use App\Models\ProkerStruktur;
use App\Models\Rapat;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class RapatService
{
    public function generatePesertaList(int $rapatId): Collection
    {
        $rapat = Rapat::findOrFail($rapatId);

        $targetPeserta = $rapat->target_peserta;
        $detail = $rapat->target_detail ?? [];

        if ($targetPeserta === 'semua') {
            return AnggotaAssem::query()
                ->whereIn('status_anggota', ['calon_anggota', 'anggota_muda', 'anggota_tetap'])
                ->orderBy('nama_lengkap')
                ->get();
        }

        if ($targetPeserta === 'divisi') {
            $divisi = $detail['divisi'] ?? [];

            if (! is_array($divisi) || $divisi === []) {
                return collect();
            }

            return AnggotaAssem::query()
                ->whereIn('divisi', $divisi)
                ->orderBy('nama_lengkap')
                ->get();
        }

        if ($targetPeserta === 'role') {
            $roles = $detail['role'] ?? [];

            if (! is_array($roles) || $roles === []) {
                return collect();
            }

            $users = User::query()
                ->whereIn('role', $roles)
                ->with('anggotaAssem')
                ->get();

            $anggotaIds = $users
                ->pluck('anggotaAssem')
                ->filter()
                ->pluck('id')
                ->all();

            if ($anggotaIds === []) {
                return collect();
            }

            return AnggotaAssem::query()
                ->whereIn('id', $anggotaIds)
                ->orderBy('nama_lengkap')
                ->get();
        }

        if ($targetPeserta === 'proker_team' && $rapat->proker_id) {
            $struktur = ProkerStruktur::query()
                ->where('proker_id', $rapat->proker_id)
                ->whereNotNull('anggota_id')
                ->get();

            $anggotaIds = $struktur
                ->pluck('anggota_id')
                ->filter()
                ->unique()
                ->values()
                ->all();

            if ($anggotaIds === []) {
                return collect();
            }

            return AnggotaAssem::query()
                ->whereIn('id', $anggotaIds)
                ->orderBy('nama_lengkap')
                ->get();
        }

        if ($targetPeserta === 'custom') {
            $ids = $detail['anggota_ids'] ?? [];

            if (! is_array($ids) || $ids === []) {
                return collect();
            }

            return AnggotaAssem::query()
                ->whereIn('id', $ids)
                ->orderBy('nama_lengkap')
                ->get();
        }

        return collect();
    }
}

