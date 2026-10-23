<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use App\Models\GaleriFoto;
use App\Models\Proker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GaleriAdminController extends Controller
{
    public const KADIV_DIVISI = [
        'kad_mus' => 'musik',
        'kad_tar' => 'tari',
        'kad_fil' => 'film',
        'kad_fot' => 'foto',
        'kad_tea' => 'teater',
    ];

    public const BISA_PUBLISH = ['rajawebsite', 'dm', 'humas'];

    public function index(Request $request): Response
    {
        $jenis = $request->string('jenis', Galeri::JENIS_KEGIATAN)->toString();
        $status = $request->string('status')->toString();
        $cari = $request->string('cari')->toString();

        abort_unless(in_array($jenis, GaleriPublikController::JENIS, true), 404);

        $query = Galeri::query()
            ->jenis($jenis)
            ->with(['creator'])
            ->orderByDesc('created_at');

        if ($status !== '') {
            $query->where('status', $status);
        }

        if ($cari !== '') {
            $query->where(function ($q) use ($cari) {
                $q->where('judul', 'like', "%{$cari}%")
                    ->orWhere('pembuat', 'like', "%{$cari}%");
            });
        }

        $galeris = $query->paginate(15)->withQueryString();

        $menunggu = 0;
        if ($this->bisaKelola() || $this->divisiKadiv()) {
            $menunggu = Galeri::query()
                ->jenis(Galeri::JENIS_KARYA)
                ->where('status', 'menunggu')
                ->when($this->divisiKadiv(), fn ($q, $divisi) => $q->where('divisi', $divisi))
                ->count();
        }

        return Inertia::render('GaleriAdmin/Index', [
            'jenis' => $jenis,
            'galeris' => $galeris,
            'filters' => [
                'status' => $status,
                'cari' => $cari,
            ],
            'bisaKelola' => $this->bisaKelola(),
            'menunggu' => $menunggu,
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('GaleriAdmin/Create', [
            'jenis' => $request->string('jenis', Galeri::JENIS_KEGIATAN)->toString(),
            'prokers' => Proker::query()
                ->with('mainProker')
                ->orderByDesc('tahun')
                ->orderBy('nama_lengkap')
                ->get(['id', 'nama_lengkap', 'tahun', 'status', 'main_proker_id']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($this->bisaKelola(), 403);

        $validated = $this->validasi($request);

        $galeri = Galeri::create([
            'judul' => $validated['judul'],
            'slug' => $this->slugBaru($validated['judul']),
            'jenis' => $validated['jenis'],
            'ringkasan' => $validated['ringkasan'] ?? null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'video_link' => $validated['video_link'] ?? null,
            'tanggal' => $validated['tanggal'] ?? null,
            'divisi' => $validated['divisi'] ?? null,
            'pembuat' => $validated['pembuat'] ?? null,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? now() : null,
            'created_by' => $request->user()->id,
        ]);

        if (! empty($validated['proker_ids'])) {
            $galeri->prokers()->sync($validated['proker_ids']);
        }

        $this->simpanFile($request, $galeri);

        return to_route('galeri-admin.edit', $galeri);
    }

    public function edit(Request $request, Galeri $galeri): Response
    {
        if (! $this->bisaKelola() && $this->divisiKadiv() !== $galeri->divisi) {
            abort(403);
        }

        $galeri->load(['carouselFotos', 'dokumentasiFotos', 'creator', 'approver', 'prokers.mainProker']);

        return Inertia::render('GaleriAdmin/Edit', [
            'galeri' => array_merge($galeri->toArray(), [
                'proker_ids' => $galeri->prokers()->pluck('prokers.id'),
            ]),
            'prokers' => Proker::query()
                ->with('mainProker')
                ->orderByDesc('tahun')
                ->orderBy('nama_lengkap')
                ->get(['id', 'nama_lengkap', 'tahun', 'status', 'main_proker_id']),
            'bisaKelola' => $this->bisaKelola(),
        ]);
    }

    public function update(Request $request, Galeri $galeri): RedirectResponse
    {
        abort_unless($this->bisaKelola(), 403);

        $validated = $this->validasi($request, $galeri);

        $galeri->update([
            'judul' => $validated['judul'],
            'ringkasan' => $validated['ringkasan'] ?? null,
            'deskripsi' => $validated['deskripsi'] ?? null,
            'video_link' => $validated['video_link'] ?? null,
            'tanggal' => $validated['tanggal'] ?? null,
            'divisi' => $validated['divisi'] ?? ($validated['jenis'] === Galeri::JENIS_KARYA ? $galeri->divisi : null),
            'pembuat' => $validated['pembuat'] ?? ($validated['jenis'] === Galeri::JENIS_KARYA ? $galeri->pembuat : null),
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published'
                ? ($galeri->published_at ?? now())
                : null,
        ]);

        if ($validated['jenis'] === Galeri::JENIS_PAGELARAN) {
            $galeri->prokers()->sync($validated['proker_ids'] ?? []);
        }

        $this->hapusFotoTerpilih($request, $galeri);
        $this->simpanFile($request, $galeri);
        $this->gantiCoverDariFoto($request, $galeri);

        return to_route('galeri-admin.edit', $galeri)->with('sukses', 'Galeri berhasil disimpan.');
    }

    public function destroy(Request $request, Galeri $galeri): RedirectResponse
    {
        abort_unless($this->bisaKelola(), 403);

        foreach (GaleriFoto::query()->where('galeri_id', $galeri->id)->get() as $foto) {
            Storage::disk('public')->delete($foto->path);
        }

        if ($galeri->cover_path) {
            Storage::disk('public')->delete($galeri->cover_path);
        }

        $galeri->delete();

        return to_route('galeri-admin.index', ['jenis' => $galeri->jenis])
            ->with('sukses', 'Konten galeri dihapus.');
    }

    public function updateStatus(Request $request, Galeri $galeri): RedirectResponse
    {
        abort_unless($this->bisaKelola(), 403);

        $validated = $request->validate([
            'status' => ['required', 'in:draft,published'],
        ]);

        $galeri->update([
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published'
                ? ($galeri->published_at ?? now())
                : null,
        ]);

        return back()->with('sukses', 'Status berhasil diubah.');
    }

    public function menunggu(): Response
    {
        $divisi = $this->divisiKadiv();

        $karyaList = Galeri::query()
            ->jenis(Galeri::JENIS_KARYA)
            ->where('status', 'menunggu')
            ->when($divisi, fn ($q) => $q->where('divisi', $divisi))
            ->with(['creator', 'carouselFotos'])
            ->orderBy('created_at')
            ->get();

        return Inertia::render('GaleriAdmin/Pending', [
            'karyaList' => $karyaList,
            'bisaKelola' => $this->bisaKelola(),
        ]);
    }

    public function setujui(Request $request, Galeri $galeri): RedirectResponse
    {
        abort_unless($galeri->jenis === Galeri::JENIS_KARYA, 404);
        abort_unless($galeri->status === 'menunggu', 422, 'Karya tidak sedang menunggu persetujuan.');

        $divisi = $this->divisiKadiv();

        abort_unless($this->bisaKelola() || $divisi === $galeri->divisi, 403);

        $galeri->update([
            'status' => 'published',
            'published_at' => now(),
            'approved_by' => $request->user()->id,
        ]);

        return back()->with('sukses', 'Karya berhasil disetujui dan tampil publik.');
    }

    public function tolak(Request $request, Galeri $galeri): RedirectResponse
    {
        abort_unless($galeri->jenis === Galeri::JENIS_KARYA, 404);
        abort_unless($galeri->status === 'menunggu', 422, 'Karya tidak sedang menunggu persetujuan.');

        $divisi = $this->divisiKadiv();

        abort_unless($this->bisaKelola() || $divisi === $galeri->divisi, 403);

        $validated = $request->validate([
            'catatan_admin' => ['nullable', 'string', 'max:1000'],
        ]);

        $galeri->update([
            'status' => 'ditolak',
            'catatan_admin' => $validated['catatan_admin'] ?? null,
            'approved_by' => $request->user()->id,
        ]);

        return back()->with('sukses', 'Karya ditolak.');
    }

    protected function validasi(Request $request, ?Galeri $galeri = null): array
    {
        $validated = $request->validate([
            'jenis' => ['required', 'in:kegiatan,pagelaran,karya'],
            'judul' => ['required', 'string', 'max:255'],
            'ringkasan' => ['nullable', 'string', 'max:500'],
            'deskripsi' => ['nullable', 'string'],
            'video_link' => ['nullable', 'string', 'max:255', 'starts_with:http://,https://'],
            'tanggal' => ['nullable', 'date'],
            'divisi' => ['nullable', 'in:musik,tari,film,foto,teater'],
            'pembuat' => ['nullable', 'string', 'max:255'],
            'proker_ids' => ['nullable', 'array'],
            'proker_ids.*' => ['integer', 'exists:prokers,id'],
            'status' => ['required', 'in:draft,published'],
            'cover_baru' => ['nullable', 'image', 'max:8192'],
            'carousel_baru' => ['nullable', 'array', 'max:3'],
            'carousel_baru.*' => ['image', 'max:8192'],
            'dokumentasi_baru' => ['nullable', 'array', 'max:15'],
            'dokumentasi_baru.*' => ['image', 'max:8192'],
            'hapus_foto_ids' => ['nullable', 'array'],
            'hapus_foto_ids.*' => ['integer', 'exists:galeri_fotos,id'],
            'cover_foto_id' => ['nullable', 'integer', 'exists:galeri_fotos,id'],
        ]);

        $validated['divisi'] = $validated['jenis'] === Galeri::JENIS_KARYA
            ? ($validated['divisi'] ?? null)
            : null;
        $validated['pembuat'] = $validated['jenis'] === Galeri::JENIS_KARYA
            ? ($validated['pembuat'] ?? null)
            : null;

        if ($validated['jenis'] === Galeri::JENIS_KEGIATAN || $validated['jenis'] === Galeri::JENIS_PAGELARAN) {
            $validated['tanggal'] = $validated['tanggal'] ?? now()->toDateString();
        }

        return $validated;
    }

    protected function simpanFile(Request $request, Galeri $galeri): void
    {
        if ($request->file('cover_baru')) {
            if ($galeri->cover_path) {
                Storage::disk('public')->delete($galeri->cover_path);
            }
            $galeri->update([
                'cover_path' => $request->file('cover_baru')->store('galeri/cover', 'public'),
            ]);
        }

        $carouselDipakai = $galeri->carouselFotos()->count();

        foreach ($request->file('carousel_baru', []) as $file) {
            if ($carouselDipakai >= 3) {
                break;
            }
            GaleriFoto::create([
                'galeri_id' => $galeri->id,
                'tipe' => 'carousel',
                'path' => $file->store('galeri/carousel', 'public'),
                'urutan' => $carouselDipakai++,
            ]);
        }

        $dokDipakai = $galeri->dokumentasiFotos()->count();

        foreach ($request->file('dokumentasi_baru', []) as $file) {
            if ($dokDipakai >= 15) {
                break;
            }
            GaleriFoto::create([
                'galeri_id' => $galeri->id,
                'tipe' => 'dokumentasi',
                'path' => $file->store('galeri/dokumentasi', 'public'),
                'urutan' => $dokDipakai++,
            ]);
        }
    }

    protected function hapusFotoTerpilih(Request $request, Galeri $galeri): void
    {
        $ids = $request->input('hapus_foto_ids', []);

        if (! is_array($ids) || $ids === []) {
            return;
        }

        foreach (GaleriFoto::query()->where('galeri_id', $galeri->id)->whereIn('id', $ids)->get() as $foto) {
            Storage::disk('public')->delete($foto->path);
            $foto->delete();
        }
    }

    protected function gantiCoverDariFoto(Request $request, Galeri $galeri): void
    {
        $coverFotoId = $request->input('cover_foto_id');

        if (! $coverFotoId) {
            return;
        }

        $foto = GaleriFoto::query()
            ->where('galeri_id', $galeri->id)
            ->find($coverFotoId);

        if ($foto) {
            if ($galeri->cover_path && $galeri->cover_path !== $foto->path) {
                Storage::disk('public')->delete($galeri->cover_path);
            }
            $galeri->update(['cover_path' => $foto->path]);
        }
    }

    protected function slugBaru(string $judul): string
    {
        $basis = Str::slug($judul) ?: 'galeri';
        $slug = $basis;
        $i = 1;

        while (Galeri::where('slug', $slug)->exists()) {
            $slug = $basis . '-' . $i++;
        }

        return $slug;
    }

    protected function bisaKelola(): bool
    {
        return in_array(auth()->user()?->role, self::BISA_PUBLISH, true);
    }

    protected function divisiKadiv(): ?string
    {
        $role = auth()->user()?->role;

        return self::KADIV_DIVISI[$role] ?? null;
    }
}
