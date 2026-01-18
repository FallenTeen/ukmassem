import { Head, Link } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';

export default function Welcome() {
    return (
        <>
            <Head title="UKM ASSEM" />
            <div className="flex min-h-screen flex-col bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    {/* Hero Section */}
                    <section className="grid flex-1 gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">
                        <ScrollReveal direction="left">
                            <div className="space-y-4 md:space-y-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                                    Selamat datang
                                </p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                    Ruang berkarya <span className="text-red-500">UKM ASSEM</span>
                                </h1>
                                <div className="space-y-3 text-sm leading-relaxed text-white/80 md:text-base">
                                    <p>
                                        UKM ASSEM (Amikom Seneng Seni dan Musik) adalah organisasi mahasiswa di Universitas
                                        AMIKOM Purwokerto yang menjadi wadah pengembangan bakat dan kreativitas di bidang seni.
                                    </p>
                                    <p>
                                        Kami memiliki lima divisi: Musik, Tari, Film, Foto, dan Teater. Bersama, kami
                                        menghadirkan berbagai karya, pagelaran seni, dan kegiatan kreatif lainnya.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <a
                                        href="#tentang"
                                        className="inline-flex items-center rounded-full bg-gradient-to-r from-red-600 to-red-400 px-6 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 hover:from-red-500 hover:to-red-300 hover:shadow-red-500/25"
                                    >
                                        Jelajahi lebih jauh
                                    </a>
                                    <Link
                                        href="/galeri"
                                        className="inline-flex items-center rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white/90 transition-all hover:scale-105 hover:border-white hover:bg-white/5 hover:text-white"
                                    >
                                        Lihat galeri
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={200}>
                            <div className="flex justify-center md:justify-end">
                                <div className="relative aspect-square w-full max-w-xs md:max-w-sm">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-500/40 via-purple-500/30 to-blue-500/30 blur-3xl" />
                                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/60">
                                        <img
                                            src="/images/bg-1.JPG"
                                            alt="Ilustrasi kegiatan UKM ASSEM"
                                            className="h-full w-full rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>

                    {/* Features Section */}
                    <section id="tentang" className="mt-16 md:mt-20 lg:mt-24">
                        <ScrollReveal direction="up">
                            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                                <article className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-red-500/10 md:p-7">
                                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition-colors group-hover:bg-red-500/20">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-base font-semibold md:text-lg">Bidang Seni</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                                        Lima divisi aktif: Musik, Tari, Film, Foto, dan Teater yang menjadi ruang eksplorasi
                                        dan kolaborasi karya seni.
                                    </p>
                                </article>

                                <article className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-red-500/10 md:p-7">
                                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition-colors group-hover:bg-red-500/20">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-base font-semibold md:text-lg">Kegiatan</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                                        Latihan rutin, workshop, pagelaran seni, serta kolaborasi dengan komunitas dan lembaga
                                        lain di luar kampus.
                                    </p>
                                </article>

                                <article className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-red-500/10 sm:col-span-2 md:p-7 lg:col-span-1">
                                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400 transition-colors group-hover:bg-red-500/20">
                                        <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-base font-semibold md:text-lg">Terbuka untuk Semua</h2>
                                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                                        ASSEM terbuka untuk seluruh mahasiswa yang ingin belajar, berkarya, dan berkembang di
                                        dunia seni, apapun latar belakangnya.
                                    </p>
                                </article>
                            </div>
                        </ScrollReveal>
                    </section>
                </main>
                <LandingFooter />
            </div>
        </>
    );
}