import { Head } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';

export default function Sejarah() {
    return (
        <>
            <Head title="Sejarah UKM ASSEM" />
            <div className="min-h-screen scroll-smooth bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    {/* Hero Section */}
                    <section className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-12 lg:gap-16">
                        <ScrollReveal direction="left">
                            <div className="space-y-4 md:space-y-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                                    Tentang Kami
                                </p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                    Sejarah singkat <span className="text-red-500">UKM ASSEM</span>
                                </h1>
                                <div className="space-y-3 text-sm leading-relaxed text-white/80 md:text-base">
                                    <p>
                                        Unit Kegiatan Mahasiswa Amikom Seneng Seni dan Musik (UKM ASSEM) adalah organisasi
                                        mahasiswa di Universitas AMIKOM Purwokerto yang menjadi wadah bagi pengembangan bakat
                                        dan kreativitas di bidang seni.
                                    </p>
                                    <p>
                                        ASSEM memiliki lima divisi: Film, Fotografi, Musik, Teater, dan Tari. Setiap divisi
                                        menjadi ruang eksplorasi bagi mahasiswa untuk berkarya, berekspresi, dan berkolaborasi
                                        dalam berbagai bentuk pertunjukan maupun karya visual.
                                    </p>
                                </div>
                                <a
                                    href="#detail-sejarah"
                                    className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-red-600 to-red-400 px-6 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 hover:from-red-500 hover:to-red-300 hover:shadow-red-500/25"
                                >
                                    Baca selengkapnya
                                    <span className="ml-2 inline-block text-base transition-transform group-hover:translate-x-1">
                                        →
                                    </span>
                                </a>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={200}>
                            <div className="flex justify-center md:justify-end">
                                <div className="relative">
                                    <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-red-500/30 via-purple-500/30 to-blue-500/30 blur-3xl" />
                                    <div className="relative h-44 w-44 md:h-52 md:w-52">
                                        <img
                                            src="/icons/assem.png"
                                            alt="Logo UKM ASSEM"
                                            className="h-full w-full rounded-full border border-white/10 bg-black/60 object-contain p-4 shadow-[0_0_40px_rgba(248,113,113,0.4)] transition-transform duration-500 hover:scale-105 md:p-5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>

                    {/* Detail Section */}
                    <ScrollReveal direction="up">
                        <section
                            id="detail-sejarah"
                            className="mt-16 space-y-5 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 p-6 md:mt-20 md:space-y-6 md:p-10"
                        >
                            <h2 className="text-2xl font-semibold md:text-3xl">
                                Perjalanan <span className="text-red-500">UKM ASSEM</span>
                            </h2>
                            <div className="space-y-4 text-sm leading-relaxed text-white/80 md:text-base">
                                <p>
                                    UKM ASSEM lahir dari semangat mahasiswa yang ingin menghadirkan ruang berkesenian di
                                    lingkungan kampus. Melalui berbagai kegiatan seperti latihan rutin, workshop, hingga
                                    pagelaran seni, ASSEM menjadi tempat tumbuhnya banyak karya dan kolaborasi kreatif.
                                </p>
                                <p>
                                    Dari panggung musik, pentas teater, karya film pendek, hingga pameran fotografi dan
                                    pertunjukan tari, ASSEM turut menghidupkan atmosfer seni di kampus maupun di luar kampus.
                                </p>
                                <p>
                                    Dengan semangat kebersamaan dan kreativitas, ASSEM terus berkembang sebagai wadah untuk
                                    belajar, berkarya, dan berkontribusi bagi seni dan kebudayaan.
                                </p>
                            </div>
                        </section>
                    </ScrollReveal>

                    {/* Visi Misi Section */}
                    <section id="visi-misi" className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
                        <ScrollReveal direction="left" delay={100}>
                            <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-6 transition-all duration-300 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/10 md:p-8">
                                <h3 className="text-xl font-semibold text-purple-200 md:text-2xl">Visi</h3>
                                <p className="mt-4 text-sm leading-relaxed text-white/85 md:text-base">
                                    Unggul dalam kreativitas dan inovasi untuk melestarikan unsur seni budaya serta menjadi
                                    pelopor unit kegiatan mahasiswa berdasarkan Pancasila.
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={200}>
                            <div className="group rounded-3xl border border-white/10 bg-gradient-to-br from-rose-900/40 to-amber-900/40 p-6 transition-all duration-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-500/10 md:p-8">
                                <h3 className="text-xl font-semibold text-amber-200 md:text-2xl">Misi</h3>
                                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-white/85 md:text-base">
                                    <li className="flex gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                                        <span>Menjalankan organisasi UKM di bidang kesenian dan kebudayaan.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                                        <span>
                                            Menyelenggarakan pagelaran seni dan budaya di lingkungan kampus maupun masyarakat.
                                        </span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                                        <span>Melaksanakan pengabdian masyarakat dan kerja sama di bidang kesenian.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                                        <span>Mengembangkan minat dan bakat mahasiswa di bidang seni.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                                        <span>
                                            Menanamkan kecintaan terhadap budaya serta kreativitas dalam berkesenian.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </ScrollReveal>
                    </section>
                </main>
                <LandingFooter />
            </div>
        </>
    );
}