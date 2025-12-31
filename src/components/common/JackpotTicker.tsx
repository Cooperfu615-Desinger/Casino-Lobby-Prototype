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
        let isCancelled = false;

        const runPhase = async () => {
            if (isCancelled) return;

            // Phase A: Show Label (2 seconds)
            setDisplayMode('LABEL');
            await new Promise(r => { cycleTimeoutRef.current = setTimeout(r, 2000); });

            if (isCancelled) return;

            // Phase B: Show Value (5 seconds) with Rolling Effect
            setDisplayMode('VALUE');

            // Reset base value from config
            let val = JACKPOT_LEVELS[levelIndex].baseValue;
            setCurrentValue(val);

            // Start rolling (add random amount every 100ms)
            rollingIntervalRef.current = setInterval(() => {
                val += Math.random() * 100;
                setCurrentValue(val);
            }, 100);

            await new Promise(r => { cycleTimeoutRef.current = setTimeout(r, 5000); });

            // Stop rolling
            if (rollingIntervalRef.current) {
                clearInterval(rollingIntervalRef.current);
                rollingIntervalRef.current = null;
            }

            if (isCancelled) return;

            // Move to next level and loop
            setLevelIndex(prev => (prev + 1) % JACKPOT_LEVELS.length);
        };

        runPhase();

        return () => {
            isCancelled = true;
            if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
            if (rollingIntervalRef.current) clearInterval(rollingIntervalRef.current);
        };
    }, [levelIndex]);

    const currentLevel = JACKPOT_LEVELS[levelIndex];

    return (
        <div className="absolute -top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
            <div className="bg-gradient-to-r from-yellow-600 via-red-600 to-yellow-600 border border-yellow-400 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.8)] px-1 py-0.5 w-[90%] max-w-[240px]">
                <div className="bg-black/20 rounded-full px-3 py-1 flex items-center justify-center min-h-[28px]">
                    <span className="text-white font-bold text-xs tracking-wider whitespace-nowrap drop-shadow-md">
                        {displayMode === 'LABEL' ? (
                            <span className="text-[#FFD700] animate-pulse">{currentLevel.label} JACKPOT</span>
                        ) : (
                            <span className="font-mono text-white tracking-widest">
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
