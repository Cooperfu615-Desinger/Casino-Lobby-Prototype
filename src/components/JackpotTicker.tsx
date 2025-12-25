import { useState, useEffect, useRef } from 'react';

const JACKPOT_LEVELS = [
    { label: 'GRAND', baseValue: 123456789.00 },
    { label: 'MAJOR', baseValue: 3456789.00 },
    { label: 'MINOR', baseValue: 456789.00 },
    { label: 'MINI', baseValue: 56789.00 },
];

const JackpotTicker = () => {
    const [levelIndex, setLevelIndex] = useState(0);
    const [displayMode, setDisplayMode] = useState<'LABEL' | 'VALUE'>('LABEL');
    const [currentValue, setCurrentValue] = useState(JACKPOT_LEVELS[0].baseValue);

    // Store interval IDs to clear them cleanly
    const cycleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Format currency
    const formatCurrency = (val: number) => {
        return val.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    useEffect(() => {
        const runCycle = () => {
            // 1. Show Label Phase
            setDisplayMode('LABEL');

            // Set timeout to switch to Value
            cycleTimeoutRef.current = setTimeout(() => {
                // 2. Show Value Phase
                setDisplayMode('VALUE');

                // Start rolling effect
                // Reset value to base + some accumulated "live" amount simulator
                // For simplicity, we just continue from base for this demo, 
                // but realistically it should be fetched or simulated from a "live" state.
                // Let's just simulate rolling from the base value of the current level.
                const level = JACKPOT_LEVELS[levelIndex];
                setCurrentValue(level.baseValue);

                rollingIntervalRef.current = setInterval(() => {
                    setCurrentValue(prev => prev + Math.random() * 100); // Add random small amount
                }, 100);

                // Set timeout to switch to Next Level Label
                cycleTimeoutRef.current = setTimeout(() => {
                    // Stop rolling
                    if (rollingIntervalRef.current) clearInterval(rollingIntervalRef.current);

                    // Move to next level
                    setLevelIndex(prev => (prev + 1) % JACKPOT_LEVELS.length);
                    // Cycle continues because levelIndex changes, triggering this effect? 
                    // No, we need to be careful with dependency loops.
                    // Better approach: One main orchestrator loop.
                }, 5000); // Value stays for 5 seconds

            }, 2000); // Label stays for 2 seconds
        };

        // Note: The structure above with recursive timeouts or dependency changes can be tricky.
        // Let's use a cleaner approach with a single simple effect that reacts to 'step' changes if we had a complex state machine,
        // or just a self-contained sequence.

        // Actually, since we need to wait for state updates (levelIndex), 
        // using useEffect on levelIndex is a good "trigger" for the next cycle.

        runCycle();

        return () => {
            if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
            if (rollingIntervalRef.current) clearInterval(rollingIntervalRef.current);
        };
    }, [levelIndex]);

    const currentLevel = JACKPOT_LEVELS[levelIndex];

    return (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-30 w-[90%]">
            <div className="bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 border border-yellow-400 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                <div className="bg-black/20 rounded-full px-3 py-1 flex items-center justify-center min-h-[28px]">
                    <span className="text-white font-bold text-xs tracking-wider animate-pulse whitespace-nowrap drop-shadow-md">
                        {displayMode === 'LABEL' ? (
                            <span className="text-[#FFD700]">{currentLevel.label} JACKPOT</span>
                        ) : (
                            <span className="font-mono text-white">
                                ${formatCurrency(currentValue)}
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default JackpotTicker;
