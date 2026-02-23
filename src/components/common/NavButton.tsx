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
      relative flex flex-col items-center justify-center gap-[3px] w-full h-full transition-all duration-300
      ${active ? '-translate-y-2 opacity-100' : 'opacity-90 hover:opacity-100'}
    `}
  >
    {/* Icon Container */}
    <div className={`
      p-[7px] rounded-2xl transition-all duration-300 shadow-xl border-2
      bg-gradient-to-b ${colorTheme} text-white border-white/30 shadow-[0_4px_15px_rgba(0,0,0,0.4)]
      ${active ? 'scale-110 ring-2 ring-white/80 shadow-[0_0_18px_rgba(255,255,255,0.4)]' : 'hover:scale-105 active:scale-95'}
    `}>
      <Icon size={36} strokeWidth={2.2} />
    </div>

    {/* Label */}
    <span className="text-[9px] font-bold text-white/90 drop-shadow whitespace-nowrap leading-none tracking-wide">
      {label}
    </span>
  </button>
);

export default NavButton;
