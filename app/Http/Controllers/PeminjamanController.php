<?php

namespace App\Http\Controllers;

use App\Models\Inventaris;
use App\Models\InventarisLog;
use App\Models\Peminjaman;
use App\Models\PeminjamanItem;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PeminjamanController extends Controller
{
    public function pengaturan(): Response
    {
        return Inertia::render('Rt/Pengaturan/Index', [
            'waNama' => SiteSetting::nilai(KatalogPublikController::WA_NAMA),
            'waNomor' => SiteSetting::nilai(KatalogPublikController::WA_NOMOR),
            'pricelistAktif' => SiteSetting::aktif(SiteSetting::INVENTARIS_PRICELIST, true),
        ]);
    }

    public function simpanPengaturan(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'wa_nama' => ['required', 'string', 'max:100'],
            'wa_nomor' => ['required', 'string', 'min:8', 'max:20', 'regex:/^[0-9+\\s-]+$/'],
            'pricelist_aktif' => ['nullable', 'boolean'],
        ]);

        SiteSetting::set(KatalogPublikController::WA_NAMA, $validated['wa_nama']);
        SiteSetting::set(KatalogPublikController::WA_NOMOR, preg_replace('/[^0-9]/', '', $validated['wa_nomor']));
        SiteSetting::set(SiteSetting::INVENTARIS_PRICELIST, $request->boolean('pricelist_aktif') ? '1' : '0');

        return back()->with('sukses', 'Pengaturan peminjaman tersimpan.');
    }

    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $sifat = $request->string('sifat')->toString();
        $cari = $request->string('cari')->toString();

        $peminjamen = Peminjaman::query()
            ->with(['items.inventaris', 'pengaju', 'penyetuju'])
            ->when($status !== '', fn ($q) => $q->where('status', $status))
            ->when($sifat !== '', fn ($q) => $q->where('sifat', $sifat))
            ->when($cari !== '', fn ($q) => $q->where(fn ($w) => $w
                ->where('nama_peminjam', 'like', "%{$cari}%")
                ->orWhere('asal_organisasi', 'like', "%{$cari}%")
                ->orWhere('kode', 'like', "%{$cari}%")))
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Rt/Peminjaman/Index', [
            'peminjamen' => $peminjamen,
            'filters' => [
                'status' => $status,
                'sifat' => $sifat,
                'cari' => $cari,
            ],
            'jumlahMenunggu' => Peminjaman::query()->where('status', 'menunggu')->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Rt/Peminjaman/Create', [
            'barang' => $this->daftarBarang(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validasi($request);

        abort_unless($request->boolean('langsung_pinjam') === true, 422, 'Peminjaman langsung harus dicentang.');

        $peminjaman = DB::transaction(function () use ($validated, $request) {
            $peminjaman = Peminjaman::create([
                ...$validated,
                'status' => 'dipinjam',
                'disetujui_oleh' => $request->user()->id,
            ]);

            foreach ($validated['inventaris_ids'] as $id) {
                $peminjaman->items()->create([
                    'inventaris_id' => $id,
                ]);

                $unit = Inventaris::query()->findOrFail($id);
                $unit->update(['status' => 'dipinjam']);

                $this->tulisLog($unit, 'pinjam', $request->user()->id, "Pinjamin manual: {$peminjaman->kode} ({$peminjaman->nama_peminjam}).");
            }

            return $peminjaman;
        });

        return to_route('peminjaman.show', $peminjaman)
            ->with('sukses', 'Peminjaman langsung tercatat dengan kode '.$peminjaman->kode.'.');
    }

    public function show(Request $request, Peminjaman $peminjaman): Response
    {
        $peminjaman->load(['items.inventaris.kategori', 'pengaju', 'penyetuju']);

        return Inertia::render('Rt/Peminjaman/Show', [
            'peminjaman' => $peminjaman,
        ]);
    }

    public function setujui(Request $request, Peminjaman $peminjaman): RedirectResponse
    {
        abort_unless($peminjaman->status === 'menunggu', 422, 'Pengajuan tidak sedang menunggu persetujuan.');

        $validated = $request->validate([
            'catatan_rt' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($peminjaman, $validated, $request) {
            $unitTersedia = Inventaris::query()
                ->whereIn('id', $peminjaman->items()->pluck('inventaris_id'))
                ->where('status', 'tersedia')
                ->where('boleh_dipinjam', true)
                ->count();

            abort_if($unitTersedia !== $peminjaman->items()->count(), 422,
                'Ada unit barang yang sudah tidak layak dipinjam (dikembalikan, rusak, atau nonaktif untuk dipinjam).');

            $peminjaman->update([
                'status' => 'dipinjam',
                'disetujui_oleh' => $request->user()->id,
                'catatan_rt' => $validated['catatan_rt'] ?? null,
            ]);

            foreach ($peminjaman->items as $item) {
                $unit = Inventaris::query()->findOrFail($item->inventaris_id);

                $unit->update(['status' => 'dipinjam']);

                $this->tulisLog($unit, 'pinjam', $request->user()->id, "Peminjaman {$peminjaman->kode} disetujui.");
            }
        });

        return back()->with('sukses', 'Pengajuan disetujui dan barang diserahkan.');
    }

    public function tolak(Request $request, Peminjaman $peminjaman): RedirectResponse
    {
        abort_unless($peminjaman->status === 'menunggu', 422, 'Pengajuan tidak sedang menunggu persetujuan.');

        $validated = $request->validate([
            'catatan_rt' => ['nullable', 'string', 'max:1000'],
        ]);

        $peminjaman->update([
            'status' => 'ditolak',
            'catatan_rt' => $validated['catatan_rt'] ?? null,
            'disetujui_oleh' => $request->user()->id,
        ]);

        return back()->with('sukses', 'Pengajuan ditolak.');
    }

    public function kembalikan(Request $request, Peminjaman $peminjaman): RedirectResponse
    {
        abort_unless($peminjaman->status === 'dipinjam', 422, 'Pengajuan ini tidak sedang dipinjam.');

        $validated = $request->validate([
            'item_ids' => ['required', 'array', 'min:1'],
            'item_ids.*' => ['integer', 'exists:peminjaman_items,id'],
            'kondisi' => ['nullable', 'in:'.implode(',', Inventaris::KONDISI)],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ]);

        $sisa = DB::transaction(function () use ($peminjaman, $validated, $request) {
            $items = PeminjamanItem::query()
                ->whereIn('id', $validated['item_ids'])
                ->where('peminjaman_id', $peminjaman->id)
                ->where('kembali', false)
                ->get();

            $kondisiBaru = $validated['kondisi'] ?? 'bagus';

            foreach ($items as $item) {
                $unit = Inventaris::query()->findOrFail($item->inventaris_id);

                $statusAkhir = $kondisiBaru === 'rusak_berat' ? 'perbaikan' : 'tersedia';

                $unit->update([
                    'status' => $statusAkhir,
                    'kondisi' => $kondisiBaru,
                ]);

                $item->update(['kembali' => true, 'catatan' => trim(($item->catatan.'; catatan pengembalian: kondisi '.$kondisiBaru), ' ;')]);

                $this->tulisLog($unit, 'kembali', $request->user()->id, "Barang kembali dari peminjaman {$peminjaman->kode}, kondisi: {$kondisiBaru}.");
            }

            $sisaItem = PeminjamanItem::query()
                ->where('peminjaman_id', $peminjaman->id)
                ->where('kembali', false)
                ->count();

            if ($sisaItem === 0) {
                $peminjaman->update([
                    'status' => 'selesai',
                    'dikembalikan' => now()->toDateString(),
                ]);
            }

            return $sisaItem;
        });

        $pesan = $sisa === 0
            ? 'Semua barang dikembalikan, peminjaman selesai.'
            : "{$sisa} unit masih dipinjam.";

        return back()->with('sukses', $pesan);
    }

    public function batal(Request $request, Peminjaman $peminjaman): RedirectResponse
    {
        if ($peminjaman->status === 'dipinjam') {
            abort(422, 'Barang sedang dipinjam, tidak bisa dibatalkan. Gunakan menu pengembalian.');
        }

        if ($peminjaman->status !== 'menunggu') {
            abort(422, 'Hanya pengajuan berstatus menunggu yang bisa dibatalkan.');
        }

        $peminjaman->update([
            'status' => 'batal',
            'disetujui_oleh' => $request->user()->id,
        ]);

        return back()->with('sukses', 'Pengajuan dibatalkan.');
    }

    public function destroy(Peminjaman $peminjaman): RedirectResponse
    {
        abort_unless(in_array($peminjaman->status, ['selesai', 'ditolak', 'batal'], true), 422,
            'Hanya catatan peminjaman selesai/ditolak/batal yang bisa dihapus.');

        $peminjaman->delete();

        return to_route('peminjaman.index')->with('sukses', 'Catatan peminjaman dihapus.');
    }

    protected function daftarBarang()
    {
        $barang = Inventaris::query()
            ->untukKatalog()
            ->with('kategori:id,kode,nama')
            ->orderBy('kode')
            ->get(['id', 'kode', 'nama_barang', 'kondisi', 'kategori_barang_id', 'harga_sewa', 'lokasi', 'foto', 'kondisi']);

        $mendatang = PeminjamanItem::query()
            ->whereIn('inventaris_id', $barang->pluck('id'))
            ->where('kembali', false)
            ->whereHas('peminjaman', fn ($q) => $q->whereIn('status', ['menunggu', 'dipinjam']))
            ->with(['peminjaman:id,kode,nama_peminjam,tanggal_pinjam,rencana_kembali,status'])
            ->get();

        $terkelompok = $mendatang
            ->filter(fn ($item) => $item->peminjaman !== null)
            ->groupBy('inventaris_id');

        $hariIni = now()->toDateString();

        return $barang->map(function ($unit) use ($terkelompok, $hariIni) {
            $unit->peminjaman_mendatang = ($terkelompok->get($unit->id) ?? collect())
                ->filter(fn ($item) => $item->peminjaman->tanggal_pinjam !== null && $item->peminjaman->tanggal_pinjam->toDateString() >= $hariIni)
                ->sortBy(fn ($item) => $item->peminjaman->tanggal_pinjam->toDateString())
                ->map(fn ($item) => [
                    'kode' => $item->peminjaman->kode,
                    'nama_peminjam' => $item->peminjaman->nama_peminjam,
                    'status' => $item->peminjaman->status,
                    'tanggal_pinjam' => $item->peminjaman->tanggal_pinjam->toDateString(),
                    'rencana_kembali' => $item->peminjaman->rencana_kembali?->toDateString(),
                ])
                ->values()
                ->all();

            return $unit;
        })->all();
    }

    protected function validasi(Request $request): array
    {
        $validated = $request->validate([
            'sifat' => ['required', 'in:'.implode(',', Peminjaman::SIFAT)],
            'nama_peminjam' => ['required', 'string', 'max:255'],
            'asal_organisasi' => ['nullable', 'string', 'max:255'],
            'kontak' => ['required', 'string', 'max:100'],
            'tanggal_pinjam' => ['required', 'date'],
            'rencana_kembali' => ['nullable', 'date', 'after_or_equal:tanggal_pinjam'],
            'catatan' => ['nullable', 'string', 'max:1000'],
            'inventaris_ids' => ['required', 'array', 'min:1'],
            'inventaris_ids.*' => ['integer', 'exists:inventariss,id'],
            'langsung_pinjam' => ['nullable', 'boolean'],
        ]);

        $unitTidakTersedia = Inventaris::query()
            ->whereIn('id', $validated['inventaris_ids'])
            ->whereNot('status', 'tersedia')
            ->count();

        abort_if($unitTidakTersedia !== 0, 422, 'Ada unit barang yang tidak tersedia. Segarkan daftar barangnya.');

        return $validated;
    }

    protected function tulisLog(Inventaris $unit, string $tipe, ?int $userId, ?string $keterangan = null): void
    {
        InventarisLog::create([
            'inventaris_id' => $unit->id,
            'user_id' => $userId,
            'tipe' => $tipe,
            'keterangan' => $keterangan,
        ]);
    }
}
