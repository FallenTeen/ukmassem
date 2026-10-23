import { Head, Link } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';
import { gambarUrl, type MainProkerItem } from '@/pages/ProkerPublik/types';

interface PortfolioIndexProps {
    mainProkers: MainProkerItem[];
}

export default function PortfolioIndex({ mainProkers }: PortfolioIndexProps) {
    return (
        <>
            <Head title="Portfolio Proker — UKM ASSEM" />
            <div className="flex min-h-screen flex-col bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-10">
                    <ScrollReveal direction="up">
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Portfolio</p>
                            <h1 className="text-3xl font-bold md:text-4xl">Program Kerja UKM ASSEM</h1>
                            <p className="max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                                Beragam program dan pagelaran seni yang menjadi wajah UKM ASSEM ke publik — dari
                                festival musik hingga panggung teater dan pameran karya.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {mainProkers.map((main, index) => (
                            <ScrollReveal key={main.id} direction="up" delay={index * 80}>
                                <Link
                                    href={`/portfolio/${main.id}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/10"
                                >
                                    <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                                        <img
                                            src={gambarUrl(main.gambar)}
                                            alt={main.nama_proker}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {main.deskripsi && (
                                            <p className="absolute bottom-2 left-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-400">
                                                {main.nama_proker}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-3 p-5">
                                        <div className="flex items-center justify-between gap-2">
                                            <h2 className="text-lg font-semibold">{main.nama_proker}</h2>
                                            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/70">
                                                {main.prokers_count} kegiatan
                                            </span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-white/70">
                                            {main.deskripsi ? main.deskripsi.slice(0, 120) : 'Dokumentasi & detail program kerja.'}
                                        </p>
                                        <p className="mt-auto text-sm font-semibold text-red-400">
                                            Lihat detail →
                                        </p>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
