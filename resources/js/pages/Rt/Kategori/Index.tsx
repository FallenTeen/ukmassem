import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import AlertError from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type KategoriBarang } from '../types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kategori Barang', href: '/inventaris/kategori' },
];

export default function Index({ kategoris }: { kategoris: KategoriBarang[] }) {
    const [baru, setBaru] = useState({ kode: '', nama: '', keterangan: '' });
    const [edit, setEdit] = useState<{ [id: number]: { kode: string; nama: string; keterangan: string } }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [processing, setProcessing] = useState(false);

    const simpanBaru = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/inventaris/kategori', baru, {
            onFinish: () => {
                setProcessing(false);
                setBaru({ kode: '', nama: '', keterangan: '' });
            },
            onError: (bag) => setErrors(bag as { [key: string]: string }),
        });
    };

    const simpanEdit = (id: number) => {
        setProcessing(true);
        router.put(`/inventaris/kategori/${id}`, edit[id], {
            onFinish: () => setProcessing(false),
            onError: (bag) => setErrors(bag as { [key: string]: string }),
        });
    };

    const hapus = (id: number) => {
        setProcessing(true);
        router.delete(`/inventaris/kategori/${id}`, {
            onFinish: () => setProcessing(false),
            onError: (bag) => setErrors(bag as { [key: string]: string }),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Barang" />

            <div className="flex flex-col gap-4 p-4">
                {Object.keys(errors).length > 0 && (
                    <AlertError title="Gagal menyimpan" errors={Object.values(errors)} />
                )}

                <div>
                    <h1 className="text-lg font-semibold">Kategori Barang</h1>
                    <p className="text-sm text-muted-foreground">
                        Kode kategori dipakai sebagai prefiks kode unit (misal A → A-001).
                    </p>
                </div>

                <form onSubmit={simpanBaru} className="flex flex-wrap items-end gap-3 rounded-lg border bg-background p-4">
                    <div className="w-28 space-y-1">
                        <Label htmlFor="kode">Kode</Label>
                        <Input
                            id="kode"
                            placeholder="A"
                            maxLength={3}
                            value={baru.kode}
                            onChange={(e) => setBaru((prev) => ({ ...prev, kode: e.target.value.toUpperCase() }))}
                            required
                        />
                    </div>
                    <div className="w-56 space-y-1">
                        <Label htmlFor="nama">Nama</Label>
                        <Input
                            id="nama"
                            placeholder="Kapital / Opt File"
                            value={baru.nama}
                            onChange={(e) => setBaru((prev) => ({ ...prev, nama: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="w-64 space-y-1">
                        <Label htmlFor="keterangan">Keterangan</Label>
                        <Input
                            id="keterangan"
                            placeholder="Opsional"
                            value={baru.keterangan}
                            onChange={(e) => setBaru((prev) => ({ ...prev, keterangan: e.target.value }))}
                        />
                    </div>
                    <Button type="submit" disabled={processing}>
                        Tambah
                    </Button>
                </form>

                <div className="min-h-0 flex-1 overflow-auto rounded-lg border bg-background">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead className="sticky top-0 z-10 border-b bg-muted text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2">Kode</th>
                                <th className="px-4 py-2">Nama</th>
                                <th className="px-4 py-2">Keterangan</th>
                                <th className="px-4 py-2">Jumlah Unit</th>
                                <th className="px-4 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kategoris.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">
                                        Belum ada kategori.
                                    </td>
                                </tr>
                            )}
                            {kategoris.map((kategori) => {
                                const nilai = edit[kategori.id] ?? {
                                    kode: kategori.kode,
                                    nama: kategori.nama,
                                    keterangan: kategori.keterangan ?? '',
                                };

                                const sedangEdit = Boolean(edit[kategori.id]);

                                return (
                                    <tr key={kategori.id} className="border-b last:border-0">
                                        <td className="px-4 py-2">
                                            {sedangEdit ? (
                                                <Input
                                                    className="w-20"
                                                    maxLength={3}
                                                    value={nilai.kode}
                                                    onChange={(e) =>
                                                        setEdit((prev) => ({
                                                            ...prev,
                                                            [kategori.id]: { ...nilai, kode: e.target.value.toUpperCase() },
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                <span className="font-mono">{kategori.kode}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {sedangEdit ? (
                                                <Input
                                                    value={nilai.nama}
                                                    onChange={(e) =>
                                                        setEdit((prev) => ({ ...prev, [kategori.id]: { ...nilai, nama: e.target.value } }))
                                                    }
                                                />
                                            ) : (
                                                kategori.nama
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            {sedangEdit ? (
                                                <Input
                                                    value={nilai.keterangan}
                                                    onChange={(e) =>
                                                        setEdit((prev) => ({
                                                            ...prev,
                                                            [kategori.id]: { ...nilai, keterangan: e.target.value },
                                                        }))
                                                    }
                                                />
                                            ) : (
                                                kategori.keterangan ?? '-'
                                            )}
                                        </td>
                                        <td className="px-4 py-2">{kategori.inventariss_count ?? 0}</td>
                                        <td className="px-4 py-2 text-right">
                                            {sedangEdit ? (
                                                <div className="space-x-1">
                                                    <Button type="button" size="sm" disabled={processing} onClick={() => simpanEdit(kategori.id)}>
                                                        Simpan
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setEdit((prev) => {
                                                                const next = { ...prev };
                                                                delete next[kategori.id];
                                                                return next;
                                                            })
                                                        }
                                                    >
                                                        Batal
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-x-1">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setEdit((prev) => ({ ...prev, [kategori.id]: nilai }))}
                                                    >
                                                        Ubah
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        disabled={processing}
                                                        onClick={() => hapus(kategori.id)}
                                                    >
                                                        Hapus
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
