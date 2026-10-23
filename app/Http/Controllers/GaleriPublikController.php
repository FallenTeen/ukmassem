<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GaleriPublikController extends Controller
{
    public const JENIS = ['kegiatan', 'pagelaran', 'karya'];

    public function landing(): Response
    {
        $counts = collect(self::JENIS)
            ->mapWithKeys(fn ($jenis) => [$jenis => Galeri::published()->jenis($jenis)->count()]);

        $galeris = Galeri::query()
            ->published()
            ->orderByDesc('tanggal')
            ->orderByDesc('published_at')
            ->select(['id', 'judul', 'slug', 'jenis', 'cover_path', 'tanggal', 'pembuat', 'divisi'])
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('galeri', [
            'counts' => $counts,
            'galeris' => $galeris,
        ]);
    }

    public function index(Request $request, string $jenis): Response
    {
        abort_unless(in_array($jenis, self::JENIS, true), 404);

        $divisi = $request->string('divisi')->toString();

        $query = Galeri::query()
            ->published()
            ->jenis($jenis)
            ->orderByDesc('tanggal')
            ->orderByDesc('published_at');

        if ($jenis === Galeri::JENIS_KARYA && $divisi !== '') {
            $query->where('divisi', $divisi);
        }

        $galeris = $query
            ->select(['id', 'judul', 'slug', 'ringkasan', 'cover_path', 'tanggal', 'divisi', 'pembuat', 'jenis','status', 'published_at'])
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Galeri/Index', [
            'jenis' => $jenis,
            'divisi' => $divisi !== '' ? $divisi : null,
            'galeris' => $galeris,
        ]);
    }

    public function show(string $jenis, string $slug): Response
    {
        abort_unless(in_array($jenis, self::JENIS, true), 404);

        $galeri = Galeri::query()
            ->published()
            ->where('jenis', $jenis)
            ->where('slug', $slug)
            ->with(['carouselFotos', 'dokumentasiFotos', 'prokers.mainProker', 'creator'])
            ->firstOrFail();

        return Inertia::render('Galeri/Show', [
            'jenis' => $jenis,
            'galeri' => $galeri,
        ]);
    }
}
