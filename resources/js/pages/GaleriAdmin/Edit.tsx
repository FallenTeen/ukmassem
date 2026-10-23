import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import {
    LABEL_DIVISI,
    LABEL_JENIS,
    LABEL_STATUS,
    coverUrl,
    formatTanggal,
    type DivisiGaleri,
    type GaleriDetail,
    type GaleriFotoItem,
    type ProkerRingkas,
    type StatusGaleri,
} from '@/pages/Galeri/types';
import { type BreadcrumbItem } from '@/types';

interface ProkerOption {
    id: number;
    nama_lengkap: string;
    tahun: number;
    status: string;
    main_proker?: { nama_proker: string } | null;
}

interface GaleriAdminEditProps {
    galeri: GaleriDetail & { proker_ids: number[] };
    prokers: ProkerOption[];
    bisaKelola: boolean;
}

interface GaleriForm {
    judul: string;
    tanggal: string;
    ringkasan: string;
    deskripsi: string;
    video_link: string;
    divisi: DivisiGaleri | '';
    pembuat: string;
    proker_ids: number[];
    status: StatusGaleri;
    cover_baru: File | null;
    hapus_foto_ids: number[];
    cover_foto_id: number | null;
}

const DIVISI_OPTIONS: DivisiGaleri[] = ['musik', 'tari', 'film', 'foto', 'teater'];

export default function GaleriAdminEdit({ galeri, prokers, bisaKelola }: GaleriAdminEditProps) {
    const [carouselBaru, setCarouselBaru] = useState<File[]>([]);
    const [dokumentasiBaru, setDokumentasiBaru] = useState<File[]>([]);
    const [prokerCari, setProkerCari] = useState('');
    const [hapus, setHapus] = useState<number[]>([]);

    const { data, setData, put, processing, errors, transform } = useForm<GaleriForm>({
        judul: galeri.judul,
        tanggal: galeri.tanggal ? String(galeri.tanggal).slice(0, 10) : '',
        ringkasan: galeri.ringkasan ?? '',
        deskripsi: galeri.deskripsi ?? '',
        video_link: galeri.video_link ?? '',
        divisi: (galeri.divisi as DivisiGaleri | null) ?? '',
        pembuat: galeri.pembuat ?? '',
        proker_ids: galeri.proker_ids ?? [],
        status: galeri.status as StatusGaleri,
        cover_baru: null,
        hapus_foto_ids: [],
        cover_foto_id: null,
    });

    const prokerTerpilihSet = useMemo(() => new Set(data.proker_ids), [data.proker_ids]);

    const toggleHapus = (foto: GaleriFotoItem) => {
        setHapus((prev) =>
            prev.includes(foto.id) ? prev.filter((item) => item !== foto.id) : [...prev, foto.id],
        );
        setData('hapus_foto_ids', hapus.includes(foto.id)
            ? hapus.filter((item) => item !== foto.id)
            : [...hapus, foto.id]);
    };

    const toggleProker = (id: number) => {
        setData(
            'proker_ids',
            prokerTerpilihSet.has(id)
                ? data.proker_ids.filter((item) => item !== id)
                : [...data.proker_ids, id],
        );
    };

    const prokerTerfilter = prokers.filter((item) =>
        item.nama_lengkap.toLowerCase().includes(prokerCari.toLowerCase()),
    );

    const isPagelaran = galeri.jenis === 'pagelaran';
    const isKarya = galeri.jenis === 'karya';

    const textCreator = galeri.creator?.name ?? '-';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Galeri', href: '/galeri-admin' },
        { title: galeri.judul, href: '' },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const files = {
            cover_baru: data.cover_baru,
            carousel_baru: carouselBaru as File[] | undefined,
            dokumentasi_baru: dokumentasiBaru as File[] | undefined,
        };

        transform((d) => ({ ...d, hapus_foto_ids: hapus, ...files }));
        put(`/galeri-admin/${galeri.id}`, { forceFormData: true });
    };

    const warnaStatus: Record<StatusGaleri, 'default' | 'secondary' | 'outline' | 'destructive'> = {
        published: 'default',
        draft: 'secondary',
        menunggu: 'outline',
        ditolak: 'destructive',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${LABEL_JENIS[galeri.jenis as keyof typeof LABEL_JENIS]}`} />

            <form onSubmit={submit} className="flex flex-col gap-4 p-4" encType="multipart/form-data">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">
                            Edit {LABEL_JENIS[galeri.jenis as keyof typeof LABEL_JENIS]}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Slug: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{galeri.slug}</code>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant={warnaStatus[galeri.status as StatusGaleri] ?? 'secondary'}>
                            {LABEL_STATUS[galeri.status as StatusGaleri] ?? galeri.status}
                        </Badge>
                        <Button variant="outline" asChild>
                            <Link href={`/galeri/${galeri.jenis}/${galeri.slug}`} target="_blank">
                                Lihat Publik
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/galeri-admin">← Kembali</Link>
                        </Button>
                    </div>
                </div>

                {galeri.catatan_admin && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                        <span className="font-medium">Catatan penolakan:</span> {galeri.catatan_admin}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4 rounded-lg border bg-background p-4">
                        <div className="space-y-1">
                            <Label htmlFor="judul">Judul</Label>
                            <Input
                                id="judul"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                required
                                disabled={!bisaKelola}
                            />
                            {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="tanggal">Tanggal — saat ini: {formatTanggal(galeri.tanggal)}</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                disabled={!bisaKelola}
                            />
                        </div>
                        {isKarya && (
                            <>
                                <div className="space-y-1">
                                    <Label>Divisi</Label>
                                    <Select
                                        value={data.divisi || 'none'}
                                        onValueChange={(value) =>
                                            setData('divisi', value === 'none' ? '' : (value as DivisiGaleri))
                                        }
                                        disabled={!bisaKelola}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih divisi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Tanpa divisi</SelectItem>
                                            {DIVISI_OPTIONS.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {LABEL_DIVISI[item]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="pembuat">Nama pembuat</Label>
                                    <Input
                                        id="pembuat"
                                        value={data.pembuat}
                                        onChange={(e) => setData('pembuat', e.target.value)}
                                        disabled={!bisaKelola}
                                    />
                                </div>
                            </>
                        )}
                        <div className="space-y-1">
                            <Label htmlFor="ringkasan">Ringkasan</Label>
                            <textarea
                                id="ringkasan"
                                className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={data.ringkasan}
                                onChange={(e) => setData('ringkasan', e.target.value)}
                            />
                            {errors.ringkasan && <p className="text-xs text-destructive">{errors.ringkasan}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="video_link">Link video</Label>
                            <Input
                                id="video_link"
                                value={data.video_link}
                                onChange={(e) => setData('video_link', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {errors.video_link && <p className="text-xs text-destructive">{errors.video_link}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <textarea
                                id="deskripsi"
                                className="min-h-[160px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                            />
                            {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
                        </div>

                        {bisaKelola && (
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <Label>Status</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value as StatusGaleri)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Tayang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-4 rounded-lg border bg-background p-4">
                            <div className="space-y-1">
                                <Label>Sampul saat ini</Label>
                                <div className="h-40 w-full overflow-hidden rounded-md border bg-muted">
                                    {coverUrl(galeri.cover_path) ? (
                                        <img
                                            src={coverUrl(galeri.cover_path) ?? ''}
                                            alt="Sampul"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                            Belum ada sampul
                                        </div>
                                    )}
                                </div>
                                {bisaKelola && (
                                    <div>
                                        <Label htmlFor="cover_baru">Ganti sampul dengan file baru</Label>
                                        <Input
                                            id="cover_baru"
                                            type="file"
                                            accept="image/*"
                                            className="mt-1"
                                            onChange={(e) => setData('cover_baru', e.target.files?.[0] ?? null)}
                                        />
                                        {errors.cover_baru && (
                                            <p className="text-xs text-destructive">{errors.cover_baru}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {bisaKelola && (
                                <>
                                    <div className="space-y-1">
                                        <Label>Tambah foto carousel</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) =>
                                                setCarouselBaru(
                                                    Array.from(e.target.files ?? []).slice(
                                                        0,
                                                        Math.max(0, 3 - galeri.carouselFotos.length),
                                                    ),
                                                )
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Terpakai {galeri.carouselFotos.length}/3. {carouselBaru.length} dipilih.
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Tambah gambar dokumentasi pendukung</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) =>
                                                setDokumentasiBaru(
                                                    Array.from(e.target.files ?? []).slice(
                                                        0,
                                                        Math.max(0, 15 - galeri.dokumentasiFotos.length),
                                                    ),
                                                )
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Terpakai {galeri.dokumentasiFotos.length}/15. {dokumentasiBaru.length}{' '}
                                            dipilih.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {galeri.carouselFotos.length > 0 && (
                            <div className="space-y-2 rounded-lg border bg-background p-4">
                                <Label>Carousel saat ini</Label>
                                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {galeri.carouselFotos.map((foto) => (
                                        <li key={foto.id} className="rounded-md border p-2">
                                            <img
                                                src={`/storage/${foto.path}`}
                                                alt="Carousel"
                                                className="mb-2 aspect-video w-full rounded object-cover"
                                            />
                                            {bisaKelola && (
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => {
                                                            transform((d) => ({ ...d, cover_foto_id: foto.id }));
                                                            put(`/galeri-admin/${galeri.id}`, {
                                                                forceFormData: true,
                                                            });
                                                        }}
                                                    >
                                                        Jadikan Cover
                                                    </Button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {galeri.dokumentasiFotos.length > 0 && (
                            <div className="space-y-2 rounded-lg border bg-background p-4">
                                <Label>Dokumentasi saat ini</Label>
                                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {galeri.dokumentasiFotos.map((foto) => (
                                        <li key={foto.id} className="rounded-md border p-2">
                                            <img
                                                src={`/storage/${foto.path}`}
                                                alt="Dokumentasi"
                                                className="mb-2 aspect-video w-full rounded object-cover"
                                            />
                                            <div className="flex items-center justify-end gap-1">
                                                <input
                                                    type="checkbox"
                                                    className="mr-auto h-4 w-4"
                                                    checked={hapus.includes(foto.id)}
                                                    onChange={() => toggleHapus(foto)}
                                                    disabled={processing}
                                                />
                                                {bisaKelola && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        type="button"
                                                        disabled={processing}
                                                        onClick={() => {
                                                            transform((d) => ({ ...d, cover_foto_id: foto.id }));
                                                            put(`/galeri-admin/${galeri.id}`, {
                                                                forceFormData: true,
                                                            });
                                                        }}
                                                    >
                                                        Cover
                                                    </Button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {hapus.length > 0 && (
                                    <p className="text-xs text-amber-700">
                                        {hapus.length} foto ditandai untuk dihapus saat menyimpan.
                                    </p>
                                )}
                            </div>
                        )}

                        {isPagelaran && bisaKelola && (
                            <div className="space-y-3 rounded-lg border bg-background p-4">
                                <Label>Proker terkait</Label>
                                <Input
                                    value={prokerCari}
                                    onChange={(e) => setProkerCari(e.target.value)}
                                    placeholder="Cari proker"
                                />
                                <div className="max-h-64 space-y-1 overflow-y-auto">
                                    {prokerTerfilter.map((proker) => (
                                        <label
                                            key={proker.id}
                                            className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted/50"
                                        >
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4"
                                                checked={prokerTerpilihSet.has(proker.id)}
                                                onChange={() => toggleProker(proker.id)}
                                            />
                                            <span className="flex-1">
                                                {proker.nama_lengkap}
                                                <span className="text-xs text-muted-foreground">
                                                    {' '}
                                                    • {proker.status}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {data.proker_ids.length} proker dipilih.
                                </p>
                            </div>
                        )}

                        <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground">
                            Dibuat oleh: <span className="font-medium text-foreground">{textCreator}</span>
                            {galeri.approver && (
                                <>
                                    {' • '}
                                    Disetujui: <span className="font-medium text-foreground">{galeri.approver.name}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pb-4">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
