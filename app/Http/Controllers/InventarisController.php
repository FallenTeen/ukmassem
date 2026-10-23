<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\InventarisLog;
use App\Models\KategoriBarang;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InventarisController extends Controller
{
    public function index(Request $request): Response
    {
        $cari = $request->string('cari')->toString();
        $kategori = $request->string('kategori')->toString();
        $kondisi = $request->string('kondisi')->toString();
        $status = $request->string('status')->toString();

        $inventariss = Inventaris::query()
            ->with('kategori')
            ->when($cari !== '', fn ($q) => $q->where(fn ($w) => $w
                ->where('nama_barang', 'like', "%{$cari}%")
                ->orWhere('kode', 'like', "%{$cari}%")))
            ->when($kategori !== '', fn ($q) => $q->where('kategori_barang_id', $kategori))
            ->when($kondisi !== '', fn ($q) => $q->where('kondisi', $kondisi))
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->orderBy('kode')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Rt/Inventaris/Index', [
            'inventariss' => $inventariss,
            'kategoris' => $this->daftarKategori(),
            'filters' => [
                'cari' => $cari,
                'kategori' => $kategori,
                'kondisi' => $kondisi,
                'status' => $status,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Rt/Inventaris/Create', [
            'kategoris' => $this->daftarKategori(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validasi($request);

        $kategori = KategoriBarang::query()->findOrFail($validated['kategori_barang_id']);

        $inventaris = Inventaris::create([
            ...$validated,
            'kode' => $this->kodeBaru($kategori),
            'status' => 'tersedia',
            'foto' => $request->file('foto')?->store('inventaris', 'public'),
            'created_by' => $request->user()->id,
        ]);

        $this->tulisLog($inventaris, 'masuk', $request->user()->id, 'Barang masuk ke daftar inventaris.');

        return to_route('inventaris.show', $inventaris)
            ->with('sukses', 'Barang berhasil didaftarkan.');
    }

    public function show(Request $request, Inventaris $inventari): Response
    {
        $inventari->load(['kategori', 'logs.user', 'logs.peminjaman', 'creator']);

        return Inertia::render('Rt/Inventaris/Show', [
            'inventaris' => $inventari,
        ]);
    }

    public function edit(Inventaris $inventari): Response
    {
        $inventari->load('kategori');

        return Inertia::render('Rt/Inventaris/Edit', [
            'inventaris' => $inventari,
            'kategoris' => $this->daftarKategori(),
        ]);
    }

    public function update(Request $request, Inventaris $inventari): RedirectResponse
    {
        abort_if($inventari->status === 'dipinjam', 422, 'Barang sedang dipinjam, pulangkan bila sudah kembali.');

        $validated = $this->validasi($request, $inventari);

        $kategoriGanti = $validated['kategori_barang_id'] !== $inventari->kategori_barang_id;

        $inventari->update([
            ...$validated,
            ...( $kategoriGanti ? ['kode' => $this->kodeBaru(KategoriBarang::query()->findOrFail($validated['kategori_barang_id']))] : []),
        ]);

        if ($request->file('foto')) {
            if ($inventari->foto) {
                Storage::disk('public')->delete($inventari->foto);
            }
            $inventari->update(['foto' => $request->file('foto')->store('inventaris', 'public')]);
        }

        $this->tulisLog($inventari, 'kondisi', $request->user()->id, 'Data barang diperbarui.'.($kategoriGanti ? " Kode baru: {$inventari->kode}." : ''));

        return to_route('inventaris.show', $inventari)
            ->with('sukses', 'Barang berhasil diperbarui.');
    }

    public function togglePinjam(Request $request, Inventaris $inventari): RedirectResponse
    {
        $baru = ! $inventari->boleh_dipinjam;

        $inventari->update(['boleh_dipinjam' => $baru]);

        $this->tulisLog($inventari, 'kondisi', $request->user()->id, $baru
            ? 'Barang diaktifkan untuk dipinjam.'
            : 'Barang dinonaktifkan untuk dipinjam.');

        $pesan = $baru
            ? 'Barang diaktifkan untuk dipinjam (masuk katalog publik).'
            : 'Barang dinonaktifkan untuk dipinjam (keluar katalog publik).';

        return back()->with('sukses', $pesan);
    }

    public function destroy(Request $request, Inventaris $inventari): RedirectResponse
    {
        abort_if($inventari->status === 'dipinjam', 422, 'Barang sedang dipinjam, tidak bisa dihapus.');

        if ($inventari->foto) {
            Storage::disk('public')->delete($inventari->foto);
        }

        $inventari->delete();

        return to_route('inventaris.index')->with('sukses', 'Barang dihapus dari inventaris.');
    }

    public function adjust(Request $request, Inventaris $inventari): RedirectResponse
    {
        $validated = $request->validate([
            'aksi' => ['required', 'in:kondisi,perbaikan,hilang'],
            'kondisi' => ['nullable', 'in:'.implode(',', Inventaris::KONDISI)],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();

        if ($validated['aksi'] === 'kondisi') {
            $kondisiLama = $inventari->kondisi;
            $kondisiBaru = $validated['kondisi'] ?? $inventari->kondisi;

            $inventari->update(['kondisi' => $kondisiBaru]);

            if ($inventari->status === 'perbaikan' && $kondisiBaru === 'bagus') {
                $inventari->update(['status' => 'tersedia']);
            }

            $this->tulisLog($inventari, 'kondisi', $user->id, "Kondisi diubah: {$kondisiLama} → {$kondisiBaru}.");
        } elseif ($validated['aksi'] === 'perbaikan') {
            abort_if($inventari->status === 'dipinjam', 422, 'Barang sedang dipinjam.');

            $inventari->update(['status' => 'perbaikan']);
            $this->tulisLog($inventari, 'perbaikan', $user->id, $validated['keterangan'] ?? 'Barang dikondisikan ke perbaikan.');
        } else {
            $inventari->update(['status' => 'hilang']);
            $this->tulisLog($inventari, 'hilang', $user->id, $validated['keterangan'] ?? 'Barang tercatat hilang.');
        }

        return back()->with('sukses', 'Perubahan tersimpan.');
    }

    protected function daftarKategori(): array
    {
        return KategoriBarang::query()
            ->withCount('inventariss')
            ->orderBy('kode')
            ->get()
            ->all();
    }

    protected function kodeBaru(KategoriBarang $kategori): string
    {
        $polos = Inventaris::query()
            ->where('kategori_barang_id', $kategori->id)
            ->orderBy('kode')
            ->get(['kode']);

        $nomor = 0;
        $dipakai = $polos->pluck('kode')->all();

        do {
            $nomor++;
            $kode = $kategori->kode.'-'.str_pad((string) $nomor, 3, '0', STR_PAD_LEFT);
        } while (in_array($kode, $dipakai, true));

        return $kode;
    }

    protected function validasi(Request $request, ?Inventaris $inventari = null): array
    {
        $validated = $request->validate([
            'kategori_barang_id' => ['required', 'integer', 'exists:kategori_barangs,id'],
            'nama_barang' => ['required', 'string', 'max:255'],
            'kondisi' => ['nullable', 'in:'.implode(',', Inventaris::KONDISI)],
            'harga_sewa' => ['nullable', 'numeric', 'min:0'],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'foto' => ['nullable', 'image', 'max:8192'],
        ]);

        $validated['kondisi'] ??= $inventari?->kondisi ?? 'bagus';
        $validated['boleh_dipinjam'] = $request->has('boleh_dipinjam')
            ? $request->boolean('boleh_dipinjam')
            : ($inventari?->boleh_dipinjam ?? true);

        return $validated;
    }

    protected function tulisLog(Inventaris $inventari, string $tipe, ?int $userId, ?string $keterangan = null): void
    {
        InventarisLog::create([
            'inventaris_id' => $inventari->id,
            'user_id' => $userId,
            'tipe' => $tipe,
            'keterangan' => $keterangan,
        ]);
    }
}
