import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface JenisRapat {
    id: number;
    nama: string;
    deskripsi: string | null;
}

interface IndexProps {
    jenisRapats: JenisRapat[];
}

interface JenisForm {
    nama: string;
    deskripsi: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master Jenis Rapat',
        href: '/rapat/master-jenis',
    },
];

export default function Index({ jenisRapats }: IndexProps) {
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<JenisRapat | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const { data, setData, post, put, processing, errors, reset } = useForm<JenisForm>({
        nama: '',
        deskripsi: '',
    });

    const openCreate = () => {
        setMode('create');
        setSelected(null);
        reset();
        setOpen(true);
    };

    const openEdit = (item: JenisRapat) => {
        setMode('edit');
        setSelected(item);
        setData({
            nama: item.nama,
            deskripsi: item.deskripsi ?? '',
        });
        setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message:
                        mode === 'create'
                            ? 'Jenis rapat berhasil ditambahkan.'
                            : 'Jenis rapat berhasil diperbarui.',
                });
                setOpen(false);
                reset();
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Terjadi kesalahan saat menyimpan jenis rapat.',
                });
            },
        };

        if (mode === 'create') {
            post('/rapat/master-jenis', options);
        } else if (selected) {
            put(`/rapat/master-jenis/${selected.id}`, options);
        }
    };

    const handleDelete = (item: JenisRapat) => {
        router.delete(`/rapat/master-jenis/${item.id}`, {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Jenis rapat berhasil dihapus.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal menghapus jenis rapat.',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Jenis Rapat" />

            <div className="flex flex-col gap-4 p-4">
                {toast && (
                    <div className="fixed right-4 top-4 z-50 max-w-sm">
                        <div
                            className={`rounded-md border px-4 py-3 text-sm shadow-md ${
                                toast.type === 'success'
                                    ? 'border-green-200 bg-green-50 text-green-800'
                                    : 'border-red-200 bg-red-50 text-red-800'
                            }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <span>{toast.message}</span>
                                <button
                                    type="button"
                                    className="text-xs font-semibold"
                                    onClick={() => setToast(null)}
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Master Jenis Rapat</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola jenis rapat yang digunakan di sistem.
                        </p>
                    </div>
                    <Button type="button" onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Jenis Rapat
                    </Button>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {mode === 'create' ? 'Tambah Jenis Rapat' : 'Edit Jenis Rapat'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="nama">Nama</Label>
                                <Input
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                <InputError message={errors.nama} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Input
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                />
                                <InputError message={errors.deskripsi} />
                            </div>
                            <DialogFooter className="pt-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="overflow-x-auto rounded-lg border bg-background">
                    <table className="w-full min-w-[520px] text-left text-sm">
                        <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-4 py-2">Nama</th>
                                <th className="px-4 py-2">Deskripsi</th>
                                <th className="px-4 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jenisRapats.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                                    >
                                        Belum ada jenis rapat.
                                    </td>
                                </tr>
                            )}
                            {jenisRapats.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b last:border-0 hover:bg-muted/40"
                                >
                                    <td className="px-4 py-3 text-sm">{item.nama}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {item.deskripsi || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openEdit(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        <Trash2 className="mr-1 h-3 w-3" />
                                                        Hapus
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Hapus Jenis Rapat
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <p className="text-sm text-muted-foreground">
                                                        Yakin ingin menghapus jenis rapat ini?
                                                        Tindakan ini tidak dapat dibatalkan.
                                                    </p>
                                                    <DialogFooter className="pt-3">
                                                        <DialogClose asChild>
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                            >
                                                                Batal
                                                            </Button>
                                                        </DialogClose>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            onClick={() => handleDelete(item)}
                                                        >
                                                            Hapus
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

