import { Head, Link } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';

const divisions = [
    {
        slug: 'musik',
        name: 'Musik',
        description:
            'Ruang eksplorasi aransemen, produksi, dan penampilan musik untuk mengasah kemampuan teknis dan performa panggung.',
        accent: 'from-red-500/70 via-rose-500/60 to-orange-400/70',
        icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
    },
    {
        slug: 'foto',
        name: 'Fotografi',
        description:
            'Mengembangkan kepekaan visual melalui fotografi, dokumentasi kegiatan, dan eksplorasi gaya foto kreatif.',
        accent: 'from-emerald-500/70 via-teal-500/60 to-lime-400/70',
        icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
        slug: 'film',
        name: 'Film',
        description: 'Belajar proses produksi film: penulisan naskah, sinematografi, penyutradaraan, dan editing.',
        accent: 'from-amber-400/70 via-yellow-400/60 to-orange-500/70',
        icon: 'M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h12a1 1 0 100-2h-3v-2.07z',
    },
    {
        slug: 'tari',
        name: 'Tari',
        description: 'Wadah ekspresi seni gerak yang menggabungkan teknik, koreografi, dan penghayatan budaya.',
        accent: 'from-rose-500/70 via-red-500/60 to-pink-500/70',
        icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
    {
        slug: 'teater',
        name: 'Teater',
        description:
            'Mengeksplorasi seni peran, penyutradaraan, penulisan naskah, dan produksi pertunjukan panggung.',
        accent: 'from-amber-900/80 via-orange-700/70 to-yellow-600/70',
        icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
    },
];

export default function DivisiIndex() {
    return (
        <>
            <Head title="Divisi UKM ASSEM" />
            <div className="min-h-screen bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    {/* Hero Section */}
                    <section className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16">
                        <ScrollReveal direction="left">
                            <div className="space-y-4 md:space-y-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Divisi</p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                    Profil Divisi <span className="text-red-500">UKM ASSEM</span>
                                </h1>
                                <div className="space-y-3 text-sm leading-relaxed text-white/80 md:text-base">
                                    <p>
                                        UKM ASSEM memiliki lima divisi pengkaryaan: Musik, Fotografi, Film, Tari, dan Teater.
                                        Setiap divisi menjadi ruang untuk belajar teknis, berkolaborasi, sekaligus berkarya
                                        dalam pertunjukan maupun produksi kreatif.
                                    </p>
                                    <p>
                                        Pilih salah satu divisi di bawah ini untuk melihat profil, kegiatan, dan karakteristik
                                        masing-masing divisi.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={200}>
                            <div className="flex justify-center md:justify-end">
                                <div className="relative aspect-square w-full max-w-xs">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-500/40 via-purple-500/30 to-blue-500/30 blur-3xl" />
                                    <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-black/60">
                                        <img
                                            src="/icons/assem.png"
                                            alt="Logo UKM ASSEM"
                                            className="h-32 w-32 rounded-full border border-white/10 bg-black/80 object-contain p-4 transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>

                    {/* Divisions Grid */}
                    <section className="mt-14 md:mt-20">
                        <div className="grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                            {divisions.map((divisi, index) => (
                                <ScrollReveal key={divisi.slug} direction="up" delay={index * 100}>
                                    <Link
                                        href={`/divisi/${divisi.slug}`}
                                        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-xl hover:shadow-red-500/10 md:p-7"
                                    >
                                        <div
                                            className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60 ${divisi.accent}`}
                                        />
                                        <div className="relative z-10">
                                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-red-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10">
                                                <svg
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d={divisi.icon}
                                                    />
                                                </svg>
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                                                    Divisi
                                                </p>
                                                <h2 className="mt-1 text-lg font-semibold md:text-xl">{divisi.name}</h2>
                                            </div>
                                            <p className="mb-4 text-sm leading-relaxed text-white/80">
                                                {divisi.description}
                                            </p>
                                            <span className="inline-flex items-center text-sm font-semibold text-red-300 transition-colors group-hover:text-red-200">
                                                Jelajahi divisi
                                                <span className="ml-1.5 inline-block text-base transition-transform duration-300 group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>
                </main>
                <LandingFooter />
            </div>
        </>
    );
}