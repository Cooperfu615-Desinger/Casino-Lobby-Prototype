import { X, Check } from 'lucide-react';

interface LanguageModalProps {
    onClose: () => void;
}

const LANGUAGES = [
    { id: 'zh-TW', name: '繁體中文', active: true },
    { id: 'zh-CN', name: '简体中文', active: false },
    { id: 'en-US', name: 'English', active: false },
    { id: 'ja-JP', name: '日本語', active: false },
    { id: 'ko-KR', name: '한국어', active: false },
    { id: 'ms-MY', name: 'Bahasa Melayu', active: false },
    { id: 'th-TH', name: 'ไทย', active: false },
    { id: 'id-ID', name: 'Bahasa Indonesia', active: false },
];

const LanguageModal = ({ onClose }: LanguageModalProps) => {
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
                    {LANGUAGES.map((lang) => (
                        <div
                            key={lang.id}
                            className={`relative rounded-xl border-2 p-4 flex flex-col items-center justify-center min-h-[100px] transition-all ${lang.active
                                ? 'bg-white/10 border-[#FFD700] cursor-default'
                                : 'bg-black/20 border-white/5 opacity-40 cursor-not-allowed hover:bg-black/30'
                                }`}
                        >
                            <span className={`text-base font-bold ${lang.active ? 'text-white' : 'text-slate-400'}`}>
                                {lang.name}
                            </span>

                            {lang.active && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-[#FFD700] rounded-full flex items-center justify-center">
                                    <Check size={12} className="text-black font-bold" />
                                </div>
                            )}

                            {!lang.active && (
                                <span className="absolute bottom-2 text-[10px] text-slate-500 uppercase tracking-wider">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-center text-slate-500 text-xs">
                    More languages will be supported in future updates.
                </p>
            </div>
        </div>
    );
};

export default LanguageModal;
