import { useEffect, useState } from 'react';
import { X, FileText, Shield, ScrollText, FileCheck2, CheckSquare, Square, ArrowRight } from 'lucide-react';
import PrototypeOverlay from '../common/PrototypeOverlay';

export type TermsTab = 'terms' | 'privacy' | 'service' | 'personal';

interface TermsModalProps {
    onClose: () => void;
    onAgree?: () => void;
    initialTab?: TermsTab;
    title?: string;
    readOnly?: boolean;
    confirmLabel?: string;
    registrationReview?: boolean;
}

const TermsModal = ({
    onClose,
    onAgree,
    initialTab = 'terms',
    title = '註冊帳號 - 條款審閱',
    readOnly = false,
    confirmLabel = '下一步',
    registrationReview = false,
}: TermsModalProps) => {
    const [activeTab, setActiveTab] = useState<TermsTab>(initialTab);
    const [isAgreed, setIsAgreed] = useState(false);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const tabs = [
        { id: 'terms' as const, label: '使用者規章', icon: <FileText size={16} /> },
        { id: 'privacy' as const, label: '隱私權政策', icon: <Shield size={16} /> },
        { id: 'service' as const, label: '服務條款', icon: <ScrollText size={16} /> },
        { id: 'personal' as const, label: '個人資料使用同意書', icon: <FileCheck2 size={16} /> },
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
如有爭議，雙方同意以台北地方法院為第一審管轄法院。`,

        personal: `個人資料使用同意書

一、同意蒐集之個人資料
本人同意巨亨ONLINE於提供註冊、登入、遊戲、社群、客服及金融 Mock 操作展示之必要範圍內，蒐集本人提供的帳號、手機號碼、社群登入識別資訊、裝置資訊及操作紀錄。

二、資料使用目的
上述資料僅用於身分驗證、帳號安全、服務通知、遊戲功能提供、客服處理、系統維運與原型流程展示，不作為真實金流或其他未經同意用途。

三、資料利用期間與方式
資料於服務期間及完成相關服務所需期間內，以電子方式處理及利用。除法令要求、委外維運或提供服務所必要之合作夥伴外，不會任意提供予第三人。

四、當事人權利
本人得依法請求查詢、閱覽、製給複製本、補充、更正、停止蒐集處理利用或刪除個人資料。行使權利時，可能需要完成身分確認程序。

五、同意與撤回
本人已閱讀並了解本同意書內容，並同意巨亨ONLINE依上述目的使用個人資料。撤回同意可能影響部分帳號、驗證或服務功能的使用。`
    };

    const registrationSections = [
        {
            index: '01',
            title: '帳號與資格',
            content: '使用者須年滿十八歲並妥善保管登入資訊。所有註冊、登入及驗證流程在本原型中均為前端 Mock，不會傳送真實資料。',
        },
        {
            index: '02',
            title: '遊戲與點數',
            content: '平台點數僅用於原型操作展示。儲值、贈禮、兌換、提款及交易結果不構成真實金流或權利義務。',
        },
        {
            index: '03',
            title: '理性娛樂',
            content: '請依自身狀況安排遊戲時間。若操作影響日常生活，應立即停止並尋求適當協助。',
        },
    ];

    return (
        <PrototypeOverlay layer={registrationReview ? 'auth' : 'modal'}>
            <div className="juheng-modal-panel juheng-legal-modal relative w-[600px] max-h-[640px] bg-[#1a0b2e] border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-6 py-5">
                    <div>
                        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#AEB2FF]">Platform documents</p>
                        <h2 className="text-xl font-black tracking-wide text-white">{title}</h2>
                    </div>
                    <button
                        aria-label="關閉"
                        onClick={onClose}
                        className="rounded-full border border-white/15 bg-white/[0.06] p-2 text-slate-300 transition-colors hover:border-[#AEB2FF]/70 hover:bg-white/10 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                {!registrationReview && (
                    <div className="flex gap-2 border-b border-white/10 bg-black/20 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 rounded-xl border px-3 py-3 text-sm font-black flex items-center justify-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'border-[#AEB2FF]/80 bg-gradient-to-r from-[#8B8FFF] to-[#5048D8] text-white shadow-[0_0_18px_rgba(116,125,255,0.34)]'
                                    : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content - Height restricted for always-visible footer */}
                <div className={`${registrationReview ? 'max-h-[380px]' : 'max-h-[250px]'} juheng-legal-body overflow-y-auto p-6 custom-scrollbar`}>
                    {registrationReview ? (
                        <div>
                            <p className="mb-4 text-sm leading-relaxed text-slate-400">
                                請完整審閱下列內容。此文件用於呈現 APP 對齊後的原型操作流程。
                            </p>
                            <div className="divide-y divide-white/10">
                                {registrationSections.map((section) => (
                                    <section key={section.index} className="grid grid-cols-[38px_1fr] gap-3 py-4 first:pt-0">
                                        <span className="text-xs font-black tracking-widest text-[#BFC5FF]">{section.index}</span>
                                        <div>
                                            <h3 className="mb-1.5 text-sm font-black text-white">{section.title}</h3>
                                            <p className="text-xs leading-6 text-slate-400">{section.content}</p>
                                        </div>
                                    </section>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans leading-relaxed">
                            {termsContent[activeTab]}
                        </pre>
                    )}
                </div>

                {/* Footer with Checkbox and Button */}
                {registrationReview ? (
                    <div className="flex justify-end gap-3 border-t border-white/10 bg-black/20 p-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-[#8B8FFF]/50 px-6 py-3 text-sm font-black text-[#DCE0FF] transition-all hover:bg-[#8B8FFF]/10 active:scale-95"
                        >
                            稍後再看
                        </button>
                        <button
                            type="button"
                            onClick={onAgree}
                            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8B8FFF] to-[#5048D8] px-7 py-3 text-sm font-black text-white transition-all hover:brightness-110 active:scale-95"
                        >
                            我已閱讀並了解 <ArrowRight size={18} />
                        </button>
                    </div>
                ) : readOnly ? (
                    <div className="p-6 border-t border-white/10 bg-black/20">
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-full font-black text-lg flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-[#8B8FFF] to-[#5048D8] text-white hover:brightness-110 active:scale-95"
                        >
                            {confirmLabel} <ArrowRight size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="p-6 border-t border-white/10 bg-black/20">
                        <label
                            className="flex items-center gap-3 cursor-pointer group mb-4"
                            onClick={() => setIsAgreed(!isAgreed)}
                        >
                            {isAgreed ? (
                                <CheckSquare size={24} className="text-[#AEB2FF]" />
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
                                ? 'bg-gradient-to-r from-[#8B8FFF] to-[#5048D8] text-white hover:brightness-110 active:scale-95'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {confirmLabel} <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </PrototypeOverlay>
    );
};

export default TermsModal;
