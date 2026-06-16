import { useEffect, useState, type ReactNode } from 'react';

export const PROTOTYPE_WIDTH = 1280;
export const PROTOTYPE_HEIGHT = 720;

interface PrototypeStageProps {
    children: ReactNode;
}

const PrototypeStage = ({ children }: PrototypeStageProps) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const scaleX = window.innerWidth / PROTOTYPE_WIDTH;
            const scaleY = window.innerHeight / PROTOTYPE_HEIGHT;
            setScale(Math.min(scaleX, scaleY));
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
            <div
                className="relative h-[720px] w-[1280px] overflow-hidden shadow-2xl"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default PrototypeStage;
