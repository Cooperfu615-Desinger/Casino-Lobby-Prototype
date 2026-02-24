import { useState } from 'react';
import { X, Zap, MessageSquare, Smile, Save, FlaskConical } from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface AutoSendSettings {
    enabled: boolean;
    message: string;
    selectedSticker: string | null;
}

interface AutoSendSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
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
// simulateNewPlayerJoin — Mock logic helper
// ─────────────────────────────────────────────
const simulateNewPlayerJoin = (settings: AutoSendSettings) => {
    if (settings.enabled) {
        const stickerText = settings.selectedSticker ?? '（無圖示）';
        console.log(
            `[Auto-Send] 發送訊息給新玩家: ${settings.message || '（未設定訊息）'} + ${stickerText}`
        );
    } else {
        console.log('[Auto-Send] 自動發送功能目前已關閉，不發送訊息。');
    }
};

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
        className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${enabled
            ? 'bg-gradient-to-r from-[#FFD700] to-[#DAA520] shadow-[0_0_12px_rgba(255,215,0,0.4)]'
            : 'bg-white/10'
            }`}
        aria-label={enabled ? '關閉自動發送' : '開啟自動發送'}
    >
        <span
            className={`absolute top-0.5 w-5 h-5 rounded-full shadow-md transition-all duration-300 ${enabled ? 'left-6 bg-black' : 'left-0.5 bg-slate-400'
                }`}
        />
    </button>
);

// ─────────────────────────────────────────────
// AutoSendSettingsModal — Horizontal layout
// ─────────────────────────────────────────────
const AutoSendSettingsModal = ({ isOpen, onClose }: AutoSendSettingsModalProps) => {
    const [settings, setSettings] = useState<AutoSendSettings>({
        enabled: false,
        message: '歡迎加入！祝您好運 🍀',
        selectedSticker: '🎉',
    });

    const [savedSettings, setSavedSettings] = useState<AutoSendSettings | null>(null);
    const [justSaved, setJustSaved] = useState(false);
    const [testFired, setTestFired] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        setSavedSettings({ ...settings });
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
    };

    const handleCancel = () => {
        if (savedSettings) setSettings({ ...savedSettings });
        onClose();
    };

    const handleSimulate = () => {
        simulateNewPlayerJoin(settings);
        setTestFired(true);
        setTimeout(() => setTestFired(false), 2000);
    };

    return (
        /* Backdrop */
        <div
            className="absolute inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* ── Modal Panel: horizontal wide layout ── */}
            <div className="relative w-[720px] bg-[#1a0b2e] border border-white/15 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0f061e] to-[#1a0b2e] border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFD700]/20 to-[#DAA520]/10 border border-[#FFD700]/30 flex items-center justify-center">
                            <Zap size={14} className="text-[#FFD700]" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-sm leading-none">自動發送設定</h2>
                            <p className="text-slate-500 text-[10px] mt-0.5">Special Player Feature</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="關閉設定"
                        className="p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* ── Body: two-column horizontal ── */}
                <div className="flex gap-0 divide-x divide-white/8">

                    {/* ── LEFT COLUMN: Toggle + Message ── */}
                    <div className="flex-1 p-5 space-y-4">

                        {/* Enable / Disable Toggle */}
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <Zap
                                    size={14}
                                    className={settings.enabled ? 'text-[#FFD700]' : 'text-slate-500'}
                                />
                                <div>
                                    <p className="text-white text-xs font-semibold leading-none">
                                        {settings.enabled ? '自動發送已啟用' : '自動發送已停用'}
                                    </p>
                                    <p className="text-slate-500 text-[10px] mt-0.5">
                                        新玩家加入時自動發送歡迎訊息
                                    </p>
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.enabled}
                                onChange={(v) => setSettings((s) => ({ ...s, enabled: v }))}
                            />
                        </div>

                        {/* Message Textarea */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                                <MessageSquare size={11} className="text-[#FFD700]" />
                                歡迎訊息內容
                            </label>
                            <textarea
                                value={settings.message}
                                onChange={(e) =>
                                    setSettings((s) => ({ ...s, message: e.target.value }))
                                }
                                maxLength={100}
                                rows={4}
                                placeholder="輸入要自動發送的歡迎詞..."
                                className="w-full bg-[#0f061e] text-white text-sm rounded-xl px-3.5 py-3 border border-white/10
                                           focus:outline-none focus:border-[#FFD700]/60 focus:shadow-[0_0_0_2px_rgba(255,215,0,0.1)]
                                           placeholder:text-slate-600 resize-none transition-all leading-relaxed"
                            />
                            <p className="text-right text-[10px] text-slate-600">
                                {settings.message.length} / 100
                            </p>
                        </div>

                        {/* Simulate Button */}
                        <button
                            type="button"
                            onClick={handleSimulate}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200
                                ${testFired
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                    : 'bg-white/5 border-white/15 text-slate-400 hover:bg-white/10 hover:text-slate-200 hover:border-white/25'
                                }`}
                        >
                            <FlaskConical size={13} />
                            {testFired ? '✅ 已輸出至 Console！' : '模擬新玩家加入（測試用）'}
                        </button>
                    </div>

                    {/* ── RIGHT COLUMN: Sticker Selector ── */}
                    <div className="w-[300px] flex-shrink-0 p-5 space-y-3">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                            <Smile size={11} className="text-[#FFD700]" />
                            附加貼圖
                            <span className="text-slate-600 font-normal text-[10px]">（再次點擊取消）</span>
                        </label>

                        {/* 4×2 grid */}
                        <div className="grid grid-cols-4 gap-2">
                            {STICKER_OPTIONS.map((sticker) => {
                                const isSelected = settings.selectedSticker === sticker.id;
                                return (
                                    <button
                                        key={sticker.id}
                                        type="button"
                                        title={`選擇貼圖：${sticker.label}`}
                                        onClick={() =>
                                            setSettings((s) => ({
                                                ...s,
                                                selectedSticker: isSelected ? null : sticker.id,
                                            }))
                                        }
                                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all duration-150
                                            ${isSelected
                                                ? 'bg-[#FFD700]/15 border-[#FFD700]/60 shadow-[0_0_10px_rgba(255,215,0,0.2)] scale-105'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25'
                                            }`}
                                    >
                                        <span className="text-xl leading-none">{sticker.id}</span>
                                        <span
                                            className={`text-[9px] font-medium ${isSelected ? 'text-[#FFD700]' : 'text-slate-500'
                                                }`}
                                        >
                                            {sticker.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected sticker display */}
                        <div className="h-6 flex items-center justify-center">
                            {settings.selectedSticker ? (
                                <p className="text-[10px] text-slate-400">
                                    已選擇：
                                    <span className="ml-1 font-semibold text-[#FFD700]">
                                        {settings.selectedSticker}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-[10px] text-slate-600">尚未選擇貼圖</p>
                            )}
                        </div>

                        {/* Preview bar */}
                        {(settings.message || settings.selectedSticker) && (
                            <div className="mt-2 p-3 bg-[#0f061e] rounded-xl border border-white/10">
                                <p className="text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wide">預覽</p>
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD700]/30 to-[#DAA520]/20 border border-[#FFD700]/30 flex items-center justify-center flex-shrink-0">
                                        <Zap size={10} className="text-[#FFD700]" />
                                    </div>
                                    <p className="text-white text-xs leading-relaxed break-words flex-1">
                                        {settings.message || '（未設定訊息）'}
                                        {settings.selectedSticker && (
                                            <span className="ml-1">{settings.selectedSticker}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Footer: Cancel & Save spanning full width ── */}
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
            </div>
        </div>
    );
};

export default AutoSendSettingsModal;
