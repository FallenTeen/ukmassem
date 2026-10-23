import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';
import {
    LABEL_DIVISI,
    LABEL_JENIS,
    coverUrl,
    formatTanggal,
    type DivisiGaleri,
    type GaleriIndexItem,
    type JenisGaleri,
} from '@/pages/Galeri/types';
import type { Paginator } from '@/types/anggota';

interface GaleriIndexProps {
    jenis: JenisGaleri;
    divisi: DivisiGaleri | null;
    galeris: Paginator<GaleriIndexItem>;
}

const JENIS_TAB: { jenis: JenisGaleri; label: string }[] = [
    { jenis: 'kegiatan', label: LABEL_JENIS.kegiatan },
    { jenis: 'pagelaran', label: LABEL_JENIS.pagelaran },
    { jenis: 'karya', label: LABEL_JENIS.karya },
];

const DIVISI_FILTER: DivisiGaleri[] = ['musik', 'tari', 'film', 'foto', 'teater'];

const teksturGradien = [
    'from-red-500/30 via-purple-500/20 to-blue-500/20',
    'from-emerald-500/30 via-teal-500/20 to-cyan-500/20',
    'from-amber-500/30 via-orange-500/20 to-yellow-500/20',
];

export default function GaleriIndex({ jenis, divisi, galeris }: GaleriIndexProps) {
    const items = galeris?.data ?? [];
    const [filterDivisi, setFilterDivisi] = useState<DivisiGaleri | ''>(divisi ?? '');

    const handleFilterDivisi = (value: DivisiGaleri | '') => {
        setFilterDivisi(value);
        router.get(
            `/galeri/${jenis}`,
            { divisi: value || undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.get(
            url,
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title={`${LABEL_JENIS[jenis]} — UKM ASSEM`} />
            <div className="min-h-screen bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <Link
                                href="/galeri"
                                className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 hover:text-red-300"
                            >
                                ← Galeri
                            </Link>
                            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                                {LABEL_JENIS[jenis]}
                            </h1>
                        </div>
                        <nav className="flex flex-wrap gap-2">
                            {JENIS_TAB.map((tab) => (
                                <Link
                                    key={tab.jenis}
                                    href={`/galeri/${tab.jenis}`}
                                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                                        tab.jenis === jenis
                                            ? 'border-red-500/40 bg-red-500/10 text-red-300'
                                            : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {jenis === 'karya' && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => handleFilterDivisi('')}
                                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                    filterDivisi === ''
                                        ? 'border-white/40 bg-white/10 text-white'
                                        : 'border-white/10 text-white/60 hover:text-white'
                                }`}
                            >
                                Semua Divisi
                            </button>
                            {DIVISI_FILTER.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => handleFilterDivisi(item)}
                                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                                        filterDivisi === item
                                            ? 'border-white/40 bg-white/10 text-white'
                                            : 'border-white/10 text-white/60 hover:text-white'
                                    }`}
                                >
                                    {LABEL_DIVISI[item]}
                                </button>
                            ))}
                        </div>
                    )}

                    {items.length === 0 ? (
                        <div className="mt-12 rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                            <h2 className="text-lg font-semibold">Belum ada konten</h2>
                            <p className="mt-2 text-sm text-white/70">
                                Konten {LABEL_JENIS[jenis].toLowerCase()} akan muncul di sini setelah admin
                                mengunggahnya.
                            </p>
                        </div>
                    ) : (
                        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((item, index) => (
                                <ScrollReveal key={item.id} direction="up" delay={(index % 3) * 80}>
                                    <Link
                                        href={`/galeri/${jenis}/${item.slug}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-red-500/10"
                                    >
                                        <div className="aspect-[16/10] w-full overflow-hidden bg-black/40">
                                            {coverUrl(item.cover_path) ? (
                                                <img
                                                    src={coverUrl(item.cover_path) ?? ''}
                                                    alt={item.judul}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div
                                                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
                                                        teksturGradien[index % 3]
                                                    } text-xs text-white/50`}
                                                >
                                                    Tanpa Sampul
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <span className="text-xs text-white/50">
                                                {formatTanggal(item.tanggal)}
                                            </span>
                                            <h2 className="mt-1 text-base font-semibold leading-snug group-hover:text-red-300">
                                                {item.judul}
                                            </h2>
                                            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-white/70">
                                                {item.ringkasan || '-'}
                                            </p>
                                            {jenis === 'karya' && item.divisi && (
                                                <span className="mt-3 w-fit rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/70">
                                                    {LABEL_DIVISI[item.divisi]}
                                                    {item.pembuat ? ` • ${item.pembuat}` : ''}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </section>
                    )}

                    {galeris && galeris.last_page > 1 && (
                        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">
                            {(galeris.links ?? []).map((link, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => handlePageChange(link.url)}
                                    className={`rounded-lg border px-3 py-1.5 transition-colors ${
                                        link.active
                                            ? 'border-red-500/50 bg-red-500/10 text-red-300'
                                            : 'border-white/10 text-white/70 hover:border-white/20'
                                    } ${!link.url ? 'opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label ?? '',
                                    }}
                                />
                            ))}
                        </nav>
                    )}
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
