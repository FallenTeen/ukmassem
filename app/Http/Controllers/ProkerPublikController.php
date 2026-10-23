<?php

namespace App\Http\Controllers;

use App\Models\Galeri;
use App\Models\MainProker;
use Inertia\Inertia;
use Inertia\Response;

class ProkerPublikController extends Controller
{
    public function index(): Response
    {
        $mainProkers = MainProker::query()
            ->where('nama_proker', '!=', 'Lainnya')
            ->withCount(['prokers' => fn ($q) => $q->where('status', 'aktif')])
            ->orderBy('id')
            ->get();

        return Inertia::render('ProkerPublik/Index', [
            'mainProkers' => $mainProkers,
        ]);
    }

    public function show(int $mainProker): Response
    {
        $main = MainProker::findOrFail($mainProker);

        $prokers = $main->prokers()
            ->with([
                'ketuaPelaksana.user',
                'galeris' => function ($q) {
                    $q->published()
                        ->select([
                            'galeris.id',
                            'galeris.jenis',
                            'galeris.judul',
                            'galeris.slug',
                            'galeris.cover_path',
                            'galeris.tanggal',
                        ])
                        ->orderByDesc('galeris.tanggal');
                },
            ])
            ->orderByDesc('tahun')
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'tahun', 'tanggal_mulai', 'tanggal_selesai', 'deskripsi', 'status', 'ketua_pelaksana_id']);

        $pagelaran = Galeri::published()
            ->jenis(Galeri::JENIS_PAGELARAN)
            ->whereHas('prokers', fn ($q) => $q->where('prokers.main_proker_id', $main->id))
            ->with('prokers:id,main_proker_id,nama_lengkap,tahun')
            ->orderByDesc('tanggal')
            ->get([
                'id',
                'judul',
                'slug',
                'ringkasan',
                'cover_path',
                'tanggal',
            ]);

        return Inertia::render('ProkerPublik/Show', [
            'mainProker' => $main->only(['id', 'nama_proker', 'deskripsi', 'gambar']),
            'prokers' => $prokers,
            'pagelaran' => $pagelaran,
        ]);
    }
}
