import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { LABEL_JENIS, type DivisiGaleri, type JenisGaleri, type StatusGaleri } from '@/pages/Galeri/types';
import { type BreadcrumbItem } from '@/types';

interface ProkerOption {
    id: number;
    nama_lengkap: string;
    tahun: number;
    status: string;
    main_proker?: { nama_proker: string } | null;
}

interface GaleriAdminCreateProps {
    jenis: JenisGaleri;
    prokers: ProkerOption[];
}

interface GaleriForm {
    jenis: JenisGaleri;
    judul: string;
    tanggal: string;
    ringkasan: string;
    deskripsi: string;
    video_link: string;
    divisi: DivisiGaleri | '';
    pembuat: string;
    proker_ids: number[];
    status: StatusGaleri;
}

const DIVISI_OPTIONS: DivisiGaleri[] = ['musik', 'tari', 'film', 'foto', 'teater'];

export default function GaleriAdminCreate({ jenis, prokers }: GaleriAdminCreateProps) {
    const { data, setData, post, processing, errors, transform } = useForm<GaleriForm & { cover: File | null }>({
        jenis,
        judul: '',
        tanggal: new Date().toISOString().slice(0, 10),
        ringkasan: '',
        deskripsi: '',
        video_link: '',
        divisi: '',
        pembuat: '',
        proker_ids: [],
        status: 'draft',
        cover: null,
    });

    const [carousel, setCarousel] = useState<File[]>([]);
    const [dokumentasi, setDokumentasi] = useState<File[]>([]);
    const [prokerCari, setProkerCari] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Galeri', href: '/galeri-admin' },
        { title: `Buat ${LABEL_JENIS[jenis]}`, href: `/galeri-admin/create` },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((d) => ({ ...d, carousel_baru: carousel, dokumentasi_baru: dokumentasi }));
        post('/galeri-admin', { forceFormData: true });
    };

    const toggleProker = (id: number) => {
        setData(
            'proker_ids',
            data.proker_ids.includes(id)
                ? data.proker_ids.filter((item) => item !== id)
                : [...data.proker_ids, id],
        );
    };

    const prokerTerfilter = prokers.filter((item) =>
        item.nama_lengkap.toLowerCase().includes(prokerCari.toLowerCase()),
    );

    const isKarya = data.jenis === 'karya';
    const isPagelaran = data.jenis === 'pagelaran';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Buat Konten ${LABEL_JENIS[jenis]}`} />

            <form onSubmit={submit} className="flex flex-col gap-4 p-4" encType="multipart/form-data">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">Buat Konten {LABEL_JENIS[jenis]}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isKarya
                                ? 'Karya anggota yang tampil di galeri publik.'
                                : isPagelaran
                                    ? 'Dokumentasi pagelaran seni beserta proker terkait.'
                                    : 'Artikel kegiatan untuk galeri kegiatan.'}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/galeri-admin">← Kembali</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4 rounded-lg border bg-background p-4">
                        <div className="space-y-1">
                            <Label htmlFor="judul">Judul *</Label>
                            <Input
                                id="judul"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                required
                            />
                            {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="tanggal">Tanggal</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                            />
                            {errors.tanggal && <p className="text-xs text-destructive">{errors.tanggal}</p>}
                        </div>
                        {isKarya && (
                            <>
                                <div className="space-y-1">
                                    <Label>Divisi *</Label>
                                    <Select value={data.divisi || 'none'} onValueChange={(value) => setData('divisi', value as DivisiGaleri)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih divisi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DIVISI_OPTIONS.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.divisi && <p className="text-xs text-destructive">{errors.divisi}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="pembuat">Nama pembuat *</Label>
                                    <Input
                                        id="pembuat"
                                        value={data.pembuat}
                                        onChange={(e) => setData('pembuat', e.target.value)}
                                        required
                                    />
                                    {errors.pembuat && <p className="text-xs text-destructive">{errors.pembuat}</p>}
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
                            <Label htmlFor="video_link">Link video (opsional)</Label>
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
                    </div>

                    <div className="space-y-4">
                        {
                            <div className="space-y-4 rounded-lg border bg-background p-4">
                                <div className="space-y-1">
                                    <Label htmlFor="cover">Sampul (cover) *</Label>
                                    <Input
                                        id="cover"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('cover', e.target.files?.[0] ?? null)}
                                    />
                                    {errors.cover && <p className="text-xs text-destructive">{errors.cover}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label>Carousel (maks 3)</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) =>
                                            setCarousel(Array.from(e.target.files ?? []).slice(0, 3))
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {carousel.length} file dipilih, maks 3.
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <Label>Gambar dokumentasi pendukung</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) =>
                                            setDokumentasi(Array.from(e.target.files ?? []).slice(0, 15))
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {dokumentasi.length} file dipilih.
                                    </p>
                                </div>
                            </div>
                        }

                        {isPagelaran && (
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
                                                checked={data.proker_ids.includes(proker.id)}
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
                                    {prokerTerfilter.length === 0 && (
                                        <p className="py-2 text-center text-xs text-muted-foreground">
                                            Tidak ada proker ditemukan.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="space-y-1 rounded-lg border bg-background p-4">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value as StatusGaleri)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Tayang (publik)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pb-4">
                    <Button variant="outline" asChild>
                        <Link href="/galeri-admin">Batal</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan Konten'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
