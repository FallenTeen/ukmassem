import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FilterTableLayout from '@/components/filter-table-layout';
import AppLayout from '@/layouts/app-layout';
import SwitchToggle from '@/components/ui/switch-toggle';
import { type BreadcrumbItem } from '@/types';
import { type Paginator } from '@/types/anggota';
import {
    LABEL_KONDISI,
    LABEL_STATUS_BARANG,
    type InventarisItem,
    type KategoriBarang,
    VARIANT_KONDISI,
    VARIANT_STATUS_BARANG,
} from '../types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventaris',
        href: '/inventaris',
    },
];

interface IndexProps {
    inventariss: Paginator<InventarisItem>;
    kategoris: KategoriBarang[];
    filters: {
        cari: string;
        kategori: string;
        kondisi: string;
        status: string;
    };
}

export default function Index({ inventariss, kategoris, filters }: IndexProps) {
    const [cari, setCari] = useState(filters.cari ?? '');
    const [kategori, setKategori] = useState(filters.kategori ?? '');
    const [kondisi, setKondisi] = useState(filters.kondisi);
    const [status, setStatus] = useState(filters.status);
    const [loading, setLoading] = useState(false);
    const [gantiPinjam, setGantiPinjam] = useState<number | null>(null);

    const selectKategori = kategori === '' ? 'all' : kategori;

    const terapkan = () => {
        setLoading(true);
        router.get(
            '/inventaris',
            {
                cari: cari || undefined,
                kategori: kategori || undefined,
                kondisi: kondisi || undefined,
                status: status || undefined,
            },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false),
                onError: () => setLoading(false),
            },
        );
    };

    const halamanBerkas = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventaris Barang" />

            <div className="flex flex-col gap-4 p-4 md:h-[calc(100vh-4rem)]">
                <div className="flex shrink-0 items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Inventaris Barang</h1>
                        <p className="text-sm text-muted-foreground">
                            Total {inventariss.total} unit barang terdaftar di sekretariat.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/peminjaman/create">
                            <Button type="button" size="sm" variant="outline">
                                Catat Peminjaman
                            </Button>
                        </Link>
                        <Link href="/inventaris/create">
                            <Button type="button" size="sm">
                                Tambah Barang
                            </Button>
                        </Link>
                    </div>
                </div>

                <FilterTableLayout
                    filterLabel="Filter Barang"
                    filterBody={
                        <>
                            <div className="space-y-1">
                                <Label htmlFor="inventariss-cari">Cari</Label>
                                <Input
                                    id="inventariss-cari"
                                    placeholder="Nama atau kode barang"
                                    value={cari}
                                    onChange={(e) => setCari(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Kategori</Label>
                                <Select
                                    value={selectKategori}
                                    onValueChange={(value) =>
                                        setKategori(value === 'all' ? '' : value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua kategori</SelectItem>
                                        {kategoris.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.kode} - {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Kondisi</Label>
                                <Select value={kondisi || 'all'} onValueChange={(value) => setKondisi(value === 'all' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua kondisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua kondisi</SelectItem>
                                        <SelectItem value="bagus">Bagus</SelectItem>
                                        <SelectItem value="rusak_ringan">Rusak Ringan</SelectItem>
                                        <SelectItem value="rusak_berat">Rusak Berat</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua status</SelectItem>
                                        <SelectItem value="tersedia">Tersedia</SelectItem>
                                        <SelectItem value="dipinjam">Dipinjam</SelectItem>
                                        <SelectItem value="perbaikan">Perbaikan</SelectItem>
                                        <SelectItem value="hilang">Hilang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="button" className="flex-1" onClick={terapkan} disabled={loading}>
                                    Terapkan
                                </Button>
                            </div>
                        </>
                    }
                    table={
                        <>
                            <div className="min-h-0 flex-1 overflow-auto rounded-lg border bg-background">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead className="sticky top-0 z-10 border-b bg-muted text-xs uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-4 py-2">Kode</th>
                                            <th className="px-4 py-2">Barang</th>
                                            <th className="px-4 py-2">Kategori</th>
                                            <th className="px-4 py-2">Kondisi</th>
                                            <th className="px-4 py-2">Status</th>
                                            <th className="px-4 py-2">Pinjam</th>
                                            <th className="px-4 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventariss.data.length === 0 && (
                                            <tr>
                                                <td className="px-4 py-6 text-center text-sm text-muted-foreground" colSpan={7}>
                                                    Tidak ada unit barang yang cocok.
                                                </td>
                                            </tr>
                                        )}
                                        {inventariss.data.map((item) => (
                                                <tr key={item.id} className="border-b last:border-0 hover:bg-muted/40">
                                                    <td className="px-4 py-3 font-mono text-xs">{item.kode}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarFallback className="bg-primary/10 text-xs font-semibold uppercase text-primary">
                                                                    {item.nama_barang.slice(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium">{item.nama_barang}</span>
                                                                <span className="text-xs text-muted-foreground">{item.lokasi || 'Tanpa lokasi'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {item.kategori ? `${item.kategori.kode} - ${item.kategori.nama}` : '-'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={VARIANT_KONDISI[item.kondisi]} className="text-xs">
                                                            {LABEL_KONDISI[item.kondisi] ?? item.kondisi}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={VARIANT_STATUS_BARANG[item.status]} className="text-xs">
                                                            {LABEL_STATUS_BARANG[item.status] ?? item.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <SwitchToggle
                                                                checked={item.boleh_dipinjam}
                                                                disabled={loading}
                                                                onCheckedChange={() => {
                                                                    setGantiPinjam(item.id);
                                                                    router.post(`/inventaris/${item.id}/toggle-pinjam`, {}, {
                                                                        preserveState: true,
                                                                        preserveScroll: true,
                                                                        onFinish: () => setGantiPinjam(null),
                                                                        onError: () => setGantiPinjam(null),
                                                                    });
                                                                }}
                                                            />
                                                            <span className={`text-xs ${gantiPinjam === item.id ? 'animate-pulse' : ''}`}>
                                                                {item.boleh_dipinjam ? 'Boleh' : 'Tertutup'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-xs">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/inventaris/${item.id}`} className="font-medium text-primary hover:underline">
                                                                Detail
                                                            </Link>
                                                            <Link href={`/inventaris/${item.id}/edit`} className="font-medium text-amber-600 hover:underline">
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex shrink-0 flex-col items-center justify-between gap-3 pt-4 text-xs text-muted-foreground md:flex-row">
                                <div>
                                    Menampilkan {inventariss.from ?? 0} - {inventariss.to ?? 0} dari {inventariss.total} unit
                                </div>
                                <div className="flex flex-wrap items-center gap-1">
                                    {inventariss.links.map((link, index) => {
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
