import { X, LayoutGrid, Sparkles, MessageCircle, Wallet, FolderKanban } from 'lucide-react';

interface LobbyGuideModalProps {
    onClose: () => void;
}

const GUIDE_ITEMS = [
    {
        icon: LayoutGrid,
        title: '首頁坑位與分類',
        description: '主大廳作為美術與前端的對照基準，展示 Header、公告、分類、遊戲卡片與營運 CTA 的版位關係。',
    },
    {
        icon: Sparkles,
        title: '營運入口',
        description: 'BUY / SALE、左右浮動活動位與 promotion modal 為營運調整示意，可延伸成後台配置欄位。',
    },
    {
        icon: MessageCircle,
        title: '社交流程',
        description: '聊天室、客服、公頻、玩家卡片與贈禮導流，主要是讓團隊對齊跨模組跳轉與互動節點。',
    },
    {
        icon: Wallet,
        title: '交易流程',
        description: '銀行中心、支付、贈禮與紀錄頁面用來定義 phase 1 的金流相關 UI 範圍與操作順序。',
    },
    {
        icon: FolderKanban,
        title: 'Phase 1 / Phase 2 邊界',
        description: '部分分類與內容保留為後續擴充坑位，方便團隊知道哪些是本期完成、哪些是規劃中的延伸模組。',
    },
];

const LobbyGuideModal = ({ onClose }: LobbyGuideModalProps) => {
    return (
        <div className="juheng-modal-backdrop absolute inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="juheng-modal-panel relative w-[720px] max-w-[92vw] rounded-[28px] border border-white/10 bg-[#1a0b2e] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="border-b border-white/10 bg-black/20 px-8 py-6">
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="關閉功能說明"
                        className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-[11px] uppercase tracking-[0.3em] text-[#FFD700]/70">Prototype Guide</div>
                    <h2 className="mt-2 text-2xl font-black text-white">Lobby 功能說明</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                        這份原型主要用來協助美術與前端對齊版面、功能與跨模組流程，並作為 Creator 實作前的互動參考。
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-2">
                    {GUIDE_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-white/10 bg-black/20 p-5"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFD700]/15 text-[#FFD700]">
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="border-t border-white/10 bg-black/20 px-8 py-5">
                    <div className="rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/5 px-5 py-4 text-sm leading-relaxed text-slate-200">
                        建議交接時將此原型搭配 phase 文件一起使用：哪些互動是已完成流程、哪些是視覺占位、哪些是為 Phase 2 預留的結構。
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LobbyGuideModal;
