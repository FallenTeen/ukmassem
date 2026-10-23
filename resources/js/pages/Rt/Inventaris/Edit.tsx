import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SwitchToggle from '@/components/ui/switch-toggle';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { InventarisItem, KategoriBarang } from '../types';

const breadcrumbs = (kode: string): BreadcrumbItem[] => [
    { title: 'Inventaris', href: '/inventaris' },
    { title: `Edit ${kode}`, href: '' },
];

export default function Edit({
    inventaris,
    kategoris,
}: {
    inventaris: InventarisItem;
    kategoris: KategoriBarang[];
}) {
    const [form, setForm] = useState<{ [key: string]: string | boolean }>({
        nama_barang: inventaris.nama_barang,
        kategori_barang_id: String(inventaris.kategori_barang_id),
        kondisi: inventaris.kondisi,
        harga_sewa: inventaris.harga_sewa ?? '',
        lokasi: inventaris.lokasi ?? '',
        catatan: inventaris.catatan ?? '',
        boleh_dipinjam: inventaris.boleh_dipinjam,
    });
    const [foto, setFoto] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [processing, setProcessing] = useState(false);

    const ubah = (key: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(`/inventaris/${inventaris.id}`, { ...form, foto, _method: 'PUT' }, {
            forceFormData: true,
            onFinish: () => setProcessing(false),
            onError: (bag) => setErrors(bag as { [key: string]: string }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(inventaris.kode)}>
            <Head title={`Edit ${inventaris.nama_barang}`} />

            <div className="flex flex-col gap-4 p-4">
                {Object.keys(errors).length > 0 && (
                    <AlertError
                        title="Form tidak valid"
                        errors={Object.values(errors)}
                    />
                )}

                <form onSubmit={submit} className="flex flex-col gap-4 md:max-w-3xl">
                    <div className="space-y-1">
                        <Label htmlFor="nama_barang">Nama Barang</Label>
                        <Input
                            id="nama_barang"
                            value={String(form.nama_barang)}
                            onChange={(e) => ubah('nama_barang', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="kategori_barang_id">Kategori</Label>
                            <Select
                                value={String(form.kategori_barang_id)}
                                onValueChange={(value) => ubah('kategori_barang_id', value)}
                            >
                                <SelectTrigger id="kategori_barang_id">
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kategoris.map((item) => (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.kode} - {item.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Mengganti kategori akan membuat kode unit baru sesuai urutan kategori yang dipilih.
                            </p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="kondisi">Kondisi</Label>
                            <Select value={String(form.kondisi)} onValueChange={(value) => ubah('kondisi', value)}>
                                <SelectTrigger id="kondisi">
                                    <SelectValue placeholder="Pilih kondisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bagus">Bagus</SelectItem>
                                    <SelectItem value="rusak_ringan">Rusak Ringan</SelectItem>
                                    <SelectItem value="rusak_berat">Rusak Berat</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <Label htmlFor="harga_sewa">Harga Sewa (Rp)</Label>
                            <Input
                                id="harga_sewa"
                                type="number"
                                min="0"
                                placeholder="Kosongkan bila gratis"
                                value={String(form.harga_sewa)}
                                onChange={(e) => ubah('harga_sewa', e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="lokasi">Lokasi</Label>
                            <Input
                                id="lokasi"
                                value={String(form.lokasi)}
                                onChange={(e) => ubah('lokasi', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="foto">Foto Barang</Label>
                        <Input
                            id="foto"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setFoto(file);
                            }}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="catatan">Catatan</Label>
                        <Input
                            id="catatan"
                            value={String(form.catatan)}
                            onChange={(e) => ubah('catatan', e.target.value)}
                        />
                    </div>

                    <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <span className="text-sm font-medium">Boleh dipinjam</span>
                            <p className="text-xs text-muted-foreground">
                                Aktif = barang tampil di katalog publik dan boleh diajukan.
                            </p>
                            {inventaris.status === 'dipinjam' && (
                                <p className="text-xs text-orange-600">
                                    Barang sedang dipinjam; nonaktif hanya menyembunyikan dari katalog hingga kembali.
                                </p>
                            )}
                        </div>
                        <SwitchToggle
                            checked={Boolean(form.boleh_dipinjam)}
                            onCheckedChange={(next) => ubah('boleh_dipinjam', next)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
