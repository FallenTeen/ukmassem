import { Head } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';

export function DivisiFilm() {
    return (
        <>
            <Head title="Divisi Film - UKM ASSEM" />
            <div className="min-h-screen bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    <section className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 lg:gap-16">
                        <ScrollReveal direction="left">
                            <div className="space-y-4 md:space-y-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Divisi</p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                    Divisi <span className="text-red-500">Film</span>
                                </h1>
                                <div className="space-y-3 text-sm leading-relaxed text-white/80 md:text-base">
                                    <p>
                                        Divisi Film adalah wadah pengembangan kemampuan di bidang perfilman: penyutradaraan,
                                        sinematografi, penulisan skenario, hingga editing.
                                    </p>
                                    <p>
                                        Melalui produksi film pendek, pelatihan teknis, dan eksplorasi gaya sinematik, divisi
                                        ini mendorong lahirnya karya yang berkualitas dan relevan dengan perkembangan dunia
                                        film.
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
                                                src="https://picsum.photos/400/260?random=31"
                                                alt="Produksi Film"
                                            />
                                        </div>
                                        <div className="row-span-1 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="https://picsum.photos/400/180?random=32"
                                                alt="Sinematografi"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 grid grid-rows-4 gap-3 md:gap-4">
                                        <div className="row-span-1 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="https://picsum.photos/400/180?random=33"
                                                alt="Peralatan Film"
                                            />
                                        </div>
                                        <div className="row-span-3 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="https://picsum.photos/400/260?random=34"
                                                alt="Pemutaran Film"
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