import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import {
    LABEL_DIVISI,
    LABEL_STATUS,
    coverUrl,
    formatTanggal,
    type DivisiGaleri,
    type GaleriIndexItem,
} from '@/pages/Galeri/types';
import { type BreadcrumbItem } from '@/types';

interface KaryaSayaProps {
    karyaList: GaleriIndexItem[];
    divisiSaya: DivisiGaleri | null;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    published: 'default',
    draft: 'secondary',
    menunggu: 'outline',
    ditolak: 'destructive',
};

export default function KaryaSayaIndex({ karyaList }: KaryaSayaProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Karya Saya', href: '/galeri/karya-saya' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Karya Saya — UKM ASSEM" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">Karya Saya</h1>
                        <p className="text-sm text-muted-foreground">
                            Unggah karyamu. Karya dari anggota divisi perlu persetujuan ketua divisi sebelum tampil
                            publik; karya yang diunggah ketua divisi langsung tayang.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/galeri/karya-saya/create">+ Unggah Karya</Link>
                    </Button>
                </div>

                {karyaList.length === 0 ? (
                    <div className="rounded-lg border bg-background p-10 text-center">
                        <p className="font-medium">Belum ada karya</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Unggah karya pertamamu lewat tombol di atas.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {karyaList.map((karya) => (
                            <div key={karya.id} className="flex flex-col rounded-lg border bg-background">
                                <div className="aspect-video w-full overflow-hidden rounded-t-lg border-b bg-muted">
                                    {coverUrl(karya.cover_path) ? (
                                        <img
                                            src={coverUrl(karya.cover_path) ?? ''}
                                            alt={karya.judul}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div className="flex flex-1 flex-col gap-2 p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="text-sm font-medium leading-snug">{karya.judul}</h2>
                                        <Badge variant={STATUS_VARIANT[karya.status] ?? 'secondary'}>
                                            {LABEL_STATUS[karya.status as keyof typeof LABEL_STATUS] ?? karya.status}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatTanggal(karya.tanggal)} • Divisi{' '}
                                        {karya.divisi ? LABEL_DIVISI[karya.divisi as keyof typeof LABEL_DIVISI] ?? karya.divisi : '-'}
                                    </p>
                                    {karya.catatan_admin && (
                                        <p className="rounded bg-destructive/5 p-2 text-xs text-destructive">
                                            Catatan: {karya.catatan_admin}
                                        </p>
                                    )}
                                    {karya.status === 'published' && (
                                        <Link
                                            href={`/galeri/karya/${karya.slug}`}
                                            target="_blank"
                                            className="mt-auto text-xs font-medium text-primary hover:underline"
                                        >
                                            Lihat di galeri publik →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground">
                    Pembuat default mengikuti nama akun. Unggahan berstatus <span className="font-medium">Menunggu</span>{' '}
                    menunggu persetujuan ketua divisi; periksa halaman ini untuk update statusnya.
                </div>
            </div>
        </AppLayout>
    );
}
