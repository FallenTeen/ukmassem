import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Anggota } from '@/types/anggota';

type ProkerStatus = 'draft' | 'aktif' | 'selesai' | 'dibatalkan';

interface Presensi {
    id: number;
    anggota_id: number;
    status_kehadiran: string;
    anggota?: Anggota | null;
}

interface Rapat {
    id: number;
    judul: string;
    tanggal: string;
    presensi_rapats?: Presensi[];
    [key: string]: unknown;
}

interface ProkerForRekap {
    status: ProkerStatus;
    rapats?: Rapat[];
    [key: string]: unknown;
}

interface RekapProps {
    proker: ProkerForRekap;
}

const STATUS_PROGRESS: Record<ProkerStatus, number> = {
    draft: 25,
    aktif: 60,
    selesai: 100,
    dibatalkan: 0,
};

export default function Rekap({ proker }: RekapProps) {
    const rapats = (proker.rapats ?? []) as Rapat[];

    const rapatStats = rapats.map((rapat) => {
        const presensis = (rapat.presensi_rapats ?? []) as Presensi[];
        const total = presensis.length;
        const hadir = presensis.filter((p) => p.status_kehadiran === 'hadir').length;
        const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;
        return { rapat, total, hadir, percentage };
    });

    const rapatDenganPresensi = rapatStats.filter((r) => r.total > 0);
    const rataRataKehadiran =
        rapatDenganPresensi.length === 0
            ? 0
            : Math.round(
                  rapatDenganPresensi.reduce((sum, r) => sum + r.percentage, 0) /
                      rapatDenganPresensi.length,
              );

    const anggotaMap = new Map<
        number,
        {
            hadir: number;
            total: number;
            nama: string;
        }
    >();

    rapatStats.forEach(({ rapat }) => {
        const presensis = (rapat.presensi_rapats ?? []) as Presensi[];
        presensis.forEach((p) => {
            const existing = anggotaMap.get(p.anggota_id) ?? {
                hadir: 0,
                total: 0,
                nama: p.anggota
                    ? p.anggota.nama_lengkap || p.anggota.user?.name || `Anggota ${p.anggota_id}`
                    : `Anggota ${p.anggota_id}`,
            };
            const hadirInc = p.status_kehadiran === 'hadir' ? 1 : 0;
            const next = {
                ...existing,
                hadir: existing.hadir + hadirInc,
                total: existing.total + 1,
            };
            anggotaMap.set(p.anggota_id, next);
        });
    });

    const anggotaStats = Array.from(anggotaMap.values())
        .map((item) => ({
            ...item,
            percentage: item.total > 0 ? Math.round((item.hadir / item.total) * 100) : 0,
        }))
        .sort((a, b) => b.percentage - a.percentage || b.hadir - a.hadir)
        .slice(0, 10);

    const progressValue = STATUS_PROGRESS[proker.status] ?? 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Total Rapat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{rapats.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Rata-rata Kehadiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">
                            {rataRataKehadiran}
                            <span className="text-sm font-normal text-muted-foreground">
                                %
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Progress Proker</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span>Status: {proker.status}</span>
                            <span>{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Kehadiran per Anggota</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        {anggotaStats.length === 0 && (
                            <div className="text-muted-foreground">
                                Belum ada data presensi rapat.
                            </div>
                        )}
                        {anggotaStats.map((item, index) => (
                            <div key={index} className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-medium">{item.nama}</span>
                                    <span className="text-muted-foreground">
                                        {item.hadir}/{item.total} hadir ({item.percentage}%)
                                    </span>
                                </div>
                                <Progress value={item.percentage} />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Rapat dan Tingkat Kehadiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {rapatStats.length === 0 && (
                            <div className="text-xs text-muted-foreground">
                                Belum ada rapat yang terhubung dengan proker ini.
                            </div>
                        )}
                        {rapatStats.length > 0 && (
                            <table className="w-full text-left text-xs">
                                <thead className="border-b bg-muted/40 text-[11px] uppercase text-muted-foreground">
                                    <tr>
                                        <th className="px-2 py-1">Judul</th>
                                        <th className="px-2 py-1">Tanggal</th>
                                        <th className="px-2 py-1 text-right">Kehadiran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rapatStats.map((item) => (
                                        <tr key={item.rapat.id} className="border-b last:border-0">
                                            <td className="px-2 py-1 align-top">
                                                <div className="max-w-[220px] truncate">
                                                    {item.rapat.judul}
                                                </div>
                                            </td>
                                            <td className="px-2 py-1 align-top text-[11px] text-muted-foreground">
                                                {item.rapat.tanggal}
                                            </td>
                                            <td className="px-2 py-1 align-top text-right text-[11px] text-muted-foreground">
                                                {item.hadir}/{item.total} hadir ({item.percentage}
                                                %)
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

