import { useState, useCallback } from 'react';
import { Mail, Clock, Trash2, X, Gift, CheckCheck, Loader2 } from 'lucide-react';
import { INBOX_MESSAGES } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import type { InboxMessage } from '../../types/inbox';

interface InboxInterfaceProps {
    onClose: () => void;
}

/**
 * InboxInterface - 完整 CRUD 模擬的信箱介面
 * 
 * 此組件展示如何在前端模擬 CRUD 操作，並提供適當的 UX 反饋。
 * 在實際開發中，這些操作應與後端 API 同步。
 */
const InboxInterface = ({ onClose }: InboxInterfaceProps) => {
    const { setLoading, showToast } = useUI();

    // 使用 useState 管理信件列表的本地狀態
    // 實際開發時，這些狀態可能來自 React Query / SWR 等資料狀態管理工具
    const [messages, setMessages] = useState<InboxMessage[]>(INBOX_MESSAGES);
    const [selectedMsgId, setSelectedMsgId] = useState<number | null>(INBOX_MESSAGES[0]?.id || null);
    const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
    const [isClaimingAll, setIsClaimingAll] = useState(false);

    const selectedMsg = messages.find(m => m.id === selectedMsgId);
    const unreadCount = messages.filter(m => !m.read).length;
    const unclaimedAttachments = messages.filter(m => m.attachment && !claimedIds.has(m.id));

    /**
     * 標記所有信件為已讀
     * 
     * @description
     * 實際開發時的 API 整合建議 (Optimistic UI):
     * 1. 先在 UI 上立即更新狀態 (樂觀更新)
     * 2. 發送 API 請求 (例如: PATCH /api/inbox/mark-all-read)
     * 3. 若 API 失敗，回滾 UI 狀態並顯示錯誤訊息
     * 
     * @example
     * // 實際 API 整合範例
     * const handleMarkAllRead = async () => {
     *     const previousMessages = [...messages];
     *     setMessages(prev => prev.map(m => ({ ...m, read: true }))); // 樂觀更新
     *     try {
     *         await api.patch('/inbox/mark-all-read');
     *     } catch (error) {
     *         setMessages(previousMessages); // 回滾
     *         showToast('操作失敗，請稍後再試', 'error');
     *     }
     * };
     */
    const handleMarkAllRead = useCallback(async () => {
        if (unreadCount === 0) {
            showToast('所有信件已經是已讀狀態', 'info');
            return;
        }

        setLoading(true);
        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 500));

        setMessages(prev => prev.map(m => ({ ...m, read: true })));
        setLoading(false);
        showToast('所有信件已標記為已讀', 'info');
    }, [unreadCount, setLoading, showToast]);

    /**
     * 刪除指定信件
     * 
     * @description
     * 實際開發時的 API 整合建議 (Optimistic UI):
     * 1. 先從 UI 中移除該信件 (樂觀更新)
     * 2. 發送 DELETE 請求 (例如: DELETE /api/inbox/{messageId})
     * 3. 若失敗，將信件插回原位置並顯示錯誤
     * 
     * 注意事項:
     * - 確保 API 支援軟刪除 (soft delete)，以便後續可能的恢復功能
     * - 考慮加入「撤銷刪除」的 Toast Action
     * 
     * @param messageId - 要刪除的信件 ID
     */
    const handleDeleteMessage = useCallback((messageId: number) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));

        // 如果刪除的是當前選中的信件，選擇下一封
        if (selectedMsgId === messageId) {
            const remaining = messages.filter(m => m.id !== messageId);
            setSelectedMsgId(remaining[0]?.id || null);
        }

        showToast('信件已刪除', 'info');
    }, [selectedMsgId, messages, showToast]);

    /**
     * 領取單一附件獎勵
     * 
     * @description
     * 實際開發時的 API 整合建議:
     * 1. 發送 POST 請求領取獎勵 (例如: POST /api/inbox/{messageId}/claim)
     * 2. 後端應驗證:
     *    - 該信件是否存在且屬於當前用戶
     *    - 附件是否已被領取過
     *    - 獎勵是否過期
     * 3. 成功後更新用戶餘額並返回新餘額
     * 4. 前端收到成功響應後更新 UI 狀態
     * 
     * @param messageId - 要領取附件的信件 ID
     */
    const handleClaimAttachment = useCallback(async (messageId: number) => {
        if (claimedIds.has(messageId)) return;

        setLoading(true);
        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        setClaimedIds(prev => new Set([...prev, messageId]));
        setLoading(false);
        showToast('成功領取附件獎勵！', 'success');
    }, [claimedIds, setLoading, showToast]);

    /**
     * 全部領取所有未領取的附件
     * 
     * @description
     * 實際開發時的 API 整合建議:
     * 1. 發送批次領取請求 (例如: POST /api/inbox/claim-all)
     * 2. 後端應返回成功領取的數量和失敗的項目
     * 3. 考慮使用 transaction 確保原子性
     * 4. 返回領取總金額供前端顯示
     * 
     * 效能考量:
     * - 若附件數量多，考慮分批處理
     * - 使用 loading 狀態防止重複點擊
     */
    const handleClaimAll = useCallback(async () => {
        if (unclaimedAttachments.length === 0) {
            showToast('沒有可領取的附件', 'info');
            return;
        }

        setIsClaimingAll(true);
        setLoading(true);

        // 模擬批次 API 延遲
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newClaimedIds = new Set([...claimedIds, ...unclaimedAttachments.map(m => m.id)]);
        setClaimedIds(newClaimedIds);

        setLoading(false);
        setIsClaimingAll(false);
        showToast(`成功領取 ${unclaimedAttachments.length} 份附件獎勵！`, 'success');
    }, [unclaimedAttachments, claimedIds, setLoading, showToast]);

    // 點擊信件時標記為已讀
    const handleSelectMessage = useCallback((msgId: number) => {
        setSelectedMsgId(msgId);
        setMessages(prev => prev.map(m =>
            m.id === msgId ? { ...m, read: true } : m
        ));
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1000px] h-[600px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="關閉信箱"
                >
                    <X size={20} />
                </button>

                {/* Left Panel: Message List */}
                <div className="w-[35%] bg-[#0f061e] border-r border-white/10 flex flex-col">
                    <div className="h-14 flex items-center px-4 border-b border-white/5 gap-2">
                        <Mail size={18} className="text-[#FFD700]" />
                        <span className="text-white font-bold text-sm">收件夾</span>
                        <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {messages.length} 則訊息
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-3 py-2 border-b border-white/5 flex gap-2">
                        <button
                            onClick={handleMarkAllRead}
                            disabled={unreadCount === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <CheckCheck size={14} />
                            全部已讀 {unreadCount > 0 && <span className="text-[10px] bg-red-500/30 text-red-300 px-1.5 rounded-full">{unreadCount}</span>}
                        </button>
                        <button
                            onClick={handleClaimAll}
                            disabled={unclaimedAttachments.length === 0 || isClaimingAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isClaimingAll ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
                            全部領取
                        </button>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => handleSelectMessage(msg.id)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group ${selectedMsgId === msg.id ? 'bg-white/10 border-l-4 border-l-[#FFD700]' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${msg.type === 'system' ? 'border-red-500 text-red-400' :
                                            msg.type === 'promo' ? 'border-yellow-500 text-yellow-400' :
                                                'border-blue-500 text-blue-400'
                                            }`}>
                                            {msg.type === 'system' ? '系統' : msg.type === 'promo' ? '活動' : '通知'}
                                        </span>
                                        {msg.attachment && !claimedIds.has(msg.id) && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30">
                                                <Gift size={10} className="inline mr-0.5" />附件
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500">{msg.date}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteMessage(msg.id);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
                                            aria-label="刪除信件"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <h4 className={`text-sm font-bold mb-1 truncate ${!msg.read ? 'text-white' : 'text-slate-400'}`}>
                                    {!msg.read && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>}
                                    {msg.title}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{msg.content}</p>
                            </div>
                        ))}

                        {messages.length === 0 && (
                            <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-2 py-20">
                                <Mail size={32} className="opacity-20" />
                                <span className="text-sm">信箱已清空</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Message Content */}
                <div className="flex-1 flex flex-col bg-[#160b29] relative">
                    {selectedMsg ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-white/10 bg-[#1a0b2e] pr-16">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${selectedMsg.type === 'system' ? 'bg-red-500/20 text-red-400' :
                                        selectedMsg.type === 'promo' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {selectedMsg.type === 'system' ? '系統公告' : selectedMsg.type === 'promo' ? '限時活動' : '一般通知'}
                                    </span>
                                    <span className="text-slate-500 text-xs flex items-center gap-1"><Clock size={12} /> {selectedMsg.date}</span>
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-wide">{selectedMsg.title}</h2>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto">
                                <div className="bg-[#120822] p-6 rounded-2xl border border-white/5 text-slate-300 text-sm leading-7 whitespace-pre-wrap shadow-inner">
                                    {selectedMsg.content}
                                </div>

                                {/* Attachment Section */}
                                {selectedMsg.attachment && (
                                    <div className="mt-4 bg-gradient-to-r from-[#FFD700]/10 to-amber-500/5 p-4 rounded-xl border border-[#FFD700]/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                                                    <Gift size={20} className="text-[#FFD700]" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{selectedMsg.attachment.label}</p>
                                                    <p className="text-[#FFD700] text-xs">{selectedMsg.attachment.amount}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleClaimAttachment(selectedMsg.id)}
                                                disabled={claimedIds.has(selectedMsg.id)}
                                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${claimedIds.has(selectedMsg.id)
                                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-[#FFD700] to-amber-500 text-black hover:brightness-110 active:scale-95'
                                                    }`}
                                            >
                                                {claimedIds.has(selectedMsg.id) ? '已領取' : '領取'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#1a0b2e]">
                                <button
                                    onClick={() => handleDeleteMessage(selectedMsg.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-slate-400 hover:text-red-400 hover:border-red-400/50 transition-colors text-xs font-bold"
                                >
                                    <Trash2 size={14} /> 刪除
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-2">
                            <Mail size={48} className="opacity-20" />
                            <span className="text-sm">請選擇一則訊息閱讀</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxInterface;
