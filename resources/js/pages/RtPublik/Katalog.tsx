import { Head } from '@inertiajs/react';
import { Boxes, CalendarClock, ImageOff, ListChecks, MessageCircle, PackageOpen, Phone, Search, Trash2, User } from 'lucide-react';
import { useMemo, useState } from 'react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BarangKatalog {
    id: number;
    kode: string;
    nama_barang: string;
    kondisi: string;
    harga_sewa: string | null;
    lokasi: string | null;
    foto: string | null;
    catatan: string | null;
}

const LABEL_KONDISI: Record<string, string> = {
    bagus: 'Bagus',
    rusak_ringan: 'Rusak Ringan',
    rusak_berat: 'Rusak Berat',
};

const formatTanggal = (value: string) => {
    const tanggal = new Date(`${value}T00:00:00`);
    return isNaN(tanggal.getTime()) ? value : tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const normNomorWa = (raw: string): string | null => {
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.length < 8) return null;
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    if (digits.startsWith('62')) return digits;
    if (digits.startsWith('8')) return `62${digits}`;
    return digits;
};

export default function Katalog({
    barang,
    pricelistAktif,
    waNama,
    waNomor,
}: {
    barang: BarangKatalog[];
    pricelistAktif: boolean;
    waNama: string | null;
    waNomor: string | null;
}) {
    const [cari, setCari] = useState('');
    const [daftarPinjam, setDaftarPinjam] = useState<BarangKatalog[]>([]);
    const [bukaForm, setBukaForm] = useState(false);
    const [bukaModalDaftar, setBukaModalDaftar] = useState(false);
    const [form, setForm] = useState({
        nama: '',
        asal: '',
        tanggalMulai: '',
        tanggalSampai: '',
    });
    const [galatKirim, setGalatKirim] = useState<string | null>(null);

    const hasilCari = useMemo(
        () => barang.filter((item) => `${item.kode} ${item.nama_barang}`.toLowerCase().includes(cari.toLowerCase())),
        [barang, cari],
    );

    const isiDaftar = (id: number) => daftarPinjam.some((item) => item.id === id);

    const ubahPilih = (item: BarangKatalog) => {
        setDaftarPinjam((prev) => {
            if (!isiDaftar(item.id)) {
                setBukaForm(false);

                return [...prev, item];
            }

            return prev.filter((pinjam) => pinjam.id !== item.id);
        });
    };

    const buatPesan = () => {
        const barisBarang = daftarPinjam.map((item) => `- ${item.nama_barang} (${item.kode})`).join('\n');

        const denganAsal = form.asal.trim() !== ''
            ? ` dari *${form.asal.trim()}*`
            : '';

        return `Halo kak, saya *${form.nama.trim()}*${denganAsal} berencana ingin meminjam barang sebagai berikut\n${barisBarang}\nuntuk tanggal ${formatTanggal(form.tanggalMulai)} hingga ${formatTanggal(form.tanggalSampai)}`;
    };

    const buatTautanWa = (nomor: string | null, pesan: string): string | null => {
        const nomorUtuh = nomor ? normNomorWa(nomor) : null;

        return nomorUtuh ? `https://wa.me/${nomorUtuh}?text=${encodeURIComponent(pesan)}` : null;
    };

    const kirimPinjaman = () => {
        if (form.nama.trim() === '') {
            setGalatKirim('Nama wajib diisi.');

            return;
        }
        if (form.tanggalMulai === '' || form.tanggalSampai === '') {
            setGalatKirim('Tanggal peminjaman wajib diisi.');

            return;
        }

        const tautan = buatTautanWa(waNomor, buatPesan());

        if (tautan === null) {
            setGalatKirim('Penanggung jawab belum mengatur nomor WhatsApp. Hubungi pengurus secara manual.');

            return;
        }

        setGalatKirim(null);
        window.open(tautan, '_blank');
    };

    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            <Head title="Katalog Peminjaman | UKM ASSEM" />
            <LandingNavbar />

            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10">
                <div className="text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">Kerumahtanggaan</p>
                    <h1 className="mt-2 text-3xl font-bold md:text-4xl">Katalog Peminjaman Barang</h1>
                    <p className="mx-auto mt-2 max-w-2xl text-sm text-white/60">
                        Cari barang yang kamu butuhkan, masukkan ke daftar pinjam, lalu kirim pengajuan langsung lewat
                        WhatsApp ke penanggung jawab.
                    </p>
                    {(waNama || waNomor) && (
                        <div className="mx-auto mt-4 flex w-fit flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm">
                            <User className="h-4 w-4 text-red-400" />
                            <span className="text-white/70">Penanggung jawab:</span>
                            <span className="font-semibold">{waNama ?? '-'}</span>
                            {waNomor && (
                                <>
                                    <Phone className="ml-2 h-4 w-4 text-red-400" />
                                    <span className="font-mono">{waNomor}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-black/70 p-3"
                >
                    <Search className="ml-2 h-5 w-5 shrink-0 text-white/50" />
                    <Input
                        className="border-0 bg-transparent focus-visible:ring-0"
                        placeholder="Cari barang berdasarkan nama atau kode..."
                        value={cari}
                        onChange={(e) => setCari(e.target.value)}
                    />
                </form>

                {hasilCari.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/60 py-16 text-white/60">
                        {barang.length === 0 ? <PackageOpen className="h-8 w-8" /> : <Search className="h-8 w-8" />}
                        <p>
                            {barang.length === 0
                                ? 'Belum ada barang yang bisa dipinjam saat ini.'
                                : `Tidak ada barang yang cocok dengan "${cari}".`}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {hasilCari.map((item) => {
                            const dipilih = isiDaftar(item.id);
                            const foto = item.foto ? `/storage/${item.foto}` : null;

                            return (
                                <div
                                    key={item.id}
                                    className={`flex flex-col overflow-hidden rounded-2xl border bg-black/60 transition-colors ${
                                        dipilih ? 'border-red-400/70' : 'border-white/10 hover:border-red-400/40'
                                    }`}
                                >
                                    <div className="relative aspect-[4/3] w-full bg-black/40">
                                        {foto ? (
                                            <img src={foto} alt={item.nama_barang} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-white/30">
                                                <ImageOff className="h-8 w-8" />
                                            </div>
                                        )}
                                        {pricelistAktif && item.harga_sewa && (
                                            <span className="absolute bottom-2 left-2 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-red-400">
                                                Rp {Number(item.harga_sewa).toLocaleString('id-ID')} / pinjam
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col gap-2 p-4">
                                        <h2 className="text-lg font-semibold leading-tight">{item.nama_barang}</h2>
                                        {item.catatan && <p className="text-sm text-white/55">{item.catatan}</p>}

                                        <Button
                                            type="button"
                                            variant={dipilih ? 'destructive' : 'default'}
                                            className="mt-auto w-full"
                                            onClick={() => ubahPilih(item)}
                                        >
                                            {dipilih ? 'Keluarkan dari Daftar' : 'Masukkan ke Daftar'}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {daftarPinjam.length > 0 && (
                <div className="sticky bottom-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur-md">
                    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Boxes className="h-5 w-5 text-red-400" />
                                <span className="font-semibold">Daftar Pinjam</span>

                                {!bukaForm && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setBukaModalDaftar(true)}
                                    >
                                        <Badge variant="secondary" className="text-xs">
                                    {daftarPinjam.length} barang
                                </Badge>
                                        <ListChecks className="mr-2 h-4 w-4" />
                                        Lihat Daftar
                                    </Button>
                                )}
                            </div>
                            <Button type="button" onClick={() => setBukaForm(!bukaForm)}>
                                <CalendarClock className="mr-2 h-4 w-4" />
                                {bukaForm ? 'Tutup Formulir' : 'Pinjam Sekarang'}
                            </Button>
                        </div>

                        {bukaForm && (
                            <div className="grid gap-4 rounded-xl border border-white/10 bg-black/80 p-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
                                <div className="flex flex-col gap-3">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="nama-pinjam" className="text-white/70">
                                                Nama <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="nama-pinjam"
                                                placeholder="Nama lengkap / PJ"
                                                value={form.nama}
                                                onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="asal-pinjam" className="text-white/70">
                                                Asal Komunitas / Organisasi / UKM (opsional)
                                            </Label>
                                            <Input
                                                id="asal-pinjam"
                                                placeholder="Misal: UKM ASSEM"
                                                value={form.asal}
                                                onChange={(e) => setForm((prev) => ({ ...prev, asal: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="tgl-mulai" className="text-white/70">
                                                Tanggal Pinjam <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="tgl-mulai"
                                                type="date"
                                                min={new Date().toISOString().slice(0, 10)}
                                                value={form.tanggalMulai}
                                                onChange={(e) => setForm((prev) => ({ ...prev, tanggalMulai: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="tgl-sampai" className="text-white/70">
                                                Rencana Kembali <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                id="tgl-sampai"
                                                type="date"
                                                min={form.tanggalMulai || new Date().toISOString().slice(0, 10)}
                                                value={form.tanggalSampai}
                                                onChange={(e) => setForm((prev) => ({ ...prev, tanggalSampai: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {galatKirim && <p className="text-sm text-red-400">{galatKirim}</p>}

                                    <Button
                                        type="button"
                                        className="w-fit"
                                        onClick={kirimPinjaman}
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Kirim via WhatsApp ke {waNama ?? 'Penanggung Jawab'}
                                    </Button>
                                </div>

                                <ul className="flex max-h-52 flex-col gap-1.5 overflow-y-auto rounded-lg border border-white/10 p-3 text-sm">
                                    {daftarPinjam.map((item) => (
                                        <li key={item.id} className="flex items-center justify-between gap-2">
                                            <div className="flex flex-col">
                                                <span className="truncate font-medium">{item.nama_barang}</span>
                                                <span className="font-mono text-xs text-white/50">{item.kode}</span>
                                            </div>
                                            <button
                                                type="button"
                                                title="Keluarkan dari daftar"
                                                className="rounded p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-red-400"
                                                onClick={() => ubahPilih(item)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Dialog open={bukaModalDaftar} onOpenChange={setBukaModalDaftar}>
                <DialogContent className="max-w-md border-white/10 bg-neutral-950 text-white sm:rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Boxes className="h-5 w-5 text-red-400" />
                            Daftar Pinjam
                            <Badge variant="secondary" className="text-xs">
                                {daftarPinjam.length} barang
                            </Badge>
                        </DialogTitle>
                        <DialogDescription className="text-white/60">
                            Barang yang sudah kamu masukkan ke daftar pinjam.
                        </DialogDescription>
                    </DialogHeader>

                    {daftarPinjam.length === 0 ? (
                        <p className="rounded-lg border border-white/10 p-4 text-center text-sm text-white/50">
                            Daftar masih kosong — pilih barang dari katalog dulu.
                        </p>
                    ) : (
                        <ul className="flex max-h-52 flex-col gap-1.5 overflow-y-auto rounded-lg border border-white/10 p-3 text-sm">
                            {daftarPinjam.map((item) => (
                                <li key={item.id} className="flex items-center justify-between gap-2">
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate font-medium">{item.nama_barang}</span>
                                        <span className="font-mono text-xs text-white/50">{item.kode}</span>
                                    </div>
                                    <button
                                        type="button"
                                        title="Keluarkan dari daftar"
                                        className="rounded p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-red-400"
                                        onClick={() => ubahPilih(item)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setBukaModalDaftar(false)}
                        >
                            Tutup
                        </Button>
                        <Button
                            type="button"
                            disabled={daftarPinjam.length === 0}
                            onClick={() => {
                                setBukaModalDaftar(false);
                                setBukaForm(true);
                            }}
                        >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            Pinjam Sekarang
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <LandingFooter />
        </div>
    );
}
