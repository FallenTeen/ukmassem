import { Head, Link } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';
import { type GaleriIndexItem, LABEL_JENIS, coverUrl, formatTanggal } from '@/pages/Galeri/types';
import type { Paginator } from '@/types/anggota';

interface GaleriLandingProps {
    counts?: {
        kegiatan: number;
        pagelaran: number;
        karya: number;
    };
    galeris?: Paginator<GaleriIndexItem>;
}

const kategori = [
    {
        jenis: 'kegiatan' as const,
        title: LABEL_JENIS.kegiatan,
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
    },
    {
        jenis: 'pagelaran' as const,
        title: LABEL_JENIS.pagelaran,
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
            </svg>
        ),
    },
    {
        jenis: 'karya' as const,
        title: LABEL_JENIS.karya,
        icon: (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.576l-.31.146a3 3 0 01-4.018-4.018l.146-.31a6 6 0 00.576-3.86l-.477-2.387a2 2 0 00-1.022-.547L5 3.11m15.428 12.318a1 1 0 001.072 1.072L23 17m-7.5-1.5l-1.5 3m2.25-6.75l3 1.5"
                />
            </svg>
        ),
    },
];

const JENIS_WARNA: Record<string, string> = {
    kegiatan: 'bg-red-500/80',
    pagelaran: 'bg-emerald-500/80',
    karya: 'bg-amber-500/80',
};

const tinggiPlaceholder = [220, 160, 260, 200];

export default function Galeri({ counts, galeris }: GaleriLandingProps) {
    const items = galeris?.data ?? [];

    return (
        <>
            <Head title="Galeri UKM ASSEM" />
            <div className="min-h-screen bg-black text-white">
                {/* Fade atas (di bawah navbar) & bawah viewport — fixed */}
                <div className="pointer-events-none fixed inset-x-0 top-14 z-20 h-20 bg-gradient-to-b from-black via-black/70 to-transparent md:top-16" />
                <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    <ScrollReveal direction="up">
                        <section className="text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Galeri</p>
                            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                Galeri <span className="text-red-500">UKM ASSEM</span>
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                                Dokumentasi kegiatan, pagelaran seni, dan karya anggota UKM ASSEM.
                            </p>
                        </section>
                    </ScrollReveal>

                    {/* Tombol kategori besar — sticky */}
                    <section className="sticky top-14 z-30 md:top-16">
                        {/* Layer blur gradasi: 100% di atas, meleleh ke 0% di bawah */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+5rem)] bg-gradient-to-b from-black/80 via-black/60 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_bottom,black_calc(100%-5rem),transparent)]"
                        />
                        <div className="-mx-4 px-4 py-2 md:py-4">
                            <div className="grid gap-3 sm:grid-cols-3 md:gap-4">
                                {kategori.map((item) => (
                                    <Link
                                        key={item.jenis}
                                        href={`/galeri/${item.jenis}`}
                                        className="group flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-black/70 px-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-red-400/60 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/15 md:py-5 md:px-8"
                                    >
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/40 via-purple-500/30 to-blue-500/30 text-white transition-transform duration-300 group-hover:scale-110">
                                            {item.icon}
                                        </span>
                                        <span className="flex flex-col items-center gap-1">
                                            <span className="text-base font-bold md:text-lg">{item.title}</span>
                                            {counts?.[item.jenis] !== undefined && (
                                                <span className="text-xs text-white/60">
                                                    {counts[item.jenis]} konten →
                                                </span>
                                            )}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Masonry semua kategori */}
                    {items.length === 0 ? (
                        <div className="mt-14 rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                            <p className="text-sm text-white/70">
                                Belum ada konten galeri yang dipublikasikan.
                            </p>
                        </div>
                    ) : (
                        <section className="relative mt-12 md:mt-16">
                            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                                {items.map((item, index) => {
                                    const url = coverUrl(item.cover_path);
                                    return (
                                        <Link
                                            key={item.id}
                                            href={`/galeri/${item.jenis}/${item.slug}`}
                                            className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-white/10 relative"
                                        >
                                            {url ? (
                                                <img
                                                    src={url}
                                                    alt={item.judul}
                                                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div
                                                    className="flex w-full items-center justify-center bg-gradient-to-br from-red-500/30 via-purple-500/20 to-blue-500/30 p-6 text-center"
                                                    style={{ height: tinggiPlaceholder[index % tinggiPlaceholder.length] }}
                                                >
                                                    <span className="text-sm font-medium text-white/70">
                                                        {item.judul}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                                            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                                                <div>
                                                    <span
                                                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${JENIS_WARNA[item.jenis] ?? 'bg-white/30'}`}
                                                    >
                                                        {LABEL_JENIS[item.jenis as keyof typeof LABEL_JENIS] ?? item.jenis}
                                                    </span>
                                                    <h3 className="mt-2 text-sm font-semibold leading-snug md:text-base">
                                                        {item.judul}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-white/60">
                                                        {formatTanggal(item.tanggal)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {galeris && galeris.last_page > 1 && (
                                <nav className="mt-10 flex items-center justify-center gap-2 text-sm">
                                    {(galeris.links ?? []).map((link, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) window.location.href = link.url;
                                            }}
                                            className={`rounded-lg border px-4 py-2 transition-colors ${
                                                link.active
                                                    ? 'border-red-500 bg-red-500/20 text-white'
                                                    : link.url
                                                      ? 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                                                      : 'border-white/5 text-white/30'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label ?? '' }}
                                        />
                                    ))}
                                </nav>
                            )}
                        </section>
                    )}
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
