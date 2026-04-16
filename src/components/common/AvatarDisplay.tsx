import { AVATARS } from '../../data/mockData';

interface AvatarDisplayProps {
    avatarId?: number;
    /** 'sm' = Header 小圖（text-2xl），'lg' = UserModal 大圖（text-5xl） */
    size?: 'sm' | 'lg';
    className?: string;
}

/**
 * 統一頭像渲染元件。
 * 父層負責容器尺寸與邊框；此元件只填入背景漸層 + emoji。
 */
const AvatarDisplay = ({ avatarId = 1, size = 'sm', className = '' }: AvatarDisplayProps) => {
    const avatar = AVATARS.find(a => a.id === avatarId) ?? AVATARS[0];
    const emojiSize = size === 'lg' ? 'text-5xl' : 'text-2xl';

    return (
        <div className={`w-full h-full rounded-full ${avatar.bgClass} flex items-center justify-center ${className}`}>
            <span className={emojiSize} role="img" aria-label={avatar.label}>
                {avatar.locked ? '🔒' : avatar.emoji}
            </span>
        </div>
    );
};

export default AvatarDisplay;
