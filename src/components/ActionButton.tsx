import { ShoppingCart, Tag } from 'lucide-react';

interface ActionButtonProps {
    label: string;
    type: 'buy' | 'sale';
    onClick: () => void;
}

const ActionButton = ({ label, type, onClick }: ActionButtonProps) => {
    const isBuy = type === 'buy';
    return (
        <button
            onClick={onClick}
            className={`
        relative group overflow-hidden rounded-full px-8 py-2 min-w-[140px] shadow-lg transform transition-all hover:scale-105 active:scale-95 border-2 border-white/20
        ${isBuy
                    ? 'bg-gradient-to-b from-green-500 to-green-700 shadow-green-900/50'
                    : 'bg-gradient-to-b from-red-500 to-red-700 shadow-red-900/50'}
      `}>
            {/* Glossy Shine */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full pointer-events-none"></div>

            <div className="flex items-center justify-center gap-2 relative z-10">
                {isBuy ? <ShoppingCart size={18} className="text-white" /> : <Tag size={18} className="text-white" />}
                <span className="text-white font-black text-lg tracking-wider italic drop-shadow-md">
                    {label}
                </span>
            </div>
        </button>
    );
};

export default ActionButton;
