import { ReactNode } from 'react';

interface FloatingWidgetProps {
    side: 'left' | 'right' | 'bottom-right';
    children: ReactNode;
    label?: string;
    color?: string;
}

const FloatingWidget = ({ side, children, label, color = "bg-red-600" }: FloatingWidgetProps) => (
    <div className={`
    absolute z-30 flex flex-col items-center animate-pulse-slow cursor-pointer hover:scale-105 transition-transform
    ${side === 'left' ? 'bottom-28 left-6' : ''}
    ${side === 'right' ? 'top-28 right-6' : ''}
    ${side === 'bottom-right' ? 'bottom-28 right-6' : ''}
  `}>
        {children}
        {label && (
            <div className={`${color} text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md mt-2 border border-white/20`}>
                {label}
            </div>
        )}
    </div>
);

export default FloatingWidget;
