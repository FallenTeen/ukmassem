import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

interface MainProker {
    id: number;
    nama_proker: string;
    deskripsi: string | null;
    gambar: string | null;
    prokers_count: number;
}

interface IndexProps {
    mainProkers: MainProker[];
}

interface MainProkerForm {
    nama_proker: string;
    deskripsi: string;
    gambar: File | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Main Proker',
        href: '/main-proker',
    },
];

export default function Index({ mainProkers }: IndexProps) {
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<MainProker | null>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const { data, setData, post, put, processing, errors, reset } = useForm<MainProkerForm>({
        nama_proker: '',
        deskripsi: '',
        gambar: null,
    });

    const openCreate = () => {
        setMode('create');
        setSelected(null);
        reset();
        setOpen(true);
    };

    const openEdit = (item: MainProker) => {
        setMode('edit');
        setSelected(item);
        setData({
            nama_proker: item.nama_proker,
            deskripsi: item.deskripsi ?? '',
            gambar: null,
        });
        setOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            forceFormData: true,
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message:
                        mode === 'create'
                            ? 'Main proker berhasil dibuat.'
                            : 'Main proker berhasil diperbarui.',
                });
                setOpen(false);
                reset();
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Terjadi kesalahan saat menyimpan main proker.',
                });
            },
        };

        if (mode === 'create') {
            post('/main-proker', options);
        } else if (selected) {
            put(`/main-proker/${selected.id}`, options);
        }
    };

    const handleDelete = (item: MainProker) => {
        router.delete(`/main-proker/${item.id}`, {
            onSuccess: () => {
                setToast({
                    type: 'success',
                    message: 'Main proker berhasil dihapus.',
                });
            },
            onError: () => {
                setToast({
                    type: 'error',
                    message: 'Gagal menghapus main proker.',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Main Proker" />

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
                        <h1 className="text-lg font-semibold">Main Proker</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola kelompok besar program kerja ASSEM.
                        </p>
                    </div>
                    <Button type="button" onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Main Proker
                    </Button>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {mode === 'create' ? 'Buat Main Proker Baru' : 'Edit Main Proker'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="nama_proker">Nama Main Proker</Label>
                                <Input
                                    id="nama_proker"
                                    value={data.nama_proker}
                                    onChange={(e) => setData('nama_proker', e.target.value)}
                                />
                                <InputError message={errors.nama_proker} />
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
                            <div className="space-y-1">
                                <Label htmlFor="gambar">Gambar (opsional)</Label>
                                <Input
                                    id="gambar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData('gambar', e.target.files?.[0] ?? null)
                                    }
                                />
                                <InputError message={errors.gambar} />
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

                {mainProkers.length === 0 && (
                    <div className="rounded-lg border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
                        Belum ada main proker. Klik &quot;Tambah Main Proker&quot; untuk mulai
                        menambah.
                    </div>
                )}

                {mainProkers.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {mainProkers.map((item) => (
                            <Card key={item.id}>
                                <CardHeader className="gap-3">
                                    {item.gambar && (
                                        <div className="overflow-hidden rounded-lg border bg-muted/40">
                                            <img
                                                src={`/storage/${item.gambar}`}
                                                alt={item.nama_proker}
                                                className="h-40 w-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <CardTitle className="text-base">
                                            {item.nama_proker}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {item.deskripsi && (
                                        <p className="text-sm text-muted-foreground">
                                            {item.deskripsi}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Jumlah proker</span>
                                        <Badge variant="outline">{item.prokers_count}</Badge>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-center justify-between gap-2">
                                    <div className="flex gap-2">
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
                                                    <DialogTitle>Hapus Main Proker</DialogTitle>
                                                </DialogHeader>
                                                <p className="text-sm text-muted-foreground">
                                                    Main proker ini dan seluruh prokernya akan
                                                    dihapus. Tindakan ini tidak dapat dibatalkan.
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
                                    <Link
                                        href={`/proker?tahun=&status=&main_proker_id=${item.id}`}
                                        className="text-xs font-medium text-primary hover:underline"
                                    >
                                        Lihat Proker
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

