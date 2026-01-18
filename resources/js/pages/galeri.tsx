import { Head } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';

const placeholderItems = [
    {
        title: 'Galeri Kegiatan',
        description: 'Dokumentasi foto kegiatan UKM ASSEM akan tampil di sini setelah integrasi database.',
        gradient: 'from-red-500/40 via-purple-500/30 to-blue-500/30',
    },
    {
        title: 'Pagelaran Seni',
        description: 'Kumpulan dokumentasi pagelaran musik, tari, film, foto, dan teater.',
        gradient: 'from-emerald-500/40 via-teal-500/30 to-cyan-500/30',
    },
    {
        title: 'Karya Anggota',
        description: 'Portofolio karya anggota dari berbagai divisi akan segera tersedia.',
        gradient: 'from-amber-500/40 via-orange-500/30 to-yellow-500/30',
    },
];

export default function Galeri() {
    return (
        <>
            <Head title="Galeri UKM ASSEM" />
            <div className="min-h-screen bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    {/* Header Section */}
                    <ScrollReveal direction="up">
                        <section className="text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Galeri</p>
                            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                Galeri <span className="text-red-500">UKM ASSEM</span>
                            </h1>
                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
                                Halaman ini akan menampilkan dokumentasi foto dan karya visual dari berbagai kegiatan UKM
                                ASSEM. Untuk sementara, informasi di bawah ini menjadi placeholder sampai integrasi dengan
                                database selesai.
                            </p>
                        </section>
                    </ScrollReveal>

                    {/* Placeholder Cards */}
                    <section className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-3">
                        {placeholderItems.map((item, index) => (
                            <ScrollReveal key={item.title} direction="up" delay={index * 100}>
                                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg hover:shadow-red-500/10">
                                    <div
                                        className={`h-40 w-full bg-gradient-to-br ${item.gradient} transition-opacity duration-300 group-hover:opacity-80 md:h-48`}
                                    />
                                    <div className="flex flex-1 flex-col p-5 md:p-6">
                                        <h2 className="text-base font-semibold md:text-lg">{item.title}</h2>
                                        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/80">
                                            {item.description}
                                        </p>
                                    </div>
                                </article>
                            </ScrollReveal>
                        ))}
                    </section>

                    {/* Info Box */}
                    <ScrollReveal direction="up">
                        <section className="mt-12 rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-center backdrop-blur-sm md:mt-16 md:p-10">
                            <div className="mx-auto max-w-2xl">
                                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                                    <svg
                                        className="h-7 w-7 text-red-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold md:text-xl">Integrasi database belum tersedia</h2>
                                <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                                    Setelah sistem manajemen konten dan penyimpanan media selesai dibuat, halaman galeri akan
                                    menampilkan foto, video, dan karya anggota secara dinamis.
                                </p>
                            </div>
                        </section>
                    </ScrollReveal>
                </main>
                <LandingFooter />
            </div>
        </>
    );
}