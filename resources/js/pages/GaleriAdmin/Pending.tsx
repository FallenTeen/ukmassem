import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { LABEL_DIVISI, formatTanggal, type GaleriDetail } from '@/pages/Galeri/types';
import { type BreadcrumbItem } from '@/types';

interface GaleriAdminPendingProps {
    karyaList: GaleriDetail[];
    bisaKelola: boolean;
}

export default function GaleriAdminPending({ karyaList, bisaKelola }: GaleriAdminPendingProps) {
    const [catatan, setCatatan] = useState<Record<number, string>>({});
    const [processingId, setProcessingId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Galeri', href: '/galeri-admin' },
        { title: 'Karya Menunggu', href: '' },
    ];

    const setujui = (id: number) => {
        if (!window.confirm('Setujui karya ini agar tampil publik?')) return;
        setProcessingId(id);
        router.post(`/galeri-admin/karya/${id}/setujui`, {}, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
        });
    };

    const tolak = (id: number) => {
        setProcessingId(id);
        router.post(`/galeri-admin/karya/${id}/tolak`, { catatan_admin: catatan[id] ?? '' }, {
            preserveScroll: true,
            onFinish: () => setProcessingId(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Karya Menunggu Persetujuan" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">Karya Menunggu Persetujuan</h1>
                        <p className="text-sm text-muted-foreground">
                            {bisaKelola
                                ? 'Semua karya anggota yang menunggu persetujuan.'
                                : 'Karya anggota divisimu yang menunggu persetujuan.'}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/galeri-admin">← Kembali</Link>
                    </Button>
                </div>

                {karyaList.length === 0 ? (
                    <div className="rounded-lg border bg-background p-10 text-center">
                        <p className="font-medium">Tidak ada karya menunggu persetujuan.</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Semua karya anggota sudah diproses.
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {karyaList.map((karya) => (
                            <li key={karya.id} className="rounded-lg border bg-background p-4">
                                <div className="flex flex-col gap-4 md:flex-row">
                                    <div className="h-28 w-40 shrink-0 overflow-hidden rounded-md border bg-muted">
                                        {karya.cover_path ? (
                                            <img
                                                src={`/storage/${karya.cover_path}`}
                                                alt={karya.judul}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-medium">{karya.judul}</h2>
                                            <Badge variant="outline">Menunggu</Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Divisi {karya.divisi ? LABEL_DIVISI[karya.divisi as keyof typeof LABEL_DIVISI] ?? karya.divisi : '-'}
                                            {karya.pembuat ? ` • ${karya.pembuat}` : ''}
                                            {' • '}
                                            {formatTanggal(karya.tanggal)}
                                            {' • '}
                                            Uploader: {karya.creator?.name ?? '-'}
                                            {' • '}
                                            Lihat: <Link className="text-primary hover:underline" href={`/galeri/karya/${karya.slug}`} target="_blank">/galeri/karya/{karya.slug}</Link> (belum tampil publik)
                                        </p>
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {karya.ringkasan}
                                        </p>
                                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                            <Button
                                                size="sm"
                                                onClick={() => setujui(karya.id)}
                                                disabled={processingId !== null}
                                            >
                                                Setujui
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => tolak(karya.id)}
                                                disabled={processingId !== null}
                                            >
                                                Tolak
                                            </Button>
                                            <textarea
                                                className="min-h-8 flex-1 rounded-md border bg-background px-2 py-1 text-xs"
                                                placeholder="Catatan penolakan (opsional)"
                                                value={catatan[karya.id] ?? ''}
                                                onChange={(e) =>
                                                    setCatatan({
                                                        ...catatan,
                                                        [karya.id]: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AppLayout>
    );
}
