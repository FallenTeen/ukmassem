import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Wrench } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SwitchToggle from '@/components/ui/switch-toggle';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    fotoUrl,
    LABEL_KONDISI,
    LABEL_STATUS_BARANG,
    type InventarisItem,
    VARIANT_KONDISI,
    VARIANT_STATUS_BARANG,
} from '../types';

const LABEL_LOG: Record<string, string> = {
    masuk: 'Masuk',
    pinjam: 'Dipinjam',
    kembali: 'Kembali',
    kondisi: 'Perubahan',
    perbaikan: 'Perbaikan',
    hilang: 'Hilang',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventaris', href: '/inventaris' },
    { title: 'Detail Barang', href: '' },
];

export default function Show({ inventaris }: { inventaris: InventarisItem }) {
    const [kondisi, setKondisi] = useState<'bagus' | 'rusak_ringan' | 'rusak_berat'>(inventaris.kondisi);
    const [keterangan, setKeterangan] = useState('');
    const [processing, setProcessing] = useState(false);

    const foto = fotoUrl(inventaris.foto);

    const aksi = (namaAksi: 'kondisi' | 'perbaikan' | 'hilang') => {
        setProcessing(true);
        router.post(
            `/inventaris/${inventaris.id}/adjust`,
            {
                aksi: namaAksi,
                ...(namaAksi === 'kondisi' ? { kondisi: kondisi } : {}),
                keterangan: keterangan || undefined,
            },
            {
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Barang ${inventaris.kode}`} />

            <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="flex flex-wrap items-center gap-3 text-lg font-semibold">
                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-sm">{inventaris.kode}</span>
                        {inventaris.nama_barang}
                        <Badge variant={VARIANT_STATUS_BARANG[inventaris.status]} className="text-xs">
                            {LABEL_STATUS_BARANG[inventaris.status]}
                        </Badge>
                        <Badge variant={VARIANT_KONDISI[inventaris.kondisi]} className="text-xs">
                            {LABEL_KONDISI[inventaris.kondisi]}
                        </Badge>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {inventaris.kategori ? `${inventaris.kategori.kode} - ${inventaris.kategori.nama}` : 'Tanpa kategori'}
                        {inventaris.lokasi ? ` · ${inventaris.lokasi}` : ''}
                    </p>
                </div>
                <Link href={`/inventaris/${inventaris.id}/edit`}>
                    <Button type="button" size="sm">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Barang
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="space-y-4">
                    <div className="rounded-lg border bg-background p-4">
                        <h2 className="mb-3 text-sm font-semibold">Detail Unit</h2>
                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">Boleh dipinjam?</dt>
                                <dd className="flex items-center gap-2">
                                    <span className="font-medium">{inventaris.boleh_dipinjam ? 'Ya (masuk katalog)' : 'Tidak'}</span>
                                    <SwitchToggle
                                        checked={inventaris.boleh_dipinjam}
                                        disabled={processing}
                                        onCheckedChange={() =>
                                            router.post(`/inventaris/${inventaris.id}/toggle-pinjam`, {}, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
                                        }
                                    />
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">Harga sewa</dt>
                                <dd className="font-medium">
                                    {inventaris.harga_sewa ? `Rp ${Number(inventaris.harga_sewa).toLocaleString('id-ID')}` : 'Gratis'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">Lokasi</dt>
                                <dd className="font-medium">{inventaris.lokasi || '-'}</dd>
                            </div>
                            {inventaris.catatan && (
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Catatan</dt>
                                    <dd className="max-w-md text-right font-medium">{inventaris.catatan}</dd>
                                </div>
                            )}
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">Dicatat oleh</dt>
                                <dd className="font-medium">{inventaris.creator?.name ?? '-'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg border bg-background">
                        <div className="border-b px-4 py-3 text-sm font-semibold">Riwayat Mutasi</div>
                        <ul className="divide-y">
                            {(inventaris.logs ?? []).length === 0 && (
                                <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                                    Belum ada riwayat mutasi.
                                </li>
                            )}
                            {(inventaris.logs ?? []).map((log) => (
                                <li key={log.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{LABEL_LOG[log.tipe] ?? log.tipe}</span>
                                        <span className="text-xs text-muted-foreground">{log.keterangan ?? '-'}</span>
                                    </div>
                                    <div className="text-right text-xs text-muted-foreground">
                                        <div>{log.user?.name ?? '-'}</div>
                                        <div>{new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-lg border bg-background p-4">
                        <h2 className="text-sm font-semibold">Aksi RT</h2>
                        {foto && (
                            <img src={foto} alt={inventaris.nama_barang} className="mb-3 mt-2 aspect-square w-full rounded-md object-cover" />
                        )}
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="kondisi-barang">Kondisi Terbaru</Label>
                                <SelectionKondisi value={kondisi} onChange={setKondisi} />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="keterangan-barang" className="text-sm font-medium leading-none">Catatan</label>
                                <Input id="keterangan-barang" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} placeholder="Opsional" />
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <Button type="button" variant="outline" className="w-full" onClick={() => aksi('kondisi')} disabled={processing}>
                                Simpan Kondisi ({LABEL_KONDISI[kondisi]})
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => aksi('perbaikan')}
                                disabled={processing || inventaris.status === 'dipinjam'}
                            >
                                <Wrench className="mr-2 h-4 w-4" />
                                Kirim ke Perbaikan
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                className="w-full"
                                onClick={() => aksi('hilang')}
                                disabled={processing || inventaris.status === 'hilang'}
                            >
                                Tandai Hilang
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </AppLayout>
    );
}

function SelectionKondisi({
    value,
    onChange,
}: {
    value: 'bagus' | 'rusak_ringan' | 'rusak_berat';
    onChange: (next: 'bagus' | 'rusak_ringan' | 'rusak_berat') => void;
}) {
    return (
        <Select value={value} onValueChange={(v) => onChange(v as 'bagus' | 'rusak_ringan' | 'rusak_berat')}>
            <SelectTrigger id="kondisi-barang">
                <SelectValue placeholder="Pilih kondisi" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="bagus">Bagus</SelectItem>
                <SelectItem value="rusak_ringan">Rusak Ringan</SelectItem>
                <SelectItem value="rusak_berat">Rusak Berat</SelectItem>
            </SelectContent>
        </Select>
    );
}
