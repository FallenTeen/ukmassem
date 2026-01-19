<?php

namespace App\Http\Controllers;

use App\Models\PresensiRapat;
use App\Models\Proker;
use App\Models\Rapat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function statistikKehadiran(Request $request): Response
    {
        $periode = $request->string('periode', 'all')->toString();
        $prokerId = $request->integer('proker_id');

        $query = PresensiRapat::query()
            ->select([
                'presensi_rapats.anggota_id',
                DB::raw('COUNT(DISTINCT presensi_rapats.rapat_id) as total_rapat'),
                DB::raw("SUM(CASE WHEN presensi_rapats.status_kehadiran = 'hadir' THEN 1 ELSE 0 END) as hadir"),
                DB::raw("SUM(CASE WHEN presensi_rapats.status_kehadiran = 'izin' THEN 1 ELSE 0 END) as izin"),
                DB::raw("SUM(CASE WHEN presensi_rapats.status_kehadiran = 'sakit' THEN 1 ELSE 0 END) as sakit"),
                DB::raw("SUM(CASE WHEN presensi_rapats.status_kehadiran = 'alpa' THEN 1 ELSE 0 END) as alpa"),
            ])
            ->join('rapats', 'rapats.id', '=', 'presensi_rapats.rapat_id')
            ->join('anggota_assem', 'anggota_assem.id', '=', 'presensi_rapats.anggota_id')
            ->groupBy('presensi_rapats.anggota_id');

        if ($prokerId) {
            $query->where('rapats.proker_id', $prokerId);
        }

        if ($periode !== 'all') {
            $year = (int) Carbon::now()->format('Y');
            if (preg_match('/^(\d{4})-(\d{2})$/', $periode, $matches)) {
                $year = (int) $matches[1];
                $month = (int) $matches[2];
                $query->whereYear('rapats.tanggal', $year)->whereMonth('rapats.tanggal', $month);
            } elseif (preg_match('/^\d{4}$/', $periode)) {
                $year = (int) $periode;
                $query->whereYear('rapats.tanggal', $year);
            }
        }

        $rows = $query->get();

        $anggotaIds = $rows->pluck('anggota_id')->all();

        $anggotaMap = DB::table('anggota_assem')
            ->leftJoin('users', 'users.id', '=', 'anggota_assem.user_id')
            ->whereIn('anggota_assem.id', $anggotaIds)
            ->select([
                'anggota_assem.id',
                'anggota_assem.divisi',
                'anggota_assem.status_anggota',
                'users.name as nama',
                'users.role as role',
            ])
            ->get()
            ->keyBy('id');

        $data = $rows->map(function ($row) use ($anggotaMap) {
            $meta = $anggotaMap->get($row->anggota_id);

            $totalHadir = (int) $row->hadir + (int) $row->izin + (int) $row->sakit;
            $totalRapat = (int) $row->total_rapat;
            $persentase = $totalRapat > 0 ? round(($totalHadir / $totalRapat) * 100, 2) : 0.0;

            return [
                'anggota_id' => $row->anggota_id,
                'nama' => $meta->nama ?? null,
                'role' => $meta->role ?? null,
                'divisi' => $meta->divisi ?? null,
                'status_anggota' => $meta->status_anggota ?? null,
                'total_rapat' => $totalRapat,
                'hadir' => (int) $row->hadir,
                'izin' => (int) $row->izin,
                'sakit' => (int) $row->sakit,
                'alpa' => (int) $row->alpa,
                'persentase_kehadiran' => $persentase,
            ];
        })->sortByDesc('persentase_kehadiran')->values();

        $prokers = Proker::orderByDesc('tahun')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'tahun']);

        return Inertia::render('dashboard', [
            'statistikKehadiran' => [
                'periode' => $periode,
                'proker_id' => $prokerId ?: null,
                'items' => $data,
            ],
            'prokers' => $prokers,
        ]);
    }

    public function statistikPerProker(Request $request, int $prokerId): Response
    {
        $proker = Proker::with('rapats')->findOrFail($prokerId);

        $rapatIds = $proker->rapats->pluck('id')->all();

        if ($rapatIds === []) {
            $summary = [
                'total_rapat' => 0,
                'rata_rata_kehadiran' => 0.0,
            ];

            return Inertia::render('dashboard', [
                'prokerSummary' => $summary,
                'proker' => $proker,
                'perAnggota' => [],
                'perBulan' => [],
            ]);
        }

        $presensi = PresensiRapat::query()
            ->whereIn('rapat_id', $rapatIds)
            ->get();

        $groupedByRapat = $presensi->groupBy('rapat_id');

        $totalRapat = count($rapatIds);
        $totalPersentase = 0.0;

        foreach ($groupedByRapat as $rapatId => $items) {
            $total = $items->count();
            $hadirCount = $items->whereIn('status_kehadiran', ['hadir', 'izin', 'sakit'])->count();
            $totalPersentase += $total > 0 ? ($hadirCount / $total) * 100.0 : 0.0;
        }

        $summary = [
            'total_rapat' => $totalRapat,
            'rata_rata_kehadiran' => $totalRapat > 0 ? round($totalPersentase / $totalRapat, 2) : 0.0,
        ];

        $strukturAnggota = DB::table('proker_strukturs')
            ->join('anggota_assem', 'anggota_assem.id', '=', 'proker_strukturs.anggota_id')
            ->leftJoin('users', 'users.id', '=', 'anggota_assem.user_id')
            ->where('proker_strukturs.proker_id', $proker->id)
            ->select([
                'anggota_assem.id as anggota_id',
                'users.name as nama',
                'users.role as role',
                'anggota_assem.divisi',
            ])
            ->get()
            ->keyBy('anggota_id');

        $perAnggota = $this->buildPerAnggota($presensi, $strukturAnggota);

        $perBulan = $this->buildPerBulan($presensi);

        return Inertia::render('dashboard', [
            'prokerSummary' => $summary,
            'proker' => $proker,
            'perAnggota' => $perAnggota,
            'perBulan' => $perBulan,
        ]);
    }

    protected function buildPerAnggota(Collection $presensi, Collection $strukturAnggota): array
    {
        $grouped = $presensi->groupBy('anggota_id');

        $result = [];

        foreach ($grouped as $anggotaId => $items) {
            $meta = $strukturAnggota->get($anggotaId);

            $total = $items->count();
            $hadirCount = $items->whereIn('status_kehadiran', ['hadir', 'izin', 'sakit'])->count();
            $persentase = $total > 0 ? round(($hadirCount / $total) * 100, 2) : 0.0;

            $result[] = [
                'anggota_id' => $anggotaId,
                'nama' => $meta->nama ?? null,
                'role' => $meta->role ?? null,
                'divisi' => $meta->divisi ?? null,
                'total_rapat' => $total,
                'hadir' => $items->where('status_kehadiran', 'hadir')->count(),
                'izin' => $items->where('status_kehadiran', 'izin')->count(),
                'sakit' => $items->where('status_kehadiran', 'sakit')->count(),
                'alpa' => $items->where('status_kehadiran', 'alpa')->count(),
                'persentase_kehadiran' => $persentase,
            ];
        }

        usort($result, static function (array $a, array $b): int {
            return $b['persentase_kehadiran'] <=> $a['persentase_kehadiran'];
        });

        return $result;
    }

    protected function buildPerBulan(Collection $presensi): array
    {
        $rapatIds = $presensi->pluck('rapat_id')->unique()->values()->all();

        $rapatTanggal = Rapat::query()
            ->whereIn('id', $rapatIds)
            ->pluck('tanggal', 'id');

        $perBulan = [];

        foreach ($presensi as $row) {
            $tanggal = $rapatTanggal[$row->rapat_id] ?? null;

            if (! $tanggal) {
                continue;
            }

            $monthKey = Carbon::parse($tanggal)->format('Y-m');

            if (! isset($perBulan[$monthKey])) {
                $perBulan[$monthKey] = [
                    'label' => Carbon::parse($tanggal)->translatedFormat('M Y'),
                    'hadir' => 0,
                    'izin' => 0,
                    'sakit' => 0,
                    'alpa' => 0,
                ];
            }

            $status = $row->status_kehadiran;

            if ($status === 'hadir') {
                $perBulan[$monthKey]['hadir']++;
            } elseif ($status === 'izin') {
                $perBulan[$monthKey]['izin']++;
            } elseif ($status === 'sakit') {
                $perBulan[$monthKey]['sakit']++;
            } elseif ($status === 'alpa') {
                $perBulan[$monthKey]['alpa']++;
            }
        }

        ksort($perBulan);

        return array_values($perBulan);
    }
}

