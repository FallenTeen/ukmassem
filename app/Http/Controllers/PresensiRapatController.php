<?php

namespace App\Http\Controllers;

use App\Models\AnggotaAssem;
use App\Models\PresensiRapat;
use App\Models\Rapat;
use App\Services\RapatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PresensiRapatController extends Controller
{
    public function __construct(
        protected RapatService $rapatService,
    ) {
    }

    protected function authorizeManage(Rapat $rapat): void
    {
        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        $isOwner = $rapat->created_by === $user->id;
        $isKetum = $user->role === 'ketum_waketum';
        $isSekretaris = $user->role === 'sekretaris';
        $isRajaWebsite = $user->role === 'rajawebsite';

        if (! $isOwner && ! $isKetum && ! $isSekretaris && ! $isRajaWebsite) {
            abort(403);
        }
    }

    public function generate(int $rapatId): JsonResponse
    {
        $rapat = Rapat::findOrFail($rapatId);
        $this->authorizeManage($rapat);

        $peserta = $this->rapatService->generatePesertaList($rapat->id);

        $existing = PresensiRapat::query()
            ->where('rapat_id', $rapat->id)
            ->pluck('anggota_id')
            ->all();

        $existingIds = array_map('intval', $existing);

        $items = [];

        foreach ($peserta as $anggota) {
            if (in_array($anggota->id, $existingIds, true)) {
                continue;
            }

            $items[] = [
                'rapat_id' => $rapat->id,
                'anggota_id' => $anggota->id,
                'status_kehadiran' => 'alpa',
                'keterangan' => null,
            ];
        }

        if ($items !== []) {
            PresensiRapat::query()->insert($items);
        }

        $list = PresensiRapat::query()
            ->with('anggota.user')
            ->where('rapat_id', $rapat->id)
            ->orderBy('id')
            ->get();

        return response()->json($list);
    }

    public function index(int $rapatId): JsonResponse
    {
        $rapat = Rapat::findOrFail($rapatId);
        $this->authorizeManage($rapat);

        $list = PresensiRapat::query()
            ->with('anggota.user')
            ->where('rapat_id', $rapat->id)
            ->orderBy('id')
            ->get();

        return response()->json($list);
    }

    public function bulkUpdate(Request $request, int $rapatId): Response
    {
        $rapat = Rapat::findOrFail($rapatId);
        $this->authorizeManage($rapat);

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.anggota_id' => ['required', 'integer', 'exists:anggota_assem,id'],
            'items.*.status_kehadiran' => [
                'required',
                'string',
                Rule::in(['hadir', 'izin', 'sakit', 'alpa']),
            ],
            'items.*.keterangan' => ['nullable', 'string'],
        ]);

        foreach ($validated['items'] as $item) {
            PresensiRapat::query()->updateOrCreate(
                [
                    'rapat_id' => $rapat->id,
                    'anggota_id' => $item['anggota_id'],
                ],
                [
                    'status_kehadiran' => $item['status_kehadiran'],
                    'keterangan' => $item['keterangan'] ?? null,
                ],
            );
        }

        return response()->noContent();
    }

    public function addManual(Request $request, int $rapatId): JsonResponse
    {
        $rapat = Rapat::findOrFail($rapatId);
        $this->authorizeManage($rapat);

        $validated = $request->validate([
            'anggota_id' => ['required', 'integer', 'exists:anggota_assem,id'],
            'status_kehadiran' => [
                'nullable',
                'string',
                Rule::in(['hadir', 'izin', 'sakit', 'alpa']),
            ],
            'keterangan' => ['nullable', 'string'],
        ]);

        $anggota = AnggotaAssem::findOrFail($validated['anggota_id']);

        $presensi = PresensiRapat::query()->updateOrCreate(
            [
                'rapat_id' => $rapat->id,
                'anggota_id' => $anggota->id,
            ],
            [
                'status_kehadiran' => $validated['status_kehadiran'] ?? 'hadir',
                'keterangan' => $validated['keterangan'] ?? null,
            ],
        );

        $presensi->load('anggota.user');

        return response()->json($presensi);
    }

    public function remove(int $rapatId, int $anggotaId): Response
    {
        $rapat = Rapat::findOrFail($rapatId);
        $this->authorizeManage($rapat);

        PresensiRapat::query()
            ->where('rapat_id', $rapat->id)
            ->where('anggota_id', $anggotaId)
            ->delete();

        return response()->noContent();
    }
}

