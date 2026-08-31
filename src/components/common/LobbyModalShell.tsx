import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface LobbyModalShellProps {
    children: ReactNode;
    title: string;
    eyebrow?: string;
    icon?: ReactNode;
    onClose: () => void;
    ariaLabel?: string;
    closeLabel?: string;
    headerContent?: ReactNode;
    frameClassName?: string;
    surfaceClassName?: string;
    bodyClassName?: string;
    layerClassName?: string;
    closeOnBackdrop?: boolean;
    closeDisabled?: boolean;
}

/**
 * Shared Figma-inspired frame for Lobby feature surfaces.
 *
 * The shell owns modal depth, sizing, header hierarchy and scrolling while
 * feature components keep their own state, navigation and Mock operations.
 */
const LobbyModalShell = ({
    children,
    title,
    eyebrow,
    icon,
    onClose,
    ariaLabel = title,
    closeLabel = `關閉${title}`,
    headerContent,
    frameClassName = 'h-[min(680px,92vh)] w-[94%] max-w-[1100px]',
    surfaceClassName = '',
    bodyClassName = 'p-4',
    layerClassName = 'z-[100]',
    closeOnBackdrop = false,
    closeDisabled = false,
}: LobbyModalShellProps) => (
    <div className={`lobby-modal-overlay fixed inset-0 ${layerClassName}`}>
        <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className={`lobby-modal-backdrop absolute inset-0 ${closeOnBackdrop ? 'cursor-default' : 'cursor-default pointer-events-none'}`}
            onClick={closeOnBackdrop ? onClose : undefined}
        />

        <div className={`lobby-modal-frame relative ${frameClassName}`}>
            <section
                className={`lobby-modal-surface ${surfaceClassName}`}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
            >
                <header className="lobby-modal-header">
                    <div className="lobby-modal-heading">
                        {icon && <span className="lobby-modal-heading__icon">{icon}</span>}
                        <div className="min-w-0">
                            {eyebrow && <p className="lobby-modal-eyebrow">{eyebrow}</p>}
                            <h2 className="lobby-modal-title">{title}</h2>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label={closeLabel}
                        onClick={onClose}
                        disabled={closeDisabled}
                        className="lobby-modal-close"
                    >
                        <X size={20} />
                    </button>

                    {headerContent && <div className="lobby-modal-header-content">{headerContent}</div>}
                </header>

                <div className={`lobby-modal-body custom-scrollbar ${bodyClassName}`}>
                    {children}
                </div>
            </section>
        </div>
    </div>
);

export default LobbyModalShell;
