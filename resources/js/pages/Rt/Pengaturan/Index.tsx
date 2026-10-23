import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Peminjaman', href: '/peminjaman' },
    { title: 'Pengaturan', href: '' },
];

export default function Pengaturan({
    waNama,
    waNomor,
    pricelistAktif,
}: {
    waNama: string | null;
    waNomor: string | null;
    pricelistAktif: boolean;
}) {
    const [nama, setNama] = useState(waNama ?? '');
    const [nomor, setNomor] = useState(waNomor ?? '');
    const [pricelist, setPricelist] = useState(pricelistAktif);
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/peminjaman/pengaturan', {
            wa_nama: nama,
            wa_nomor: nomor,
            pricelist_aktif: pricelist,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Peminjaman" />

            <div className="flex flex-col gap-4 p-4">
                <div>
                    <h1 className="text-lg font-semibold">Pengaturan Peminjaman</h1>
                    <p className="text-sm text-muted-foreground">
                        Data penanggung jawab peminjaman barang yang akan menerima pesan WhatsApp pengajuan.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4 md:max-w-2xl">
                    <div className="space-y-1">
                        <Label htmlFor="wa_nama">Nama Penanggung Jawab</Label>
                        <Input
                            id="wa_nama"
                            placeholder="Misal: Ito"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="wa_nomor">Nomor WhatsApp Penanggung Jawab</Label>
                        <Input
                            id="wa_nomor"
                            placeholder="Misal: 0812 3456 7890"
                            value={nomor}
                            onChange={(e) => setNomor(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Pengajuan dari katalog publik dikirim otomatis ke nomor ini.
                        </p>
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border"
                            checked={pricelist}
                            onChange={(e) => setPricelist(e.target.checked)}
                        />
                        Tampilkan harga sewa di katalog publik
                    </label>

                    <Button type="submit" disabled={processing} className="w-fit">
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
