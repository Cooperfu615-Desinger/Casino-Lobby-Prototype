import { LucideIcon } from 'lucide-react';

interface NavButtonProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
    colorTheme: string;
}

const NavButton = ({ icon: Icon, label, active, onClick, colorTheme }: NavButtonProps) => (
    <button
        onClick={onClick}
        className={`
      relative flex flex-col items-center justify-center h-full flex-1 transition-all duration-300 group
      ${active ? '-translate-y-4' : 'hover:bg-white/5'}
    `}
    >
        {/* Icon Container */}
        <div className={`
      p-2.5 rounded-2xl mb-1 transition-all duration-300 shadow-lg border-2
      ${active
                ? `bg-gradient-to-b ${colorTheme} text-white scale-125 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)]`
                : 'bg-transparent border-transparent text-slate-400 group-hover:text-slate-200'}
    `}>
            <Icon size={24} strokeWidth={active ? 2.5 : 2} />
        </div>

        {/* Label */}
        <span className={`
      text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
      ${active ? 'text-white drop-shadow-md scale-110' : 'text-slate-500 group-hover:text-slate-400'}
    `}>
            {label}
        </span>
    </button>
);

export default NavButton;
