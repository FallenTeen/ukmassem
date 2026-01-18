import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Splash() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 1800);

        const exitTimer = setTimeout(() => {
            setVisible(false);
        }, 2200);

        const redirectTimer = setTimeout(() => {
            router.visit('/');
        }, 2400);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(exitTimer);
            clearTimeout(redirectTimer);
        };
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
                fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
        >
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 -m-12 animate-pulse rounded-full bg-gradient-to-tr from-red-500/30 via-purple-500/20 to-blue-500/30 blur-3xl" />
                
                {/* Logo */}
                <div className="relative">
                    <img
                        src="/icons/assem.png"
                        alt="UKM ASSEM Logo"
                        className="h-36 w-36 animate-pulse rounded-full border-2 border-white/20 bg-black/80 p-4 shadow-[0_0_60px_rgba(248,113,113,0.4)] md:h-40 md:w-40"
                        style={{
                            animationDuration: '2s',
                        }}
                    />
                </div>

                {/* Loading Text */}
                <div className="mt-6 text-center">
                    <p className="animate-pulse text-sm font-medium text-white/60">Memuat...</p>
                </div>
            </div>
        </div>
    );
}