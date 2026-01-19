import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota } from '@/types/anggota';

import Rekap from './Rekap';

type ProkerStatus = 'draft' | 'aktif' | 'selesai' | 'dibatalkan';

interface MainProker {
    id: number;
    nama_proker: string;
}

interface ProkerStruktur {
    id: number;
    proker_id: number;
    anggota_id: number | null;
    jabatan: string;
    divisi_proker: string | null;
    anggota?: Anggota | null;
}

interface RapatTimelineItem {
    type: string;
    id: number;
    judul: string;
    tanggal: string;
}

interface Proker {
    id: number;
    main_proker_id: number;
    main_proker?: MainProker | null;
    nama_lengkap: string;
    tahun: number;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    deskripsi: string | null;
    status: ProkerStatus;
    ketua_pelaksana_id: number | null;
    ketua_pelaksana?: Anggota | null;
    proker_strukturs?: ProkerStruktur[];
    rapats?: {
        id: number;
        judul: string;
        tanggal: string;
        [key: string]: unknown;
    }[];
    [key: string]: unknown;
}

interface OtherProker {
    id: number;
    nama_lengkap: string;
    tahun: number;
}

interface ShowProps {
    proker: Proker;
    timeline: RapatTimelineItem[];
    anggota: Anggota[];
    otherProkers: OtherProker[];
}

interface StrukturForm {
    proker_id: number;
    anggota_id: string;
    jabatan: string;
    divisi_proker: string;
}

type TabKey = 'detail' | 'struktur' | 'rapat' | 'timeline';

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

const breadcrumbs = (proker: Proker): BreadcrumbItem[] => [
    {
        title: 'Proker',
        href: '/proker',
    },
    {
        title: proker.nama_lengkap,
        href: `/proker/${proker.id}`,
    },
];

export default function Show({ proker, timeline, anggota, otherProkers }: ShowProps) {
    const [tab, setTab] = useState<TabKey>('detail');
    const [copyDialogOpen, setCopyDialogOpen] = useState(false);
    const [copyFromId, setCopyFromId] = useState<string>('');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const { data, setData, post, processing, errors, reset } = useForm<StrukturForm>({
        proker_id: proker.id,
        anggota_id: '',
        jabatan: '',
        divisi_proker: '',
    });

    const strukturs = (proker.proker_strukturs ?? []) as ProkerStruktur[];

    const handleAddStruktur = (e: React.FormEvent) => {
        e.preventDefault();
        post('/proker-struktur', {
            onSuccess: () => {
                reset('anggota_id', 'jabatan', 'divisi_proker');
                setToast({
                    type: 'success',
                    message: 'Struktur proker berhasil ditambahkan.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal menambahkan struktur proker.',
                });
            },
        });
    };

    const handleDeleteStruktur = (struktur: ProkerStruktur) => {
        router.delete(`/proker-struktur/${struktur.id}`, {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Struktur proker berhasil dihapus.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal menghapus struktur proker.',
                });
            },
        });
    };

    const handleCopyStruktur = () => {
        if (!copyFromId) return;
        router.post(
            `/proker/${copyFromId}/copy-struktur/${proker.id}`,
            {},
            {
                onSuccess: () => {
                    setToast({
                        type: 'success',
                        message: 'Struktur berhasil disalin dari proker lain.',
                    });
                    setCopyDialogOpen(false);
                    setCopyFromId('');
                },
                onError: () => {
                    setToast({
                        type: 'error',
                        message: 'Gagal menyalin struktur proker.',
                    });
                },
            },
        );
    };

    const tanggalRange =
        proker.tanggal_mulai || proker.tanggal_selesai
            ? [proker.tanggal_mulai, proker.tanggal_selesai].filter(Boolean).join(' - ')
            : '-';

    return (
        <AppLayout breadcrumbs={breadcrumbs(proker)}>
            <Head title={`Detail Proker - ${proker.nama_lengkap}`} />

            <div className="p-4">
                {toast && (
                    <div className="mb-4 rounded-md border px-4 py-3 text-sm shadow-sm md:max-w-md">
                        <div
                            className={
                                toast.type === 'success'
                                    ? 'text-green-800'
                                    : 'text-red-800'
                            }
                        >
                            {toast.message}
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-5xl space-y-6 rounded-lg border bg-background p-4 md:p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">{proker.nama_lengkap}</h1>
                            <p className="text-sm text-muted-foreground">
                                {proker.main_proker?.nama_proker || '-'} • Tahun {proker.tahun}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <Badge
                                variant={
                                    STATUS_VARIANTS[proker.status] ?? 'secondary'
                                }
                            >
                                {STATUS_LABELS[proker.status] ?? proker.status}
                            </Badge>
                            <span className="text-muted-foreground">
                                Ketua pelaksana:{' '}
                                <span className="font-medium">
                                    {proker.ketua_pelaksana?.nama_lengkap ||
                                        proker.ketua_pelaksana?.user?.name ||
                                        'Belum ditentukan'}
                                </span>
                            </span>
                            <Link
                                href={`/proker/${proker.id}/edit`}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Edit Proker
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b pb-2 text-xs">
                        {(['detail', 'struktur', 'rapat', 'timeline'] as TabKey[]).map(
                            (key) => (
                                <Button
                                    key={key}
                                    type="button"
                                    size="sm"
                                    variant={tab === key ? 'default' : 'ghost'}
                                    onClick={() => setTab(key)}
                                >
                                    {key === 'detail' && 'Detail Proker'}
                                    {key === 'struktur' && 'Struktur Kepengurusan'}
                                    {key === 'rapat' && 'Rapat Terkait'}
                                    {key === 'timeline' && 'Timeline & Rekap'}
                                </Button>
                            ),
                        )}
                    </div>

                    {tab === 'detail' && (
                        <div className="space-y-3 text-sm">
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Nama Proker
                                    </div>
                                    <div className="font-medium">
                                        {proker.nama_lengkap}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Main Proker
                                    </div>
                                    <div>
                                        {proker.main_proker?.nama_proker || '-'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Tahun
                                    </div>
                                    <div>{proker.tahun}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Tanggal
                                    </div>
                                    <div>{tanggalRange}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Deskripsi
                                </div>
                                <div>{proker.deskripsi || '-'}</div>
                            </div>
                        </div>
                    )}

                    {tab === 'struktur' && (
                        <div className="space-y-6 text-sm">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold">
                                        Struktur Kepengurusan
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Atur anggota yang terlibat dalam kepengurusan proker.
                                    </p>
                                </div>
                                <Dialog
                                    open={copyDialogOpen}
                                    onOpenChange={setCopyDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button type="button" variant="outline" size="sm">
                                            Copy dari Proker Lain
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Salin Struktur dari Proker Lain
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-3 text-xs">
                                            <div className="space-y-1">
                                                <Label>Pilih Proker Sumber</Label>
                                                <Select
                                                    value={copyFromId}
                                                    onValueChange={setCopyFromId}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih proker" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {otherProkers.map((p) => (
                                                            <SelectItem
                                                                key={p.id}
                                                                value={String(p.id)}
                                                            >
                                                                {p.nama_lengkap} ({p.tahun})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <p className="text-muted-foreground">
                                                Hanya jabatan dan divisi proker yang akan
                                                disalin. Anggota tidak ikut disalin.
                                            </p>
                                        </div>
                                        <DialogFooter className="pt-3">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => setCopyDialogOpen(false)}
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="button"
                                                disabled={!copyFromId}
                                                onClick={handleCopyStruktur}
                                            >
                                                Salin Struktur
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="overflow-x-auto rounded-lg border bg-background">
                                <table className="w-full min-w-[720px] text-left text-xs">
                                    <thead className="border-b bg-muted/40 text-[11px] uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2">Anggota</th>
                                            <th className="px-3 py-2">Jabatan</th>
                                            <th className="px-3 py-2">Divisi Proker</th>
                                            <th className="px-3 py-2 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {strukturs.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-3 py-4 text-center text-xs text-muted-foreground"
                                                >
                                                    Belum ada struktur kepengurusan.
                                                </td>
                                            </tr>
                                        )}
                                        {strukturs.map((struktur) => (
                                            <tr
                                                key={struktur.id}
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <td className="px-3 py-2">
                                                    {struktur.anggota
                                                        ? struktur.anggota
                                                              .nama_lengkap ||
                                                          struktur.anggota.user?.name
                                                        : '-'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {struktur.jabatan}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {struktur.divisi_proker || '-'}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <Button
                                                        type="button"
                                                    size="sm"
                                                        variant="ghost"
                                                        className="text-red-600"
                                                        onClick={() =>
                                                            handleDeleteStruktur(struktur)
                                                        }
                                                    >
                                                        Hapus
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="rounded-md border bg-muted/40 p-3 text-xs">
                                <div className="mb-2 font-semibold">
                                    Tambah Anggota ke Struktur
                                </div>
                                <form
                                    onSubmit={handleAddStruktur}
                                    className="grid gap-3 md:grid-cols-[2fr_2fr_2fr_auto]"
                                >
                                    <div className="space-y-1">
                                        <Label>Anggota</Label>
                                        <Select
                                            value={data.anggota_id}
                                            onValueChange={(value) =>
                                                setData('anggota_id', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih anggota" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {anggota.map((a) => (
                                                    <SelectItem
                                                        key={a.id}
                                                        value={String(a.id)}
                                                    >
                                                        {a.nama_lengkap ||
                                                            a.user?.name ||
                                                            '-'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.anggota_id} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Jabatan</Label>
                                        <Input
                                            value={data.jabatan}
                                            onChange={(e) =>
                                                setData('jabatan', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.jabatan} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Divisi Proker</Label>
                                        <Input
                                            value={data.divisi_proker}
                                            onChange={(e) =>
                                                setData('divisi_proker', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.divisi_proker} />
                                    </div>
                                    <div className="flex items-end">
                                        <Button type="submit" size="sm" disabled={processing}>
                                            Tambah
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {tab === 'rapat' && (
                        <div className="space-y-3 text-xs">
                            <h2 className="text-sm font-semibold">Rapat Terkait</h2>
                            <p className="text-muted-foreground">
                                Daftar rapat yang terhubung dengan proker ini.
                            </p>
                            <div className="overflow-x-auto rounded-lg border bg-background">
                                <table className="w-full min-w-[640px] text-left text-xs">
                                    <thead className="border-b bg-muted/40 text-[11px] uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2">Judul</th>
                                            <th className="px-3 py-2">Tanggal</th>
                                            <th className="px-3 py-2">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(proker.rapats ?? []).length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="px-3 py-4 text-center text-xs text-muted-foreground"
                                                >
                                                    Belum ada rapat yang terhubung dengan proker
                                                    ini.
                                                </td>
                                            </tr>
                                        )}
                                        {(proker.rapats ?? []).map((rapat) => (
                                            <tr
                                                key={rapat.id}
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <td className="px-3 py-2">
                                                    <div className="max-w-[260px] truncate">
                                                        {rapat.judul}
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                                                    {rapat.tanggal}
                                                </td>
                                                <td className="px-3 py-2 text-[11px] text-muted-foreground">
                                                    Terhubung sebagai rapat proker.
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {tab === 'timeline' && (
                        <div className="space-y-6 text-xs">
                            <div>
                                <h2 className="text-sm font-semibold">Timeline Proker</h2>
                                <ol className="mt-3 space-y-2 border-l pl-3">
                                    {timeline.length === 0 && (
                                        <li className="text-muted-foreground">
                                            Belum ada aktivitas pada timeline.
                                        </li>
                                    )}
                                    {timeline.map((item) => (
                                        <li key={`${item.type}-${item.id}`}>
                                            <div className="relative mb-1">
                                                <span className="absolute -left-3 top-1 h-2 w-2 rounded-full bg-primary" />
                                                <div className="text-[11px] text-muted-foreground">
                                                    {item.tanggal}
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {item.judul}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div>
                                <h2 className="mb-2 text-sm font-semibold">Rekap</h2>
                                <Rekap proker={proker} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
