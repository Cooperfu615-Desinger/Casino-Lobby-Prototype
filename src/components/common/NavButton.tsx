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
      relative flex flex-col items-center justify-center h-full w-full transition-all duration-300 group
      ${active ? '-translate-y-3' : 'hover:bg-white/5'}
    `}
  >
    {/* Icon Container - Always Active Style */}
    <div className={`
      p-1.5 rounded-xl mb-[2px] transition-all duration-300 shadow-md border-[1.5px]
      bg-gradient-to-b ${colorTheme} text-white border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.3)]
      ${active ? 'scale-110 ring-[1.5px] ring-white' : 'hover:scale-105 active:scale-95 opacity-100'}
    `}>
      <Icon size={26} strokeWidth={2} className="drop-shadow-sm" />
    </div>

    {/* Label - Always White */}
    <span className="text-[10px] leading-tight font-bold uppercase tracking-wider text-white drop-shadow-md transition-transform duration-300 whitespace-nowrap scale-90 sm:scale-100">
      {label}
    </span>
  </button>
);

export default NavButton;
