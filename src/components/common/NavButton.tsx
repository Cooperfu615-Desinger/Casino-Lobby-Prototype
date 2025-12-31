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
    {/* Icon Container - Always Active Style */}
    <div className={`
      p-2 rounded-2xl mb-[1px] transition-all duration-300 shadow-lg border-2
      bg-gradient-to-b ${colorTheme} text-white border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.3)]
      ${active ? 'scale-110 ring-2 ring-white' : 'hover:scale-105 active:scale-95 opacity-100'}
    `}>
      <Icon size={50} strokeWidth={2.5} />
    </div>

    {/* Label - Always White */}
    <span className="text-xs font-bold uppercase tracking-wider text-white drop-shadow-md transition-transform duration-300">
      {label}
    </span>
  </button>
);

export default NavButton;
