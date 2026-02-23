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
      relative flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300
      ${active ? '-translate-y-2' : 'hover:opacity-90'}
    `}
  >
    {/* Icon Container */}
    <div className={`
      p-[6px] rounded-2xl transition-all duration-300 shadow-lg border-2
      bg-gradient-to-b ${colorTheme} text-white border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.25)]
      ${active ? 'scale-115 ring-2 ring-white/80' : 'hover:scale-105 active:scale-95'}
    `}>
      <Icon size={34} strokeWidth={2.2} />
    </div>

    {/* Label */}
    <span className="text-[9px] font-bold text-white drop-shadow-sm whitespace-nowrap leading-none">
      {label}
    </span>
  </button>
);

export default NavButton;
