import { Head, useForm } from '@inertiajs/react';
import { CheckSquare2, Square } from 'lucide-react';
import { useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota, Paginator, Role } from '@/types/anggota';

interface BulkCreateProps {
    anggotas: Paginator<Anggota>;
}

interface BulkItem {
    anggota_id: number;
    name: string;
    email: string;
    password: string;
    role: Role | '';
    selected: boolean;
    hidden?: boolean;
}

interface BulkForm {
    items: BulkItem[];
}

type ClientErrors = Partial<Record<string, string>>;

const ROLES: Role[] = [
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

type Step = 'select' | 'review';

export default function BulkCreate({ anggotas }: BulkCreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manajemen Akun',
            href: '/user-account',
        },
        {
            title: 'Buat Akun Massal',
            href: '/user-account/bulk-create',
        },
    ];

    const initialItems: BulkItem[] = useMemo(
        () =>
            anggotas.data.map((anggota) => ({
                anggota_id: anggota.id,
                name: anggota.nama_lengkap || anggota.user?.name || '',
                email: '',
                password: '',
                role: 'anggota',
                selected: false,
            })),
        [anggotas.data],
    );

    const { data, setData, post, processing, errors, transform } = useForm<BulkForm>({
        items: initialItems,
    });

    const [step, setStep] = useState<Step>('select');
    const [divisiFilter, setDivisiFilter] = useState<string>('');
    const [autoEmailDomain, setAutoEmailDomain] = useState<string>('example.com');
    const [emailMode, setEmailMode] = useState<'auto' | 'manual'>('auto');
    const [passwordMode, setPasswordMode] = useState<'nim' | 'manual'>('nim');
    const [clientErrors, setClientErrors] = useState<ClientErrors>({});
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const filteredItems = useMemo(
        () =>
            data.items.map((item) => {
                const anggota = anggotas.data.find((a) => a.id === item.anggota_id);
                if (!anggota) return item;
                if (divisiFilter && anggota.divisi !== divisiFilter) {
                    return { ...item, hidden: true };
                }
                return { ...item, hidden: false };
            }),
        [data.items, anggotas.data, divisiFilter],
    );

    const toggleSelect = (anggotaId: number) => {
        setData(
            'items',
            data.items.map((item) =>
                item.anggota_id === anggotaId
                    ? { ...item, selected: !item.selected }
                    : item,
            ),
        );
    };

    const toggleSelectAllVisible = () => {
        const anyUnselected = filteredItems.some(
            (item) => !item.hidden && !item.selected,
        );
        setData(
            'items',
            data.items.map((item) => {
                const filtered = filteredItems.find(
                    (fi) => fi.anggota_id === item.anggota_id,
                );
                if (!filtered || filtered.hidden) return item;
                return { ...item, selected: anyUnselected };
            }),
        );
    };

    const applyAutoEmailAndPassword = () => {
        setData(
            'items',
            data.items.map((item) => {
                const anggota = anggotas.data.find((a) => a.id === item.anggota_id);
                if (!anggota || !item.selected) return item;

                let email = item.email;
                if (emailMode === 'auto' && anggota.NIM) {
                    email = `${anggota.NIM}@${autoEmailDomain}`;
                }

                let password = item.password;
                if (passwordMode === 'nim' && anggota.NIM) {
                    password = anggota.NIM;
                }

                return { ...item, email, password };
            }),
        );
    };

    const validateClient = (): boolean => {
        const nextErrors: ClientErrors = {};
        const selectedItems = data.items.filter((item) => item.selected);

        if (selectedItems.length === 0) {
            nextErrors._global = 'Pilih minimal satu anggota.';
        }

        selectedItems.forEach((item, index) => {
            if (!item.email) {
                nextErrors[`items.${index}.email`] = 'Email wajib diisi.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
                nextErrors[`items.${index}.email`] = 'Format email tidak valid.';
            }

            if (!item.role) {
                nextErrors[`items.${index}.role`] = 'Role wajib diisi.';
            }

            if (!item.password || item.password.length < 8) {
                nextErrors[`items.${index}.password`] =
                    'Password minimal 8 karakter.';
            }
        });

        setClientErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleNext = () => {
        if (step === 'select') {
            applyAutoEmailAndPassword();
            if (!validateClient()) return;
            setStep('review');
        }
    };

    const handleBack = () => {
        if (step === 'review') {
            setStep('select');
        }
    };

    const handleSubmit = () => {
        if (!validateClient()) {
            setStep('select');
            return;
        }

        transform((formData) => ({
            items: formData.items
                .filter((item) => item.selected)
                .map((item) => ({
                    anggota_id: item.anggota_id,
                    name: item.name,
                    email: item.email,
                    password: item.password,
                    role: item.role,
                })),
        }));

        post('/user-account/bulk-store', {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Akun massal berhasil dibuat.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal membuat akun massal.',
                });
            },
        });
    };

    const selectedCount = data.items.filter((item) => item.selected).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Akun Massal" />

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

                <div className="mx-auto max-w-5xl space-y-4">
                    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-lg font-semibold">Buat Akun Massal</h1>
                            <p className="text-sm text-muted-foreground">
                                Pilih anggota dan review akun sebelum dibuat.
                            </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Langkah: {step === 'select' ? 'Pilih & Konfigurasi' : 'Review'}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[2fr_3fr]">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    Pengaturan Otomatis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="space-y-1">
                                    <Label>Filter Divisi</Label>
                                    <Select
                                        value={divisiFilter || 'all'}
                                        onValueChange={(value) =>
                                            setDivisiFilter(value === 'all' ? '' : value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua divisi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua divisi</SelectItem>
                                            <SelectItem value="musik">Musik</SelectItem>
                                            <SelectItem value="foto">Foto</SelectItem>
                                            <SelectItem value="film">Film</SelectItem>
                                            <SelectItem value="tari">Tari</SelectItem>
                                            <SelectItem value="teater">Teater</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={emailMode === 'auto' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setEmailMode('auto')}
                                        >
                                            Auto (NIM@domain)
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={
                                                emailMode === 'manual' ? 'default' : 'outline'
                                            }
                                            size="sm"
                                            onClick={() => setEmailMode('manual')}
                                        >
                                            Manual
                                        </Button>
                                    </div>
                                    {emailMode === 'auto' && (
                                        <div className="space-y-1">
                                            <Label>Domain Email</Label>
                                            <Input
                                                value={autoEmailDomain}
                                                onChange={(e) =>
                                                    setAutoEmailDomain(e.target.value)
                                                }
                                                placeholder="example.com"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Password</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant={passwordMode === 'nim' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setPasswordMode('nim')}
                                        >
                                            Default: NIM
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={
                                                passwordMode === 'manual'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() => setPasswordMode('manual')}
                                        >
                                            Manual
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs text-muted-foreground">
                                    <div>
                                        Dipilih: <span className="font-semibold">{selectedCount}</span>{' '}
                                        anggota
                                    </div>
                                    {clientErrors._global && (
                                        <div className="text-red-600">
                                            {clientErrors._global}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">
                                    {step === 'select'
                                        ? 'Pilih Anggota & Isi Data'
                                        : 'Review Akun yang Akan Dibuat'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 text-primary"
                                        onClick={toggleSelectAllVisible}
                                    >
                                        <CheckSquare2 className="h-4 w-4" />
                                        <span>Pilih / hapus semua yang terlihat</span>
                                    </button>
                                </div>

                                <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1 text-xs">
                                    {filteredItems.map((item) => {
                                        if (item.hidden) return null;
                                        const anggota = anggotas.data.find(
                                            (a) => a.id === item.anggota_id,
                                        );
                                        if (!anggota) return null;
                                        const index = data.items.findIndex(
                                            (i) => i.anggota_id === item.anggota_id,
                                        );
                                        const errorEmail =
                                            clientErrors[`items.${index}.email`] ||
                                            errors[`items.${index}.email`];
                                        const errorPassword =
                                            clientErrors[`items.${index}.password`] ||
                                            errors[`items.${index}.password`];
                                        const errorRole =
                                            clientErrors[`items.${index}.role`] ||
                                            errors[`items.${index}.role`];

                                        return (
                                            <div
                                                key={item.anggota_id}
                                                className={`rounded-md border p-2 ${
                                                    item.selected
                                                        ? 'border-primary/70 bg-primary/5'
                                                        : ''
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <button
                                                        type="button"
                                                        className="flex items-center gap-2"
                                                        onClick={() =>
                                                            toggleSelect(item.anggota_id)
                                                        }
                                                    >
                                                        {item.selected ? (
                                                            <CheckSquare2 className="h-4 w-4 text-primary" />
                                                        ) : (
                                                            <Square className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        <div className="text-left">
                                                            <div className="font-medium">
                                                                {anggota.nama_lengkap ||
                                                                    anggota.user?.name ||
                                                                    `Anggota #${anggota.id}`}
                                                            </div>
                                                            <div className="text-[11px] text-muted-foreground">
                                                                NIM {anggota.NIM || '-'} ·{' '}
                                                                {anggota.divisi || '-'}
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>

                                                {item.selected && (
                                                    <div className="mt-2 grid gap-2 md:grid-cols-3">
                                                        <div className="space-y-1 md:col-span-1">
                                                            <Label className="text-[11px]">
                                                                Email
                                                            </Label>
                                                            <Input
                                                                value={item.email}
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'items',
                                                                        data.items.map(
                                                                            (i) =>
                                                                                i.anggota_id ===
                                                                                item.anggota_id
                                                                                    ? {
                                                                                          ...i,
                                                                                          email: e
                                                                                              .target
                                                                                              .value,
                                                                                      }
                                                                                    : i,
                                                                        ),
                                                                    )
                                                                }
                                                                className="h-7 text-[11px]"
                                                            />
                                                            {errorEmail && (
                                                                <InputError
                                                                    className="text-[11px]"
                                                                    message={String(
                                                                        errorEmail,
                                                                    )}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="space-y-1 md:col-span-1">
                                                            <Label className="text-[11px]">
                                                                Password
                                                            </Label>
                                                            <Input
                                                                value={item.password}
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'items',
                                                                        data.items.map(
                                                                            (i) =>
                                                                                i.anggota_id ===
                                                                                item.anggota_id
                                                                                    ? {
                                                                                          ...i,
                                                                                          password:
                                                                                              e
                                                                                                  .target
                                                                                                  .value,
                                                                                      }
                                                                                    : i,
                                                                        ),
                                                                    )
                                                                }
                                                                className="h-7 text-[11px]"
                                                            />
                                                            {errorPassword && (
                                                                <InputError
                                                                    className="text-[11px]"
                                                                    message={String(
                                                                        errorPassword,
                                                                    )}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="space-y-1 md:col-span-1">
                                                            <Label className="text-[11px]">
                                                                Role
                                                            </Label>
                                                            <Select
                                                                value={item.role}
                                                                onValueChange={(value) =>
                                                                    setData(
                                                                        'items',
                                                                        data.items.map(
                                                                            (i) =>
                                                                                i.anggota_id ===
                                                                                item.anggota_id
                                                                                    ? {
                                                                                          ...i,
                                                                                          role: value as Role,
                                                                                      }
                                                                                    : i,
                                                                        ),
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="h-7 text-[11px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {ROLES.map((role) => (
                                                                        <SelectItem
                                                                            key={role}
                                                                            value={role}
                                                                        >
                                                                            {role}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            {errorRole && (
                                                                <InputError
                                                                    className="text-[11px]"
                                                                    message={String(errorRole)}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {step === 'review' && (
                                    <div className="space-y-2 text-xs text-muted-foreground">
                                        <div className="font-semibold">
                                            Preview akun yang akan dibuat:
                                        </div>
                                        {data.items.filter((i) => i.selected).length === 0 ? (
                                            <div>Tidak ada akun yang akan dibuat.</div>
                                        ) : (
                                            <ul className="list-inside list-disc space-y-1">
                                                {data.items
                                                    .filter((i) => i.selected)
                                                    .map((item) => {
                                                        const anggota = anggotas.data.find(
                                                            (a) =>
                                                                a.id === item.anggota_id,
                                                        );
                                                        if (!anggota) return null;
                                                        return (
                                                            <li key={item.anggota_id}>
                                                                {anggota.nama_lengkap ||
                                                                    anggota.user?.name ||
                                                                    `Anggota #${anggota.id}`}{' '}
                                                                - {item.email} ({item.role})
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-between gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleBack}
                            disabled={step === 'select'}
                        >
                            Kembali
                        </Button>
                        <div className="flex gap-2">
                            {step === 'select' && (
                                <Button type="button" onClick={handleNext}>
                                    Lanjut Review
                                </Button>
                            )}
                            {step === 'review' && (
                                <Button
                                    type="button"
                                    disabled={processing}
                                    onClick={handleSubmit}
                                >
                                    {processing && <Spinner />}
                                    Create All
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
