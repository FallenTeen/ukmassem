import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { LABEL_DIVISI, type DivisiGaleri } from '@/pages/Galeri/types';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface KaryaSayaCreateProps {
    divisiSaya: DivisiGaleri | null;
    bisaPilihDivisi: boolean;
}

interface KaryaForm {
    judul: string;
    divisi: DivisiGaleri | '';
    pembuat: string;
    ringkasan: string;
    deskripsi: string;
    video_link: string;
    tanggal: string;
    cover: File | null;
}

const DIVISI_OPTIONS: DivisiGaleri[] = ['musik', 'tari', 'film', 'foto', 'teater'];

export default function KaryaSayaCreate({ divisiSaya, bisaPilihDivisi }: KaryaSayaCreateProps) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, transform } = useForm<KaryaForm>({
        judul: '',
        divisi: divisiSaya ?? '',
        pembuat: auth.user.name ?? '',
        ringkasan: '',
        deskripsi: '',
        video_link: '',
        tanggal: new Date().toISOString().slice(0, 10),
        cover: null,
    });

    const [carousel, setCarousel] = useState<File[]>([]);
    const [dokumentasi, setDokumentasi] = useState<File[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Karya Saya', href: '/galeri/karya-saya' },
        { title: 'Unggah Karya', href: '' },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((d) => ({ ...d, carousel, dokumentasi }));
        post('/galeri/karya-saya', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Unggah Karya — UKM ASSEM" />

            <form onSubmit={submit} className="flex flex-col gap-4 p-4" encType="multipart/form-data">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">Unggah Karya Anggota</h1>
                        <p className="text-sm text-muted-foreground">
                            {bisaPilihDivisi
                                ? 'Sebagai ketua divisi/pengelola, karyamu otomatis tayang setelah tersimpan.'
                                : 'Karyamu akan tampil di galeri publik setelah diapprov ketua divisi.'}
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/galeri/karya-saya">← Kembali</Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4 rounded-lg border bg-background p-4">
                        <div className="space-y-1">
                            <Label htmlFor="judul">Judul karya *</Label>
                            <Input
                                id="judul"
                                value={data.judul}
                                onChange={(e) => setData('judul', e.target.value)}
                                required
                            />
                            {errors.judul && <p className="text-xs text-destructive">{errors.judul}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Divisi *</Label>
                            {bisaPilihDivisi ? (
                                <Select value={data.divisi || 'none'} onValueChange={(value) => setData('divisi', value as DivisiGaleri)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih divisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DIVISI_OPTIONS.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {LABEL_DIVISI[item]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input value={data.divisi ? LABEL_DIVISI[data.divisi] : '-'} readOnly />
                            )}
                            {!bisaPilihDivisi && <input type="hidden" name="divisi" value={data.divisi} />}
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
                        <div className="space-y-1">
                            <Label htmlFor="tanggal">Tanggal karya</Label>
                            <Input
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="ringkasan">Ringkasan *</Label>
                            <textarea
                                id="ringkasan"
                                className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={data.ringkasan}
                                onChange={(e) => setData('ringkasan', e.target.value)}
                                required
                            />
                            {errors.ringkasan && <p className="text-xs text-destructive">{errors.ringkasan}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="deskripsi">Deskripsi karya *</Label>
                            <textarea
                                id="deskripsi"
                                className="min-h-[140px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                required
                            />
                            {errors.deskripsi && <p className="text-xs text-destructive">{errors.deskripsi}</p>}
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
                    </div>

                    <div className="space-y-4 rounded-lg border bg-background p-4">
                        <div className="space-y-1">
                            <Label>Sampul (cover) *</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('cover', e.target.files?.[0] ?? null)}
                            />
                            {errors.cover && <p className="text-xs text-destructive">{errors.cover}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label>Foto tambahan carousel (maks 3)</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setCarousel(Array.from(e.target.files ?? []).slice(0, 3))}
                            />
                            <p className="text-xs text-muted-foreground">{carousel.length} dipilih.</p>
                        </div>
                        <div className="space-y-1">
                            <Label>Gambar dokumentasi pendukung</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setDokumentasi(Array.from(e.target.files ?? []).slice(0, 15))}
                            />
                            <p className="text-xs text-muted-foreground">{dokumentasi.length} dipilih.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pb-4">
                    <Button variant="outline" asChild>
                        <Link href="/galeri/karya-saya">Batal</Link>
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Mengirim...' : 'Kirim Karya'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
