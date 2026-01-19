import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Anggota, Paginator, Role } from '@/types/anggota';

interface IndexProps {
    anggotas: Paginator<Anggota>;
}

type StatusFilter = 'semua' | 'sudah' | 'belum';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Akun',
        href: '/user-account',
    },
];

const DIVISI_LABELS: Record<string, string> = {
    musik: 'Musik',
    foto: 'Foto',
    film: 'Film',
    tari: 'Tari',
    teater: 'Teater',
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

export default function Index({ anggotas }: IndexProps) {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('semua');
    const [divisiFilter, setDivisiFilter] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<Role | ''>('');
    const [search, setSearch] = useState('');
    const [processingBulk, setProcessingBulk] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(
        null,
    );

    const filtered = useMemo(
        () =>
            anggotas.data.filter((anggota) => {
                const hasUser = Boolean(anggota.user);

                if (statusFilter === 'sudah' && !hasUser) return false;
                if (statusFilter === 'belum' && hasUser) return false;

                if (divisiFilter && anggota.divisi !== divisiFilter) return false;

                if (roleFilter && anggota.user?.role !== roleFilter) return false;

                if (search.trim() !== '') {
                    const q = search.toLowerCase();
                    const nama =
                        anggota.nama_lengkap ||
                        anggota.user?.name ||
                        '';
                    const nim = anggota.NIM || '';
                    const email = anggota.user?.email || '';
                    if (
                        !nama.toLowerCase().includes(q) &&
                        !nim.toLowerCase().includes(q) &&
                        !email.toLowerCase().includes(q)
                    ) {
                        return false;
                    }
                }

                return true;
            }),
        [anggotas.data, statusFilter, divisiFilter, roleFilter, search],
    );

    const handleBulkCreateNavigate = () => {
        setProcessingBulk(true);
        router.post(
            '/user-account/bulk-create',
            {},
            {
                onFinish: () => setProcessingBulk(false),
                onError: () =>
                    setToast({
                        type: 'error',
                        message: 'Gagal membuka halaman bulk create.',
                    }),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Akun User" />

            <div className="flex flex-col gap-4 p-4">
                {toast && (
                    <div className="max-w-sm rounded-md border px-4 py-3 text-sm shadow-sm">
                        <div
                            className={
                                toast.type === 'success'
                                    ? 'text-green-800'
                                    : 'text-red-800'
                            }
                        >
                            {toast.message}
                        </div>
                    </div>
                )}

                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-lg font-semibold">Manajemen Akun User</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola akun login untuk anggota ASSEM.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            onClick={handleBulkCreateNavigate}
                            disabled={processingBulk}
                        >
                            {processingBulk ? 'Memuat...' : 'Buat Akun Massal'}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                    <div className="space-y-3 rounded-lg border bg-background p-4">
                        <h2 className="text-sm font-semibold">Filter</h2>
                        <div className="space-y-2">
                            <Label htmlFor="search">Cari</Label>
                            <Input
                                id="search"
                                placeholder="Nama, NIM, email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status Akun</Label>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) =>
                                    setStatusFilter(value as StatusFilter)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua</SelectItem>
                                    <SelectItem value="sudah">Sudah punya akun</SelectItem>
                                    <SelectItem value="belum">Belum punya akun</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Divisi</Label>
                            <Select
                                value={divisiFilter || 'all'}
                                onValueChange={(value) =>
                                    setDivisiFilter(value === 'all' ? '' : value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua divisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua divisi</SelectItem>
                                    {Object.entries(DIVISI_LABELS).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={roleFilter || 'all'}
                                onValueChange={(value) =>
                                    setRoleFilter(
                                        value === 'all' ? '' : (value as Role | ''),
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua role</SelectItem>
                                    {ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border bg-background">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-2">Nama</th>
                                    <th className="px-4 py-2">NIM</th>
                                    <th className="px-4 py-2">Divisi</th>
                                    <th className="px-4 py-2">Status Akun</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Role</th>
                                    <th className="px-4 py-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            Tidak ada data.
                                        </td>
                                    </tr>
                                )}
                                {filtered.map((anggota) => {
                                    const hasUser = Boolean(anggota.user);
                                    return (
                                        <tr
                                            key={anggota.id}
                                            className="border-b last:border-0 hover:bg-muted/40"
                                        >
                                            <td className="px-4 py-3 text-sm">
                                                {anggota.nama_lengkap ||
                                                    anggota.user?.name ||
                                                    '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {anggota.NIM || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm capitalize">
                                                {anggota.divisi || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <Badge
                                                    variant={
                                                        hasUser ? 'default' : 'secondary'
                                                    }
                                                >
                                                    {hasUser ? 'Sudah' : 'Belum'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {anggota.user?.email || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {String(anggota.user?.role ?? '-')}
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs">
                                                {hasUser ? (
                                                    <Link
                                                        href={`/user-account/${anggota.user?.id}/edit`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        Edit Akun
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/user-account/create/${anggota.id}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        Buat Akun
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between text-xs text-muted-foreground">
                        <div>
                            Menampilkan {anggotas.from ?? 0} - {anggotas.to ?? 0} dari{' '}
                            {anggotas.total} data (server)
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

