import type { ReactNode } from 'react';

type PrototypeOverlayLayer = 'modal' | 'auth' | 'system';

const OVERLAY_LAYER_CLASSES: Record<PrototypeOverlayLayer, string> = {
    modal: 'z-50',
    auth: 'z-[110]',
    system: 'z-[9999]',
};

interface PrototypeOverlayProps {
    children: ReactNode;
    layer?: PrototypeOverlayLayer;
    className?: string;
    panelClassName?: string;
    backdropClassName?: string;
}

const PrototypeOverlay = ({
    children,
    layer = 'modal',
    className = '',
    panelClassName = '',
    backdropClassName = 'bg-black/80 backdrop-blur-md',
}: PrototypeOverlayProps) => (
    <div
        className={`absolute inset-0 ${OVERLAY_LAYER_CLASSES[layer]} flex items-center justify-center ${backdropClassName} animate-in fade-in duration-200 ${className}`}
    >
        <div className={`relative max-h-[640px] ${panelClassName}`}>
            {children}
        </div>
    </div>
);

export default PrototypeOverlay;
