import { useState, useCallback, useMemo } from 'react';
import { BellRing, Building2, Clock, Gift, Loader2, Mail, MailOpen, Trash2, X } from 'lucide-react';
import { INBOX_MESSAGES } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import type { InboxMessage } from '../../types/inbox';

interface InboxInterfaceProps {
    onClose: () => void;
}

type InboxFilter = Extract<InboxMessage['type'], 'promo' | 'system'>;

const DEFAULT_INBOX_FILTER: InboxFilter = 'promo';

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
    const [activeFilter, setActiveFilter] = useState<InboxFilter>(DEFAULT_INBOX_FILTER);
    const [selectedMsgId, setSelectedMsgId] = useState<number | null>(
        INBOX_MESSAGES.find(message => message.type === DEFAULT_INBOX_FILTER)?.id ?? null,
    );
    const [claimedIds, setClaimedIds] = useState<Set<number>>(new Set());
    const [claimingId, setClaimingId] = useState<number | null>(null);

    const selectedMsg = messages.find(m => m.id === selectedMsgId);
    const visibleMessages = useMemo(
        () => messages.filter(message => message.type === activeFilter),
        [activeFilter, messages],
    );
    const supportedMessageCount = useMemo(
        () => messages.filter(message => message.type === 'promo' || message.type === 'system').length,
        [messages],
    );
    const filterCounts = useMemo(
        () => ({
            promo: messages.filter(message => message.type === 'promo').length,
            system: messages.filter(message => message.type === 'system').length,
        }),
        [messages],
    );
    const unreadCounts = useMemo(
        () => ({
            promo: messages.filter(message => message.type === 'promo' && !message.read).length,
            system: messages.filter(message => message.type === 'system' && !message.read).length,
        }),
        [messages],
    );

    /**
     * 刪除指定信件
     */
    const handleDeleteMessage = useCallback((messageId: number) => {
        setMessages(prev => prev.filter(m => m.id !== messageId));

        if (selectedMsgId === messageId) {
            const remaining = messages.filter(m => m.id !== messageId && m.type === activeFilter);
            setSelectedMsgId(remaining[0]?.id || null);
        }

        showToast('信件已刪除', 'info');
    }, [activeFilter, selectedMsgId, messages, showToast]);

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
            updateBalance({ gold: user.balance.gold + bonusAmount });
        }
        triggerBalanceAnimation();
        showToast('成功領取附件獎勵！+50,000 金幣', 'success');
    }, [claimedIds, claimingId, showToast, user, updateBalance, triggerBalanceAnimation]);

    // 點擊信件時標記為已讀
    const handleSelectMessage = useCallback((msgId: number) => {
        setSelectedMsgId(msgId);
        setMessages(prev => prev.map(m =>
            m.id === msgId ? { ...m, read: true } : m
        ));
    }, []);

    const handleFilterChange = useCallback((filter: InboxFilter) => {
        setActiveFilter(filter);
        setSelectedMsgId(messages.find(message => message.type === filter)?.id ?? null);
    }, [messages]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1000px] h-[600px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="關閉功能"
                >
                    <X size={20} />
                </button>

                {/* Left Panel: Message List */}
                <div className="w-[35%] bg-[#0f061e] border-r border-white/10 flex flex-col">
                    <div className="h-14 flex items-center px-4 border-b border-white/5 gap-2">
                        <Mail size={18} className="text-[#FFD700]" />
                        <span className="text-white font-bold text-sm">收件夾</span>
                        <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                            {supportedMessageCount} 則訊息
                        </span>
                    </div>

                    {/* Message Filters */}
                    <div
                        className="grid grid-cols-2 gap-2 border-b border-white/5 bg-black/10 px-3 py-2.5"
                        role="tablist"
                        aria-label="信件篩選"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeFilter === 'promo'}
                            onClick={() => handleFilterChange('promo')}
                            className={`relative flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-black transition-all active:scale-[0.98] ${activeFilter === 'promo'
                                ? 'border-[#FFD700]/45 bg-[#FFD700]/12 text-[#FFD700] shadow-[inset_0_0_16px_rgba(255,215,0,0.05)]'
                                : 'border-white/8 bg-white/[0.035] text-slate-400 hover:border-white/15 hover:bg-white/[0.07] hover:text-white'
                                }`}
                        >
                            <Building2 size={14} />
                            營運公告
                            <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${activeFilter === 'promo' ? 'bg-[#FFD700] text-black' : 'bg-white/8 text-slate-500'}`}>
                                {filterCounts.promo}
                            </span>
                            {unreadCounts.promo > 0 && (
                                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_7px_rgba(248,113,113,0.8)]" />
                            )}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeFilter === 'system'}
                            onClick={() => handleFilterChange('system')}
                            className={`relative flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-2 text-[11px] font-black transition-all active:scale-[0.98] ${activeFilter === 'system'
                                ? 'border-purple-300/40 bg-purple-500/16 text-purple-100 shadow-[inset_0_0_16px_rgba(168,85,247,0.06)]'
                                : 'border-white/8 bg-white/[0.035] text-slate-400 hover:border-white/15 hover:bg-white/[0.07] hover:text-white'
                                }`}
                        >
                            <BellRing size={14} />
                            系統通知
                            <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${activeFilter === 'system' ? 'bg-purple-200 text-purple-950' : 'bg-white/8 text-slate-500'}`}>
                                {filterCounts.system}
                            </span>
                            {unreadCounts.system > 0 && (
                                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_7px_rgba(248,113,113,0.8)]" />
                            )}
                        </button>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {visibleMessages.length > 0 ? (
                            visibleMessages.map(msg => (
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
                                            <span className={`rounded border px-1.5 py-0.5 text-[10px] font-black ${msg.type === 'system'
                                                ? 'border-purple-300/35 bg-purple-500/10 text-purple-200'
                                                : 'border-[#FFD700]/40 bg-[#FFD700]/8 text-[#FFD700]'
                                                }`}>
                                                {msg.type === 'system' ? '系統' : '營運'}
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
                                    <p className="text-lg font-bold text-slate-400">
                                        目前沒有{activeFilter === 'promo' ? '營運公告' : '系統通知'}
                                    </p>
                                    <p className="text-sm text-slate-600">新信件將會顯示在這裡</p>
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
                                    <span className={`rounded px-2 py-1 text-xs font-black ${selectedMsg.type === 'system'
                                        ? 'bg-purple-500/18 text-purple-200'
                                        : 'bg-[#FFD700]/12 text-[#FFD700]'
                                        }`}>
                                        {selectedMsg.type === 'system' ? '系統' : '營運'}
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
                                    {visibleMessages.length === 0 ? '此分類目前沒有信件' : '請選擇一則訊息閱讀'}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {visibleMessages.length === 0 ? '新信件將會顯示在這裡' : '點擊左側信件查看詳細內容'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxInterface;
