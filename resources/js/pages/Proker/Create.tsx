import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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

interface CreateProps {
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Proker',
        href: '/proker',
    },
    {
        title: 'Buat Proker',
        href: '/proker/create',
    },
];

const steps = [
    { id: 1, label: 'Info Dasar' },
    { id: 2, label: 'Ketua Pelaksana' },
    { id: 3, label: 'Review & Submit' },
];

export default function Create({ mainProkers, ketuaOptions }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<ProkerForm>({
        main_proker_id: '',
        nama_main_proker_baru: '',
        nama_lengkap: '',
        tahun: String(new Date().getFullYear()),
        tanggal_mulai: '',
        tanggal_selesai: '',
        deskripsi: '',
        status: 'draft',
        ketua_pelaksana_id: '',
    });

    const [step, setStep] = useState(1);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/proker', {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Proker berhasil dibuat.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Terjadi kesalahan saat membuat proker.',
                });
            },
        });
    };

    const selectedMainProker =
        data.main_proker_id && data.main_proker_id !== 'new'
            ? mainProkers.find((m) => String(m.id) === data.main_proker_id) || null
            : null;

    const selectedKetua =
        data.ketua_pelaksana_id !== ''
            ? ketuaOptions.find((a) => String(a.id) === data.ketua_pelaksana_id) || null
            : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Proker" />

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

                <div className="mx-auto max-w-3xl space-y-6 rounded-lg border bg-background p-4 md:p-6">
                    <div>
                        <h1 className="text-lg font-semibold">Buat Proker Baru</h1>
                        <p className="text-sm text-muted-foreground">
                            Lengkapi informasi proker secara bertahap.
                        </p>
                    </div>

                    <ol className="flex flex-col justify-between gap-2 text-xs text-muted-foreground md:flex-row">
                        {steps.map((s) => {
                            const isActive = s.id === step;
                            const isDone = s.id < step;
                            return (
                                <li
                                    key={s.id}
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
                                            {s.id}
                                        </span>
                                    )}
                                    <span>{s.label}</span>
                                </li>
                            );
                        })}
                    </ol>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && (
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
                                            <SelectValue placeholder="Pilih main proker" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mainProkers.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={String(item.id)}
                                                >
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
                                                setData(
                                                    'nama_main_proker_baru',
                                                    e.target.value,
                                                )
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
                                            onChange={(e) => setData('tahun', e.target.value)}
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
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    Ketua pelaksana bersifat opsional dan dapat diatur nanti.
                                </div>
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
                                            <SelectItem value="none">
                                                Belum ditentukan
                                            </SelectItem>
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
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 text-sm">
                                <div className="rounded-md bg-muted/60 p-3">
                                    <div className="font-medium">Ringkasan Proker</div>
                                    <dl className="mt-2 grid gap-2 md:grid-cols-2">
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Nama Proker
                                            </dt>
                                            <dd>{data.nama_lengkap || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Main Proker
                                            </dt>
                                            <dd>
                                                {data.main_proker_id === 'new'
                                                    ? data.nama_main_proker_baru || '-'
                                                    : selectedMainProker?.nama_proker || '-'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Tahun
                                            </dt>
                                            <dd>{data.tahun || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Tanggal
                                            </dt>
                                            <dd>
                                                {data.tanggal_mulai || data.tanggal_selesai
                                                    ? [data.tanggal_mulai, data.tanggal_selesai]
                                                          .filter(Boolean)
                                                          .join(' - ')
                                                    : '-'}
                                            </dd>
                                        </div>
                                        <div className="md:col-span-2">
                                            <dt className="text-xs text-muted-foreground">
                                                Deskripsi
                                            </dt>
                                            <dd>{data.deskripsi || '-'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Status
                                            </dt>
                                            <dd>{data.status}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs text-muted-foreground">
                                                Ketua Pelaksana
                                            </dt>
                                            <dd>
                                                {selectedKetua
                                                    ? selectedKetua.nama_lengkap ||
                                                      selectedKetua.user?.name
                                                    : 'Belum ditentukan'}
                                            </dd>
                                        </div>
                                    </dl>
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
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Proker'}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

