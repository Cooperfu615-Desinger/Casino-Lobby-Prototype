import { useEffect, useRef } from 'react';
import bgmUrl from '../assets/audio/bgm.mp3';
import btnUrl from '../assets/audio/btn.mp3';

export const useAudioSystem = (
    musicEnabled: boolean = true,
    soundEnabled: boolean = true
) => {
    const bgmRef = useRef<HTMLAudioElement | null>(null);
    const sfxRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio Instances
    useEffect(() => {
        // BGM Setup
        const bgm = new Audio(bgmUrl);
        bgm.loop = true;
        bgm.volume = 0.5;
        bgmRef.current = bgm;

        // SFX Setup
        const sfx = new Audio(btnUrl);
        sfx.volume = 0.6; // Slightly louder than BGM
        sfxRef.current = sfx;

        return () => {
            bgm.pause();
            bgmRef.current = null;
            sfxRef.current = null;
        };
    }, []);

    // Handle BGM Playback & Autoplay Strategy
    useEffect(() => {
        if (!bgmRef.current) return;

        if (musicEnabled) {
            const playPromise = bgmRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Auto-play was prevented. Setup a one-time interaction listener.
                    const startAudio = () => {
                        bgmRef.current?.play();
                        document.removeEventListener('click', startAudio);
                        document.removeEventListener('keydown', startAudio);
                    };
                    document.addEventListener('click', startAudio);
                    document.addEventListener('keydown', startAudio);
                });
            }
        } else {
            bgmRef.current.pause();
        }
    }, [musicEnabled]);

    // Global Click SFX
    useEffect(() => {
        if (!soundEnabled) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if clicked element or its parent is interactive
            const interactive = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');

            if (interactive && sfxRef.current) {
                sfxRef.current.currentTime = 0;
                sfxRef.current.play().catch(() => {
                    // Ignore errors for SFX (e.g. rapid clicking)
                });
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [soundEnabled]);

    return {
        bgm: bgmRef.current,
        sfx: sfxRef.current
    };
};
