import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import bgmUrl from '../assets/audio/bgm.mp3';
import btnUrl from '../assets/audio/btn.mp3';

interface AudioContextType {
    isMusicEnabled: boolean;
    isSoundEnabled: boolean;
    toggleMusic: () => void;
    toggleSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);

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

        if (isMusicEnabled) {
            const playPromise = bgmRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Auto-play was prevented. Setup a one-time interaction listener.
                    const startAudio = () => {
                        if (isMusicEnabled) { // Double check state
                            bgmRef.current?.play();
                        }
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
    }, [isMusicEnabled]);

    // Global Click SFX
    useEffect(() => {
        if (!isSoundEnabled) return;

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
    }, [isSoundEnabled]);

    const toggleMusic = () => setIsMusicEnabled(prev => !prev);
    const toggleSound = () => setIsSoundEnabled(prev => !prev);

    return (
        <AudioContext.Provider value={{ isMusicEnabled, isSoundEnabled, toggleMusic, toggleSound }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
