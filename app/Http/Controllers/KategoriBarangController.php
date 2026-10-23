<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\KategoriBarang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KategoriBarangController extends Controller
{
    public function index(): Response
    {
        $kategoris = KategoriBarang::query()
            ->withCount('inventariss')
            ->orderBy('kode')
            ->get();

        return Inertia::render('Rt/Kategori/Index', [
            'kategoris' => $kategoris,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validasi($request);

        KategoriBarang::create($validated);

        return back()->with('sukses', 'Kategori barang ditambahkan.');
    }

    public function update(Request $request, KategoriBarang $kategori): RedirectResponse
    {
        $validated = $this->validasi($request, $kategori);

        $kategori->update($validated);

        return back()->with('sukses', 'Kategori barang diperbarui.');
    }

    public function destroy(KategoriBarang $kategori): RedirectResponse
    {
        abort_if($kategori->inventariss()->exists(), 422, 'Kategori masih dipakai oleh barang.');

        $kategori->delete();

        return back()->with('sukses', 'Kategori barang dihapus.');
    }

    protected function validasi(Request $request, ?KategoriBarang $kategori = null): array
    {
        $kodeUnik = $kategori
            ? 'required|string|size:1|unique:kategori_barangs,kode,'.$kategori->id
            : 'required|string|size:1|unique:kategori_barangs,kode';

        return $request->validate([
            'kode' => $kodeUnik,
            'nama' => ['required', 'string', 'max:100'],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ]);
    }
}
