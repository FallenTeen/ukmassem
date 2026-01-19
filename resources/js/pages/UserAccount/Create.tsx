import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota, Role } from '@/types/anggota';

interface CreateProps {
    anggota: Anggota;
}

interface CreateForm {
    anggota_id: number;
    name: string;
    email: string;
    password: string;
    role: Role | '';
}

type ClientErrors = Partial<Record<keyof CreateForm, string>>;

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

export default function Create({ anggota }: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Manajemen Akun',
            href: '/user-account',
        },
        {
            title: 'Buat Akun',
            href: `/user-account/create/${anggota.id}`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        anggota_id: anggota.id,
        name: anggota.nama_lengkap || anggota.user?.name || '',
        email: anggota.user?.email || '',
        password: '',
        role: 'anggota',
    });

    const [clientErrors, setClientErrors] = useState<ClientErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const validateClient = (): boolean => {
        const nextErrors: ClientErrors = {};

        if (!data.email) {
            nextErrors.email = 'Email wajib diisi.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            nextErrors.email = 'Format email tidak valid.';
        }

        if (!data.password) {
            nextErrors.password = 'Password wajib diisi.';
        } else if (data.password.length < 8) {
            nextErrors.password = 'Password minimal 8 karakter.';
        }

        if (!data.role) {
            nextErrors.role = 'Role wajib dipilih.';
        }

        setClientErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateClient()) return;

        post('/user-account', {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Akun user berhasil dibuat.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal membuat akun user.',
                });
            },
        });
    };

    const mergedError = (field: keyof CreateForm) => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Akun User" />

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

                <div className="mx-auto max-w-2xl space-y-4 rounded-lg border bg-background p-4 md:p-6">
                    <h1 className="text-lg font-semibold">Buat Akun User</h1>

                    <div className="grid gap-2 rounded-md bg-muted/60 p-3 text-sm md:grid-cols-2">
                        <div>
                            <div className="font-medium">Nama</div>
                            <div className="text-muted-foreground">
                                {anggota.nama_lengkap || anggota.user?.name || '-'}
                            </div>
                        </div>
                        <div>
                            <div className="font-medium">NIM</div>
                            <div className="text-muted-foreground">
                                {anggota.NIM || '-'}
                            </div>
                        </div>
                        <div>
                            <div className="font-medium">Divisi</div>
                            <div className="text-muted-foreground capitalize">
                                {anggota.divisi || '-'}
                            </div>
                        </div>
                        <div>
                            <div className="font-medium">Status Anggota</div>
                            <div className="text-muted-foreground capitalize">
                                {anggota.status_anggota.replace('_', ' ')}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Nama User</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama untuk akun user"
                            />
                            <InputError message={mergedError('name')} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                            <InputError message={mergedError('email')} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <InputError message={mergedError('password')} />
                        </div>

                        <div className="space-y-1">
                            <Label>Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) =>
                                    setData('role', value as Role | '')
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={mergedError('role')} />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => history.back()}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Simpan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

