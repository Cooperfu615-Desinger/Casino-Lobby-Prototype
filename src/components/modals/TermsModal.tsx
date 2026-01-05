import { useState } from 'react';
import { X, FileText, Shield, ScrollText, CheckSquare, Square, ArrowRight } from 'lucide-react';

interface TermsModalProps {
    onClose: () => void;
    onAgree: () => void;
}

const TermsModal = ({ onClose, onAgree }: TermsModalProps) => {
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'service'>('terms');
    const [isAgreed, setIsAgreed] = useState(false);

    const tabs = [
        { id: 'terms' as const, label: '使用者規章', icon: <FileText size={16} /> },
        { id: 'privacy' as const, label: '隱私權政策', icon: <Shield size={16} /> },
        { id: 'service' as const, label: '服務條款', icon: <ScrollText size={16} /> }
    ];

    const termsContent = {
        terms: `使用者規章

第一條：帳號管理
1.1 用戶須使用真實資料註冊帳號，並妥善保管帳號密碼。
1.2 一人限註冊一個帳號，禁止共用、轉讓或出售帳號。
1.3 如發現帳號異常登入，請立即聯繫客服處理。

第二條：遊戲行為規範
2.1 禁止使用任何形式的外掛、作弊程式或第三方工具。
2.2 禁止利用系統漏洞獲取不當利益。
2.3 禁止在遊戲中發布不當言論、騷擾其他玩家。
2.4 禁止進行真幣交易或任何形式的洗錢行為。

第三條：虛擬貨幣
3.1 遊戲內虛擬貨幣僅供娛樂用途，不具有實際貨幣價值。
3.2 虛擬貨幣不可兌換為現金或其他有價物品。
3.3 贈送虛擬貨幣需依平台規定收取手續費。

第四條：違規處理
4.1 輕微違規：警告並暫停帳號 24 小時。
4.2 嚴重違規：永久封禁帳號，沒收所有虛擬資產。
4.3 本公司保留最終解釋權及處理權。`,

        privacy: `隱私權政策

一、資料蒐集範圍
我們會蒐集以下個人資料：
• 註冊資訊：帳號名稱、密碼（加密儲存）
• 裝置資訊：裝置型號、作業系統版本、唯一識別碼
• 遊戲紀錄：登入時間、遊戲記錄、交易紀錄

二、資料使用目的
• 提供帳號註冊及登入服務
• 遊戲服務之優化與改善
• 客戶服務及問題處理
• 防範詐欺及維護系統安全

三、資料保護措施
• 採用業界標準 SSL/TLS 加密傳輸
• 密碼以不可逆加密方式儲存
• 定期進行資安稽核與弱點掃描
• 存取權限嚴格管控

四、資料保存期間
• 帳號存續期間及刪除後 90 天
• 法規要求之資料依規定期間保存

五、用戶權利
您有權要求存取、更正或刪除您的個人資料。
如需行使上述權利，請聯繫客服團隊。`,

        service: `服務條款

壹、服務內容
本服務提供線上社交遊戲平台，包含但不限於：
• 老虎機、撲克牌等休閒娛樂遊戲
• 虛擬貨幣系統及贈禮功能
• 社群聊天及好友系統
• 俱樂部與公會系統

貳、服務變更
本公司保留隨時修改、暫停或終止服務之權利。
重大變更將提前 7 日於平台公告通知。

參、免責聲明
3.1 本遊戲為純娛樂性質，不涉及真實金錢賭博。
3.2 遊戲結果完全隨機，本公司不保證任何獲勝機率。
3.3 因不可抗力因素導致之服務中斷，本公司不負賠償責任。
3.4 用戶因自身裝置問題導致之損失，本公司不負賠償責任。

肆、智慧財產權
本遊戲之所有內容，包含但不限於程式碼、美術素材、音效、
文字等，均為本公司或授權方所有，受智慧財產權法律保護。

伍、準據法與管轄
本條款之解釋與適用，以中華民國法律為準據法。
如有爭議，雙方同意以台北地方法院為第一審管轄法院。`
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
            <div className="relative w-[600px] max-h-[80vh] bg-[#1a0b2e] border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">註冊帳號 - 條款審閱</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                                ? 'text-[#FFD700] border-b-2 border-[#FFD700] bg-white/5'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content - Height restricted for always-visible footer */}
                <div className="max-h-[250px] overflow-y-auto p-6 custom-scrollbar">
                    <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">
                        {termsContent[activeTab]}
                    </pre>
                </div>

                {/* Footer with Checkbox and Button */}
                <div className="p-6 border-t border-white/10 bg-black/20">
                    <label
                        className="flex items-center gap-3 cursor-pointer group mb-4"
                        onClick={() => setIsAgreed(!isAgreed)}
                    >
                        {isAgreed ? (
                            <CheckSquare size={24} className="text-[#FFD700]" />
                        ) : (
                            <Square size={24} className="text-slate-400 group-hover:text-white transition-colors" />
                        )}
                        <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                            我已閱讀並同意上述所有條款
                        </span>
                    </label>

                    <button
                        onClick={onAgree}
                        disabled={!isAgreed}
                        className={`w-full py-4 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all ${isAgreed
                            ? 'bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black hover:brightness-110 active:scale-95'
                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        下一步 <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
