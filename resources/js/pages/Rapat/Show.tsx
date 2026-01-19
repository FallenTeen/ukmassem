import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import type { Anggota } from '@/types/anggota';

type RapatStatus = 'draft' | 'dijadwalkan' | 'berlangsung' | 'selesai' | 'dibatalkan';

type TargetPeserta = 'semua' | 'divisi' | 'role' | 'proker_team' | 'custom';

interface JenisRapat {
    id: number;
    nama: string;
    deskripsi: string | null;
}

interface Proker {
    id: number;
    nama_lengkap: string;
    tahun?: number;
}

interface CreatorUser {
    id: number;
    name: string;
    email: string;
    [key: string]: unknown;
}

type PresensiStatus = 'hadir' | 'izin' | 'sakit' | 'alpa';

interface PresensiItem {
    id: number;
    rapat_id: number;
    anggota_id: number;
    status_kehadiran: PresensiStatus;
    keterangan: string | null;
    anggota?: Anggota | null;
}

interface PresensiRow extends PresensiItem {
    selected: boolean;
}

interface Rapat {
    id: number;
    judul: string;
    jenis_rapat_id: number;
    jenis_rapat?: JenisRapat | null;
    kategori: string;
    proker_id: number | null;
    proker?: Proker | null;
    deskripsi: string | null;
    tanggal: string;
    waktu_mulai: string | null;
    waktu_selesai: string | null;
    lokasi: string | null;
    notulensi: string | null;
    hasil: unknown[] | null;
    evaluasi: string | null;
    link_dokumentasi: string | null;
    status: RapatStatus;
    target_peserta: TargetPeserta;
    target_detail: {
        divisi?: string[];
        role?: string[];
        anggota_ids?: number[];
        [key: string]: unknown;
    } | null;
    created_by: number;
    creator?: CreatorUser | null;
    presensi_rapats?: PresensiItem[];
}

interface ShowProps {
    rapat: Rapat;
    canManage: boolean;
    anggota: Anggota[];
}

type TabKey = 'detail' | 'notulensi' | 'hasil' | 'evaluasi' | 'presensi';

interface RapatTargetDetail {
    divisi: string[];
    role: string[];
    anggota_ids: number[];
}

interface RapatForm {
    judul: string;
    jenis_rapat_id: string;
    kategori: string;
    proker_id: string;
    deskripsi: string;
    tanggal: string;
    waktu_mulai: string;
    waktu_selesai: string;
    lokasi: string;
    notulensi: string;
    hasil: string[];
    evaluasi: string;
    link_dokumentasi: string;
    status: RapatStatus;
    target_peserta: TargetPeserta;
    target_detail: RapatTargetDetail;
}

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

const breadcrumbs = (rapat: Rapat): BreadcrumbItem[] => [
    {
        title: 'Rapat',
        href: '/rapat',
    },
    {
        title: rapat.judul,
        href: `/rapat/${rapat.id}`,
    },
];

const formatKategori = (value: string) => {
    if (value === 'proker') return 'Proker';
    if (value === 'non_proker') return 'Non Proker';
    return value || '-';
};

const formatTargetPeserta = (rapat: Rapat) => {
    if (!rapat.target_peserta) return '-';
    if (rapat.target_peserta === 'semua') return 'Semua anggota aktif';
    if (rapat.target_peserta === 'divisi') {
        const divisi = (rapat.target_detail?.divisi ?? []) as string[];
        return `Divisi: ${divisi.join(', ') || '-'}`;
    }
    if (rapat.target_peserta === 'role') {
        const roles = (rapat.target_detail?.role ?? []) as string[];
        return `Role: ${roles.join(', ') || '-'}`;
    }
    if (rapat.target_peserta === 'proker_team') {
        return 'Tim proker terkait';
    }
    if (rapat.target_peserta === 'custom') {
        const ids = (rapat.target_detail?.anggota_ids ?? []) as number[];
        return `Custom, total ${ids.length} anggota`;
    }
    return rapat.target_peserta;
};

const parseHasilItems = (hasil: unknown[] | null | undefined) => {
    if (!hasil || !Array.isArray(hasil)) return [];
    return hasil.map((item, index) => {
        if (typeof item === 'string') {
            return { id: index, label: item, done: false };
        }
        if (typeof item === 'object' && item !== null) {
            const anyItem = item as { [key: string]: unknown };
            return {
                id: index,
                label: String(anyItem.label ?? anyItem.text ?? `Item ${index + 1}`),
                done: Boolean(anyItem.done ?? anyItem.checked ?? false),
            };
        }
        return { id: index, label: `Item ${index + 1}`, done: false };
    });
};

export default function Show({ rapat, canManage, anggota }: ShowProps) {
    const { auth } = usePage<SharedData>().props;
    const currentUser = auth.user;
    const currentRole = String((currentUser as { [key: string]: unknown }).role ?? '');
    const isOwner = rapat.created_by === currentUser.id;
    const canManagePresensi =
        isOwner ||
        currentRole === 'rajawebsite' ||
        currentRole === 'ketum_waketum' ||
        currentRole === 'sekretaris';

    const [tab, setTab] = useState<TabKey>('detail');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const detail: RapatTargetDetail = {
        divisi: (rapat.target_detail?.divisi ?? []) as string[],
        role: (rapat.target_detail?.role ?? []) as string[],
        anggota_ids: (rapat.target_detail?.anggota_ids ?? []) as number[],
    };

    const { data, setData, put, processing, errors } = useForm<RapatForm>({
        judul: rapat.judul,
        jenis_rapat_id: String(rapat.jenis_rapat_id),
        kategori: rapat.kategori,
        proker_id: rapat.proker_id ? String(rapat.proker_id) : '',
        deskripsi: rapat.deskripsi ?? '',
        tanggal: rapat.tanggal,
        waktu_mulai: rapat.waktu_mulai ?? '',
        waktu_selesai: rapat.waktu_selesai ?? '',
        lokasi: rapat.lokasi ?? '',
        notulensi: rapat.notulensi ?? '',
        hasil: Array.isArray(rapat.hasil)
            ? rapat.hasil.map((item) => String(item))
            : [],
        evaluasi: rapat.evaluasi ?? '',
        link_dokumentasi: rapat.link_dokumentasi ?? '',
        status: rapat.status,
        target_peserta: rapat.target_peserta,
        target_detail: detail,
    });

    const handleSaveNotulensi = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canManage) return;
        put(`/rapat/${rapat.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Notulensi rapat berhasil disimpan.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal menyimpan notulensi rapat.',
                });
            },
        });
    };

    const handleSaveEvaluasi = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canManage) return;
        put(`/rapat/${rapat.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Evaluasi rapat berhasil disimpan.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal menyimpan evaluasi rapat.',
                });
            },
        });
    };

    const tanggalWaktu =
        rapat.waktu_mulai || rapat.waktu_selesai
            ? [rapat.waktu_mulai, rapat.waktu_selesai].filter(Boolean).join(' - ')
            : null;

    const hasilItems = parseHasilItems(rapat.hasil);
    const presensiRaw = (rapat.presensi_rapats ?? []) as PresensiItem[];

    const [presensiItems, setPresensiItems] = useState<PresensiRow[]>(() =>
        presensiRaw.map((item) => ({
            ...item,
            status_kehadiran: item.status_kehadiran || 'alpa',
            keterangan: item.keterangan ?? '',
            selected: false,
        })),
    );

    const [isSavingPresensi, setIsSavingPresensi] = useState(false);
    const [isGeneratingPresensi, setIsGeneratingPresensi] = useState(false);
    const [isAddingManual, setIsAddingManual] = useState(false);
    const [manualAnggotaId, setManualAnggotaId] = useState('');
    const [manualKeterangan, setManualKeterangan] = useState('');
    const [searchAnggota, setSearchAnggota] = useState('');

    const presensiCounts = useMemo(
        () =>
            presensiItems.reduce(
                (acc, item) => {
                    acc.total += 1;
                    if (item.status_kehadiran === 'hadir') acc.hadir += 1;
                    if (item.status_kehadiran === 'izin') acc.izin += 1;
                    if (item.status_kehadiran === 'sakit') acc.sakit += 1;
                    if (item.status_kehadiran === 'alpa') acc.alpa += 1;
                    return acc;
                },
                { total: 0, hadir: 0, izin: 0, sakit: 0, alpa: 0 },
            ),
        [presensiItems],
    );

    const presensiAnggotaIds = useMemo(
        () => new Set(presensiItems.map((item) => item.anggota_id)),
        [presensiItems],
    );

    const availableAnggota = useMemo(
        () =>
            anggota.filter((item) => !presensiAnggotaIds.has(item.id)).sort((a, b) => {
                const nameA = (a.nama_lengkap || a.user?.name || '').toLowerCase();
                const nameB = (b.nama_lengkap || b.user?.name || '').toLowerCase();
                return nameA.localeCompare(nameB);
            }),
        [anggota, presensiAnggotaIds],
    );

    const filteredAnggota = useMemo(() => {
        if (!searchAnggota.trim()) return availableAnggota;
        const term = searchAnggota.toLowerCase();
        return availableAnggota.filter((item) => {
            const name = (item.nama_lengkap || item.user?.name || '').toLowerCase();
            const divisi = String(item.divisi ?? '').toLowerCase();
            return name.includes(term) || divisi.includes(term);
        });
    }, [availableAnggota, searchAnggota]);

    const anySelected = presensiItems.some((item) => item.selected);

    const handleToggleSelectAll = (checked: boolean) => {
        setPresensiItems((items) => items.map((item) => ({ ...item, selected: checked })));
    };

    const handleToggleSelect = (anggotaId: number, checked: boolean) => {
        setPresensiItems((items) =>
            items.map((item) =>
                item.anggota_id === anggotaId ? { ...item, selected: checked } : item,
            ),
        );
    };

    const handleChangeStatus = (anggotaId: number, value: PresensiStatus) => {
        setPresensiItems((items) =>
            items.map((item) =>
                item.anggota_id === anggotaId ? { ...item, status_kehadiran: value } : item,
            ),
        );
    };

    const handleChangeKeterangan = (anggotaId: number, value: string) => {
        setPresensiItems((items) =>
            items.map((item) =>
                item.anggota_id === anggotaId ? { ...item, keterangan: value } : item,
            ),
        );
    };

    const handleBulkSetStatus = (status: PresensiStatus) => {
        setPresensiItems((items) =>
            items.map((item) => (item.selected ? { ...item, status_kehadiran: status } : item)),
        );
    };

    const handleBulkReset = () => {
        setPresensiItems((items) =>
            items.map((item) =>
                item.selected
                    ? {
                          ...item,
                          status_kehadiran: 'alpa',
                          keterangan: '',
                      }
                    : item,
            ),
        );
    };

    const getCsrfToken = () => {
        if (typeof document === 'undefined') return '';
        const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        return el?.content ?? '';
    };

    const handleGeneratePresensi = async () => {
        if (!canManagePresensi) return;
        const token = getCsrfToken();
        if (!token) return;
        setIsGeneratingPresensi(true);
        try {
            const res = await fetch(`/rapat/${rapat.id}/presensi/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({}),
            });
            if (!res.ok) {
                throw new Error('Failed to generate presensi');
            }
            const list = (await res.json()) as PresensiItem[];
            setPresensiItems(
                list.map((item) => ({
                    ...item,
                    status_kehadiran: item.status_kehadiran || 'alpa',
                    keterangan: item.keterangan ?? '',
                    selected: false,
                })),
            );
            setToast({
                type: 'success',
                message: 'Peserta rapat berhasil digenerate.',
            });
        } catch {
            setToast({
                type: 'error',
                message: 'Gagal meng-generate peserta rapat.',
            });
        } finally {
            setIsGeneratingPresensi(false);
        }
    };

    const handleSavePresensi = async () => {
        if (!canManagePresensi) return;
        if (presensiItems.length === 0) return;
        const token = getCsrfToken();
        if (!token) return;
        setIsSavingPresensi(true);
        try {
            const payload = {
                items: presensiItems.map((item) => ({
                    anggota_id: item.anggota_id,
                    status_kehadiran: item.status_kehadiran,
                    keterangan: item.keterangan || null,
                })),
            };
            const res = await fetch(`/rapat/${rapat.id}/presensi/bulk-update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error('Failed to save presensi');
            }
            setToast({
                type: 'success',
                message: 'Presensi rapat berhasil disimpan.',
            });
        } catch {
            setToast({
                type: 'error',
                message: 'Gagal menyimpan presensi rapat.',
            });
        } finally {
            setIsSavingPresensi(false);
        }
    };

    const handleAddManual = async () => {
        if (!canManagePresensi) return;
        if (!manualAnggotaId) return;
        const token = getCsrfToken();
        if (!token) return;
        setIsAddingManual(true);
        try {
            const payload = {
                anggota_id: Number.parseInt(manualAnggotaId, 10),
                status_kehadiran: 'hadir' as PresensiStatus,
                keterangan: manualKeterangan || null,
            };
            const res = await fetch(`/rapat/${rapat.id}/presensi/add-manual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error('Failed to add manual presensi');
            }
            const item = (await res.json()) as PresensiItem;
            setPresensiItems((items) => [
                ...items,
                {
                    ...item,
                    status_kehadiran: item.status_kehadiran || 'hadir',
                    keterangan: item.keterangan ?? '',
                    selected: false,
                },
            ]);
            setManualAnggotaId('');
            setManualKeterangan('');
            setSearchAnggota('');
            setToast({
                type: 'success',
                message: 'Anggota berhasil ditambahkan ke presensi.',
            });
        } catch {
            setToast({
                type: 'error',
                message: 'Gagal menambahkan anggota ke presensi.',
            });
        } finally {
            setIsAddingManual(false);
        }
    };

    const handleRemove = async (anggotaId: number) => {
        if (!canManagePresensi) return;
        const token = getCsrfToken();
        if (!token) return;
        const confirmed = window.confirm('Hapus anggota ini dari presensi rapat?');
        if (!confirmed) return;
        try {
            const res = await fetch(`/rapat/${rapat.id}/presensi/${anggotaId}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': token,
                },
            });
            if (!res.ok) {
                throw new Error('Failed to remove presensi');
            }
            setPresensiItems((items) => items.filter((item) => item.anggota_id !== anggotaId));
            setToast({
                type: 'success',
                message: 'Anggota dihapus dari presensi.',
            });
        } catch {
            setToast({
                type: 'error',
                message: 'Gagal menghapus anggota dari presensi.',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(rapat)}>
            <Head title={`Detail Rapat - ${rapat.judul}`} />

            <div className="p-4">
                {toast && (
                    <div className="mb-4 rounded-md border px-4 py-3 text-sm shadow-sm md:max-w-md">
                        <div
                            className={
                                toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }
                        >
                            {toast.message}
                        </div>
                    </div>
                )}

                <div className="mx-auto max-w-5xl space-y-6 rounded-lg border bg-background p-4 md:p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">{rapat.judul}</h1>
                            <p className="text-sm text-muted-foreground">
                                {rapat.jenis_rapat?.nama || '-'} • {formatKategori(rapat.kategori)}
                            </p>
                            {rapat.proker && (
                                <p className="text-[11px] text-muted-foreground">
                                    Proker terkait:{' '}
                                    <span className="font-medium">
                                        {rapat.proker.nama_lengkap}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <Badge
                                variant={
                                    STATUS_VARIANTS[rapat.status] ?? 'secondary'
                                }
                            >
                                {STATUS_LABELS[rapat.status] ?? rapat.status}
                            </Badge>
                            <span className="text-muted-foreground">
                                Tanggal:{' '}
                                <span className="font-medium">
                                    {rapat.tanggal}
                                </span>
                            </span>
                            {tanggalWaktu && (
                                <span className="text-muted-foreground">
                                    Waktu:{' '}
                                    <span className="font-medium">
                                        {tanggalWaktu}
                                    </span>
                                </span>
                            )}
                            {canManage && (
                                <Link
                                    href={`/rapat/${rapat.id}/edit`}
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    Edit Rapat
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-b pb-2 text-xs">
                        {(['detail', 'notulensi', 'hasil', 'evaluasi', 'presensi'] as TabKey[]).map(
                            (key) => (
                                <Button
                                    key={key}
                                    type="button"
                                    size="sm"
                                    variant={tab === key ? 'default' : 'ghost'}
                                    onClick={() => setTab(key)}
                                >
                                    {key === 'detail' && 'Detail Rapat'}
                                    {key === 'notulensi' && 'Notulensi'}
                                    {key === 'hasil' && 'Hasil'}
                                    {key === 'evaluasi' && 'Evaluasi'}
                                    {key === 'presensi' && 'Presensi'}
                                </Button>
                            ),
                        )}
                    </div>

                    {tab === 'detail' && (
                        <div className="space-y-3 text-sm">
                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Judul
                                    </div>
                                    <div className="font-medium">{rapat.judul}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Jenis Rapat
                                    </div>
                                    <div>{rapat.jenis_rapat?.nama || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Kategori
                                    </div>
                                    <div>{formatKategori(rapat.kategori)}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Proker Terkait
                                    </div>
                                    <div>{rapat.proker?.nama_lengkap || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Tanggal
                                    </div>
                                    <div>{rapat.tanggal}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Waktu
                                    </div>
                                    <div>{tanggalWaktu || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Lokasi
                                    </div>
                                    <div>{rapat.lokasi || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Link Dokumentasi
                                    </div>
                                    <div>
                                        {rapat.link_dokumentasi ? (
                                            <a
                                                href={rapat.link_dokumentasi}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-primary underline"
                                            >
                                                {rapat.link_dokumentasi}
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Deskripsi
                                </div>
                                <div>{rapat.deskripsi || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Target Peserta
                                </div>
                                <div>{formatTargetPeserta(rapat)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">
                                    Dibuat oleh
                                </div>
                                <div>
                                    {rapat.creator?.name || '-'}{' '}
                                    <span className="text-xs text-muted-foreground">
                                        ({rapat.creator?.email || 'tanpa email'})
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'notulensi' && (
                        <form onSubmit={handleSaveNotulensi} className="space-y-4 text-sm">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-muted-foreground">
                                            Notulensi Rapat
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Isi ringkasan pembahasan rapat di sini.
                                        </p>
                                    </div>
                                    {!canManage && (
                                        <span className="text-[11px] text-muted-foreground">
                                            Hanya pembuat rapat atau ketum yang dapat
                                            mengubah notulensi.
                                        </span>
                                    )}
                                </div>
                                <textarea
                                    className="mt-2 min-h-[200px] w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.notulensi}
                                    onChange={(e) => setData('notulensi', e.target.value)}
                                    disabled={!canManage}
                                />
                                <InputError message={errors.notulensi} />
                            </div>
                            {canManage && (
                                <div className="flex justify-end gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Notulensi'}
                                    </Button>
                                </div>
                            )}
                        </form>
                    )}

                    {tab === 'hasil' && (
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-xs font-semibold text-muted-foreground">
                                    Hasil dan Keputusan Rapat
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Daftar ini bersifat hanya baca. Pengelolaan detail hasil
                                    dapat dilakukan dari modul lain jika diperlukan.
                                </p>
                            </div>
                            {hasilItems.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Belum ada hasil yang tercatat untuk rapat ini.
                                </p>
                            )}
                            {hasilItems.length > 0 && (
                                <ul className="space-y-1 text-xs">
                                    {hasilItems.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-start gap-2 rounded-md border bg-muted/40 px-3 py-2"
                                        >
                                            <span className="mt-0.5 text-xs">
                                                {item.done ? '☑' : '☐'}
                                            </span>
                                            <span>{item.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {tab === 'evaluasi' && (
                        <form onSubmit={handleSaveEvaluasi} className="space-y-4 text-sm">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-semibold text-muted-foreground">
                                            Evaluasi Rapat
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Catat evaluasi dan tindak lanjut rapat di sini.
                                        </p>
                                    </div>
                                    {!canManage && (
                                        <span className="text-[11px] text-muted-foreground">
                                            Hanya pembuat rapat atau ketum yang dapat
                                            mengubah evaluasi.
                                        </span>
                                    )}
                                </div>
                                <textarea
                                    className="mt-2 min-h-[200px] w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={data.evaluasi}
                                    onChange={(e) => setData('evaluasi', e.target.value)}
                                    disabled={!canManage}
                                />
                                <InputError message={errors.evaluasi} />
                            </div>
                            {canManage && (
                                <div className="flex justify-end gap-2">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Evaluasi'}
                                    </Button>
                                </div>
                            )}
                        </form>
                    )}

                    {tab === 'presensi' && (
                        <div className="space-y-3 text-xs">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="text-sm font-semibold">Presensi Rapat</div>
                                    <p className="text-xs text-muted-foreground">
                                        Kelola daftar kehadiran peserta rapat.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                    <div className="rounded-full border bg-muted/50 px-3 py-1">
                                        <span className="font-medium">Total:</span>{' '}
                                        {presensiCounts.total}
                                        <span className="mx-1.5">•</span>
                                        <span className="text-green-700">
                                            Hadir {presensiCounts.hadir}
                                        </span>
                                        <span className="mx-1.5 text-yellow-700">
                                            Izin {presensiCounts.izin}
                                        </span>
                                        <span className="mx-1.5 text-blue-700">
                                            Sakit {presensiCounts.sakit}
                                        </span>
                                        <span className="mx-1.5 text-red-700">
                                            Alpa {presensiCounts.alpa}
                                        </span>
                                    </div>
                                    {canManagePresensi && presensiItems.length === 0 && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleGeneratePresensi}
                                            disabled={isGeneratingPresensi}
                                        >
                                            {isGeneratingPresensi && (
                                                <Spinner className="mr-1.5 size-3" />
                                            )}
                                            Generate Peserta
                                        </Button>
                                    )}
                                    {canManagePresensi && presensiItems.length > 0 && (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleSavePresensi}
                                            disabled={isSavingPresensi}
                                        >
                                            {isSavingPresensi && (
                                                <Spinner className="mr-1.5 size-3" />
                                            )}
                                            Simpan Presensi
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {canManagePresensi && presensiItems.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
                                    <span className="text-[11px] font-medium">
                                        Aksi cepat untuk baris terpilih:
                                    </span>
                                    <Button
                                        type="button"
                                        size="xs"
                                        variant="outline"
                                        disabled={!anySelected}
                                        onClick={() => handleBulkSetStatus('hadir')}
                                    >
                                        Tandai Hadir
                                    </Button>
                                    <Button
                                        type="button"
                                        size="xs"
                                        variant="outline"
                                        disabled={!anySelected}
                                        onClick={handleBulkReset}
                                    >
                                        Reset Status
                                    </Button>
                                    <span className="text-[11px] text-muted-foreground">
                                        {anySelected
                                            ? 'Beberapa baris dipilih.'
                                            : 'Pilih baris presensi untuk mengaktifkan aksi.'}
                                    </span>
                                </div>
                            )}

                            <div className="overflow-x-auto rounded-lg border bg-background">
                                <table className="w-full min-w-[720px] text-left text-xs">
                                    <thead className="sticky top-0 z-10 border-b bg-muted/60 text-[11px] uppercase text-muted-foreground">
                                        <tr>
                                            <th className="px-3 py-2">
                                                {canManagePresensi && presensiItems.length > 0 && (
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4"
                                                        checked={
                                                            presensiItems.length > 0 &&
                                                            presensiItems.every(
                                                                (item) => item.selected,
                                                            )
                                                        }
                                                        onChange={(e) =>
                                                            handleToggleSelectAll(e.target.checked)
                                                        }
                                                    />
                                                )}
                                            </th>
                                            <th className="px-3 py-2">Nama</th>
                                            <th className="px-3 py-2">Divisi</th>
                                            <th className="px-3 py-2">Status Kehadiran</th>
                                            <th className="px-3 py-2">Keterangan</th>
                                            {canManagePresensi && (
                                                <th className="px-3 py-2 text-right">Aksi</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {presensiItems.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={canManagePresensi ? 6 : 5}
                                                    className="px-3 py-4 text-center text-xs text-muted-foreground"
                                                >
                                                    Belum ada data presensi untuk rapat ini.
                                                </td>
                                            </tr>
                                        )}
                                        {presensiItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="border-b last:border-0 hover:bg-muted/40"
                                            >
                                                <td className="px-3 py-2">
                                                    {canManagePresensi && (
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4"
                                                            checked={item.selected}
                                                            onChange={(e) =>
                                                                handleToggleSelect(
                                                                    item.anggota_id,
                                                                    e.target.checked,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item.anggota?.nama_lengkap ||
                                                        item.anggota?.user?.name ||
                                                        `ID ${item.anggota_id}`}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item.anggota?.divisi || '-'}
                                                </td>
                                                <td className="px-3 py-1">
                                                    {canManagePresensi ? (
                                                        <select
                                                            className="h-8 w-full rounded-md border bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                            value={item.status_kehadiran}
                                                            onChange={(e) =>
                                                                handleChangeStatus(
                                                                    item.anggota_id,
                                                                    e.target.value as PresensiStatus,
                                                                )
                                                            }
                                                        >
                                                            <option value="hadir">Hadir</option>
                                                            <option value="izin">Izin</option>
                                                            <option value="sakit">Sakit</option>
                                                            <option value="alpa">Alpa</option>
                                                        </select>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            {item.status_kehadiran}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-3 py-1">
                                                    {canManagePresensi ? (
                                                        <textarea
                                                            className="h-8 w-full rounded-md border bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                            value={item.keterangan ?? ''}
                                                            onChange={(e) =>
                                                                handleChangeKeterangan(
                                                                    item.anggota_id,
                                                                    e.target.value,
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <span>{item.keterangan || '-'}</span>
                                                    )}
                                                </td>
                                                {canManagePresensi && (
                                                    <td className="px-3 py-2 text-right">
                                                        <Button
                                                            type="button"
                                                            size="xs"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleRemove(item.anggota_id)
                                                            }
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {canManagePresensi && (
                                <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] font-semibold">
                                            Tambah Anggota Manual
                                        </span>
                                        <input
                                            type="text"
                                            className="h-8 w-full max-w-[200px] rounded-md border bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            placeholder="Cari nama atau divisi"
                                            value={searchAnggota}
                                            onChange={(e) => setSearchAnggota(e.target.value)}
                                        />
                                        <select
                                            className="h-8 w-full max-w-[260px] rounded-md border bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={manualAnggotaId}
                                            onChange={(e) => setManualAnggotaId(e.target.value)}
                                        >
                                            <option value="">Pilih anggota</option>
                                            {filteredAnggota.map((item) => (
                                                <option key={item.id} value={String(item.id)}>
                                                    {(item.nama_lengkap ||
                                                        item.user?.name ||
                                                        '-') +
                                                        (item.divisi ? ` • ${item.divisi}` : '')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <textarea
                                            className="h-8 w-full max-w-[260px] rounded-md border bg-background px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            placeholder="Keterangan (opsional)"
                                            value={manualKeterangan}
                                            onChange={(e) => setManualKeterangan(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            size="xs"
                                            onClick={handleAddManual}
                                            disabled={isAddingManual || !manualAnggotaId}
                                        >
                                            {isAddingManual && (
                                                <Spinner className="mr-1.5 size-3" />
                                            )}
                                            Tambah Anggota
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
