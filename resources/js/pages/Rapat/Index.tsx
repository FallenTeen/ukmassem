import { Head, Link, router } from '@inertiajs/react';
import { CalendarSearch, ListChecks, Plus } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Paginator } from '@/types/anggota';

type RapatStatus = 'draft' | 'dijadwalkan' | 'berlangsung' | 'selesai' | 'dibatalkan';

interface JenisRapat {
    id: number;
    nama: string;
    deskripsi: string | null;
}

interface ProkerOption {
    id: number;
    nama_lengkap: string;
}

interface RapatListItem {
    id: number;
    judul: string;
    kategori: string;
    tanggal: string;
    status: RapatStatus;
    jenis_rapat?: JenisRapat | null;
    proker?: ProkerOption | null;
    [key: string]: unknown;
}

interface IndexProps {
    rapats: Paginator<RapatListItem>;
    jenisRapats: JenisRapat[];
    prokers: ProkerOption[];
    filters: {
        tanggal_start: string | null;
        tanggal_end: string | null;
        status: string | null;
        kategori: string | null;
        jenis_rapat_id: number | null;
        proker_id: number | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rapat',
        href: '/rapat',
    },
];

const STATUS_LABELS: Record<RapatStatus, string> = {
    draft: 'Draft',
    dijadwalkan: 'Dijadwalkan',
    berlangsung: 'Berlangsung',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
};

const STATUS_VARIANTS: Record<RapatStatus, 'default' | 'secondary' | 'outline' | 'destructive'> =
    {
        draft: 'secondary',
        dijadwalkan: 'default',
        berlangsung: 'default',
        selesai: 'outline',
        dibatalkan: 'destructive',
    };

export default function Index({
    rapats,
    jenisRapats,
    prokers,
    filters,
}: IndexProps) {
    const [tanggalStart, setTanggalStart] = useState(filters.tanggal_start ?? '');
    const [tanggalEnd, setTanggalEnd] = useState(filters.tanggal_end ?? '');
    const [status, setStatus] = useState<RapatStatus | ''>(
        (filters.status as RapatStatus | null) ?? '',
    );
    const [kategori, setKategori] = useState(filters.kategori ?? '');
    const [jenisRapatId, setJenisRapatId] = useState(
        filters.jenis_rapat_id ? String(filters.jenis_rapat_id) : '',
    );
    const [prokerId, setProkerId] = useState(
        filters.proker_id ? String(filters.proker_id) : '',
    );

    const selectStatusValue = status === '' ? 'all' : status;
    const selectKategoriValue = kategori === '' ? 'all' : kategori;
    const selectJenisRapatValue = jenisRapatId === '' ? 'all' : jenisRapatId;
    const selectProkerValue = prokerId === '' ? 'all' : prokerId;

    const applyFilters = () => {
        router.get(
            '/rapat',
            {
                tanggal_start: tanggalStart || undefined,
                tanggal_end: tanggalEnd || undefined,
                status: status || undefined,
                kategori: kategori || undefined,
                jenis_rapat_id: jenisRapatId || undefined,
                proker_id: prokerId || undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const formatKategori = (value: string) => {
        if (value === 'proker') return 'Proker';
        if (value === 'non_proker') return 'Non Proker';
        if (!value) return '-';
        return value;
    };

    const formatTanggal = (value: string) => {
        if (!value) return '-';
        return value;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Rapat" />

            <div className="flex flex-col gap-4 p-4 md:flex-row">
                <div className="w-full space-y-4 md:w-80">
                    <div className="rounded-lg border bg-background p-4">
                        <h2 className="mb-3 text-sm font-semibold">Filter Rapat</h2>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="tanggal-start">Tanggal Mulai</Label>
                                <Input
                                    id="tanggal-start"
                                    type="date"
                                    value={tanggalStart}
                                    onChange={(e) => setTanggalStart(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="tanggal-end">Tanggal Selesai</Label>
                                <Input
                                    id="tanggal-end"
                                    type="date"
                                    value={tanggalEnd}
                                    onChange={(e) => setTanggalEnd(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select
                                    value={selectStatusValue}
                                    onValueChange={(value) =>
                                        setStatus(value === 'all' ? '' : (value as RapatStatus))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua status</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="dijadwalkan">
                                            Dijadwalkan
                                        </SelectItem>
                                        <SelectItem value="berlangsung">Berlangsung</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Kategori</Label>
                                <Select
                                    value={selectKategoriValue}
                                    onValueChange={(value) =>
                                        setKategori(value === 'all' ? '' : value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua kategori</SelectItem>
                                        <SelectItem value="proker">Proker</SelectItem>
                                        <SelectItem value="non_proker">Non Proker</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Jenis Rapat</Label>
                                <Select
                                    value={selectJenisRapatValue}
                                    onValueChange={(value) =>
                                        setJenisRapatId(value === 'all' ? '' : value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua jenis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua jenis</SelectItem>
                                        {jenisRapats.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label>Proker Terkait</Label>
                                <Select
                                    value={selectProkerValue}
                                    onValueChange={(value) =>
                                        setProkerId(value === 'all' ? '' : value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua proker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua proker</SelectItem>
                                        {prokers.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {item.nama_lengkap}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <Button type="button" className="flex-1" onClick={applyFilters}>
                                    Terapkan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">Daftar Rapat</h1>
                            <p className="text-sm text-muted-foreground">
                                Total {rapats.total} rapat terdaftar.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex rounded-md border bg-muted/40 text-xs">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    className="flex items-center gap-1 rounded-none border-r px-3"
                                >
                                    <ListChecks className="h-3 w-3" />
                                    List
                                </Button>
                                <Link href="/rapat/calendar">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        className="flex items-center gap-1 rounded-none px-3"
                                    >
                                        <CalendarSearch className="h-3 w-3" />
                                        Kalender
                                    </Button>
                                </Link>
                            </div>
                            <Link href="/rapat/create">
                                <Button type="button" size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Rapat
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border bg-background">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-2">Judul</th>
                                    <th className="px-4 py-2">Jenis</th>
                                    <th className="px-4 py-2">Kategori</th>
                                    <th className="px-4 py-2">Proker</th>
                                    <th className="px-4 py-2">Tanggal</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rapats.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-6 text-center text-sm text-muted-foreground"
                                            colSpan={7}
                                        >
                                            Tidak ada data rapat.
                                        </td>
                                    </tr>
                                )}
                                {rapats.data.map((rapat) => (
                                    <tr
                                        key={rapat.id}
                                        className="border-b last:border-0 hover:bg-muted/40"
                                    >
                                        <td className="px-4 py-3 text-sm">{rapat.judul}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {rapat.jenis_rapat?.nama || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {formatKategori(rapat.kategori)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {rapat.proker?.nama_lengkap || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                            {formatTanggal(rapat.tanggal)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant={
                                                    STATUS_VARIANTS[
                                                        rapat.status || 'draft'
                                                    ] ?? 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {STATUS_LABELS[rapat.status] ?? rapat.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right text-xs">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/rapat/${rapat.id}`}
                                                    className="font-medium text-primary hover:underline"
                                                >
                                                    Detail
                                                </Link>
                                                <Link
                                                    href={`/rapat/${rapat.id}/edit`}
                                                    className="font-medium text-amber-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
                        <div>
                            Menampilkan {rapats.from ?? 0} - {rapats.to ?? 0} dari {rapats.total}{' '}
                            data
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {rapats.links.map((link, index) => {
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
                                        onClick={() => handlePageChange(link.url)}
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
                </div>
            </div>
        </AppLayout>
    );
}
