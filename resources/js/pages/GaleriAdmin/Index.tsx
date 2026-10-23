import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    LABEL_JENIS,
    LABEL_STATUS,
    coverUrl,
    formatTanggal,
    type GaleriIndexItem,
    type JenisGaleri,
    type StatusGaleri,
} from '@/pages/Galeri/types';
import type { BreadcrumbItem } from '@/types';
import type { Paginator } from '@/types/anggota';

type StatusFilter = StatusGaleri | '';

interface GaleriAdminIndexProps {
    jenis: JenisGaleri;
    galeris: Paginator<GaleriIndexItem>;
    filters: {
        status: string;
        cari: string;
    };
    bisaKelola: boolean;
    menunggu: number;
}

const JENIS_TAB: { jenis: JenisGaleri; label: string }[] = [
    { jenis: 'kegiatan', label: LABEL_JENIS.kegiatan },
    { jenis: 'pagelaran', label: LABEL_JENIS.pagelaran },
    { jenis: 'karya', label: LABEL_JENIS.karya },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: '', label: 'Semua Status' },
    { value: 'published', label: LABEL_STATUS.published },
    { value: 'draft', label: LABEL_STATUS.draft },
    { value: 'menunggu', label: 'Menunggu' },
    { value: 'ditolak', label: LABEL_STATUS.ditolak },
];

const STATUS_VARIANT: Record<StatusGaleri, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    published: 'default',
    draft: 'secondary',
    menunggu: 'outline',
    ditolak: 'destructive',
};

export default function GaleriAdminIndex({
    jenis,
    galeris,
    filters,
    bisaKelola,
    menunggu,
}: GaleriAdminIndexProps) {
    const [status, setStatus] = useState<StatusFilter>((filters.status as StatusFilter) ?? '');
    const [cari, setCari] = useState(filters.cari ?? '');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Galeri', href: '/galeri-admin' },
    ];

    const terapkanFilter = (jenisBaru?: JenisGaleri, statusBaru?: StatusFilter) => {
        router.get(
            '/galeri-admin',
            {
                jenis: jenisBaru ?? jenis,
                status: (statusBaru ?? status) || undefined,
                cari: cari || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const hapusKonten = (item: GaleriIndexItem) => {
        if (!window.confirm(`Hapus konten "${item.judul}"? Tindakan tidak dapat dibatalkan.`)) {
            return;
        }
        router.delete(`/galeri-admin/${item.id}`, {
            preserveScroll: true,
        });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kelola Galeri — ${LABEL_JENIS[jenis]}`} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">Kelola Galeri</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola konten kegiatan, pagelaran seni, dan karya anggota untuk halaman publik.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {menunggu > 0 && (
                            <Button variant="outline" asChild>
                                <Link href="/galeri-admin/menunggu">
                                    Karya Menunggu
                                    <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                        {menunggu}
                                    </span>
                                </Link>
                            </Button>
                        )}
                        {bisaKelola && (
                            <Button asChild>
                                <Link href="/galeri-admin/create">
                                    + Buat Konten
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {JENIS_TAB.map((tab) => (
                        <button
                            key={tab.jenis}
                            type="button"
                            onClick={() => terapkanFilter(tab.jenis)}
                            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                                tab.jenis === jenis
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="rounded-lg border bg-background p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end">
                        <div className="flex-1 space-y-1">
                            <Label htmlFor="cari">Cari</Label>
                            <Input
                                id="cari"
                                value={cari}
                                onChange={(e) => setCari(e.target.value)}
                                placeholder="Judul atau pembuat"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') terapkanFilter();
                                }}
                            />
                        </div>
                        <div className="w-full space-y-1 md:w-52">
                            <Label>Status</Label>
                            <Select
                                value={status === '' ? 'all' : status}
                                onValueChange={(value) => {
                                    const nextStatus = (value === 'all' ? '' : value) as StatusFilter;
                                    setStatus(nextStatus);
                                    terapkanFilter(undefined, nextStatus);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((option) => (
                                        <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="button" onClick={() => terapkanFilter()}>
                            Cari
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border bg-background">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Konten</th>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Dibuat oleh</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {galeris.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            Belum ada konten untuk kategori ini.
                                        </td>
                                    </tr>
                                )}
                                {galeris.data.map((item) => (
                                    <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-11 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                                                    {coverUrl(item.cover_path) ? (
                                                        <img
                                                            src={coverUrl(item.cover_path) ?? ''}
                                                            alt={item.judul}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{item.judul}</div>
                                                    {jenis === 'karya' && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {item.divisi}
                                                            {item.pembuat ? ` • ${item.pembuat}` : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {formatTanggal(item.tanggal)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={STATUS_VARIANT[item.status as StatusGaleri] ?? 'secondary'}>
                                                {LABEL_STATUS[item.status as StatusGaleri] ?? item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {(item as { creator?: { name?: string } }).creator?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/galeri/${jenis}/${item.slug}`} target="_blank">
                                                        Lihat
                                                    </Link>
                                                </Button>
                                                {bisaKelola && (
                                                    <>
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/galeri-admin/${item.id}/edit`}>Edit</Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => hapusKonten(item)}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {galeris.last_page > 1 && (
                        <nav className="flex flex-wrap items-center justify-center gap-2 p-4 text-sm">
                            {galeris.links.map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => handlePageChange(link.url)}
                                    className={`rounded-md border px-3 py-1 transition-colors ${
                                        link.active
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border text-muted-foreground hover:text-foreground'
                                    } ${!link.url ? 'opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label ?? '' }}
                                />
                            ))}
                        </nav>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
