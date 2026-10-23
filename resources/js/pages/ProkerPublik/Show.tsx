import { Head, Link } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';
import {
    LABEL_STATUS_PROKER,
    formatTanggal,
    gambarUrl,
    type MainProkerItem,
    type PagelaranRingkas,
    type ProkerRingkas,
} from '@/pages/ProkerPublik/types';

interface PortfolioShowProps {
    mainProker: MainProkerItem;
    prokers: ProkerRingkas[];
    pagelaran: PagelaranRingkas[];
}

const STATUS_WARNA: Record<string, string> = {
    aktif: 'border-green-500/40 bg-green-500/10 text-green-400',
    selesai: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    draft: 'border-white/15 bg-white/5 text-white/70',
    dibatalkan: 'border-red-500/40 bg-red-500/10 text-red-400',
};

export default function PortfolioShow({ mainProker, prokers, pagelaran }: PortfolioShowProps) {
    return (
        <>
            <Head title={`${mainProker.nama_proker} — UKM ASSEM`} />
            <div className="flex min-h-screen flex-col bg-black text-white">
                <LandingNavbar />
                <main className="flex w-full flex-1 flex-col">
                    {/* Hero */}
                    <section className="relative min-h-[320px] w-full overflow-hidden md:min-h-[420px]">
                        <img
                            src={gambarUrl(mainProker.gambar)}
                            alt={mainProker.nama_proker}
                            className="absolute inset-0 h-full w-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                        <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end px-4 pb-10 pt-40">
                            <Link href="/portfolio" className="mb-4 text-sm text-white/70 hover:text-white">
                                ← Kembali ke portfolio
                            </Link>
                            <h1 className="text-3xl font-bold md:text-5xl">{mainProker.nama_proker}</h1>
                            {mainProker.deskripsi && (
                                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                                    {mainProker.deskripsi}
                                </p>
                            )}
                        </div>
                    </section>

                    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 py-14">
                        {/* Pro-proker */}
                        <ScrollReveal direction="up">
                            <section>
                                <h2 className="text-2xl font-bold">Rangkaian Kegiatan</h2>
                                <p className="mt-2 text-sm text-white/70">
                                    Program kerja bertahun-tahun di bawah {mainProker.nama_proker}.
                                </p>
                                {prokers.length === 0 ? (
                                    <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                                        Belum ada kegiatan yang didokumentasikan.
                                    </p>
                                ) : (
                                    <ul className="mt-6 space-y-4">
                                        {prokers.map((proker) => (
                                            <li
                                                key={proker.id}
                                                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-5 transition-colors hover:border-white/20"
                                            >
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <h3 className="text-lg font-semibold">{proker.nama_lengkap}</h3>
                                                    <span
                                                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                                            STATUS_WARNA[proker.status] ?? STATUS_WARNA.draft
                                                        }`}
                                                    >
                                                        {LABEL_STATUS_PROKER[proker.status] ?? proker.status}
                                                    </span>
                                                    <span className="text-xs text-white/60">
                                                        Tahun {proker.tahun}
                                                        {proker.tanggal_mulai
                                                            ? ` • ${formatTanggal(proker.tanggal_mulai)}${
                                                                  proker.tanggal_selesai
                                                                      ? ` – ${formatTanggal(proker.tanggal_selesai)}`
                                                                      : ''
                                                              }`
                                                            : ''}
                                                    </span>
                                                </div>
                                                {proker.ketua_pelaksana?.user?.name && (
                                                    <p className="mt-2 text-xs text-white/60">
                                                        Ketua pelaksana: {proker.ketua_pelaksana.user.name}
                                                    </p>
                                                )}
                                                {proker.deskripsi && (
                                                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                                                        {proker.deskripsi}
                                                    </p>
                                                )}
                                                {(proker.galeris ?? []).length > 0 && (
                                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-semibold uppercase tracking-wide text-white/40">
                                                            Artikel:
                                                        </span>
                                                        {(proker.galeris ?? []).map((artikel) => (
                                                            <Link
                                                                key={artikel.id}
                                                                href={`/galeri/${artikel.jenis}/${artikel.slug}`}
                                                                className="group/link inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 transition-colors hover:border-red-400/60 hover:bg-red-500/10 hover:text-white"
                                                            >
                                                                {artikel.judul}
                                                                {formatTanggal(artikel.tanggal) ? (
                                                                    <span className="text-white/40">
                                                                        • {formatTanggal(artikel.tanggal)}
                                                                    </span>
                                                                ) : null}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        </ScrollReveal>

                        {/* Pagelaran / dokumentasi */}
                        <ScrollReveal direction="up">
                            <section>
                                <h2 className="text-2xl font-bold">Dokumentasi Pagelaran</h2>
                                <p className="mt-2 text-sm text-white/70">
                                    Dokumentasi lengkap tersedia di galeri pagelaran UKM ASSEM.
                                </p>
                                {pagelaran.length === 0 ? (
                                    <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">
                                        Belum ada dokumentasi pagelaran untuk proker ini.
                                    </p>
                                ) : (
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {pagelaran.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/galeri/pagelaran/${item.slug}`}
                                                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40"
                                            >
                                                <div className="aspect-video w-full overflow-hidden bg-black/40">
                                                    {item.cover_path ? (
                                                        <img
                                                            src={`/storage/${item.cover_path}`}
                                                            alt={item.judul}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="flex flex-1 flex-col gap-2 p-4">
                                                    <h3 className="font-semibold">{item.judul}</h3>
                                                    <p className="text-xs text-white/50">{formatTanggal(item.tanggal)}</p>
                                                    {item.ringkasan && (
                                                        <p className="text-sm leading-relaxed text-white/70">
                                                            {item.ringkasan}
                                                        </p>
                                                    )}
                                                    {item.prokers.length > 0 && (
                                                        <p className="text-xs text-white/50">
                                                            {item.prokers.map((p) => p.nama_lengkap).join(' • ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </ScrollReveal>

                        <ScrollReveal direction="up">
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/portfolio"
                                    className="inline-flex items-center rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold transition-all hover:border-white hover:bg-white/5"
                                >
                                    ← Semua portfolio
                                </Link>
                                <Link
                                    href="/galeri/pagelaran"
                                    className="inline-flex items-center rounded-full bg-gradient-to-r from-red-600 to-red-400 px-6 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105"
                                >
                                    Galeri pagelaran
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
