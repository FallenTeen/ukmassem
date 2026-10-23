import { Head, router } from '@inertiajs/react';
import { CalendarDays, ImageIcon, Maximize2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import AlertError from '@/components/alert-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { LABEL_KONDISI, type PeminjamanMendatang } from '../types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Peminjaman', href: '/peminjaman' },
    { title: 'Catat Peminjaman', href: '' },
];

interface BarangPinjam {
    id: number;
    kode: string;
    nama_barang: string;
    kondisi: string;
    harga_sewa: string | null;
    lokasi: string | null;
    foto: string | null;
    kategori?: { id: number; kode: string; nama: string } | null;
    peminjaman_mendatang?: PeminjamanMendatang[];
}

export default function Create({ barang }: { barang: BarangPinjam[] }) {
    const [form, setForm] = useState<{ [key: string]: string }>({
        sifat: 'anggota_amikom',
        nama_peminjam: '',
        asal_organisasi: '',
        kontak: '',
        tanggal_pinjam: new Date().toISOString().slice(0, 10),
        rencana_kembali: '',
        catatan: '',
    });
    const [terpilih, setTerpilih] = useState<number[]>([]);
    const [cari, setCari] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [processing, setProcessing] = useState(false);

    const hasilCari = useMemo(
        () =>
            barang.filter((item) =>
                `${item.kode} ${item.nama_barang}`.toLowerCase().includes(cari.toLowerCase()),
            ),
        [barang, cari],
    );

    const ubah = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toggle = (id: number) => {
        setTerpilih((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            '/peminjaman',
            { ...form, langsung_pinjam: true, inventaris_ids: terpilih },
            {
                onFinish: () => setProcessing(false),
                onError: (bag) => setErrors(bag as { [key: string]: string }),
            },
        );
    };

    const tanggalIndo = (value: string | null) =>
        value
            ? new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { dateStyle: 'long' })
            : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catat Peminjaman" />

            <div className="flex flex-col gap-4 p-4">
                {Object.keys(errors).length > 0 && (
                    <AlertError title="Form tidak valid" errors={Object.values(errors)} />
                )}

                <form onSubmit={submit} className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)]">
                    <div className="flex flex-col gap-4 self-start rounded-lg border bg-background p-4 lg:sticky lg:top-4">
                        <h2 className="text-sm font-semibold">Data Peminjam</h2>

                        <div className="space-y-1">
                            <Label htmlFor="sifat">Sifat</Label>
                            <Select value={form.sifat} onValueChange={(value) => ubah('sifat', value)}>
                                <SelectTrigger id="sifat">
                                    <SelectValue placeholder="Pilih sifat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="anggota_amikom">Anggota Amikom</SelectItem>
                                    <SelectItem value="eksternal">Eksternal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="nama_peminjam">Nama</Label>
                            <Input
                                id="nama_peminjam"
                                placeholder="Nama orang / PJ"
                                value={form.nama_peminjam}
                                onChange={(e) => ubah('nama_peminjam', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="asal_organisasi">Asal</Label>
                            <Input
                                id="asal_organisasi"
                                placeholder="Komunitas / UKM (opsional)"
                                value={form.asal_organisasi}
                                onChange={(e) => ubah('asal_organisasi', e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="tanggal_pinjam">Tanggal Pinjam</Label>
                            <Input
                                id="tanggal_pinjam"
                                type="date"
                                value={form.tanggal_pinjam}
                                onChange={(e) => ubah('tanggal_pinjam', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="rencana_kembali">Rencana Kembali</Label>
                            <Input
                                id="rencana_kembali"
                                type="date"
                                min={form.tanggal_pinjam}
                                value={form.rencana_kembali}
                                onChange={(e) => ubah('rencana_kembali', e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="catatan">Catatan</Label>
                            <Input
                                id="catatan"
                                placeholder="Opsional"
                                value={form.catatan}
                                onChange={(e) => ubah('catatan', e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="kontak">Kontak</Label>
                            <Input
                                id="kontak"
                                placeholder="No. WhatsApp"
                                value={form.kontak}
                                onChange={(e) => ubah('kontak', e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={processing || terpilih.length === 0}>
                            {processing ? 'Menyimpan...' : `Catat Peminjaman (${terpilih.length} barang)`}
                        </Button>
                        <Button type="button" variant="outline" className="w-full" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 bg-background px-1 pb-2">
                            <div>
                                <h2 className="text-sm font-semibold">Pilih Unit ({terpilih.length} dipilih)</h2>
                                <p className="text-xs text-muted-foreground">
                                    Total {barang.length} unit tersedia yang boleh dipinjam dari katalog.
                                </p>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-8"
                                    placeholder="Cari kode / nama barang"
                                    value={cari}
                                    onChange={(e) => setCari(e.target.value)}
                                />
                            </div>
                        </div>

                        {hasilCari.length === 0 && (
                            <div className="rounded-lg border bg-background py-10 text-center text-sm text-muted-foreground">
                                Tidak ada unit tersedia yang cocok dengan pencarian.
                            </div>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {hasilCari.map((item) => {
                                const dipilih = terpilih.includes(item.id);
                                const foto = item.foto ? `/storage/${item.foto}` : null;

                                return (
                                    <div
                                        key={item.id}
                                        className={`flex flex-col overflow-hidden rounded-lg border bg-background transition-colors ${
                                            dipilih ? 'border-primary ring-2 ring-primary/30' : 'hover:border-primary/40'
                                        }`}
                                    >
                                        <div className="relative aspect-[16/9] w-full bg-muted">
                                            {foto ? (
                                                <img src={foto} alt={item.nama_barang} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                                                    <ImageIcon className="h-6 w-6" />
                                                    <span className="mt-1 text-[10px]">Tanpa foto</span>
                                                </div>
                                            )}
                                            <label className="absolute right-2 top-2 flex cursor-pointer items-center gap-1.5 rounded bg-background/90 px-2 py-1 shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border"
                                                    checked={dipilih}
                                                    onChange={() => toggle(item.id)}
                                                />
                                                <span className="text-xs font-medium">{dipilih ? 'Dipilih' : 'Pinjam'}</span>
                                            </label>
                                            <span className="absolute bottom-2 left-2 rounded bg-background/90 px-2 py-0.5 font-mono text-xs">
                                                {item.kode}
                                            </span>
                                        </div>

                                        <div className="flex flex-1 flex-col gap-1.5 p-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="font-medium leading-tight">{item.nama_barang}</span>
                                                <Badge variant="secondary" className="shrink-0 text-xs">
                                                    {LABEL_KONDISI[item.kondisi as 'bagus'] ?? item.kondisi}
                                                </Badge>
                                            </div>

                                            <p className="text-xs text-muted-foreground">
                                                {item.kategori ? `${item.kategori.kode} · ${item.kategori.nama}` : 'Tanpa kategori'}
                                                {item.lokasi ? ` · ${item.lokasi}` : ''}
                                            </p>

                                            <p className="text-xs">
                                                {item.harga_sewa
                                                    ? `Rp ${Number(item.harga_sewa).toLocaleString('id-ID')} / pinjam`
                                                    : 'Gratis'}
                                            </p>

                                            <div className="mt-auto space-y-1.5 pt-1">
                                                {(item.peminjaman_mendatang ?? []).length > 0 && (
                                                    <div className="flex flex-col gap-1">
                                                        {(item.peminjaman_mendatang ?? []).map((pjm) => (
                                                            <div
                                                                key={pjm.kode}
                                                                className="flex items-start gap-1.5 rounded bg-orange-100 px-2 py-1.5 text-[11px] text-orange-900 dark:bg-orange-950/40 dark:text-orange-200"
                                                            >
                                                                <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                                                <span>
                                                                    {pjm.status === 'dipinjam'
                                                                        ? 'Sedang dipinjam'
                                                                        : 'Akan dipinjam'}{' '}
                                                                    {tanggalIndo(pjm.tanggal_pinjam)}
                                                                    {pjm.rencana_kembali
                                                                        ? ` s.d. ${tanggalIndo(pjm.rencana_kembali)}`
                                                                        : ''}{' '}
                                                                    oleh <strong>{pjm.nama_peminjam}</strong>
                                                                    {pjm.status === 'menunggu' ? ' (menunggu persetujuan)' : ''}
                                                                    {' — '}
                                                                    <span className="font-mono">{pjm.kode}</span>
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant={dipilih ? 'destructive' : 'outline'}
                                                    className="w-full"
                                                    onClick={() => toggle(item.id)}
                                                >
                                                    {dipilih ? 'Keluarkan dari Pilihan' : 'Pinjamkan Unit Ini'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Maximize2 className="h-3.5 w-3.5" />
                            Pencatatan manual berarti barang sudah langsung diserahkan; peminjaman tercatat berstatus “Dipinjam”.
                        </p>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
