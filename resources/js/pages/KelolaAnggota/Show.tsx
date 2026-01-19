import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota } from '@/types/anggota';

interface ShowProps {
    anggota: Anggota;
}

const breadcrumbs = (anggota: Anggota): BreadcrumbItem[] => [
    {
        title: 'Kelola Anggota',
        href: '/kelola-anggota',
    },
    {
        title: anggota.nama_lengkap || anggota.user?.name || 'Detail Anggota',
        href: `/kelola-anggota/${anggota.id}`,
    },
];

export default function Show({ anggota }: ShowProps) {
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const handleDelete = () => {
        const confirmed = window.confirm(
            'Yakin ingin menghapus anggota ini? Data tidak akan hilang permanen karena menggunakan soft delete.',
        );
        if (!confirmed) return;

        setProcessing(true);
        router.delete(`/kelola-anggota/${anggota.id}`, {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Anggota berhasil dihapus.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal menghapus anggota.',
                });
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(anggota)}>
            <Head title="Detail Anggota" />

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

                <div className="mx-auto max-w-3xl space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h1 className="text-lg font-semibold">
                                {anggota.nama_lengkap ||
                                    anggota.user?.name ||
                                    `Anggota #${anggota.id}`}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Detail lengkap data anggota.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/kelola-anggota/${anggota.id}/edit`}>
                                <Button variant="secondary" size="sm">
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={processing}
                                onClick={handleDelete}
                            >
                                Hapus
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Anggota</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">Nama Lengkap</div>
                                    <div className="text-muted-foreground">
                                        {anggota.nama_lengkap ||
                                            anggota.user?.name ||
                                            '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">NIM</div>
                                    <div className="text-muted-foreground">
                                        {anggota.NIM || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">Nomor Anggota</div>
                                    <div className="text-muted-foreground">
                                        {anggota.nomor_anggota || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">Tanggal Lahir</div>
                                    <div className="text-muted-foreground">
                                        {anggota.tanggal_lahir || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">Divisi</div>
                                    <div className="text-muted-foreground capitalize">
                                        {anggota.divisi || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">Status Anggota</div>
                                    <div className="text-muted-foreground capitalize">
                                        {anggota.status_anggota.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">Angkatan</div>
                                    <div className="text-muted-foreground">
                                        {anggota.angkatan ?? '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm md:col-span-2">
                                    <div className="font-medium">Alamat</div>
                                    <div className="text-muted-foreground">
                                        {anggota.alamat || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="font-medium">Nomor Telepon</div>
                                    <div className="text-muted-foreground">
                                        {anggota.nomor_telepon || '-'}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm md:col-span-2">
                                    <div className="font-medium">Nama Panggilan</div>
                                    <div className="text-muted-foreground">
                                        {anggota.nama_panggilan &&
                                        anggota.nama_panggilan.length > 0
                                            ? anggota.nama_panggilan.join(', ')
                                            : '-'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Akun Pengguna</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {anggota.user ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-1 text-sm">
                                        <div className="font-medium">Nama</div>
                                        <div className="text-muted-foreground">
                                            {anggota.user.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="font-medium">Email</div>
                                        <div className="text-muted-foreground">
                                            {anggota.user.email}
                                        </div>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="font-medium">Role</div>
                                        <div className="text-muted-foreground">
                                            {String(anggota.user.role ?? '-')}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    Anggota ini belum terhubung dengan akun pengguna.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
