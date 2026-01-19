import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight, ListChecks, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type RapatStatus = 'draft' | 'dijadwalkan' | 'berlangsung' | 'selesai' | 'dibatalkan';

interface JenisRapat {
    id: number;
    nama: string;
    deskripsi: string | null;
}

interface ProkerOption {
    id: number;
    nama_lengkap: string;
}

interface RapatItem {
    id: number;
    judul: string;
    tanggal: string;
    status: RapatStatus;
    kategori: string;
    jenis_rapat?: JenisRapat | null;
    proker?: ProkerOption | null;
    [key: string]: unknown;
}

interface CalendarProps {
    rapats: RapatItem[];
    month: number;
    year: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rapat',
        href: '/rapat',
    },
];

const STATUS_COLORS: Record<RapatStatus, string> = {
    draft: 'bg-gray-200 text-gray-800',
    dijadwalkan: 'bg-blue-100 text-blue-800',
    berlangsung: 'bg-amber-100 text-amber-800',
    selesai: 'bg-emerald-100 text-emerald-800',
    dibatalkan: 'bg-red-100 text-red-800',
};

const MONTH_NAMES = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
};

const getFirstDayOffset = (year: number, month: number) => {
    const date = new Date(year, month - 1, 1);
    const day = date.getDay();
    return (day + 6) % 7;
};

export default function Calendar({ rapats, month, year }: CalendarProps) {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOffset = getFirstDayOffset(year, month);

    const eventsByDay: Record<number, RapatItem[]> = {};

    rapats.forEach((rapat) => {
        if (!rapat.tanggal) {
            return;
        }
        const date = new Date(rapat.tanggal);
        const day = date.getDate();
        if (!eventsByDay[day]) {
            eventsByDay[day] = [];
        }
        eventsByDay[day].push(rapat);
    });

    const handleChangeMonth = (delta: number) => {
        let nextMonth = month + delta;
        let nextYear = year;

        if (nextMonth < 1) {
            nextMonth = 12;
            nextYear -= 1;
        } else if (nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
        }

        router.get(
            '/rapat/calendar',
            {
                month: nextMonth,
                year: nextYear,
            },
            {
                preserveState: false,
                replace: true,
            },
        );
    };

    const handleDayClick = (day: number) => {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const tanggal = `${year}-${monthStr}-${dayStr}`;

        router.get(
            '/rapat/create',
            { tanggal },
            {
                preserveState: false,
            },
        );
    };

    const cells = [];
    for (let i = 0; i < firstDayOffset; i += 1) {
        cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(day);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kalender Rapat" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-6 w-6 text-primary" />
                        <div>
                            <h1 className="text-lg font-semibold">Kalender Rapat</h1>
                            <p className="text-sm text-muted-foreground">
                                Lihat jadwal rapat dalam tampilan kalender.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-md border bg-muted/40 text-xs">
                            <Link href="/rapat">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    className="flex items-center gap-1 rounded-none border-r px-3"
                                >
                                    <ListChecks className="h-3 w-3" />
                                    List
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="flex items-center gap-1 rounded-none px-3"
                            >
                                <CalendarDays className="h-3 w-3" />
                                Kalender
                            </Button>
                        </div>
                        <Link href="/rapat/create">
                            <Button type="button" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Rapat
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleChangeMonth(-1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="text-sm font-semibold">
                            {MONTH_NAMES[month - 1]} {year}
                        </div>
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleChangeMonth(1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-blue-400" />
                            Dijadwalkan
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            Berlangsung
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Selesai
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-red-400" />
                            Dibatalkan
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border bg-background p-3">
                    <div className="grid grid-cols-7 gap-2 text-xs">
                        {DAY_NAMES.map((day) => (
                            <div
                                key={day}
                                className="px-2 py-1 text-center text-[11px] font-semibold uppercase text-muted-foreground"
                            >
                                {day}
                            </div>
                        ))}
                        {cells.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="min-h-[90px] rounded-md border border-dashed border-muted bg-muted/30"
                                    />
                                );
                            }

                            const events = eventsByDay[day] ?? [];

                            return (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleDayClick(day)}
                                    className="flex min-h-[110px] flex-col rounded-md border bg-background px-2 py-1 text-left hover:bg-muted/60"
                                >
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-xs font-semibold">{day}</span>
                                        {events.length > 0 && (
                                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                                {events.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                                        {events.map((rapat) => (
                                            <Link
                                                key={rapat.id}
                                                href={`/rapat/${rapat.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="group rounded-md border bg-muted/40 px-1.5 py-1 text-[11px] hover:bg-primary/10"
                                            >
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="line-clamp-2 font-medium">
                                                        {rapat.judul}
                                                    </span>
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-1">
                                                    {rapat.jenis_rapat && (
                                                        <span className="truncate text-[10px] text-muted-foreground">
                                                            {rapat.jenis_rapat.nama}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`ml-auto inline-flex items-center rounded px-1.5 py-0.5 text-[9px] font-semibold ${STATUS_COLORS[rapat.status]}`}
                                                    >
                                                        {rapat.status}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                        {events.length === 0 && (
                                            <span className="mt-4 text-[10px] text-muted-foreground">
                                                Tidak ada rapat
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="rounded-lg border bg-background p-3 text-xs text-muted-foreground">
                    <p>
                        Klik tanggal untuk membuat rapat baru dengan tanggal tersebut terisi
                        otomatis. Klik kartu rapat untuk melihat detail rapat.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
