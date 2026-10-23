import { Head, Link, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    LABEL_SIFAT,
    LABEL_STATUS_PINJAM,
    type KondisiBarang,
    type PeminjamanDetail,
    VARIANT_STATUS_PINJAM,
} from '../types';

const breadcrumbs: (kode: string) => BreadcrumbItem[] = (kode) => [
    { title: 'Peminjaman', href: '/peminjaman' },
    { title: kode, href: '' },
];

const LABEL_LOG: Record<string, string> = {
    masuk: 'Masuk',
    pinjam: 'Dipinjam',
    kembali: 'Kembali',
    kondisi: 'Perubahan',
    perbaikan: 'Perbaikan',
    hilang: 'Hilang',
};

export default function Show({ peminjaman }: { peminjaman: PeminjamanDetail }) {
    const [catatanRt, setCatatanRt] = useState(peminjaman.catatan_rt ?? '');
    const [kondisiItem, setKondisiItem] = useState<{ [itemId: number]: KondisiBarang }>(() => {
        const awal: { [itemId: number]: KondisiBarang } = {};
        (peminjaman.items ?? []).forEach((item) => {
            awal[item.id] = item.inventaris?.kondisi ?? 'bagus';
        });
        return awal;
    });
    const [processing, setProcessing] = useState(false);

    const aksi = (route: string, data: Record<string, unknown> = {}) => {
        setProcessing(true);
        router.post(
            route,
            { ...data, ...(route.includes('setujui') ? { catatan_rt: catatanRt || undefined } : {}) },
            { onFinish: () => setProcessing(false) },
        );
    };

    const semuaUnitAda = (peminjaman.items ?? []).length > 0;
    const unitLayak = (peminjaman.items ?? []).filter((item) => item.inventaris);
    const unitTidakLayak = unitLayak.filter(
        (item) => item.inventaris?.status !== 'tersedia' || !item.inventaris?.boleh_dipinjam,
    );
    const bisaSetujui = peminjaman.status === 'menunggu' && semuaUnitAda && unitTidakLayak.length === 0;
    const adaYangBelumKembali = (peminjaman.items ?? []).some((item) => !item.kembali);

    return (
        <AppLayout breadcrumbs={breadcrumbs(peminjaman.kode)}>
            <Head title={`Peminjaman ${peminjaman.kode}`} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="flex flex-wrap items-center gap-3 text-lg font-semibold">
                            <span className="rounded bg-muted px-2 py-0.5 font-mono text-sm">{peminjaman.kode}</span>
                            {LABEL_STATUS_PINJAM[peminjaman.status] ?? 'Peminjaman'}
                            <Badge variant={VARIANT_STATUS_PINJAM[peminjaman.status]} className="text-xs">
                                {peminjaman.sifat ? LABEL_SIFAT[peminjaman.sifat] : 'Tanpa Sifat'}
                            </Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Diajukan {new Date(peminjaman.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                            {peminjaman.pengaju ? ` oleh ${peminjaman.pengaju.name} (anggota)` : ' dari formulir publik'}
                            {peminjaman.penyetuju ? ` · disetujui ${peminjaman.penyetuju.name}` : ''}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                    <div className="space-y-4">
                        <div className="rounded-lg border bg-background p-4">
                            <h2 className="mb-3 text-sm font-semibold">Data Peminjam</h2>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Nama</dt>
                                    <dd className="font-medium">{peminjaman.nama_peminjam}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Asal organisasi</dt>
                                    <dd className="font-medium">{peminjaman.asal_organisasi || '-'}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Kontak</dt>
                                    <dd className="font-medium">{peminjaman.kontak}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Tanggal pinjam</dt>
                                    <dd className="font-medium">
                                        {new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Rencana kembali</dt>
                                    <dd className="font-medium">
                                        {peminjaman.status === 'selesai'
                                            ? `Sudah dikembalikan ${new Date(peminjaman.dikembalikan ?? peminjaman.tanggal_pinjam).toLocaleDateString('id-ID', { dateStyle: 'long' })}`
                                            : peminjaman.rencana_kembali
                                              ? new Date(peminjaman.rencana_kembali).toLocaleDateString('id-ID', { dateStyle: 'long' })
                                              : '-'}
                                    </dd>
                                </div>
                                {peminjaman.catatan && (
                                    <div className="flex justify-between gap-4">
                                        <dt className="text-muted-foreground">Catatan peminjam</dt>
                                        <dd className="max-w-md text-right font-medium">{peminjaman.catatan}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="rounded-lg border bg-background">
                            <div className="border-b px-4 py-3 text-sm font-semibold">Unit Barang Dipinjam</div>
                            <ul className="divide-y">
                                {(peminjaman.items ?? []).map((item) => (
                                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                                        <div className="flex flex-col gap-0.5">
                                            {item.inventaris ? (
                                                <>
                                                    <span className="font-medium">{item.inventaris.nama_barang}</span>
                                                    <span className="font-mono text-xs text-muted-foreground">
                                                        {item.inventaris.kode} · {item.inventaris.kategori?.nama ?? '-'}
                                                    </span>
                                                    <Link
                                                        href={`/inventaris/${item.inventaris.id}`}
                                                        className="w-fit text-xs text-primary hover:underline"
                                                    >
                                                        Lihat unit
                                                    </Link>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground">Unit telah dihapus.</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {item.kembali ? (
                                                <Badge variant="secondary" className="text-xs">
                                                    Sudah kembali
                                                    {item.catatan ? ` · ${item.catatan}` : ''}
                                                </Badge>
                                            ) : peminjaman.status === 'dipinjam' ? (
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={kondisiItem[item.id]}
                                                        onValueChange={(value) =>
                                                            setKondisiItem((prev) => ({ ...prev, [item.id]: value as KondisiBarang }))
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8 w-36 text-xs">
                                                            <SelectValue placeholder="Kondisi" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="bagus">Bagus</SelectItem>
                                                            <SelectItem value="rusak_ringan">Rusak Ringan</SelectItem>
                                                            <SelectItem value="rusak_berat">Rusak Berat</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        disabled={processing}
                                                        onClick={() =>
                                                            aksi(`/peminjaman/${peminjaman.id}/kembalikan`, {
                                                                item_ids: [item.id],
                                                                kondisi: kondisiItem[item.id],
                                                            })
                                                        }
                                                    >
                                                        Proses Kembali
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Belum dikembalikan</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                                {!semuaUnitAda && (
                                    <li className="px-4 py-6 text-center text-sm text-muted-foreground">Tidak ada unit tercatat.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-lg border bg-background p-4">
                            <h2 className="text-sm font-semibold">Aksi RT</h2>
                            <div className="mt-3 space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="catatan-rt">Catatan RT (opsional)</Label>
                                    <Input
                                        id="catatan-rt"
                                        placeholder="Misal: serahkan di sekretariat jam 3"
                                        value={catatanRt}
                                        onChange={(e) => setCatatanRt(e.target.value)}
                                    />
                                </div>

                                {peminjaman.status === 'menunggu' && (
                                    <div className="flex gap-2">
                                        <Button type="button" className="flex-1" disabled={!bisaSetujui || processing} onClick={() => aksi(`/peminjaman/${peminjaman.id}/setujui`)}>
                                            <Check className="mr-1 h-4 w-4" />
                                            Setujui
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="flex-1"
                                            disabled={processing}
                                            onClick={() => aksi(`/peminjaman/${peminjaman.id}/tolak`)}
                                        >
                                            <X className="mr-1 h-4 w-4" />
                                            Tolak
                                        </Button>
                                    </div>
                                )}
                                {peminjaman.status === 'menunggu' && (!semuaUnitAda || unitTidakLayak.length > 0) && (
                                    <p className="text-xs text-muted-foreground">
                                        {semuaUnitAda
                                            ? `Tidak bisa menyetujui: ${unitTidakLayak.map((item) => item.inventaris?.kode ?? 'unit').join(', ')} sudah tidak layak (status berubah atau nonaktif untuk dipinjam). Batalkan/tolak pengajuan ini atau aktifkan kembali barangnya.`
                                            : 'Tidak bisa menyetujui: unit barang sudah tidak tersedia / dihapus.'}
                                    </p>
                                )}

                                {peminjaman.status === 'dipinjam' && (
                                    <Button type="button" variant="outline" className="w-full" disabled={!adaYangBelumKembali || processing} onClick={() => aksi(`/peminjaman/${peminjaman.id}/kembalikan`, { item_ids: (peminjaman.items ?? []).filter((item) => !item.kembali).map((item) => item.id) })}>
                                        {adaYangBelumKembali ? 'Tandai Semua Kembali' : 'Semua Unit Kembali'}
                                    </Button>
                                )}

                                {peminjaman.status === 'menunggu' && (
                                    <Button type="button" variant="ghost" className="w-full" disabled={processing} onClick={() => aksi(`/peminjaman/${peminjaman.id}/batal`)}>
                                        Batalkan Pengajuan
                                    </Button>
                                )}

                                {(peminjaman.status === 'selesai' || peminjaman.status === 'ditolak' || peminjaman.status === 'batal') && (
                                    <p className="text-xs text-muted-foreground">
                                        Peminjaman sudah selesai diproses; tidak ada aksi lagi.
                                    </p>
                                )}
                            </div>
                        </div>

                        {peminjaman.catatan_rt && (
                            <div className="rounded-lg border bg-background p-4">
                                <h2 className="text-sm font-semibold">Catatan RT Tersimpan</h2>
                                <p className="mt-2 text-sm text-muted-foreground">{peminjaman.catatan_rt}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
