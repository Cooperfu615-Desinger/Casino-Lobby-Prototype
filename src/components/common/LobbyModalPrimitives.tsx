import type {
    ButtonHTMLAttributes,
    InputHTMLAttributes,
    ReactNode,
} from 'react';

export interface LobbyModalTabItem<T extends string> {
    id: T;
    label: string;
    count?: number;
    icon?: ReactNode;
}

interface LobbyModalTabsProps<T extends string> {
    items: Array<LobbyModalTabItem<T>>;
    value: T;
    onChange: (value: T) => void;
    ariaLabel: string;
    variant?: 'primary' | 'secondary';
    className?: string;
}

/** Shared controlled tab row for Lobby feature modals. */
export const LobbyModalTabs = <T extends string>({
    items,
    value,
    onChange,
    ariaLabel,
    variant = 'primary',
    className = '',
}: LobbyModalTabsProps<T>) => (
    <div
        className={`${variant === 'primary' ? 'lobby-modal-tabs' : 'lobby-modal-subtabs'} ${className}`}
        role="tablist"
        aria-label={ariaLabel}
    >
        {items.map((item) => {
            const active = item.id === value;
            const baseClass = variant === 'primary' ? 'lobby-modal-tab' : 'lobby-modal-subtab';
            return (
                <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onChange(item.id)}
                    className={`${baseClass} ${active ? `${baseClass}--active` : ''}`}
                >
                    {item.icon}
                    <span>{item.label}</span>
                    {typeof item.count === 'number' && (
                        <span className={`lobby-modal-tab-count ${active ? 'lobby-modal-tab-count--active' : ''}`}>
                            {item.count}
                        </span>
                    )}
                </button>
            );
        })}
    </div>
);

interface LobbyModalSectionProps {
    children: ReactNode;
    className?: string;
    tone?: 'default' | 'soft' | 'highlight';
}

/** Grouped content surface with consistent glass contrast. */
export const LobbyModalSection = ({
    children,
    className = '',
    tone = 'default',
}: LobbyModalSectionProps) => (
    <section className={`lobby-modal-section lobby-modal-section--${tone} ${className}`}>
        {children}
    </section>
);

interface LobbyModalCardProps {
    children: ReactNode;
    className?: string;
    tone?: 'default' | 'muted' | 'selected';
}

/** Reusable content card for summaries, records and empty states. */
export const LobbyModalCard = ({
    children,
    className = '',
    tone = 'default',
}: LobbyModalCardProps) => (
    <article className={`lobby-modal-card lobby-modal-card--${tone} ${className}`}>
        {children}
    </article>
);

interface LobbyModalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    tone?: 'primary' | 'secondary' | 'success' | 'danger';
    fullWidth?: boolean;
}

/** Shared action button; semantic success/danger colors remain feature-owned. */
export const LobbyModalButton = ({
    children,
    className = '',
    tone = 'primary',
    fullWidth = false,
    type = 'button',
    ...props
}: LobbyModalButtonProps) => (
    <button
        type={type}
        className={`lobby-modal-action lobby-modal-action--${tone} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
    >
        {children}
    </button>
);

interface LobbyModalFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    hint?: string;
    leading?: ReactNode;
}

/** Labelled form field matching the shared light-blue modal surface. */
export const LobbyModalField = ({
    label,
    hint,
    leading,
    className = '',
    id,
    ...props
}: LobbyModalFieldProps) => {
    const fieldId = id ?? `lobby-modal-field-${label}`;
    return (
        <label className="lobby-modal-field" htmlFor={fieldId}>
            <span className="lobby-modal-field__label">{label}</span>
            <span className="lobby-modal-field__control">
                {leading && <span className="lobby-modal-field__leading">{leading}</span>}
                <input
                    id={fieldId}
                    className={`lobby-modal-field__input ${leading ? 'lobby-modal-field__input--leading' : ''} ${className}`}
                    {...props}
                />
            </span>
            {hint && <small className="lobby-modal-field__hint">{hint}</small>}
        </label>
    );
};
