import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
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

interface MainProker {
    id: number;
    nama_proker: string;
}

type ProkerStatus = 'draft' | 'aktif' | 'selesai' | 'dibatalkan';

interface KetuaHistoryEntry {
    tanggal: string;
    old_id: number | null;
    new_id: number | null;
    changed_by: number | null;
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
    ketua_pelaksana_history?: KetuaHistoryEntry[] | null;
    [key: string]: unknown;
}

interface EditProps {
    proker: Proker;
    mainProkers: MainProker[];
    ketuaOptions: Anggota[];
}

interface ProkerForm {
    main_proker_id: string;
    nama_main_proker_baru: string;
    nama_lengkap: string;
    tahun: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    deskripsi: string;
    status: ProkerStatus;
    ketua_pelaksana_id: string;
}

const breadcrumbs = (proker: Proker): BreadcrumbItem[] => [
    {
        title: 'Proker',
        href: '/proker',
    },
    {
        title: proker.nama_lengkap,
        href: `/proker/${proker.id}/edit`,
    },
];

export default function Edit({ proker, mainProkers, ketuaOptions }: EditProps) {
    const originalKetuaId = proker.ketua_pelaksana_id;
    const history = (proker.ketua_pelaksana_history ?? []) as KetuaHistoryEntry[];

    const { data, setData, put, processing, errors } = useForm<ProkerForm>({
        main_proker_id: String(proker.main_proker_id),
        nama_main_proker_baru: '',
        nama_lengkap: proker.nama_lengkap,
        tahun: String(proker.tahun),
        tanggal_mulai: proker.tanggal_mulai ?? '',
        tanggal_selesai: proker.tanggal_selesai ?? '',
        deskripsi: proker.deskripsi ?? '',
        status: proker.status,
        ketua_pelaksana_id:
            proker.ketua_pelaksana_id !== null ? String(proker.ketua_pelaksana_id) : '',
    });

    const [statusUpdate, setStatusUpdate] = useState<ProkerStatus>(proker.status);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const selectedKetua =
        data.ketua_pelaksana_id !== ''
            ? ketuaOptions.find((a) => String(a.id) === data.ketua_pelaksana_id) || null
            : null;

    const getAnggotaName = (id: number | null): string => {
        if (id === null) return 'Belum ditentukan';
        const found =
            ketuaOptions.find((a) => a.id === id) ||
            (proker.ketua_pelaksana_id === id ? proker.ketua_pelaksana ?? undefined : undefined);
        if (!found) return `ID ${id}`;
        return found.nama_lengkap || found.user?.name || `ID ${id}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            data.ketua_pelaksana_id !== '' &&
            String(originalKetuaId ?? '') !== data.ketua_pelaksana_id
        ) {
            const confirmChange = window.confirm(
                'Anda yakin ingin mengganti ketua pelaksana untuk proker ini?',
            );
            if (!confirmChange) {
                return;
            }
        }

        put(`/proker/${proker.id}`, {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Proker berhasil diperbarui.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Terjadi kesalahan saat memperbarui proker.',
                });
            },
        });
    };

    const handleUpdateStatus = () => {
        router.post(
            `/proker/${proker.id}/status`,
            {
                status: statusUpdate,
            },
            {
                onSuccess: () => {
                    setToast({
                        type: 'success',
                        message: 'Status proker berhasil diperbarui.',
                    });
                    setStatusDialogOpen(false);
                },
                onError: () => {
                    setToast({
                        type: 'error',
                        message: 'Gagal memperbarui status proker.',
                    });
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(proker)}>
            <Head title={`Edit Proker - ${proker.nama_lengkap}`} />

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

                <div className="mx-auto max-w-3xl space-y-6 rounded-lg border bg-background p-4 md:p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">Edit Proker</h1>
                            <p className="text-sm text-muted-foreground">
                                Perbarui informasi dan ketua pelaksana proker.
                            </p>
                        </div>
                        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" size="sm">
                                    Update Status
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Status Proker</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-900">
                                        <AlertTriangle className="mt-0.5 h-4 w-4" />
                                        <p>
                                            Perubahan status akan mempengaruhi alur proker.
                                            Pastikan status sesuai dengan progres aktual.
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Status Baru</Label>
                                        <Select
                                            value={statusUpdate}
                                            onValueChange={(value) =>
                                                setStatusUpdate(value as ProkerStatus)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="aktif">Aktif</SelectItem>
                                                <SelectItem value="selesai">
                                                    Selesai
                                                </SelectItem>
                                                <SelectItem value="dibatalkan">
                                                    Dibatalkan
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter className="pt-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => setStatusDialogOpen(false)}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="button"
                                        disabled={statusUpdate === proker.status}
                                        onClick={handleUpdateStatus}
                                    >
                                        Simpan Status
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label>Main Proker</Label>
                                <Select
                                    value={data.main_proker_id}
                                    onValueChange={(value) =>
                                        setData('main_proker_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mainProkers.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.nama_proker}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="new">Buat Main Proker Baru</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.main_proker_id} />
                            </div>

                            {data.main_proker_id === 'new' && (
                                <div className="space-y-1">
                                    <Label htmlFor="nama_main_proker_baru">
                                        Nama Main Proker Baru
                                    </Label>
                                    <Input
                                        id="nama_main_proker_baru"
                                        value={data.nama_main_proker_baru}
                                        onChange={(e) =>
                                            setData('nama_main_proker_baru', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.nama_main_proker_baru} />
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label htmlFor="nama_lengkap">Nama Proker</Label>
                                <Input
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) =>
                                        setData('nama_lengkap', e.target.value)
                                    }
                                />
                                <InputError message={errors.nama_lengkap} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-1">
                                    <Label htmlFor="tahun">Tahun</Label>
                                    <Input
                                        id="tahun"
                                        type="number"
                                        value={data.tahun}
                                        onChange={(e) =>
                                            setData('tahun', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.tahun} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                    <Input
                                        id="tanggal_mulai"
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) =>
                                            setData('tanggal_mulai', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.tanggal_mulai} />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                    <Input
                                        id="tanggal_selesai"
                                        type="date"
                                        value={data.tanggal_selesai}
                                        onChange={(e) =>
                                            setData('tanggal_selesai', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.tanggal_selesai} />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Input
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData('deskripsi', e.target.value)
                                    }
                                />
                                <InputError message={errors.deskripsi} />
                            </div>

                            <div className="space-y-1">
                                <Label>Status Proker</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value as ProkerStatus)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                        <SelectItem value="dibatalkan">
                                            Dibatalkan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label>Ketua Pelaksana</Label>
                                <Select
                                    value={data.ketua_pelaksana_id || 'none'}
                                    onValueChange={(value) =>
                                        setData(
                                            'ketua_pelaksana_id',
                                            value === 'none' ? '' : value,
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Belum ditentukan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Belum ditentukan</SelectItem>
                                        {ketuaOptions.map((a) => (
                                            <SelectItem key={a.id} value={String(a.id)}>
                                                {a.nama_lengkap || a.user?.name || '-'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.ketua_pelaksana_id} />
                            </div>

                            {selectedKetua && (
                                <div className="rounded-md bg-muted/60 p-3 text-sm">
                                    <div className="font-medium">
                                        {selectedKetua.nama_lengkap ||
                                            selectedKetua.user?.name ||
                                            '-'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        NIM: {selectedKetua.NIM || '-'} | Divisi:{' '}
                                        {selectedKetua.divisi || '-'}
                                    </div>
                                </div>
                            )}

                            {history.length > 0 && (
                                <div className="space-y-2 rounded-md bg-muted/40 p-3 text-xs">
                                    <div className="font-semibold text-sm">
                                        Riwayat Pergantian Ketua Pelaksana
                                    </div>
                                    <ul className="space-y-1.5">
                                        {history
                                            .slice()
                                            .reverse()
                                            .map((entry, index) => (
                                                <li key={index}>
                                                    <span className="font-medium">
                                                        {entry.tanggal}
                                                    </span>{' '}
                                                    :{' '}
                                                    <span>
                                                        {getAnggotaName(entry.old_id)} →{' '}
                                                        {getAnggotaName(entry.new_id)}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => window.history.back()}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
