<?php

namespace App\Http\Controllers;

use App\Models\AnggotaAssem;
use App\Models\MainProker;
use App\Models\Proker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProkerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Proker::query()
            ->with(['mainProker', 'ketuaPelaksana']);

        $tahun = $request->integer('tahun');

        if ($tahun) {
            $query->where('tahun', $tahun);
        }

        $status = $request->string('status')->toString();

        if ($status !== '') {
            $query->where('status', $status);
        }

        $mainProkerId = $request->integer('main_proker_id');

        if ($mainProkerId) {
            $query->where('main_proker_id', $mainProkerId);
        }

        $prokers = $query
            ->orderByDesc('tahun')
            ->orderBy('nama_lengkap')
            ->paginate(20)
            ->withQueryString();

        $mainProkers = MainProker::orderBy('nama_proker')->get();

        return Inertia::render('Proker/Index', [
            'prokers' => $prokers,
            'mainProkers' => $mainProkers,
            'filters' => [
                'tahun' => $tahun,
                'status' => $status,
                'main_proker_id' => $mainProkerId,
            ],
        ]);
    }

    public function create(): Response
    {
        $mainProkers = MainProker::orderBy('nama_proker')->get();
        $ketuaOptions = AnggotaAssem::with('user')
            ->get()
            ->sortBy('nama_lengkap')
            ->values();

        return Inertia::render('Proker/Create', [
            'mainProkers' => $mainProkers,
            'ketuaOptions' => $ketuaOptions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'main_proker_id' => [
                'required',
            ],
            'nama_main_proker_baru' => [
                'required_if:main_proker_id,new',
                'nullable',
                'string',
                'max:255',
            ],
            'nama_lengkap' => [
                'required',
                'string',
                'max:255',
            ],
            'tahun' => [
                'required',
                'integer',
            ],
            'tanggal_mulai' => [
                'nullable',
                'date',
            ],
            'tanggal_selesai' => [
                'nullable',
                'date',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
            'status' => [
                'required',
                'string',
                Rule::in(['draft', 'aktif', 'selesai', 'dibatalkan']),
            ],
            'ketua_pelaksana_id' => [
                'nullable',
                'integer',
                'exists:anggota_assem,id',
            ],
        ]);

        $mainProkerIdInput = $validated['main_proker_id'];

        if ($mainProkerIdInput === 'new') {
            $mainProker = MainProker::create([
                'nama_proker' => $validated['nama_main_proker_baru'],
                'deskripsi' => null,
                'gambar' => null,
            ]);
            $mainProkerId = $mainProker->id;
        } else {
            $mainProkerId = (int) $mainProkerIdInput;
        }

        Proker::create([
            'main_proker_id' => $mainProkerId,
            'nama_lengkap' => $validated['nama_lengkap'],
            'tahun' => $validated['tahun'],
            'tanggal_mulai' => $validated['tanggal_mulai'] ?? null,
            'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'status' => $validated['status'],
            'ketua_pelaksana_id' => $validated['ketua_pelaksana_id'] ?? null,
            'ketua_pelaksana_history' => [],
        ]);

        return to_route('proker.index');
    }

    public function show(int $id): Response
    {
        $proker = Proker::with([
            'mainProker',
            'ketuaPelaksana',
            'prokerStrukturs.anggota.user',
            'rapats.presensiRapats.anggota.user',
        ])->findOrFail($id);

        $otherProkers = Proker::where('id', '<>', $id)
            ->orderByDesc('tahun')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'tahun']);

        $anggota = AnggotaAssem::with('user')
            ->get()
            ->sortBy('nama_lengkap')
            ->values();

        $timeline = $proker->rapats
            ->map(function ($rapat) {
                return [
                    'type' => 'rapat',
                    'id' => $rapat->id,
                    'judul' => $rapat->judul,
                    'tanggal' => $rapat->tanggal,
                ];
            })
            ->sortBy('tanggal')
            ->values();

        return Inertia::render('Proker/Show', [
            'proker' => $proker,
            'timeline' => $timeline,
            'anggota' => $anggota,
            'otherProkers' => $otherProkers,
        ]);
    }

    public function edit(int $id): Response
    {
        $proker = Proker::with([
            'mainProker',
            'ketuaPelaksana',
        ])->findOrFail($id);

        $mainProkers = MainProker::orderBy('nama_proker')->get();
        $ketuaOptions = AnggotaAssem::with('user')
            ->get()
            ->sortBy('nama_lengkap')
            ->values();

        return Inertia::render('Proker/Edit', [
            'proker' => $proker,
            'mainProkers' => $mainProkers,
            'ketuaOptions' => $ketuaOptions,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $proker = Proker::findOrFail($id);

        $validated = $request->validate([
            'main_proker_id' => [
                'required',
            ],
            'nama_main_proker_baru' => [
                'required_if:main_proker_id,new',
                'nullable',
                'string',
                'max:255',
            ],
            'nama_lengkap' => [
                'required',
                'string',
                'max:255',
            ],
            'tahun' => [
                'required',
                'integer',
            ],
            'tanggal_mulai' => [
                'nullable',
                'date',
            ],
            'tanggal_selesai' => [
                'nullable',
                'date',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
            'status' => [
                'required',
                'string',
                Rule::in(['draft', 'aktif', 'selesai', 'dibatalkan']),
            ],
            'ketua_pelaksana_id' => [
                'nullable',
                'integer',
                'exists:anggota_assem,id',
            ],
        ]);

        $mainProkerIdInput = $validated['main_proker_id'];

        if ($mainProkerIdInput === 'new') {
            $mainProker = MainProker::create([
                'nama_proker' => $validated['nama_main_proker_baru'],
                'deskripsi' => null,
                'gambar' => null,
            ]);
            $mainProkerId = $mainProker->id;
        } else {
            $mainProkerId = (int) $mainProkerIdInput;
        }

        $oldKetuaId = $proker->ketua_pelaksana_id;
        $newKetuaId = $validated['ketua_pelaksana_id'] ?? null;

        $data = [
            'main_proker_id' => $mainProkerId,
            'nama_lengkap' => $validated['nama_lengkap'],
            'tahun' => $validated['tahun'],
            'tanggal_mulai' => $validated['tanggal_mulai'] ?? null,
            'tanggal_selesai' => $validated['tanggal_selesai'] ?? null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'status' => $validated['status'],
            'ketua_pelaksana_id' => $newKetuaId,
        ];

        if ($oldKetuaId !== $newKetuaId) {
            $history = $proker->ketua_pelaksana_history ?? [];
            $history[] = [
                'tanggal' => now()->toDateTimeString(),
                'old_id' => $oldKetuaId,
                'new_id' => $newKetuaId,
                'changed_by' => Auth::id(),
            ];
            $data['ketua_pelaksana_history'] = $history;
        }

        $proker->update($data);

        return to_route('proker.show', $proker->id);
    }

    public function destroy(int $id): RedirectResponse
    {
        $proker = Proker::findOrFail($id);

        $proker->delete();

        return to_route('proker.index');
    }

    public function copyStruktur(int $fromId, int $toId): RedirectResponse
    {
        $from = Proker::with('prokerStrukturs')->findOrFail($fromId);
        $to = Proker::findOrFail($toId);

        foreach ($from->prokerStrukturs as $struktur) {
            $to->prokerStrukturs()->create([
                'anggota_id' => null,
                'jabatan' => $struktur->jabatan,
                'divisi_proker' => $struktur->divisi_proker,
            ]);
        }

        return to_route('proker.show', $to->id);
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $proker = Proker::findOrFail($id);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(['draft', 'aktif', 'selesai', 'dibatalkan']),
            ],
        ]);

        $currentStatus = $proker->status;
        $newStatus = $validated['status'];

        $allowedTransitions = [
            'draft' => ['aktif', 'dibatalkan'],
            'aktif' => ['selesai', 'dibatalkan'],
            'selesai' => [],
            'dibatalkan' => [],
        ];

        $allowed = $allowedTransitions[$currentStatus] ?? [];

        if (! in_array($newStatus, $allowed, true)) {
            abort(422, 'Perpindahan status tidak diizinkan.');
        }

        $proker->status = $newStatus;
        $proker->save();

        return to_route('proker.show', $proker->id);
    }
}
