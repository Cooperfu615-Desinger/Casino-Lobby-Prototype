import { useState, useCallback } from 'react';
import { Mail, Clock, Trash2, X, Gift, CheckCheck, Loader2, MailOpen, AlertTriangle } from 'lucide-react';
import { INBOX_MESSAGES } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
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
    const { showToast, triggerBalanceAnimation } = useUI();
    const { updateBalance, user } = useAuth();

    // 使用 useState 管理信件列表的本地狀態
    const [messages, setMessages] = useState<InboxMessage[]>(INBOX_MESSAGES);
    const [selectedMsgId, setSelectedMsgId] = useState<number | null>(INBOX_MESSAGES[0]?.id || null);
    const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
    const [claimingId, setClaimingId] = useState<number | null>(null);
    const [isClaimingAll, setIsClaimingAll] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const selectedMsg = messages.find(m => m.id === selectedMsgId);
    const unreadCount = messages.filter(m => !m.read).length;
    const readMessages = messages.filter(m => m.read);
    const unclaimedAttachments = messages.filter(m => m.attachment && !claimedIds.has(m.id));

    /**
     * 標記所有信件為已讀
     * 瞬間移除所有紅點
     */
    const handleMarkAllRead = useCallback(() => {
        if (unreadCount === 0) {
            showToast('所有信件已經是已讀狀態', 'info');
            return;
        }
        setMessages(prev => prev.map(m => ({ ...m, read: true })));
        showToast('所有信件已標記為已讀', 'info');
    }, [unreadCount, showToast]);

    /**
     * 刪除指定信件
     */
    const handleDeleteMessage = useCallback((messageId: number) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));

        if (selectedMsgId === messageId) {
            const remaining = messages.filter(m => m.id !== messageId);
            setSelectedMsgId(remaining[0]?.id || null);
        }

        showToast('信件已刪除', 'info');
    }, [selectedMsgId, messages, showToast]);

    /**
     * 刪除所有已讀信件（需確認）
     */
    const handleDeleteAllRead = useCallback(() => {
        if (readMessages.length === 0) {
            showToast('沒有已讀信件可刪除', 'info');
            return;
        }
        setShowDeleteConfirm(true);
    }, [readMessages.length, showToast]);

    const confirmDeleteAllRead = useCallback(() => {
        const readIds = new Set(readMessages.map(m => m.id));
        setMessages(prev => prev.filter(m => !readIds.has(m.id)));

        // Reset selected if it was a read message
        if (selectedMsgId && readIds.has(selectedMsgId)) {
            const remaining = messages.filter(m => !readIds.has(m.id));
            setSelectedMsgId(remaining[0]?.id || null);
        }

        setShowDeleteConfirm(false);
        showToast(`已刪除 ${readMessages.length} 封已讀信件`, 'info');
    }, [readMessages, selectedMsgId, messages, showToast]);

    /**
     * 領取單一附件獎勵
     * 1秒 Loading，領取後按鈕變為已領取，觸發餘額動畫
     */
    const handleClaimAttachment = useCallback(async (messageId: number) => {
        if (claimedIds.has(messageId) || claimingId !== null) return;

        setClaimingId(messageId);
        // 模擬 API 延遲 1 秒
        await new Promise(resolve => setTimeout(resolve, 1000));

        setClaimedIds(prev => new Set([...prev, messageId]));
        setClaimingId(null);

        // 模擬增加餘額並觸發動畫
        const bonusAmount = 50000;
        if (user) {
            updateBalance(user.balance + bonusAmount);
        }
        triggerBalanceAnimation();
        showToast('成功領取附件獎勵！+50,000 金幣', 'success');
    }, [claimedIds, claimingId, showToast, user, updateBalance, triggerBalanceAnimation]);

    /**
     * 全部領取所有未領取的附件
     */
    const handleClaimAll = useCallback(async () => {
        if (unclaimedAttachments.length === 0) {
            showToast('沒有可領取的附件', 'info');
            return;
        }

        setIsClaimingAll(true);
        // 模擬批次 API 延遲
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newClaimedIds = new Set([...claimedIds, ...unclaimedAttachments.map(m => m.id)]);
        setClaimedIds(newClaimedIds);

        // 模擬增加餘額並觸發動畫
        const bonusAmount = 50000 * unclaimedAttachments.length;
        if (user) {
            updateBalance(user.balance + bonusAmount);
        }
        triggerBalanceAnimation();

        setIsClaimingAll(false);
        showToast(`成功領取 ${unclaimedAttachments.length} 份附件獎勵！+${bonusAmount.toLocaleString()} 金幣`, 'success');
    }, [unclaimedAttachments, claimedIds, showToast, user, updateBalance, triggerBalanceAnimation]);

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
                    <div className="px-3 py-2 border-b border-white/5 flex gap-2 flex-wrap">
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
                        <button
                            onClick={handleDeleteAllRead}
                            disabled={readMessages.length === 0}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={14} />
                            刪除已讀
                        </button>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {messages.length > 0 ? (
                            messages.map(msg => (
                                <div
                                    key={msg.id}
                                    onClick={() => handleSelectMessage(msg.id)}
                                    className={`relative p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all group
                                        ${selectedMsgId === msg.id ? 'bg-white/10 border-l-4 border-l-[#FFD700]' : 'border-l-4 border-l-transparent'}
                                        ${!msg.read ? 'bg-[#1a0f2e]' : 'bg-transparent opacity-70'}`}
                                >
                                    {/* Unread Red Dot - Left Side */}
                                    {!msg.read && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                                    )}

                                    <div className="flex justify-between items-start mb-1 pl-3">
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
                                    <div className="pl-3">
                                        <h4 className={`text-sm font-bold mb-1 truncate flex items-center gap-1.5 ${!msg.read ? 'text-white' : 'text-slate-400'}`}>
                                            {msg.read ? <MailOpen size={14} className="text-slate-500" /> : null}
                                            {msg.title}
                                        </h4>
                                        <p className={`text-xs truncate ${!msg.read ? 'text-slate-400' : 'text-slate-600'}`}>{msg.content}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State */
                            <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4 py-20">
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                                    <Mail size={48} className="opacity-30" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-400">目前尚無郵件</p>
                                    <p className="text-sm text-slate-600">新的通知和獎勵將會顯示在這裡</p>
                                </div>
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
                                                disabled={claimedIds.has(selectedMsg.id) || claimingId === selectedMsg.id}
                                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all min-w-[80px] ${claimedIds.has(selectedMsg.id)
                                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                    : claimingId === selectedMsg.id
                                                        ? 'bg-slate-600 text-slate-300 cursor-wait'
                                                        : 'bg-gradient-to-r from-[#FFD700] to-amber-500 text-black hover:brightness-110 active:scale-95'
                                                    }`}
                                            >
                                                {claimedIds.has(selectedMsg.id) ? (
                                                    '已領取'
                                                ) : claimingId === selectedMsg.id ? (
                                                    <Loader2 size={16} className="animate-spin mx-auto" />
                                                ) : (
                                                    '領取'
                                                )}
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
                        <div className="flex-1 flex items-center justify-center text-slate-500 flex-col gap-4">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                                <Mail size={48} className="opacity-30" />
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-slate-400">
                                    {messages.length === 0 ? '信箱已清空' : '請選擇一則訊息閱讀'}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {messages.length === 0 ? '新的通知和獎勵將會顯示在這裡' : '點擊左側信件查看詳細內容'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 animate-in fade-in duration-150">
                    <div className="bg-[#1a0b2e] border border-white/20 rounded-2xl p-6 w-[90%] max-w-[400px] shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <AlertTriangle size={24} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">確認刪除</h3>
                                <p className="text-slate-400 text-sm">此操作無法復原</p>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-6">
                            確定要刪除 <span className="text-red-400 font-bold">{readMessages.length}</span> 封已讀信件嗎？
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 transition-colors text-sm font-medium"
                            >
                                取消
                            </button>
                            <button
                                onClick={confirmDeleteAllRead}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-400 transition-colors text-sm font-bold"
                            >
                                確認刪除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InboxInterface;
