import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota, Paginator } from '@/types/anggota';

interface MainProker {
    id: number;
    nama_proker: string;
}

type ProkerStatus = 'draft' | 'aktif' | 'selesai' | 'dibatalkan';

interface Proker {
    id: number;
    main_proker_id: number;
    main_proker?: MainProker | null;
    nama_lengkap: string;
    tahun: number;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    status: ProkerStatus;
    ketua_pelaksana?: Anggota | null;
    [key: string]: unknown;
}

interface IndexProps {
    prokers: Paginator<Proker>;
    mainProkers: MainProker[];
    filters: {
        tahun: number | null;
        status: string | null;
        main_proker_id: number | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proker',
        href: '/proker',
    },
];

const STATUS_LABELS: Record<ProkerStatus, string> = {
    draft: 'Draft',
    aktif: 'Aktif',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
};

const STATUS_VARIANTS: Record<ProkerStatus, 'default' | 'secondary' | 'outline' | 'destructive'> =
    {
        draft: 'secondary',
        aktif: 'default',
        selesai: 'outline',
        dibatalkan: 'destructive',
    };

export default function Index({ prokers, mainProkers, filters }: IndexProps) {
    const [tahun, setTahun] = useState(filters.tahun ? String(filters.tahun) : '');
    const [status, setStatus] = useState<ProkerStatus | ''>(
        (filters.status as ProkerStatus | null) ?? '',
    );
    const [mainProkerId, setMainProkerId] = useState(
        filters.main_proker_id ? String(filters.main_proker_id) : '',
    );

    const selectStatusValue = status === '' ? 'all' : status;
    const selectMainProkerValue = mainProkerId === '' ? 'all' : mainProkerId;

    const applyFilters = () => {
        router.get(
            '/proker',
            {
                tahun: tahun || undefined,
                status: status || undefined,
                main_proker_id: mainProkerId || undefined,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Proker" />

            <div className="flex flex-col gap-4 p-4 md:flex-row">
                <div className="w-full space-y-4 md:w-72">
                    <div className="rounded-lg border bg-background p-4">
                        <h2 className="mb-3 text-sm font-semibold">Filter Proker</h2>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="tahun">Tahun</Label>
                                <Input
                                    id="tahun"
                                    type="number"
                                    value={tahun}
                                    onChange={(e) => setTahun(e.target.value)}
                                    placeholder="Misal: 2025"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select
                                    value={selectStatusValue}
                                    onValueChange={(value) =>
                                        setStatus(value === 'all' ? '' : (value as ProkerStatus))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua status</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Main Proker</Label>
                                <Select
                                    value={selectMainProkerValue}
                                    onValueChange={(value) =>
                                        setMainProkerId(value === 'all' ? '' : value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua main proker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua main proker</SelectItem>
                                        {mainProkers.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.nama_proker}
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
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h1 className="text-lg font-semibold">Daftar Proker</h1>
                            <p className="text-sm text-muted-foreground">
                                Total {prokers.total} proker terdaftar.
                            </p>
                        </div>
                        <Link href="/proker/create">
                            <Button type="button" size="sm">
                                Tambah Proker
                            </Button>
                        </Link>
                    </div>

                    <div className="overflow-x-auto rounded-lg border bg-background">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-2">Nama Proker</th>
                                    <th className="px-4 py-2">Main Proker</th>
                                    <th className="px-4 py-2">Tahun</th>
                                    <th className="px-4 py-2">Tanggal</th>
                                    <th className="px-4 py-2">Ketua Pelaksana</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prokers.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-6 text-center text-sm text-muted-foreground"
                                            colSpan={7}
                                        >
                                            Tidak ada data proker.
                                        </td>
                                    </tr>
                                )}
                                {prokers.data.map((proker) => {
                                    const tanggal =
                                        proker.tanggal_mulai || proker.tanggal_selesai
                                            ? [proker.tanggal_mulai, proker.tanggal_selesai]
                                                  .filter(Boolean)
                                                  .join(' - ')
                                            : '-';

                                    return (
                                        <tr
                                            key={proker.id}
                                            className="border-b last:border-0 hover:bg-muted/40"
                                        >
                                            <td className="px-4 py-3 text-sm">
                                                {proker.nama_lengkap}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {proker.main_proker?.nama_proker || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">{proker.tahun}</td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {tanggal}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {proker.ketua_pelaksana?.nama_lengkap || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        STATUS_VARIANTS[
                                                            proker.status || 'draft'
                                                        ] ?? 'secondary'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {STATUS_LABELS[proker.status] ??
                                                        proker.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/proker/${proker.id}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        Detail
                                                    </Link>
                                                    <Link
                                                        href={`/proker/${proker.id}/edit`}
                                                        className="font-medium text-amber-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
                        <div>
                            Menampilkan {prokers.from ?? 0} - {prokers.to ?? 0} dari{' '}
                            {prokers.total} data
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {prokers.links.map((link, index) => {
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
