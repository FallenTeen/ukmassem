<?php

namespace App\Http\Controllers;

use App\Models\AnggotaAssem;
use App\Models\Galeri;
use App\Models\GaleriFoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class KaryaSayaController extends Controller
{
    public function index(Request $request): Response
    {
        $karyaList = Galeri::query()
            ->jenis(Galeri::JENIS_KARYA)
            ->where('created_by', $request->user()->id)
            ->with(['carouselFotos'])
            ->orderByDesc('created_at')
            ->get();

        $anggota = AnggotaAssem::query()->where('user_id', $request->user()->id)->first();

        return Inertia::render('KaryaSaya/Index', [
            'karyaList' => $karyaList,
            'divisiSaya' => $anggota?->divisi,
        ]);
    }

    public function create(Request $request): Response
    {
        $anggota = AnggotaAssem::query()->where('user_id', $request->user()->id)->first();
        $bisaKelola = $this->bisaKelola();
        $bisaPilihDivisi = $bisaKelola || $this->divisiKadiv();

        return Inertia::render('KaryaSaya/Create', [
            'divisiSaya' => $anggota?->divisi,
            'bisaPilihDivisi' => $bisaPilihDivisi,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'divisi' => ['required', 'in:musik,tari,film,foto,teater'],
            'pembuat' => ['required', 'string', 'max:255'],
            'ringkasan' => ['required', 'string', 'max:500'],
            'deskripsi' => ['required', 'string'],
            'video_link' => ['nullable', 'string', 'max:255', 'starts_with:http://,https://'],
            'tanggal' => ['nullable', 'date'],
            'cover' => ['required', 'image', 'max:8192'],
            'carousel' => ['nullable', 'array', 'max:3'],
            'carousel.*' => ['image', 'max:8192'],
            'dokumentasi' => ['nullable', 'array', 'max:15'],
            'dokumentasi.*' => ['image', 'max:8192'],
        ]);

        $diikuti = $this->kirimLangsung($validated['divisi']);
        $status = $diikuti ? 'published' : 'menunggu';

        $basis = Str::slug($validated['judul']) ?: 'karya';
        $slug = $basis;
        $i = 1;

        while (Galeri::where('slug', $slug)->exists()) {
            $slug = $basis . '-' . $i++;
        }

        $galeri = Galeri::create([
            'judul' => $validated['judul'],
            'slug' => $slug,
            'jenis' => Galeri::JENIS_KARYA,
            'ringkasan' => $validated['ringkasan'],
            'deskripsi' => $validated['deskripsi'],
            'video_link' => $validated['video_link'] ?? null,
            'tanggal' => $validated['tanggal'] ?? now()->toDateString(),
            'divisi' => $validated['divisi'],
            'pembuat' => $validated['pembuat'],
            'status' => $status,
            'published_at' => $diikuti ? now() : null,
            'created_by' => $request->user()->id,
            'approved_by' => $diikuti ? $request->user()->id : null,
        ]);

        if ($request->file('cover')) {
            $galeri->update([
                'cover_path' => $request->file('cover')->store('galeri/cover', 'public'),
            ]);
        }

        foreach ($request->file('carousel', []) as $index => $file) {
            if ($index >= 3) {
                break;
            }
            GaleriFoto::create([
                'galeri_id' => $galeri->id,
                'tipe' => 'carousel',
                'path' => $file->store('galeri/carousel', 'public'),
                'urutan' => $index,
            ]);
        }

        foreach ($request->file('dokumentasi', []) as $index => $file) {
            if ($index >= 15) {
                break;
            }
            GaleriFoto::create([
                'galeri_id' => $galeri->id,
                'tipe' => 'dokumentasi',
                'path' => $file->store('galeri/dokumentasi', 'public'),
                'urutan' => $index,
            ]);
        }

        return to_route('karya-saya.index')->with(
            'sukses',
            $diikuti
                ? 'Karya berhasil dipublikasikan.'
                : 'Karya berhasil dikirim dan menunggu persetujuan ketua divisi.'
        );
    }

    protected function kirimLangsung(?string $divisiKarya): bool
    {
        if ($this->bisaKelola()) {
            return true;
        }

        return $this->divisiKadiv() !== null && $this->divisiKadiv() === $divisiKarya;
    }

    protected function bisaKelola(): bool
    {
        return in_array(auth()->user()?->role, GaleriAdminController::BISA_PUBLISH, true);
    }

    protected function divisiKadiv(): ?string
    {
        return GaleriAdminController::KADIV_DIVISI[auth()->user()?->role] ?? null;
    }
}
