import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota, FilterAnggota, Paginator, Role, StatusAnggota } from '@/types/anggota';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kelola Anggota',
        href: '/kelola-anggota',
    },
];

const DIVISI_COLORS: Record<string, string> = {
    film: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    foto: 'bg-green-100 text-green-800 border-green-200',
    musik: 'bg-blue-100 text-blue-800 border-blue-200',
    tari: 'bg-red-100 text-red-800 border-red-200',
    teater: 'bg-amber-900/10 text-amber-900 border-amber-900/40',
};

const ROLES: Role[] = [
    'rajawebsite',
    'ketum_waketum',
    'sekretaris',
    'bendahara',
    'dm',
    'humas',
    'kad_fot',
    'kad_fil',
    'kad_tar',
    'kad_mus',
    'kad_tea',
    'rt',
    'litbang',
    'pelatih',
    'pembina',
    'po',
    'anggota',
];

const PER_PAGE_OPTIONS = [10, 20, 50];

interface IndexProps {
    anggotas: Paginator<Anggota>;
    filters: FilterAnggota;
}

export default function Index({ anggotas, filters }: IndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedDivisi, setSelectedDivisi] = useState<string[]>(
        Array.isArray(filters.divisi) ? filters.divisi : filters.divisi ? [filters.divisi] : [],
    );
    const [statusAnggota, setStatusAnggota] = useState<StatusAnggota | ''>(
        (filters.status_anggota as StatusAnggota | '') ?? '',
    );
    const [role, setRole] = useState<Role | ''>(filters.role ?? '');
    const [perPage, setPerPage] = useState<number>(
        typeof filters.per_page === 'number' ? filters.per_page : 20,
    );
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const initials = useInitials();

    const activeDivisi = useMemo(() => new Set(selectedDivisi), [selectedDivisi]);

    const toggleDivisi = (value: string) => {
        setSelectedDivisi((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
        );
    };

    const applyFilters = () => {
        setLoading(true);
        const firstDivisi = selectedDivisi[0] ?? '';

        router.get(
            '/kelola-anggota',
            {
                search: search || undefined,
                divisi: firstDivisi || undefined,
                status_anggota: statusAnggota || undefined,
                role: role || undefined,
                per_page: perPage,
            },
            {
                preserveState: true,
                replace: true,
                onFinish: () => {
                    setLoading(false);
                },
                onError: () => {
                    setToast({
                        type: 'error',
                        message: 'Gagal memuat data anggota.',
                    });
                },
            },
        );
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        setLoading(true);
        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setLoading(false);
                },
                onError: () => {
                    setToast({
                        type: 'error',
                        message: 'Gagal memuat halaman.',
                    });
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Anggota" />

            <div className="flex flex-col gap-4 p-4 md:flex-row">
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

                <div className="w-full space-y-4 md:w-72">
                    <div className="rounded-lg border bg-background p-4">
                        <h2 className="mb-3 text-sm font-semibold">Filter Anggota</h2>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="search">Cari</Label>
                                <Input
                                    id="search"
                                    placeholder="Nama, NIM, Nomor Anggota"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Divisi</Label>
                                <div className="flex flex-wrap gap-1.5">
                                    {['musik', 'foto', 'film', 'tari', 'teater'].map((divisi) => (
                                        <button
                                            key={divisi}
                                            type="button"
                                            onClick={() => toggleDivisi(divisi)}
                                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize transition-colors ${
                                                activeDivisi.has(divisi)
                                                    ? DIVISI_COLORS[divisi]
                                                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {divisi}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Status Anggota</Label>
                                <Select
                                    value={statusAnggota || 'all'}
                                    onValueChange={(value) =>
                                        setStatusAnggota(
                                            value === 'all' ? '' : (value as StatusAnggota),
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua status</SelectItem>
                                        <SelectItem value="calon_anggota">
                                            Calon Anggota
                                        </SelectItem>
                                        <SelectItem value="anggota_muda">
                                            Anggota Muda
                                        </SelectItem>
                                        <SelectItem value="anggota_tetap">
                                            Anggota Tetap
                                        </SelectItem>
                                        <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                        <SelectItem value="alumni">Alumni</SelectItem>
                                        <SelectItem value="pembina">Pembina</SelectItem>
                                        <SelectItem value="pelatih">Pelatih</SelectItem>
                                        <SelectItem value="lain">Lain</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Role</Label>
                                <Select
                                    value={role || 'all'}
                                    onValueChange={(value) =>
                                        setRole(value === 'all' ? '' : (value as Role | ''))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua role</SelectItem>
                                        {ROLES.map((item) => (
                                            <SelectItem key={item} value={item}>
                                                {item}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Per halaman</Label>
                                <Select
                                    value={String(perPage)}
                                    onValueChange={(value) =>
                                        setPerPage(Number.parseInt(value, 10))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PER_PAGE_OPTIONS.map((opt) => (
                                            <SelectItem key={opt} value={String(opt)}>
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={applyFilters}
                                    disabled={loading}
                                >
                                    {loading && <Spinner />}
                                    Terapkan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <h1 className="text-lg font-semibold">Daftar Anggota</h1>
                            <p className="text-sm text-muted-foreground">
                                Total {anggotas.total} anggota terdaftar.
                            </p>
                        </div>
                        <Link
                            href="/kelola-anggota/create"
                            className={buttonVariants({ variant: 'default', size: 'sm' })}
                        >
                            Tambah Anggota
                        </Link>
                    </div>

                    <div className="overflow-x-auto rounded-lg border bg-background">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-2">Anggota</th>
                                    <th className="px-4 py-2">NIM</th>
                                    <th className="px-4 py-2">Divisi</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Role</th>
                                    <th className="px-4 py-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {anggotas.data.length === 0 && (
                                    <tr>
                                        <td
                                            className="px-4 py-6 text-center text-sm text-muted-foreground"
                                            colSpan={6}
                                        >
                                            Tidak ada data anggota.
                                        </td>
                                    </tr>
                                )}
                                {anggotas.data.map((anggota) => (
                                    <tr
                                        key={anggota.id}
                                        className="border-b last:border-0 hover:bg-muted/40"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-primary/10 text-xs font-semibold uppercase text-primary">
                                                        {initials(
                                                            anggota.nama_lengkap ||
                                                                anggota.user?.name ||
                                                                'A',
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">
                                                        {anggota.nama_lengkap ||
                                                            anggota.user?.name ||
                                                            '-'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {anggota.nomor_telepon || 'Tanpa nomor'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {anggota.NIM || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {anggota.divisi ? (
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize ${
                                                        DIVISI_COLORS[anggota.divisi] || ''
                                                    }`}
                                                >
                                                    {anggota.divisi}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm capitalize">
                                            {anggota.status_anggota.replace('_', ' ')}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {String(anggota.user?.role ?? '-')}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/kelola-anggota/${anggota.id}`}
                                                    className="text-xs font-medium text-primary hover:underline"
                                                >
                                                    Detail
                                                </Link>
                                                <Link
                                                    href={`/kelola-anggota/${anggota.id}/edit`}
                                                    className="text-xs font-medium text-amber-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
                        <div>
                            Menampilkan {anggotas.from ?? 0} - {anggotas.to ?? 0} dari{' '}
                            {anggotas.total} data
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                            {anggotas.links.map((link, index) => {
                                const isDisabled = link.url === null;
                                const label =
                                    link.label === '&laquo; Previous'
                                        ? '«'
                                        : link.label === 'Next &raquo;'
                                          ? '»'
                                          : link.label;

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={isDisabled}
                                        onClick={() => handlePageChange(link.url)}
                                        className={`min-w-8 rounded border px-2 py-1 text-xs ${
                                            link.active
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-gray-200 bg-background text-foreground hover:bg-muted'
                                        } ${isDisabled ? 'opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="fixed bottom-6 right-6 md:hidden">
                        <Link
                            href="/kelola-anggota/create"
                            className={buttonVariants({
                                variant: 'default',
                                size: 'lg',
                            })}
                        >
                            +
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
