import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, Lock } from 'lucide-react';
import { useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    RadioGroup,
    RadioGroupItem,
} from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota, Divisi, Role, StatusAnggota } from '@/types/anggota';

type RapatStatus = 'draft' | 'dijadwalkan' | 'berlangsung' | 'selesai' | 'dibatalkan';

type TargetPeserta = 'semua' | 'divisi' | 'role' | 'proker_team' | 'custom';

interface JenisRapat {
    id: number;
    nama: string;
    deskripsi: string | null;
}

interface ProkerAnggota {
    id: number;
    anggota?: Anggota | null;
}

interface Proker {
    id: number;
    nama_lengkap: string;
    proker_strukturs?: ProkerAnggota[];
}

interface Rapat {
    id: number;
    judul: string;
    jenis_rapat_id: number;
    kategori: string;
    proker_id: number | null;
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
        divisi?: Divisi[];
        role?: Role[];
        anggota_ids?: number[];
        [key: string]: unknown;
    } | null;
}

interface EditProps {
    rapat: Rapat;
    jenisRapats: JenisRapat[];
    prokers: Proker[];
    anggota: Anggota[];
}

interface TargetDetail {
    divisi: Divisi[];
    role: Role[];
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
    target_peserta: TargetPeserta | '';
    target_detail: TargetDetail;
}

const ACTIVE_STATUSES: StatusAnggota[] = [
    'calon_anggota',
    'anggota_muda',
    'anggota_tetap',
];

const ALL_DIVISI: Divisi[] = ['musik', 'tari', 'film', 'foto', 'teater'];

const RAPAT_ROLES: Role[] = [
    'rajawebsite',
    'ketum_waketum',
    'sekretaris',
    'bendahara',
    'dm',
    'humas',
    'kad_fot',
    'kad_fil',
    'kad_tar',
    'kad_mus',
    'kad_tea',
    'rt',
    'litbang',
    'pelatih',
    'pembina',
    'po',
    'anggota',
];

const roleLabel = (role: Role) => {
    if (role === 'rajawebsite') return 'Raja Website';
    if (role === 'ketum_waketum') return 'Ketum/Waketum';
    if (role === 'dm') return 'DM';
    if (role === 'kad_fot') return 'Kadiv Foto';
    if (role === 'kad_fil') return 'Kadiv Film';
    if (role === 'kad_tar') return 'Kadiv Tari';
    if (role === 'kad_mus') return 'Kadiv Musik';
    if (role === 'kad_tea') return 'Kadiv Teater';
    if (role === 'rt') return 'RT';
    if (role === 'po') return 'PO';
    if (role === 'litbang') return 'Litbang';
    return role.charAt(0).toUpperCase() + role.slice(1);
};

const divisiLabel = (divisi: Divisi) => {
    if (divisi === 'musik') return 'Musik';
    if (divisi === 'tari') return 'Tari';
    if (divisi === 'film') return 'Film';
    if (divisi === 'foto') return 'Foto';
    if (divisi === 'teater') return 'Teater';
    return divisi;
};

const statusAnggotaLabel = (status: StatusAnggota) => {
    if (status === 'calon_anggota') return 'Calon Anggota';
    if (status === 'anggota_muda') return 'Anggota Muda';
    if (status === 'anggota_tetap') return 'Anggota Tetap';
    if (status === 'nonaktif') return 'Nonaktif';
    if (status === 'alumni') return 'Alumni';
    if (status === 'pembina') return 'Pembina';
    if (status === 'pelatih') return 'Pelatih';
    if (status === 'lain') return 'Lainnya';
    return status;
};

const getActiveAnggota = (list: Anggota[]) =>
    list.filter((a) => ACTIVE_STATUSES.includes(a.status_anggota));

const generatePesertaPreview = (
    form: RapatForm,
    anggota: Anggota[],
    prokers: Proker[],
) => {
    const activeAnggota = getActiveAnggota(anggota);

    if (form.target_peserta === 'semua') {
        return activeAnggota;
    }

    if (form.target_peserta === 'divisi') {
        if (!form.target_detail.divisi.length) {
            return [];
        }
        return activeAnggota.filter(
            (a) => a.divisi && form.target_detail.divisi.includes(a.divisi),
        );
    }

    if (form.target_peserta === 'role') {
        if (!form.target_detail.role.length) {
            return [];
        }
        return activeAnggota.filter((a) => {
            const role = (a.user?.role ?? null) as Role | null;
            return role ? form.target_detail.role.includes(role) : false;
        });
    }

    if (form.target_peserta === 'proker_team') {
        if (!form.proker_id) {
            return [];
        }
        const proker = prokers.find((p) => String(p.id) === form.proker_id);
        if (!proker || !proker.proker_strukturs) {
            return [];
        }
        const anggotaFromStruktur = proker.proker_strukturs
            .map((s) => s.anggota)
            .filter((a): a is Anggota => Boolean(a));
        const ids = new Set(anggotaFromStruktur.map((a) => a.id));
        return activeAnggota.filter((a) => ids.has(a.id));
    }

    if (form.target_peserta === 'custom') {
        if (!form.target_detail.anggota_ids.length) {
            return [];
        }
        const ids = new Set(form.target_detail.anggota_ids);
        return activeAnggota.filter((a) => ids.has(a.id));
    }

    return [];
};

const breadcrumbs = (rapat: Rapat): BreadcrumbItem[] => [
    {
        title: 'Rapat',
        href: '/rapat',
    },
    {
        title: rapat.judul,
        href: `/rapat/${rapat.id}/edit`,
    },
];

export default function Edit({ rapat, jenisRapats, prokers, anggota }: EditProps) {
    const detail: TargetDetail = {
        divisi: (rapat.target_detail?.divisi ?? []) as Divisi[],
        role: (rapat.target_detail?.role ?? []) as Role[],
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
        target_peserta: rapat.target_peserta ?? '',
        target_detail: detail,
    });

    const [step, setStep] = useState(1);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );
    const [filterDivisi, setFilterDivisi] = useState<Divisi | ''>('');
    const [filterStatus, setFilterStatus] = useState<StatusAnggota | ''>('');
    const [searchNama, setSearchNama] = useState('');

    const isReadOnly = rapat.status === 'selesai';

    const selectedProker =
        data.proker_id !== ''
            ? prokers.find((p) => String(p.id) === data.proker_id) ?? null
            : null;

    const pesertaPreview = useMemo(
        () => generatePesertaPreview(data, anggota, prokers),
        [data, anggota, prokers],
    );

    const anggotaFiltered = useMemo(() => {
        let list = getActiveAnggota(anggota);
        if (filterDivisi) {
            list = list.filter((a) => a.divisi === filterDivisi);
        }
        if (filterStatus) {
            list = list.filter((a) => a.status_anggota === filterStatus);
        }
        if (searchNama.trim() !== '') {
            const term = searchNama.toLowerCase();
            list = list.filter((a) =>
                (a.nama_lengkap || a.user?.name || '').toLowerCase().includes(term),
            );
        }
        return list;
    }, [anggota, filterDivisi, filterStatus, searchNama]);

    const goNext = () => {
        if (step < 3) {
            setStep((prev) => prev + 1);
        }
    };

    const goPrev = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const toggleDivisi = (value: Divisi) => {
        const exists = data.target_detail.divisi.includes(value);
        const next = exists
            ? data.target_detail.divisi.filter((d) => d !== value)
            : [...data.target_detail.divisi, value];
        setData('target_detail', {
            ...data.target_detail,
            divisi: next,
        });
    };

    const toggleRole = (value: Role) => {
        const exists = data.target_detail.role.includes(value);
        const next = exists
            ? data.target_detail.role.filter((r) => r !== value)
            : [...data.target_detail.role, value];
        setData('target_detail', {
            ...data.target_detail,
            role: next,
        });
    };

    const toggleAnggota = (id: number) => {
        const exists = data.target_detail.anggota_ids.includes(id);
        const next = exists
            ? data.target_detail.anggota_ids.filter((a) => a !== id)
            : [...data.target_detail.anggota_ids, id];
        setData('target_detail', {
            ...data.target_detail,
            anggota_ids: next,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isReadOnly) {
            return;
        }

        put(`/rapat/${rapat.id}`, {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Rapat berhasil diperbarui.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Terjadi kesalahan saat memperbarui rapat.',
                });
            },
        });
    };

    const pesertaPreviewSummary = () => {
        if (!data.target_peserta) {
            return 'Pilih target peserta terlebih dahulu.';
        }
        if (pesertaPreview.length === 0) {
            return 'Belum ada peserta yang cocok dengan kriteria.';
        }
        const names = pesertaPreview.slice(0, 5).map(
            (a) => a.nama_lengkap || a.user?.name || `ID ${a.id}`,
        );
        const remaining = pesertaPreview.length - names.length;
        if (remaining > 0) {
            return `${names.join(', ')} dan ${remaining} lainnya.`;
        }
        return names.join(', ');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(rapat)}>
            <Head title={`Edit Rapat - ${rapat.judul}`} />

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

                <div className="mx-auto max-w-4xl space-y-6 rounded-lg border bg-background p-4 md:p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">Edit Rapat</h1>
                            <p className="text-sm text-muted-foreground">
                                Perbarui informasi rapat dan target pesertanya.
                            </p>
                        </div>
                        {isReadOnly && (
                            <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-900">
                                <Lock className="h-4 w-4" />
                                <span>
                                    Rapat dengan status selesai tidak dapat diubah dari
                                    halaman ini.
                                </span>
                            </div>
                        )}
                    </div>

                    <ol className="flex flex-col justify-between gap-2 text-xs text-muted-foreground md:flex-row">
                        {[1, 2, 3].map((id) => {
                            const isActive = id === step;
                            const isDone = id < step;
                            const label =
                                id === 1
                                    ? 'Info Dasar'
                                    : id === 2
                                      ? 'Target Peserta'
                                      : 'Review';
                            return (
                                <li
                                    key={id}
                                    className={`flex flex-1 items-center gap-2 rounded-md border px-3 py-2 ${
                                        isActive
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : isDone
                                              ? 'border-green-300 bg-green-50 text-green-800'
                                              : 'border-border bg-muted/30'
                                    }`}
                                >
                                    {isDone ? (
                                        <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]">
                                            {id}
                                        </span>
                                    )}
                                    <span>{label}</span>
                                </li>
                            );
                        })}
                    </ol>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="judul">Judul Rapat</Label>
                                    <Input
                                        id="judul"
                                        value={data.judul}
                                        disabled={isReadOnly}
                                        onChange={(e) =>
                                            setData('judul', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.judul} />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label>Jenis Rapat</Label>
                                        <Select
                                            value={data.jenis_rapat_id}
                                            onValueChange={(value) =>
                                                setData('jenis_rapat_id', value)
                                            }
                                            disabled={isReadOnly}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
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
                                        <InputError message={errors.jenis_rapat_id} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Kategori</Label>
                                        <Select
                                            value={data.kategori}
                                            onValueChange={(value) =>
                                                setData('kategori', value)
                                            }
                                            disabled={isReadOnly}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="proker">Proker</SelectItem>
                                                <SelectItem value="non_proker">
                                                    Non Proker
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.kategori} />
                                    </div>
                                </div>

                                {data.kategori === 'proker' && (
                                    <div className="space-y-1">
                                        <Label>Proker Terkait</Label>
                                        <Select
                                            value={data.proker_id}
                                            onValueChange={(value) =>
                                                setData('proker_id', value)
                                            }
                                            disabled={isReadOnly}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih proker" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {prokers.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={String(p.id)}
                                                    >
                                                        {p.nama_lengkap}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.proker_id} />
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="tanggal">Tanggal</Label>
                                        <Input
                                            id="tanggal"
                                            type="date"
                                            value={data.tanggal}
                                            disabled={isReadOnly}
                                            onChange={(e) =>
                                                setData('tanggal', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.tanggal} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="waktu_mulai">Waktu Mulai</Label>
                                        <Input
                                            id="waktu_mulai"
                                            type="time"
                                            value={data.waktu_mulai}
                                            disabled={isReadOnly}
                                            onChange={(e) =>
                                                setData('waktu_mulai', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.waktu_mulai} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="waktu_selesai">Waktu Selesai</Label>
                                        <Input
                                            id="waktu_selesai"
                                            type="time"
                                            value={data.waktu_selesai}
                                            disabled={isReadOnly}
                                            onChange={(e) =>
                                                setData('waktu_selesai', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.waktu_selesai} />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="lokasi">Lokasi</Label>
                                        <Input
                                            id="lokasi"
                                            value={data.lokasi}
                                            disabled={isReadOnly}
                                            onChange={(e) =>
                                                setData('lokasi', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.lokasi} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="link_dokumentasi">
                                            Link Dokumentasi
                                        </Label>
                                        <Input
                                            id="link_dokumentasi"
                                            value={data.link_dokumentasi}
                                            disabled={isReadOnly}
                                            onChange={(e) =>
                                                setData('link_dokumentasi', e.target.value)
                                            }
                                        />
                                        <InputError message={errors.link_dokumentasi} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <textarea
                                        id="deskripsi"
                                        className="mt-1 min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={data.deskripsi}
                                        disabled={isReadOnly}
                                        onChange={(e) =>
                                            setData('deskripsi', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.deskripsi} />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Target Peserta</Label>
                                    <RadioGroup
                                        value={data.target_peserta}
                                        onValueChange={(value: TargetPeserta) =>
                                            setData('target_peserta', value)
                                        }
                                        className="grid gap-2 md:grid-cols-2"
                                    >
                                        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
                                            <RadioGroupItem value="semua" disabled={isReadOnly} />
                                            <span className="font-medium">Semua Anggota Aktif</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
                                            <RadioGroupItem value="divisi" disabled={isReadOnly} />
                                            <span className="font-medium">Berdasarkan Divisi</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
                                            <RadioGroupItem value="role" disabled={isReadOnly} />
                                            <span className="font-medium">Berdasarkan Role</span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
                                            <RadioGroupItem
                                                value="proker_team"
                                                disabled={isReadOnly}
                                            />
                                            <span className="font-medium">
                                                Tim Proker (jika kategori proker)
                                            </span>
                                        </label>
                                        <label className="flex cursor-pointer items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-xs md:col-span-2">
                                            <RadioGroupItem
                                                value="custom"
                                                disabled={isReadOnly}
                                            />
                                            <span className="font-medium">
                                                Custom (pilih anggota secara spesifik)
                                            </span>
                                        </label>
                                    </RadioGroup>
                                    <InputError message={errors.target_peserta} />
                                </div>

                                {data.target_peserta === 'divisi' && (
                                    <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-xs">
                                        <div className="font-semibold">Pilih Divisi</div>
                                        <div className="mt-1 grid gap-2 md:grid-cols-3">
                                            {ALL_DIVISI.map((d) => (
                                                <label
                                                    key={d}
                                                    className="flex cursor-pointer items-center gap-2"
                                                >
                                                    <Checkbox
                                                        checked={data.target_detail.divisi.includes(
                                                            d,
                                                        )}
                                                        disabled={isReadOnly}
                                                        onCheckedChange={() =>
                                                            toggleDivisi(d)
                                                        }
                                                    />
                                                    <span>{divisiLabel(d)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {data.target_peserta === 'role' && (
                                    <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-xs">
                                        <div className="font-semibold">Pilih Role</div>
                                        <div className="mt-1 grid gap-2 md:grid-cols-3">
                                            {RAPAT_ROLES.map((r) => (
                                                <label
                                                    key={r}
                                                    className="flex cursor-pointer items-center gap-2"
                                                >
                                                    <Checkbox
                                                        checked={data.target_detail.role.includes(
                                                            r,
                                                        )}
                                                        disabled={isReadOnly}
                                                        onCheckedChange={() =>
                                                            toggleRole(r)
                                                        }
                                                    />
                                                    <span>{roleLabel(r)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {data.target_peserta === 'proker_team' && (
                                    <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-xs">
                                        <div className="font-semibold">
                                            Tim Proker sebagai Peserta
                                        </div>
                                        {data.kategori !== 'proker' && (
                                            <p className="text-[11px] text-red-700">
                                                Kategori rapat harus Proker untuk
                                                menggunakan target ini.
                                            </p>
                                        )}
                                        {data.kategori === 'proker' && !selectedProker && (
                                            <p className="text-[11px] text-muted-foreground">
                                                Pilih proker terlebih dahulu pada Info
                                                Dasar.
                                            </p>
                                        )}
                                        {data.kategori === 'proker' && selectedProker && (
                                            <div className="mt-2 max-h-40 space-y-1 overflow-auto rounded border bg-background p-2">
                                                {(selectedProker.proker_strukturs ??
                                                    []).length === 0 && (
                                                    <p className="text-[11px] text-muted-foreground">
                                                        Belum ada struktur proker yang
                                                        diatur.
                                                    </p>
                                                )}
                                                {(selectedProker.proker_strukturs ?? []).map(
                                                    (s) => (
                                                        <div
                                                            key={s.id}
                                                            className="flex items-center justify-between gap-2"
                                                        >
                                                            <span className="truncate text-[11px]">
                                                                {s.anggota?.nama_lengkap ||
                                                                    s.anggota?.user?.name ||
                                                                    'Anggota tanpa nama'}
                                                            </span>
                                                            <span className="truncate text-[10px] text-muted-foreground">
                                                                {s.anggota?.divisi
                                                                    ? divisiLabel(
                                                                          s.anggota.divisi,
                                                                      )
                                                                    : '-'}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {data.target_peserta === 'custom' && (
                                    <div className="space-y-3 rounded-md border bg-muted/40 p-3 text-xs">
                                        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                            <div className="space-y-1">
                                                <Label>Filter Divisi</Label>
                                                <Select
                                                    value={filterDivisi || 'all'}
                                                    onValueChange={(value) =>
                                                        setFilterDivisi(
                                                            value === 'all'
                                                                ? ''
                                                                : (value as Divisi),
                                                        )
                                                    }
                                                    disabled={isReadOnly}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue placeholder="Semua divisi" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            Semua divisi
                                                        </SelectItem>
                                                        {ALL_DIVISI.map((d) => (
                                                            <SelectItem
                                                                key={d}
                                                                value={d}
                                                            >
                                                                {divisiLabel(d)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Filter Status</Label>
                                                <Select
                                                    value={filterStatus || 'all'}
                                                    onValueChange={(value) =>
                                                        setFilterStatus(
                                                            value === 'all'
                                                                ? ''
                                                                : (value as StatusAnggota),
                                                        )
                                                    }
                                                    disabled={isReadOnly}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue placeholder="Status aktif" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">
                                                            Semua status aktif
                                                        </SelectItem>
                                                        {ACTIVE_STATUSES.map((s) => (
                                                            <SelectItem
                                                                key={s}
                                                                value={s}
                                                            >
                                                                {statusAnggotaLabel(s)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1 md:flex-1">
                                                <Label>Cari Nama</Label>
                                                <Input
                                                    value={searchNama}
                                                    disabled={isReadOnly}
                                                    onChange={(e) =>
                                                        setSearchNama(e.target.value)
                                                    }
                                                    placeholder="Ketik nama anggota"
                                                    className="h-8"
                                                />
                                            </div>
                                        </div>

                                        <div className="max-h-56 overflow-auto rounded-md border bg-background">
                                            <table className="w-full text-[11px]">
                                                <thead className="border-b bg-muted/40 text-[10px] uppercase text-muted-foreground">
                                                    <tr>
                                                        <th className="px-2 py-1 text-left">
                                                            Pilih
                                                        </th>
                                                        <th className="px-2 py-1 text-left">
                                                            Nama
                                                        </th>
                                                        <th className="px-2 py-1 text-left">
                                                            Divisi
                                                        </th>
                                                        <th className="px-2 py-1 text-left">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {anggotaFiltered.length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                className="px-2 py-3 text-center text-[11px] text-muted-foreground"
                                                            >
                                                                Tidak ada anggota yang
                                                                cocok.
                                                            </td>
                                                        </tr>
                                                    )}
                                                    {anggotaFiltered.map((a) => (
                                                        <tr
                                                            key={a.id}
                                                            className="border-b last:border-0"
                                                        >
                                                            <td className="px-2 py-1">
                                                                <Checkbox
                                                                    checked={data.target_detail.anggota_ids.includes(
                                                                        a.id,
                                                                    )}
                                                                    disabled={isReadOnly}
                                                                    onCheckedChange={() =>
                                                                        toggleAnggota(
                                                                            a.id,
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                {a.nama_lengkap ||
                                                                    a.user?.name ||
                                                                    `ID ${a.id}`}
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                {a.divisi
                                                                    ? divisiLabel(
                                                                          a.divisi,
                                                                      )
                                                                    : '-'}
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                {statusAnggotaLabel(
                                                                    a.status_anggota,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <InputError message={errors.target_detail} />
                                    </div>
                                )}

                                <div className="space-y-1 rounded-md bg-muted/40 p-3 text-xs">
                                    <div className="font-semibold">
                                        Preview Peserta (perkiraan)
                                    </div>
                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        Sistem akan menghasilkan daftar presensi berdasarkan
                                        target peserta.
                                    </p>
                                    <p className="mt-2 text-[11px]">
                                        Total perkiraan peserta:{' '}
                                        <span className="font-semibold">
                                            {pesertaPreview.length}
                                        </span>
                                    </p>
                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                        {pesertaPreviewSummary()}
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 text-sm">
                                <div className="rounded-md bg-muted/60 p-3">
                                    <div className="font-medium">Ringkasan Rapat</div>
                                    <dl className="mt-2 grid gap-2 md:grid-cols-2">
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Judul
                                            </dt>
                                            <dd>{data.judul || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Jenis Rapat
                                            </dt>
                                            <dd>
                                                {data.jenis_rapat_id
                                                    ? jenisRapats.find(
                                                          (j) =>
                                                              String(j.id) ===
                                                              data.jenis_rapat_id,
                                                      )?.nama ?? '-'
                                                    : '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Kategori
                                            </dt>
                                            <dd>
                                                {data.kategori === 'proker'
                                                    ? 'Proker'
                                                    : data.kategori === 'non_proker'
                                                      ? 'Non Proker'
                                                      : '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Proker Terkait
                                            </dt>
                                            <dd>
                                                {selectedProker
                                                    ? selectedProker.nama_lengkap
                                                    : '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Tanggal
                                            </dt>
                                            <dd>{data.tanggal || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Waktu
                                            </dt>
                                            <dd>
                                                {data.waktu_mulai || data.waktu_selesai
                                                    ? [data.waktu_mulai, data.waktu_selesai]
                                                          .filter(Boolean)
                                                          .join(' - ')
                                                    : '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Lokasi
                                            </dt>
                                            <dd>{data.lokasi || '-'}</dd>
                                        </div>
                                        <div className="md:col-span-2">
                                            <dt className="text-xs text-muted-foreground">
                                                Deskripsi
                                            </dt>
                                            <dd>{data.deskripsi || '-'}</dd>
                                        </div>
                                        <div className="md:col-span-2">
                                            <dt className="text-xs text-muted-foreground">
                                                Target Peserta
                                            </dt>
                                            <dd>
                                                {data.target_peserta === 'semua' &&
                                                    'Semua anggota aktif'}
                                                {data.target_peserta === 'divisi' &&
                                                    `Divisi: ${
                                                        data.target_detail.divisi
                                                            .map(divisiLabel)
                                                            .join(', ') || '-'
                                                    }`}
                                                {data.target_peserta === 'role' &&
                                                    `Role: ${
                                                        data.target_detail.role
                                                            .map(roleLabel)
                                                            .join(', ') || '-'
                                                    }`}
                                                {data.target_peserta === 'proker_team' &&
                                                    'Tim proker terkait'}
                                                {data.target_peserta === 'custom' &&
                                                    `Custom, total ${
                                                        data.target_detail.anggota_ids
                                                            .length
                                                    } anggota`}
                                                {!data.target_peserta && '-'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div className="rounded-md bg-muted/40 p-3 text-sm">
                                    <div className="text-xs font-semibold text-muted-foreground">
                                        Preview Peserta
                                    </div>
                                    <p className="mt-1 text-xs">
                                        Total peserta aktif yang terdaftar:{' '}
                                        <span className="font-semibold">
                                            {pesertaPreview.length}
                                        </span>
                                    </p>
                                    <div className="mt-2 max-h-40 overflow-auto rounded border bg-background p-2 text-xs">
                                        {pesertaPreview.length === 0 && (
                                            <p className="text-[11px] text-muted-foreground">
                                                Belum ada peserta yang cocok dengan
                                                kriteria.
                                            </p>
                                        )}
                                        {pesertaPreview.map((a) => (
                                            <div
                                                key={a.id}
                                                className="flex items-center justify-between gap-2 border-b py-1 last:border-0"
                                            >
                                                <span className="truncate">
                                                    {a.nama_lengkap ||
                                                        a.user?.name ||
                                                        `ID ${a.id}`}
                                                </span>
                                                <span className="truncate text-[11px] text-muted-foreground">
                                                    {a.divisi ? divisiLabel(a.divisi) : '-'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={step === 1}
                                onClick={goPrev}
                            >
                                Sebelumnya
                            </Button>
                            {step < 3 ? (
                                <Button type="button" onClick={goNext}>
                                    Selanjutnya
                                </Button>
                            ) : (
                                <Button type="submit" disabled={processing || isReadOnly}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
