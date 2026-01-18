import { Head } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';

export default function DivisiTeater() {
    return (
        <>
            <Head title="Divisi Teater - UKM ASSEM" />
            <div className="min-h-screen bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    <section className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 lg:gap-16">
                        <ScrollReveal direction="left">
                            <div className="space-y-4 md:space-y-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Divisi</p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                    Divisi <span className="text-red-500">Teater</span>
                                </h1>
                                <div className="space-y-3 text-sm leading-relaxed text-white/80 md:text-base">
                                    <p>
                                        Divisi Teater berfokus pada seni pertunjukan panggung: akting, penyutradaraan, penulisan
                                        naskah, hingga desain panggung.
                                    </p>
                                    <p>
                                        Melalui latihan, produksi pementasan, dan eksplorasi karya, divisi ini menjadi wadah untuk
                                        melestarikan dan mengembangkan seni teater di lingkungan kampus.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right" delay={200}>
                            <div className="flex justify-center md:justify-end">
                                <div className="grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-md md:gap-4">
                                    <div className="col-span-1 grid grid-rows-4 gap-3 md:gap-4">
                                        <div className="row-span-3 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="/storage/images/Teater-1.jpg"
                                                alt="Pementasan Teater 1"
                                            />
                                        </div>
                                        <div className="row-span-1 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="/storage/images/Teater-2.jpg"
                                                alt="Pementasan Teater 2"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 grid grid-rows-4 gap-3 md:gap-4">
                                        <div className="row-span-1 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="/storage/images/Teater-3.jpg"
                                                alt="Pementasan Teater 3"
                                            />
                                        </div>
                                        <div className="row-span-3 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="/storage/images/Teater-4.jpg"
                                                alt="Pementasan Teater 4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
