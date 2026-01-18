import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function LandingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <img src="/icons/assem.png" alt="Logo UKM ASSEM" className="h-8 w-8 rounded-full" />
                    <div className="leading-tight">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400 md:text-xs">
                            UKM
                        </p>
                        <p className="text-sm font-semibold md:text-base">ASSEM</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex lg:gap-8">
                    <Link href="/#tentang" className="transition-colors hover:text-white">
                        Tentang
                    </Link>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/divisi" className="transition-colors hover:text-white">
                                Divisi
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>Lihat profil Divisi Musik, Fotografi, Film, Tari, dan Teater.</TooltipContent>
                    </Tooltip>
                    <Link href="/sejarah" className="transition-colors hover:text-white">
                        Sejarah
                    </Link>
                    <Link href="/galeri" className="transition-colors hover:text-white">
                        Galeri
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`overflow-hidden border-t border-white/10 bg-black/95 backdrop-blur-md transition-all duration-300 md:hidden ${
                    mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <nav className="flex flex-col gap-1 px-4 py-3">
                    <Link
                        href="/#tentang"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        Tentang
                    </Link>
                    <Link
                        href="/divisi"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        Divisi
                    </Link>
                    <Link
                        href="/sejarah"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        Sejarah
                    </Link>
                    <Link
                        href="/galeri"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        Galeri
                    </Link>
                </nav>
            </div>
        </header>
    );
}
