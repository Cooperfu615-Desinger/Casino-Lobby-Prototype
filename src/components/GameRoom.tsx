import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { Game } from '../data/mockData';
import slotBg from '../assets/slot_demo.jpg';
import BrandLoading from './BrandLoading';

interface GameRoomProps {
    game: Game;
    onExit: () => void;
}

const GameRoom = ({ onExit }: GameRoomProps) => {
    const [isGameLoading, setIsGameLoading] = useState(true);

    if (isGameLoading) {
        return <BrandLoading onFinished={() => setIsGameLoading(false)} />;
    }

    return (
        <div className="fixed inset-0 z-40 bg-black flex flex-col animate-in fade-in duration-500">
            {/* Game Header (Optional, mostly hidden in immersive games, usually simulated in iframe) */}

            {/* Game Content Placeholder */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Background Ambient */}
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-purple-900 to-black`}></div>

                <img
                    src={slotBg}
                    alt="Slot Game Demo"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Exit FAB */}
            <button
                onClick={onExit}
                className="absolute top-6 right-6 z-50 bg-red-600/80 hover:bg-red-500 text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all hover:scale-110 active:scale-95 group"
                title="Exit Game"
            >
                <LogOut size={24} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};

export default GameRoom;
