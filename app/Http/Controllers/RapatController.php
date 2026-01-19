<?php

namespace App\Http\Controllers;

use App\Models\MasterJenisRapat;
use App\Models\Proker;
use App\Models\Rapat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RapatController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Rapat::query()
            ->with(['jenisRapat', 'proker', 'creator']);

        $tanggalStart = $request->date('tanggal_start');
        $tanggalEnd = $request->date('tanggal_end');

        if ($tanggalStart && $tanggalEnd) {
            $query->whereBetween('tanggal', [$tanggalStart->toDateString(), $tanggalEnd->toDateString()]);
        } elseif ($tanggalStart) {
            $query->whereDate('tanggal', '>=', $tanggalStart->toDateString());
        } elseif ($tanggalEnd) {
            $query->whereDate('tanggal', '<=', $tanggalEnd->toDateString());
        }

        $status = $request->string('status')->toString();

        if ($status !== '') {
            $query->where('status', $status);
        }

        $kategori = $request->string('kategori')->toString();

        if ($kategori !== '') {
            $query->where('kategori', $kategori);
        }

        $jenisRapatId = $request->integer('jenis_rapat_id');

        if ($jenisRapatId) {
            $query->where('jenis_rapat_id', $jenisRapatId);
        }

        $prokerId = $request->integer('proker_id');

        if ($prokerId) {
            $query->where('proker_id', $prokerId);
        }

        $rapats = $query
            ->orderByDesc('tanggal')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        $jenisRapats = MasterJenisRapat::orderBy('nama')->get();
        $prokers = Proker::orderByDesc('tahun')
            ->orderBy('nama_lengkap')
            ->get();

        return Inertia::render('Rapat/Index', [
            'rapats' => $rapats,
            'jenisRapats' => $jenisRapats,
            'prokers' => $prokers,
            'filters' => [
                'tanggal_start' => $tanggalStart ? $tanggalStart->toDateString() : null,
                'tanggal_end' => $tanggalEnd ? $tanggalEnd->toDateString() : null,
                'status' => $status,
                'kategori' => $kategori,
                'jenis_rapat_id' => $jenisRapatId,
                'proker_id' => $prokerId,
            ],
        ]);
    }

    public function calendar(Request $request): Response
    {
        $month = $request->integer('month', (int) date('m'));
        $year = $request->integer('year', (int) date('Y'));

        $rapats = Rapat::query()
            ->with('jenisRapat')
            ->whereYear('tanggal', $year)
            ->whereMonth('tanggal', $month)
            ->orderBy('tanggal')
            ->get();

        return Inertia::render('Rapat/Calendar', [
            'rapats' => $rapats,
            'month' => $month,
            'year' => $year,
        ]);
    }

    public function create(): Response
    {
        $jenisRapats = MasterJenisRapat::orderBy('nama')->get();
        $prokers = Proker::with(['prokerStrukturs.anggota.user'])
            ->orderByDesc('tahun')
            ->orderBy('nama_lengkap')
            ->get();
        $anggota = \App\Models\AnggotaAssem::with('user')
            ->get()
            ->sortBy('nama_lengkap')
            ->values();

        return Inertia::render('Rapat/Create', [
            'jenisRapats' => $jenisRapats,
            'prokers' => $prokers,
            'anggota' => $anggota,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => [
                'required',
                'string',
                'max:255',
            ],
            'jenis_rapat_id' => [
                'required',
                'integer',
                'exists:master_jenis_rapats,id',
            ],
            'kategori' => [
                'required',
                'string',
                'max:50',
            ],
            'proker_id' => [
                'nullable',
                'integer',
                'exists:prokers,id',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
            'tanggal' => [
                'required',
                'date',
            ],
            'waktu_mulai' => [
                'nullable',
                'string',
                'max:10',
            ],
            'waktu_selesai' => [
                'nullable',
                'string',
                'max:10',
            ],
            'lokasi' => [
                'nullable',
                'string',
                'max:255',
            ],
            'notulensi' => [
                'nullable',
                'string',
            ],
            'hasil' => [
                'nullable',
                'array',
            ],
            'evaluasi' => [
                'nullable',
                'string',
            ],
            'link_dokumentasi' => [
                'nullable',
                'string',
                'max:255',
            ],
            'status' => [
                'required',
                'string',
                Rule::in(['draft', 'dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan']),
            ],
            'target_peserta' => [
                'required',
                'string',
                Rule::in(['semua', 'divisi', 'role', 'proker_team', 'custom']),
            ],
            'target_detail' => [
                'nullable',
                'array',
            ],
        ]);

        if ($validated['kategori'] === 'proker') {
            $request->validate([
                'proker_id' => [
                    'required',
                    'integer',
                    'exists:prokers,id',
                ],
            ]);
        }

        $targetDetail = $validated['target_detail'] ?? [];

        if ($validated['target_peserta'] === 'divisi') {
            $divisi = $request->input('target_detail.divisi', []);
            $targetDetail['divisi'] = is_array($divisi) ? $divisi : [];
        } elseif ($validated['target_peserta'] === 'role') {
            $roles = $request->input('target_detail.role', []);
            $targetDetail['role'] = is_array($roles) ? $roles : [];
        } elseif ($validated['target_peserta'] === 'custom') {
            $anggotaIds = $request->input('target_detail.anggota_ids', []);
            $targetDetail['anggota_ids'] = is_array($anggotaIds) ? $anggotaIds : [];
        }

        $rapatData = [
            'judul' => $validated['judul'],
            'jenis_rapat_id' => $validated['jenis_rapat_id'],
            'kategori' => $validated['kategori'],
            'proker_id' => $validated['kategori'] === 'proker' ? $request->integer('proker_id') : null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'tanggal' => $validated['tanggal'],
            'waktu_mulai' => $validated['waktu_mulai'] ?? null,
            'waktu_selesai' => $validated['waktu_selesai'] ?? null,
            'lokasi' => $validated['lokasi'] ?? null,
            'notulensi' => $validated['notulensi'] ?? null,
            'hasil' => $validated['hasil'] ?? [],
            'evaluasi' => $validated['evaluasi'] ?? null,
            'link_dokumentasi' => $validated['link_dokumentasi'] ?? null,
            'status' => $validated['status'],
            'target_peserta' => $validated['target_peserta'],
            'target_detail' => $targetDetail,
            'created_by' => Auth::id(),
        ];

        Rapat::create($rapatData);

        return to_route('rapat.index');
    }

    public function show(int $id): Response
    {
        $rapat = Rapat::with([
            'jenisRapat',
            'proker',
            'creator',
            'presensiRapats.anggota.user',
        ])->findOrFail($id);

        $user = Auth::user();
        $canManage = $user && ($rapat->created_by === $user->id || $user->role === 'ketum_waketum');

        return Inertia::render('Rapat/Show', [
            'rapat' => $rapat,
            'canManage' => $canManage,
        ]);
    }

    public function edit(int $id): Response
    {
        $rapat = Rapat::findOrFail($id);

        $this->authorizeManage($rapat);

        $jenisRapats = MasterJenisRapat::orderBy('nama')->get();
        $prokers = Proker::with(['prokerStrukturs.anggota.user'])
            ->orderByDesc('tahun')
            ->orderBy('nama_lengkap')
            ->get();
        $anggota = \App\Models\AnggotaAssem::with('user')
            ->get()
            ->sortBy('nama_lengkap')
            ->values();

        return Inertia::render('Rapat/Edit', [
            'rapat' => $rapat,
            'jenisRapats' => $jenisRapats,
            'prokers' => $prokers,
            'anggota' => $anggota,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $rapat = Rapat::findOrFail($id);

        $this->authorizeManage($rapat);

        $validated = $request->validate([
            'judul' => [
                'required',
                'string',
                'max:255',
            ],
            'jenis_rapat_id' => [
                'required',
                'integer',
                'exists:master_jenis_rapats,id',
            ],
            'kategori' => [
                'required',
                'string',
                'max:50',
            ],
            'proker_id' => [
                'nullable',
                'integer',
                'exists:prokers,id',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
            'tanggal' => [
                'required',
                'date',
            ],
            'waktu_mulai' => [
                'nullable',
                'string',
                'max:10',
            ],
            'waktu_selesai' => [
                'nullable',
                'string',
                'max:10',
            ],
            'lokasi' => [
                'nullable',
                'string',
                'max:255',
            ],
            'notulensi' => [
                'nullable',
                'string',
            ],
            'hasil' => [
                'nullable',
                'array',
            ],
            'evaluasi' => [
                'nullable',
                'string',
            ],
            'link_dokumentasi' => [
                'nullable',
                'string',
                'max:255',
            ],
            'status' => [
                'required',
                'string',
                Rule::in(['draft', 'dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan']),
            ],
            'target_peserta' => [
                'required',
                'string',
                Rule::in(['semua', 'divisi', 'role', 'proker_team', 'custom']),
            ],
            'target_detail' => [
                'nullable',
                'array',
            ],
        ]);

        if ($validated['kategori'] === 'proker') {
            $request->validate([
                'proker_id' => [
                    'required',
                    'integer',
                    'exists:prokers,id',
                ],
            ]);
        }

        $targetDetail = $validated['target_detail'] ?? [];

        if ($validated['target_peserta'] === 'divisi') {
            $divisi = $request->input('target_detail.divisi', []);
            $targetDetail['divisi'] = is_array($divisi) ? $divisi : [];
        } elseif ($validated['target_peserta'] === 'role') {
            $roles = $request->input('target_detail.role', []);
            $targetDetail['role'] = is_array($roles) ? $roles : [];
        } elseif ($validated['target_peserta'] === 'custom') {
            $anggotaIds = $request->input('target_detail.anggota_ids', []);
            $targetDetail['anggota_ids'] = is_array($anggotaIds) ? $anggotaIds : [];
        }

        $rapat->update([
            'judul' => $validated['judul'],
            'jenis_rapat_id' => $validated['jenis_rapat_id'],
            'kategori' => $validated['kategori'],
            'proker_id' => $validated['kategori'] === 'proker' ? $request->integer('proker_id') : null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'tanggal' => $validated['tanggal'],
            'waktu_mulai' => $validated['waktu_mulai'] ?? null,
            'waktu_selesai' => $validated['waktu_selesai'] ?? null,
            'lokasi' => $validated['lokasi'] ?? null,
            'notulensi' => $validated['notulensi'] ?? null,
            'hasil' => $validated['hasil'] ?? [],
            'evaluasi' => $validated['evaluasi'] ?? null,
            'link_dokumentasi' => $validated['link_dokumentasi'] ?? null,
            'status' => $validated['status'],
            'target_peserta' => $validated['target_peserta'],
            'target_detail' => $targetDetail,
        ]);

        return to_route('rapat.show', $rapat->id);
    }

    public function destroy(int $id): RedirectResponse
    {
        $rapat = Rapat::findOrFail($id);

        $this->authorizeManage($rapat);

        $rapat->delete();

        return to_route('rapat.index');
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $rapat = Rapat::findOrFail($id);

        $this->authorizeManage($rapat);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                Rule::in(['draft', 'dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan']),
            ],
        ]);

        $current = $rapat->status;
        $next = $validated['status'];

        $allowed = [
            'draft' => ['dijadwalkan', 'dibatalkan'],
            'dijadwalkan' => ['berlangsung', 'dibatalkan'],
            'berlangsung' => ['selesai', 'dibatalkan'],
            'selesai' => [],
            'dibatalkan' => [],
        ];

        $transitions = $allowed[$current] ?? [];

        if (! in_array($next, $transitions, true)) {
            abort(422, 'Perpindahan status rapat tidak diizinkan.');
        }

        $rapat->status = $next;
        $rapat->save();

        return to_route('rapat.show', $rapat->id);
    }

    protected function authorizeManage(Rapat $rapat): void
    {
        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        $isOwner = $rapat->created_by === $user->id;
        $isKetum = $user->role === 'ketum_waketum';

        if (! $isOwner && ! $isKetum) {
            abort(403);
        }
    }
}
