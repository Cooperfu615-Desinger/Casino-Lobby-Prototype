import { X, Check } from 'lucide-react';
import { useUserPreferences, Language } from '../../context/UserPreferencesContext';
import { useUI } from '../../context/UIContext';

interface LanguageModalProps {
    onClose: () => void;
}

/** 語言選項配置 */
const LANGUAGES: Array<{
    id: Language | string;
    name: string;
    available: boolean;
}> = [
        { id: 'zh-TW', name: '繁體中文', available: true },
        { id: 'en', name: 'English', available: true },
        { id: 'ja', name: '日本語', available: true },
        { id: 'zh-CN', name: '简体中文', available: false },
        { id: 'ko-KR', name: '한국어', available: false },
        { id: 'ms-MY', name: 'Bahasa Melayu', available: false },
        { id: 'th-TH', name: 'ไทย', available: false },
        { id: 'id-ID', name: 'Bahasa Indonesia', available: false },
    ];

/** 語言名稱對照（用於 Toast 提示） */
const LANGUAGE_NAMES: Record<Language, string> = {
    'zh-TW': '繁體中文',
    'en': 'English',
    'ja': '日本語',
};

const LanguageModal = ({ onClose }: LanguageModalProps) => {
    const { language: currentLanguage, setLanguage } = useUserPreferences();
    const { showToast } = useUI();

    /**
     * 處理語言選擇
     * @param langId - 選擇的語言代碼
     */
    const handleLanguageSelect = (langId: string) => {
        // 只有可用的語言才能被選擇
        const lang = LANGUAGES.find(l => l.id === langId);
        if (!lang?.available) return;

        // 如果選擇的是不同語言
        if (langId !== currentLanguage) {
            setLanguage(langId as Language);
            showToast(`語言已切換為 ${LANGUAGE_NAMES[langId as Language]}`, 'success');
        }

        // 關閉彈窗
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-2xl bg-[#1a0b2e] border-2 border-white/10 rounded-3xl p-6 flex flex-col relative shadow-2xl">
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 text-center">選擇語言 (Select Language)</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {LANGUAGES.map((lang) => {
                        const isActive = lang.id === currentLanguage;
                        const isAvailable = lang.available;

                        return (
                            <button
                                key={lang.id}
                                onClick={() => handleLanguageSelect(lang.id)}
                                disabled={!isAvailable}
                                className={`relative rounded-xl border-2 p-4 flex flex-col items-center justify-center min-h-[100px] transition-all ${isActive
                                    ? 'bg-white/10 border-[#FFD700] cursor-default'
                                    : isAvailable
                                        ? 'bg-black/20 border-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer'
                                        : 'bg-black/20 border-white/5 opacity-40 cursor-not-allowed'
                                    }`}
                            >
                                <span className={`text-base font-bold ${isActive || isAvailable ? 'text-white' : 'text-slate-400'}`}>
                                    {lang.name}
                                </span>

                                {isActive && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center">
                                        <Check size={12} className="text-black font-bold" />
                                    </div>
                                )}

                                {!isAvailable && (
                                    <span className="absolute bottom-2 text-[10px] text-slate-500 uppercase tracking-wider">
                                        Coming Soon
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <p className="mt-8 text-center text-slate-500 text-xs">
                    More languages will be supported in future updates.
                </p>
            </div>
        </div>
    );
};

export default LanguageModal;
