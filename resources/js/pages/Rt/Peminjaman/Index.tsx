import { Head, Link, router } from '@inertiajs/react';
import { Inbox } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterTableLayout from '@/components/filter-table-layout';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Paginator } from '@/types/anggota';
import {
    LABEL_SIFAT,
    LABEL_STATUS_PINJAM,
    type PeminjamanDetail,
    type SifatPinjam,
    VARIANT_STATUS_PINJAM,
} from '../types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Peminjaman', href: '/peminjaman' },
];

interface IndexProps {
    peminjamen: Paginator<PeminjamanDetail>;
    filters: {
        status: string;
        sifat: string;
        cari: string;
    };
    jumlahMenunggu: number;
}

const formatTanggal = (value: string | null) =>
    value ? new Date(value).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-';

export default function Index({ peminjamen, filters, jumlahMenunggu }: IndexProps) {
    const [status, setStatus] = useState(filters.status ?? '');
    const [sifat, setSifat] = useState(filters.sifat ?? '');
    const [cari, setCari] = useState(filters.cari ?? '');

    const terapkan = () => {
        router.get(
            '/peminjaman',
            {
                status: status || undefined,
                sifat: sifat || undefined,
                cari: cari || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const halamanBerkas = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peminjaman Barang" />

            <div className="flex flex-col gap-4 p-4 md:h-[calc(100vh-4rem)]">
                <div className="flex shrink-0 items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Peminjaman Barang</h1>
                        <p className="text-sm text-muted-foreground">
                            Total {peminjamen.total} catatan peminjaman.
                        </p>
                    </div>
                    <Link href="/peminjaman/create">
                        <Button type="button" size="sm">
                            Catat Peminjaman
                        </Button>
                    </Link>
                </div>

                <FilterTableLayout
                    filterLabel="Filter Peminjaman"
                    filterBody={
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="Pinjam-cari">Cari</Label>
                                <Input
                                    id="Pinjam-cari"
                                    placeholder="Nama, asal, atau kode"
                                    value={cari}
                                    onChange={(e) => setCari(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua status</SelectItem>
                                        <SelectItem value="menunggu">
                                            Menunggu{jumlahMenunggu > 0 ? ` (${jumlahMenunggu})` : ''}
                                        </SelectItem>
                                        <SelectItem value="dipinjam">Dipinjam</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                        <SelectItem value="batal">Batal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Sifat</Label>
                                <Select value={sifat || 'all'} onValueChange={(value) => setSifat(value === 'all' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua sifat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua sifat</SelectItem>
                                        <SelectItem value="anggota_amikom">Anggota Amikom</SelectItem>
                                        <SelectItem value="eksternal">Eksternal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="button" className="flex-1" onClick={terapkan}>
                                    Terapkan
                                </Button>
                            </div>
                        </>
                    }
                    table={
                        <>
                            <div className="min-h-0 flex-1 overflow-auto rounded-lg border bg-background">
                                <table className="w-full min-w-[860px] text-left text-sm">
                                    <thead className="sticky top-0 z-10 border-b bg-muted text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-2">Kode</th>
                                            <th className="px-4 py-2">Peminjam</th>
                                            <th className="px-4 py-2">Sifat</th>
                                            <th className="px-4 py-2">Pinjam</th>
                                            <th className="px-4 py-2">Rencana Kembali</th>
                                            <th className="px-4 py-2">Unit</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {peminjamen.data.length === 0 && (
                                            <tr>
                                                <td className="px-4 py-6 text-center text-sm text-muted-foreground" colSpan={8}>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Inbox className="h-5 w-5" />
                                                        Tidak ada catatan peminjaman.
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {peminjamen.data.map((pinjam) => (
                                            <tr key={pinjam.id} className="border-b last:border-0 hover:bg-muted/40">
                                                <td className="px-4 py-3 font-mono text-xs">{pinjam.kode}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">{pinjam.nama_peminjam}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {pinjam.asal_organisasi || pinjam.kontak}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs">{pinjam.sifat ? LABEL_SIFAT[pinjam.sifat] : '-'}</td>
                                                <td className="px-4 py-3 text-xs">{formatTanggal(pinjam.tanggal_pinjam)}</td>
                                                <td className="px-4 py-3 text-xs">
                                                    {pinjam.status === 'selesai' ? formatTanggal(pinjam.dikembalikan) : formatTanggal(pinjam.rencana_kembali)}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {(pinjam.items ?? []).length} unit
                                                    {pinjam.status === 'dipinjam' &&
                                                        ` · ${(pinjam.items ?? []).filter((item) => !item.kembali).length} belum kembali`}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={VARIANT_STATUS_PINJAM[pinjam.status]} className="text-xs">
                                                        {LABEL_STATUS_PINJAM[pinjam.status] ?? pinjam.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right text-xs">
                                                    <Link href={`/peminjaman/${pinjam.id}`} className="font-medium text-primary hover:underline">
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex shrink-0 flex-col items-center justify-between gap-3 pt-4 text-xs text-muted-foreground md:flex-row">
                                <div>
                                    Menampilkan {peminjamen.from ?? 0} - {peminjamen.to ?? 0} dari {peminjamen.total} catatan
                                </div>
                                <div className="flex flex-wrap items-center gap-1">
                                    {peminjamen.links.map((link, index) => {
                                        const isDisabled = link.url === null;
                                        const label =
                                            link.label === '&laquo; Previous'
                                                ? '«'
                                                : link.label === 'Next &raquo;'
                                                  ? '»'
                                                  : link.label;

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                disabled={isDisabled}
                                                onClick={() => halamanBerkas(link.url)}
                                                className={`min-w-8 rounded border px-2 py-1 text-xs ${
                                                    link.active
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-gray-200 bg-background text-foreground hover:bg-muted'
                                                } ${isDisabled ? 'opacity-50' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: label }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    }
                />
            </div>
        </AppLayout>
    );
}
