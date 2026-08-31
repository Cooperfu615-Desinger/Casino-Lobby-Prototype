import { useState } from 'react';
import { MessageSquare, Smile, Save, Globe, MessageCircle, Clock } from 'lucide-react';
import LobbyModalShell from '../common/LobbyModalShell';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export interface AutoSendSettings {
    enabled: boolean;
    message: string;
    selectedSticker: string | null;
    interval: number;
}

interface AutoSendSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    channelType: 'public' | 'private';
    settings: AutoSendSettings;
    onSave: (settings: AutoSendSettings) => void;
}

// ─────────────────────────────────────────────
// Sticker options
// ─────────────────────────────────────────────
const STICKER_OPTIONS = [
    { id: '🎰', label: '老虎機' },
    { id: '🤑', label: '發財' },
    { id: '👑', label: '皇冠' },
    { id: '🎉', label: '慶祝' },
    { id: '💰', label: '金幣' },
    { id: '🔥', label: '超熱門' },
    { id: '🎊', label: '派對' },
    { id: '⚡', label: '閃電' },
];

// ─────────────────────────────────────────────
// Toggle Switch
// ─────────────────────────────────────────────
const ToggleSwitch = ({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
}) => (
    <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${enabled
            ? 'bg-gradient-to-r from-[#FFD700] to-[#DAA520] shadow-[0_0_12px_rgba(255,215,0,0.4)]'
            : 'bg-white/10 border border-white/5'
            }`}
        aria-label={enabled ? '關閉自動發送' : '開啟自動發送'}
    >
        <span
            className={`absolute top-[2px] w-5 h-5 rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-[22px] bg-black' : 'left-[2px] bg-slate-400'
                }`}
        />
    </button>
);

// ─────────────────────────────────────────────
// AutoSendSettingsModal — Single Column
// ─────────────────────────────────────────────
const AutoSendSettingsModal = ({ isOpen, onClose, channelType, settings, onSave }: AutoSendSettingsModalProps) => {
    // Local draft state — only applied to parent on Save
    const [draft, setDraft] = useState<AutoSendSettings>({ ...settings });
    const [justSaved, setJustSaved] = useState(false);

    if (!isOpen) return null;

    const isPublic = channelType === 'public';
    const channelLabel = isPublic ? '公共頻道' : '私聊頻道';
    const ChannelIcon = isPublic ? Globe : MessageCircle;
    const accentColor = isPublic ? 'text-emerald-400' : 'text-[#FFD700]';

    const handleSave = () => {
        onSave({ ...draft });
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
    };

    const handleCancel = () => {
        // Reset draft to current saved settings before closing
        setDraft({ ...settings });
        onClose();
    };

    return (
        <LobbyModalShell
            title={`${channelLabel}自動發送`}
            eyebrow="SPECIAL PLAYER FEATURE"
            icon={<ChannelIcon size={18} className={accentColor} />}
            onClose={onClose}
            closeLabel="關閉自動發送設定"
            closeOnBackdrop
            layerClassName="z-[120]"
            frameClassName="h-[min(570px,88vh)] w-[94%] max-w-[520px]"
            bodyClassName="p-0"
            headerContent={(
                <div className="flex items-center justify-between gap-4">
                    <span className={`text-[10px] font-black ${draft.enabled ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {draft.enabled ? '● 已啟用' : '目前停用'}
                    </span>
                    <ToggleSwitch enabled={draft.enabled} onChange={(value) => setDraft((state) => ({ ...state, enabled: value }))} />
                </div>
            )}
        >
                {/* ── Body ── */}
                <div className="p-5 space-y-5">

                    {/* Message Textarea */}
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-xs font-semibold text-slate-300">
                            <span className="flex items-center gap-1.5">
                                <MessageSquare size={13} className={accentColor} />
                                歡迎訊息內容
                            </span>
                            <span className="text-right text-[10px] text-slate-500">
                                {draft.message.length} / 100
                            </span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={draft.message}
                                onChange={(e) =>
                                    setDraft((s) => ({ ...s, message: e.target.value }))
                                }
                                maxLength={100}
                                rows={3}
                                placeholder="輸入要自動發送的歡迎詞..."
                                className="w-full bg-[#0f061e] text-white text-sm rounded-xl px-4 py-3 border border-white/10
                                           focus:outline-none focus:border-[#FFD700]/60 focus:shadow-[0_0_0_2px_rgba(255,215,0,0.1)]
                                           placeholder:text-slate-600 resize-none transition-all leading-relaxed"
                            />

                            {/* Horizontal Sticker Selector beneath textarea */}
                            <div className="absolute bottom-2 left-2 right-2 p-1.5 bg-[#1a0b2e]/80 backdrop-blur-md rounded-lg border border-white/5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                                <span className="text-[10px] text-slate-500 font-medium pl-1 flex-shrink-0 flex items-center gap-1">
                                    <Smile size={10} /> 貼圖:
                                </span>
                                {STICKER_OPTIONS.map((sticker) => {
                                    const isSelected = draft.selectedSticker === sticker.id;
                                    return (
                                        <button
                                            key={sticker.id}
                                            type="button"
                                            title={sticker.label}
                                            onClick={() =>
                                                setDraft((s) => ({
                                                    ...s,
                                                    selectedSticker: isSelected ? null : sticker.id,
                                                }))
                                            }
                                            className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-sm rounded-md transition-all duration-150
                                                ${isSelected
                                                    ? 'bg-[#FFD700]/20 border border-[#FFD700]/50 scale-110 shadow-[0_0_8px_rgba(255,215,0,0.3)]'
                                                    : 'bg-transparent border border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            {sticker.id}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Selected sticker indicator */}
                        {draft.selectedSticker && (
                            <p className="text-[10px] text-slate-400 mt-1 ml-1 flex items-center gap-1">
                                行尾附加圖示：<span className="font-semibold text-[#FFD700] bg-[#FFD700]/10 px-1 rounded">{draft.selectedSticker}</span>
                            </p>
                        )}
                    </div>

                    {/* Interval Setting */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                            <Clock size={13} className={accentColor} />
                            發送頻率設定
                        </label>
                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                            <span className="text-sm text-slate-300">每</span>
                            <input
                                type="number"
                                min={1}
                                max={999}
                                value={draft.interval}
                                onChange={(e) => setDraft(s => ({ ...s, interval: parseInt(e.target.value) || 1 }))}
                                className="w-16 bg-[#0f061e] border border-white/20 rounded-md py-1.5 px-2 text-center text-white text-sm focus:outline-none focus:border-[#FFD700] transition-colors"
                            />
                            <span className="text-sm text-slate-300">
                                {isPublic ? '分鐘自動發送一次' : '天向所有聯絡人自動發送一次'}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-500 ml-1">
                            {isPublic
                                ? '時間間隔小於 5 分鐘可能會被系統判定為洗頻，請謹慎設定。'
                                : '系統將會在每日首次上線時，向所有歷史私聊聯絡人發布此訊息。'}
                        </p>
                    </div>

                </div>

                {/* ── Footer ── */}
                <div className="flex gap-3 px-5 py-4 border-t border-white/8 bg-black/20">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold
                                   hover:bg-white/10 hover:text-white transition-all duration-150"
                    >
                        取消
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className={`flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
                            ${justSaved
                                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                                : 'bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:scale-[1.01] active:scale-[0.98]'
                            }`}
                    >
                        <Save size={15} />
                        {justSaved ? '已儲存！' : '儲存設定'}
                    </button>
                </div>
        </LobbyModalShell>
    );
};

export default AutoSendSettingsModal;
