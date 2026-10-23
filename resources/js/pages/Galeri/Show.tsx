import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';
import {
    LABEL_DIVISI,
    LABEL_JENIS,
    coverUrl,
    embedVideo,
    formatTanggal,
    type GaleriDetail,
    type JenisGaleri,
} from '@/pages/Galeri/types';

interface GaleriShowProps {
    jenis: JenisGaleri;
    galeri: GaleriDetail;
}

export default function GaleriShow({ jenis, galeri }: GaleriShowProps) {
    const [slideIndex, setSlideIndex] = useState(0);

    const carouselFotos = galeri.carouselFotos ?? [];
    const dokumentasiFotos = galeri.dokumentasiFotos ?? [];
    const prokers = galeri.prokers ?? [];

    const slides = useMemo(
        () => [galeri.cover_path, ...carouselFotos.map((foto) => foto.path)].filter(Boolean) as string[],
        [galeri.cover_path, carouselFotos],
    );

    const videoEmbed = useMemo(() => embedVideo(galeri.video_link), [galeri.video_link]);

    const slideUrl = slides.length > 0 ? coverUrl(slides[Math.min(slideIndex, slides.length - 1)]) : null;

    const deskripsiParagraf = (galeri.deskripsi ?? '')
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <>
            <Head title={`${galeri.judul} — UKM ASSEM`} />
            <div className="min-h-screen bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    <Link
                        href={`/galeri/${jenis}`}
                        className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400 hover:text-red-300"
                    >
                        ← {LABEL_JENIS[jenis]}
                    </Link>

                    <ScrollReveal direction="up">
                        <header className="mt-6">
                            <span className="text-sm text-white/60">{formatTanggal(galeri.tanggal)}</span>
                            <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                {galeri.judul}
                            </h1>
                            {jenis === 'karya' && (
                                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                                    {galeri.divisi && (
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80">
                                            Divisi {LABEL_DIVISI[galeri.divisi]}
                                        </span>
                                    )}
                                    {galeri.pembuat && (
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80">
                                            Karya: {galeri.pembuat}
                                        </span>
                                    )}
                                </div>
                            )}
                            {galeri.ringkasan && (
                                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                                    {galeri.ringkasan}
                                </p>
                            )}
                        </header>
                    </ScrollReveal>

                    {slideUrl && (
                        <ScrollReveal direction="up">
                            <section className="mt-10">
                                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
                                    <img
                                        src={slideUrl}
                                        alt={galeri.judul}
                                        className="aspect-[16/9] w-full object-cover"
                                    />
                                </div>
                                {slides.length > 1 && (
                                    <div className="mt-3 flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
                                            }
                                            className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
                                        >
                                            ← Prev
                                        </button>
                                        <span className="text-xs text-white/50">
                                            {Math.min(slideIndex, slides.length - 1) + 1} / {slides.length}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSlideIndex((prev) => (prev + 1) % slides.length)
                                            }
                                            className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70 hover:border-white/20 hover:text-white"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </section>
                        </ScrollReveal>
                    )}

                    {deskripsiParagraf.length > 0 && (
                        <ScrollReveal direction="up">
                            <section className="mt-10 max-w-3xl space-y-4">
                                {deskripsiParagraf.map((paragraf, index) => (
                                    <p
                                        key={index}
                                        className="text-sm leading-relaxed text-white/80 md:text-base"
                                    >
                                        {paragraf}
                                    </p>
                                ))}
                            </section>
                        </ScrollReveal>
                    )}

                    {videoEmbed && (
                        <ScrollReveal direction="up">
                            <section className="mt-10">
                                <h2 className="text-lg font-semibold">Video</h2>
                                <div className="mt-4 overflow-hidden rounded-3xl border border-white/10">
                                    <iframe
                                        src={videoEmbed}
                                        title={`Video ${galeri.judul}`}
                                        className="aspect-video w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </section>
                        </ScrollReveal>
                    )}

                    {prokers.length > 0 && (
                        <ScrollReveal direction="up">
                            <section className="mt-10">
                                <h2 className="text-lg font-semibold">Proker Terkait</h2>
                                <p className="mt-1 text-sm text-white/60">
                                    Dokumentasi dan deskripsi proker terkait pagelaran ini.
                                </p>
                                <ul className="mt-5 space-y-4">
                                    {prokers.map((proker) => (
                                        <li
                                            key={proker.id}
                                            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h3 className="text-base font-semibold">{proker.nama_lengkap}</h3>
                                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-white/70">
                                                    {proker.status}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-white/50">
                                                {proker.main_proker?.nama_proker} • Tahun {proker.tahun}
                                                {proker.tanggal_mulai && (
                                                    <>
                                                        {' • '}
                                                        {formatTanggal(proker.tanggal_mulai)}
                                                        {proker.tanggal_selesai
                                                            ? ` – ${formatTanggal(proker.tanggal_selesai)}`
                                                            : ''}
                                                    </>
                                                )}
                                            </p>
                                            {proker.deskripsi && (
                                                <p className="mt-3 text-sm leading-relaxed text-white/75">
                                                    {proker.deskripsi}
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </ScrollReveal>
                    )}

                    {dokumentasiFotos.length > 0 && (
                        <ScrollReveal direction="up">
                            <section className="mt-10">
                                <h2 className="text-lg font-semibold">Dokumentasi</h2>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {dokumentasiFotos.map((foto) => (
                                        <a
                                            key={foto.id}
                                            href={`/storage/${foto.path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group overflow-hidden rounded-2xl border border-white/10"
                                        >
                                            <img
                                                src={`/storage/${foto.path}`}
                                                alt={`Dokumentasi ${galeri.judul}`}
                                                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>
                    )}
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
