import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota, AnggotaForm, Divisi, StatusAnggota } from '@/types/anggota';

const breadcrumbs = (anggota: Anggota): BreadcrumbItem[] => [
    {
        title: 'Kelola Anggota',
        href: '/kelola-anggota',
    },
    {
        title: anggota.nama_lengkap || anggota.user?.name || 'Detail Anggota',
        href: `/kelola-anggota/${anggota.id}`,
    },
    {
        title: 'Edit',
        href: `/kelola-anggota/${anggota.id}/edit`,
    },
];

type ClientErrors = Partial<Record<keyof AnggotaForm, string>>;

interface EditProps {
    anggota: Anggota;
}

export default function Edit({ anggota }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<AnggotaForm>({
        NIM: anggota.NIM ?? '',
        nomor_anggota: anggota.nomor_anggota ?? '',
        tanggal_lahir: anggota.tanggal_lahir ?? '',
        nama_panggilan: anggota.nama_panggilan ?? [''],
        status_anggota: anggota.status_anggota,
        divisi: anggota.divisi ?? '',
        angkatan: anggota.angkatan ? String(anggota.angkatan) : '',
        alamat: anggota.alamat ?? '',
        nomor_telepon: anggota.nomor_telepon ?? '',
        user_id: anggota.user_id ? String(anggota.user_id) : '',
        email: anggota.user?.email ?? '',
    });

    const [clientErrors, setClientErrors] = useState<ClientErrors>({});
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const handleAddNamaPanggilan = () => {
        setData('nama_panggilan', [...data.nama_panggilan, '']);
    };

    const handleRemoveNamaPanggilan = (index: number) => {
        if (data.nama_panggilan.length === 1) return;
        setData(
            'nama_panggilan',
            data.nama_panggilan.filter((_, i) => i !== index),
        );
    };

    const handleChangeNamaPanggilan = (index: number, value: string) => {
        const next = [...data.nama_panggilan];
        next[index] = value;
        setData('nama_panggilan', next);
    };

    const validateClient = (): boolean => {
        const nextErrors: ClientErrors = {};

        if (!data.status_anggota) {
            nextErrors.status_anggota = 'Status anggota wajib diisi.';
        }

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            nextErrors.email = 'Format email tidak valid.';
        }

        setClientErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateClient()) return;

        put(`/kelola-anggota/${anggota.id}`, {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Berhasil memperbarui data anggota.',
                });
                setClientErrors({});
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal memperbarui data anggota.',
                });
            },
        });
    };

    const mergedErrors = (field: keyof AnggotaForm) => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs(anggota)}>
            <Head title="Edit Anggota" />

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

                <div className="mx-auto max-w-3xl rounded-lg border bg-background p-4 md:p-6">
                    <h1 className="mb-4 text-lg font-semibold">
                        Edit Anggota{' '}
                        {anggota.nama_lengkap || anggota.user?.name || `#${anggota.id}`}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="NIM">NIM</Label>
                                <Input
                                    id="NIM"
                                    value={data.NIM}
                                    onChange={(e) => setData('NIM', e.target.value)}
                                />
                                <InputError message={mergedErrors('NIM')} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nomor_anggota">Nomor Anggota</Label>
                                <Input
                                    id="nomor_anggota"
                                    value={data.nomor_anggota}
                                    onChange={(e) =>
                                        setData('nomor_anggota', e.target.value)
                                    }
                                />
                                <InputError message={mergedErrors('nomor_anggota')} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    value={data.tanggal_lahir}
                                    onChange={(e) =>
                                        setData('tanggal_lahir', e.target.value)
                                    }
                                />
                                <InputError message={mergedErrors('tanggal_lahir')} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="angkatan">Angkatan</Label>
                                <Input
                                    id="angkatan"
                                    type="number"
                                    value={data.angkatan}
                                    onChange={(e) =>
                                        setData('angkatan', e.target.value)
                                    }
                                />
                                <InputError message={mergedErrors('angkatan')} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label>Divisi</Label>
                                <Select
                                    value={data.divisi}
                                    onValueChange={(value) =>
                                        setData('divisi', value as Divisi)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih divisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="musik">Musik</SelectItem>
                                        <SelectItem value="foto">Foto</SelectItem>
                                        <SelectItem value="film">Film</SelectItem>
                                        <SelectItem value="tari">Tari</SelectItem>
                                        <SelectItem value="teater">Teater</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={mergedErrors('divisi')} />
                            </div>

                            <div className="space-y-1">
                                <Label>Status Anggota</Label>
                                <Select
                                    value={data.status_anggota}
                                    onValueChange={(value) => {
                                        const confirmChange = window.confirm(
                                            'Yakin mengubah status anggota?',
                                        );
                                        if (!confirmChange) return;
                                        setData(
                                            'status_anggota',
                                            value as StatusAnggota,
                                        );
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="calon_anggota">
                                            Calon Anggota
                                        </SelectItem>
                                        <SelectItem value="anggota_muda">
                                            Anggota Muda
                                        </SelectItem>
                                        <SelectItem value="anggota_tetap">
                                            Anggota Tetap
                                        </SelectItem>
                                        <SelectItem value="nonaktif">
                                            Nonaktif
                                        </SelectItem>
                                        <SelectItem value="alumni">Alumni</SelectItem>
                                        <SelectItem value="pembina">Pembina</SelectItem>
                                        <SelectItem value="pelatih">Pelatih</SelectItem>
                                        <SelectItem value="lain">Lain</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={mergedErrors('status_anggota')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Nama Panggilan</Label>
                            <div className="space-y-2">
                                {data.nama_panggilan.map((nama, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={nama}
                                            onChange={(e) =>
                                                handleChangeNamaPanggilan(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama panggilan"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                handleRemoveNamaPanggilan(index)
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddNamaPanggilan}
                                >
                                    Tambah nama panggilan
                                </Button>
                                <InputError message={mergedErrors('nama_panggilan')} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="alamat">Alamat</Label>
                                <Input
                                    id="alamat"
                                    value={data.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                />
                                <InputError message={mergedErrors('alamat')} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="nomor_telepon">Nomor Telepon</Label>
                                <Input
                                    id="nomor_telepon"
                                    value={data.nomor_telepon}
                                    onChange={(e) =>
                                        setData('nomor_telepon', e.target.value)
                                    }
                                />
                                <InputError message={mergedErrors('nomor_telepon')} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label htmlFor="user_id">User ID (opsional)</Label>
                                <Input
                                    id="user_id"
                                    type="number"
                                    value={data.user_id}
                                    onChange={(e) =>
                                        setData('user_id', e.target.value)
                                    }
                                />
                                <InputError message={mergedErrors('user_id')} />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="email">Email (opsional)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={mergedErrors('email')} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => history.back()}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

