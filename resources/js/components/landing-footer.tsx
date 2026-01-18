import { Link } from '@inertiajs/react';

export default function LandingFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-black/95">
            <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
                {/* Top Section */}
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                    {/* Logo & Info */}
                    <div className="flex items-center gap-3">
                        <img
                            src="/icons/assem.png"
                            alt="Logo UKM ASSEM"
                            className="h-10 w-10 flex-shrink-0 rounded-full"
                        />
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-white md:text-base">UKM ASSEM</p>
                            <p className="max-w-xs text-xs text-white/60 md:max-w-sm md:text-sm">
                                Amikom Seneng Seni dan Musik • Universitas Amikom Purwokerto
                            </p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/70 md:gap-6 md:text-sm">
                        <Link href="/sejarah" className="transition-colors hover:text-white">
                            Sejarah
                        </Link>
                        <Link href="/galeri" className="transition-colors hover:text-white">
                            Galeri
                        </Link>
                        <Link href="/divisi" className="transition-colors hover:text-white">
                            Divisi
                        </Link>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-6 flex flex-col items-start gap-2 border-t border-white/5 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
                    <p>© {year} UKM ASSEM. made by FallenTeen</p>
                </div>
            </div>
        </footer>
    );
}