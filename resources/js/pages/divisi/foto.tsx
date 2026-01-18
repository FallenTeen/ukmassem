import { Head } from '@inertiajs/react';

import LandingFooter from '@/components/landing-footer';
import LandingNavbar from '@/components/landing-navbar';
import ScrollReveal from '@/components/scroll-reveal';

export default function DivisiFoto() {
    return (
        <>
            <Head title="Divisi Fotografi - UKM ASSEM" />
            <div className="min-h-screen bg-black text-white">
                <LandingNavbar />
                <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pt-12 lg:pt-16">
                    <section className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12 lg:gap-16">
                        <ScrollReveal direction="left">
                            <div className="space-y-4 md:space-y-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Divisi</p>
                                <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
                                    Divisi <span className="text-red-500">Fotografi</span>
                                </h1>
                                <div className="space-y-3 text-sm leading-relaxed text-white/80 md:text-base">
                                    <p>
                                        Divisi Fotografi berfokus pada pengembangan kemampuan visual melalui media foto.
                                        Anggota belajar komposisi, pencahayaan, hingga dokumentasi berbagai kegiatan UKM ASSEM.
                                    </p>
                                    <p>
                                        Melalui pemotretan event, eksplorasi gaya foto, dan pengelolaan arsip visual, divisi
                                        ini menjadi garda terdepan dalam mendokumentasikan perjalanan UKM ASSEM.
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
                                                src="https://picsum.photos/400/260?random=21"
                                                alt="Kegiatan Fotografi"
                                            />
                                        </div>
                                        <div className="row-span-1 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="https://picsum.photos/400/180?random=22"
                                                alt="Pengambilan Gambar"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 grid grid-rows-4 gap-3 md:gap-4">
                                        <div className="row-span-1 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="https://picsum.photos/400/180?random=23"
                                                alt="Peralatan Kamera"
                                            />
                                        </div>
                                        <div className="row-span-3 overflow-hidden rounded-2xl">
                                            <img
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                                src="https://picsum.photos/400/260?random=24"
                                                alt="Hasil Fotografi"
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