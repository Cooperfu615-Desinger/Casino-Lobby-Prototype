import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import {
    Globe, MessageCircle, Headphones, MoreVertical,
    Send, Plus, Smile, Megaphone, Bot, User as UserIcon, X, UserPlus, Coins, Gift, Zap, Flag, ShieldAlert,
    Users, LoaderCircle, RefreshCw
} from 'lucide-react';
import { CHAT_HISTORY, PUBLIC_CHAT_HISTORY, ChatMessage, getMockPlayerProfile, getStablePlayerId } from '../../data/mockData';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import type { ChatTargetPlayer, SupportDraft } from '../../context/NavigationContext';
import type { Friend, OnlinePlayer } from '../../types/user';
import AutoSendSettingsModal, { AutoSendSettings } from '../modals/AutoSendSettingsModal';
import { useNavigation } from '../../hooks/useNavigation';
import { PRODUCT_NAME } from '../../config/brand';

const MOCK_SPECIFIC_CHATS: Record<number, ChatMessage[]> = {
    1: [
        { id: 1, sender: 'Jessica_99', text: '要一起玩嗎？', isMe: false, time: '09:00' },
        { id: 2, sender: 'Me', text: '好啊，等我五分鐘！', isMe: true, time: '09:05' },
        { id: 3, sender: 'Jessica_99', text: '我在雷神之錘等你', isMe: false, time: '09:06' }
    ],
    2: CHAT_HISTORY,
    3: [
        { id: 1, sender: 'GM_Support', text: '您好，有什麼能幫您的？', isMe: false, time: 'yesterday' },
        { id: 2, sender: 'Me', text: '我要回報一個 Bug', isMe: true, time: 'yesterday' },
        { id: 3, sender: 'GM_Support', text: '請詳細說明您的問題', isMe: false, time: 'yesterday' }
    ],
    4: [
        { id: 1, sender: 'David_King', text: '下次見', isMe: false, time: 'Mon' }
    ],
    5: [
        { id: 1, sender: 'LuckyGirl', text: '這個機台很軟！', isMe: false, time: '10:00' },
        { id: 2, sender: 'Me', text: '真假？我也去試試', isMe: true, time: '10:01' }
    ]
};

const SUPPORT_CHAT_HISTORY: ChatMessage[] = [
    { id: 1, sender: '客服小幫手', text: `您好！我是 ${PRODUCT_NAME} 客服，請問有什麼可以協助您的？`, isMe: false, time: '14:00' },
];

const getCurrentTime = () => new Date().toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

type DirectoryView = 'conversations' | 'players' | 'friends';
type DirectoryStatus = 'idle' | 'loading' | 'loaded' | 'error';


interface ChatInterfaceProps {
    initialTab?: 'public' | 'chat' | 'support';
    initialTargetPlayer?: ChatTargetPlayer;
    supportDraft?: SupportDraft;
    onClose: () => void;
}

const ChatInterface = ({ initialTab, initialTargetPlayer, supportDraft, onClose }: ChatInterfaceProps) => {
    const { openModal } = useUI();
    const { navigate } = useNavigation();
    const {
        friends,
        addFriend,
        isBlockedPlayer,
        isFriendPlayer,
        requestFriendList,
        requestPlayerList,
    } = useSocial();
    const { user } = useAuth();
    const [chatTab, setChatTab] = useState<'public' | 'chat' | 'support'>(initialTab || 'chat');
    const [selectedFriendId, setSelectedFriendId] = useState<number | null>(() => {
        if (!initialTargetPlayer) return friends[1]?.id ?? friends[0]?.id ?? null;
        const targetFriend = friends.find(friend => friend.playerId === initialTargetPlayer.playerId || friend.name === initialTargetPlayer.name);
        return targetFriend?.id ?? null;
    });
    const [directChatTarget, setDirectChatTarget] = useState<ChatTargetPlayer | null>(() => {
        if (!initialTargetPlayer) return null;
        const targetFriend = friends.find(friend => friend.playerId === initialTargetPlayer.playerId || friend.name === initialTargetPlayer.name);
        return targetFriend ? null : initialTargetPlayer;
    });
    const [directoryView, setDirectoryView] = useState<DirectoryView>('conversations');
    const [directoryStatus, setDirectoryStatus] = useState<DirectoryStatus>('idle');
    const [loadedPlayers, setLoadedPlayers] = useState<OnlinePlayer[]>([]);
    const [loadedFriends, setLoadedFriends] = useState<Friend[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiTab, setEmojiTab] = useState<'default' | 'reward' | 'other'>('default');
    const [publicMessages, setPublicMessages] = useState<ChatMessage[]>(() => [...PUBLIC_CHAT_HISTORY]);
    const [supportMessages, setSupportMessages] = useState<ChatMessage[]>(() => [...SUPPORT_CHAT_HISTORY]);
    const [privateMessages, setPrivateMessages] = useState<Record<string, ChatMessage[]>>(() => Object.fromEntries(
        friends.map((friend) => [
            friend.playerId || getStablePlayerId(friend.name, friend.id),
            [...(MOCK_SPECIFIC_CHATS[friend.id] || CHAT_HISTORY)],
        ]),
    ));
    const [messageInput, setMessageInput] = useState('');
    const [publicMessageInput, setPublicMessageInput] = useState('');
    const [supportMessageInput, setSupportMessageInput] = useState('');
    const [activeSupportDraft, setActiveSupportDraft] = useState<SupportDraft | undefined>(supportDraft);
    const [activeAutoSendChannel, setActiveAutoSendChannel] = useState<'public' | 'private' | null>(null);
    const [autoSendConfig, setAutoSendConfig] = useState<{ public: AutoSendSettings; private: AutoSendSettings }>({
        public: { enabled: false, message: '歡迎加入公共頻道！🎰', selectedSticker: '🎉', interval: 10 },
        private: { enabled: false, message: '歡迎加入！祝您好運 🍀', selectedSticker: '🎉', interval: 1 },
    });
    const messageEndRef = useRef<HTMLDivElement>(null);
    const nextMessageIdRef = useRef(Date.now());
    const directoryRequestIdRef = useRef(0);
    useEffect(() => {
        if (!initialTargetPlayer) return;

        const targetFriend = friends.find(friend => friend.playerId === initialTargetPlayer.playerId || friend.name === initialTargetPlayer.name);
        setChatTab('chat');
        setDirectoryView('conversations');

        if (targetFriend) {
            setSelectedFriendId(targetFriend.id);
            setDirectChatTarget(null);
        } else {
            setSelectedFriendId(null);
            setDirectChatTarget(initialTargetPlayer);
        }
    }, [friends, initialTargetPlayer]);

    useEffect(() => {
        if (!selectedFriendId) return;
        if (friends.some(friend => friend.id === selectedFriendId)) return;

        setSelectedFriendId(friends[0]?.id ?? null);
    }, [friends, selectedFriendId]);

    useEffect(() => {
        if (!supportDraft) return;

        setChatTab('support');
        setActiveSupportDraft(supportDraft);
        setSupportMessageInput('');
    }, [supportDraft]);

    const selectedFriend = selectedFriendId ? friends.find(f => f.id === selectedFriendId) : undefined;
    const selectedPrivatePlayer = useMemo<ChatTargetPlayer>(() => {
        if (directChatTarget) return directChatTarget;
        if (selectedFriend) {
            return {
                playerId: selectedFriend.playerId || getStablePlayerId(selectedFriend.name, selectedFriend.id),
                account: selectedFriend.account,
                name: selectedFriend.name,
                avatar: selectedFriend.avatar,
                isFriend: true,
            };
        }

        const fallbackFriend = friends[0];
        if (!fallbackFriend) {
            return {
                playerId: 'P00000',
                account: 'Player',
                name: '尚未選擇玩家',
                avatar: 'bg-slate-700',
                isFriend: false,
            };
        }

        return {
            playerId: fallbackFriend.playerId || getStablePlayerId(fallbackFriend.name, fallbackFriend.id),
            account: fallbackFriend.account,
            name: fallbackFriend.name,
            avatar: fallbackFriend.avatar,
            isFriend: true,
        };
    }, [directChatTarget, friends, selectedFriend]);

    const selectedPrivateMessages = privateMessages[selectedPrivatePlayer.playerId]
        ?? (directChatTarget ? [
            { id: 1, sender: selectedPrivatePlayer.name, text: '嗨，我們可以在這裡直接聊天。', isMe: false, time: 'now' },
        ] : []);
    const selectedPrivateBlocked = isBlockedPlayer(selectedPrivatePlayer.playerId);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [chatTab, publicMessages, supportMessages, privateMessages, selectedPrivatePlayer.playerId]);

    const showLocalToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const openPlayerProfile = (name: string) => {
        const profile = getMockPlayerProfile(name);
        if (isBlockedPlayer(profile.playerId)) {
            showLocalToast('已封鎖的玩家無法查看個人資料');
            return;
        }

        openModal('playerProfile', { profile: { ...profile, isFriend: isFriendPlayer(profile.playerId) } });
    };

    const makeSelfMessage = (text: string): ChatMessage => ({
        id: ++nextMessageIdRef.current,
        sender: user?.name || 'Me',
        text,
        isMe: true,
        time: getCurrentTime(),
    });

    const handleSendPublicMessage = () => {
        const text = publicMessageInput.trim();
        if (!text) return;
        setPublicMessages((messages) => [...messages, makeSelfMessage(text)]);
        setPublicMessageInput('');
    };

    const handleSendPrivateMessage = () => {
        const text = messageInput.trim();
        if (!text) return;
        if (selectedPrivateBlocked) {
            showLocalToast('此玩家已在黑名單中，無法傳送私人訊息');
            return;
        }

        const conversationKey = selectedPrivatePlayer.playerId;
        setPrivateMessages((messages) => ({
            ...messages,
            [conversationKey]: [...(messages[conversationKey] ?? selectedPrivateMessages), makeSelfMessage(text)],
        }));
        setMessageInput('');
        setShowEmojiPicker(false);
    };

    const handleSendSupportMessage = () => {
        const text = supportMessageInput.trim();
        if (!text) {
            if (activeSupportDraft) showLocalToast('請輸入檢舉內容');
            return;
        }

        const submittedText = activeSupportDraft ? `【${activeSupportDraft.title}】${text}` : text;
        setSupportMessages((messages) => [...messages, makeSelfMessage(submittedText)]);
        showLocalToast(activeSupportDraft ? '檢舉內容已送出給客服' : '訊息已送出給客服');
        setSupportMessageInput('');
        setActiveSupportDraft(undefined);
    };

    const handleEnterToSend = (event: KeyboardEvent<HTMLInputElement>, onSend: () => void) => {
        if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
        event.preventDefault();
        onSend();
    };


    const handleLoadDirectory = async (view: Exclude<DirectoryView, 'conversations'>) => {
        const requestId = ++directoryRequestIdRef.current;
        setDirectoryView(view);
        setDirectoryStatus('loading');

        try {
            if (view === 'players') {
                const players = await requestPlayerList();
                if (requestId !== directoryRequestIdRef.current) return;
                setLoadedPlayers(players);
            } else {
                const friendList = await requestFriendList();
                if (requestId !== directoryRequestIdRef.current) return;
                setLoadedFriends(friendList);
            }
            setDirectoryStatus('loaded');
        } catch {
            if (requestId !== directoryRequestIdRef.current) return;
            setDirectoryStatus('error');
        }
    };

    const handleAddFriendFromList = (player: OnlinePlayer) => {
        const playerId = player.playerId || getStablePlayerId(player.name, player.id);
        if (isFriendPlayer(playerId)) return;

        addFriend({
            playerId,
            account: player.account,
            name: player.name,
            avatar: player.avatar,
        });
        showLocalToast(`已將 ${player.name} 加入好友清單`);
    };

    const TabButton = ({ id, icon: Icon, label }: { id: 'public' | 'chat' | 'support'; icon: typeof Globe; label: string }) => (
        <button
            onClick={() => setChatTab(id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 rounded-lg transition-all ${chatTab === id
                ? 'bg-white/10 text-[#FFD700]'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
        >
            <Icon size={18} />
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );

    const renderRightPanel = () => {
        switch (chatTab) {
            case 'support':
                return (
                    <div className="flex-1 flex flex-col bg-[#160b29] relative">
                        <div className="h-14 border-b border-white/10 flex justify-between items-center pl-6 pr-16 bg-[#1a0b2e]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border border-white/20">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">智能客服 AI</h3>
                                    <span className="text-green-500 text-[10px] flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        24H 在線服務
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeSupportDraft && (
                                <div className="rounded-2xl border border-orange-300/25 bg-orange-400/10 p-4 text-orange-50 shadow-[0_0_24px_rgba(251,146,60,0.08)]">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-black text-orange-200">
                                        <Flag size={14} />
                                        檢舉案件
                                    </div>
                                    <div className="text-sm font-black text-white">{activeSupportDraft.title}</div>
                                    <p className="mt-2 text-xs leading-relaxed text-orange-100/70">
                                        請在下方輸入檢舉內容，送出後客服會依此玩家資料與您的描述建立案件。
                                    </p>
                                </div>
                            )}
                            {supportMessages.map((message) => (
                                <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!message.isMe && (
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 mr-2 flex items-center justify-center border border-white/20">
                                            <Bot size={14} className="text-white" />
                                        </div>
                                    )}
                                    <div className="flex max-w-[70%] flex-col gap-1">
                                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${message.isMe
                                            ? 'rounded-tr-none bg-blue-600 text-white'
                                            : 'rounded-tl-none border border-white/10 bg-[#2a1b42] text-white'
                                            }`}>
                                            {message.text}
                                        </div>
                                        <span className={`text-[9px] text-slate-500 ${message.isMe ? 'text-right' : 'text-left'}`}>{message.time}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                        <div className="h-16 border-t border-white/10 p-3 flex items-center gap-3 bg-[#1a0b2e]">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={supportMessageInput}
                                    onChange={(e) => setSupportMessageInput(e.target.value)}
                                    onKeyDown={(event) => handleEnterToSend(event, handleSendSupportMessage)}
                                    placeholder={activeSupportDraft ? '請輸入檢舉內容...' : '請輸入您的問題...'}
                                    className="w-full bg-[#0f061e] text-white text-sm rounded-full py-2.5 pl-4 pr-10 border border-white/10 focus:outline-none focus:border-[#FFD700]"
                                />
                            </div>
                            <button
                                onClick={handleSendSupportMessage}
                                disabled={!supportMessageInput.trim()}
                                aria-label="傳送客服訊息"
                                className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                );
            case 'public':
                return (
                    <div className="flex-1 flex flex-col bg-[#160b29] relative">
                        <div className="flex h-14 items-center border-b border-white/10 bg-[#1a0b2e] pl-6 pr-16">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-[#FFD700]" />
                                <h3 className="text-white font-bold text-sm">公共頻道 (World Chat)</h3>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {publicMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} relative group`}>
                                    {!msg.isSystem && !msg.isMe && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openPlayerProfile(msg.sender);
                                            }}
                                            className="flex flex-col items-center mr-2 hover:opacity-80 transition-all active:scale-95 group-hover:scale-105"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-white/10 group-hover:border-[#FFD700] transition-colors shadow-lg">
                                                <UserIcon size={14} className="text-white/80" />
                                            </div>
                                            <span className="text-[9px] text-slate-500 mt-0.5 max-w-[50px] truncate group-hover:text-[#FFD700] transition-colors">{msg.sender}</span>
                                        </button>
                                    )}
                                    {msg.isSystem ? (
                                        <div className="w-full flex justify-center my-2">
                                            <div className="bg-black/30 text-[#FFD700] text-xs px-3 py-1 rounded-full border border-[#FFD700]/20 flex items-center gap-2">
                                                <Megaphone size={10} /> {msg.text}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.isMe
                                            ? 'bg-[#FFD700] text-black rounded-tr-none'
                                            : 'bg-[#2a1b42] text-white rounded-tl-none border border-white/10'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messageEndRef} />
                        </div>
                        <div className="h-16 border-t border-white/10 p-3 flex items-center gap-3 bg-[#1a0b2e]">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={publicMessageInput}
                                    onChange={(event) => setPublicMessageInput(event.target.value)}
                                    onKeyDown={(event) => handleEnterToSend(event, handleSendPublicMessage)}
                                    placeholder="發送訊息到公共頻道..."
                                    className="w-full bg-[#0f061e] text-white text-sm rounded-full py-2.5 pl-4 pr-10 border border-white/10 focus:outline-none focus:border-[#FFD700]"
                                />
                            </div>
                            <button
                                onClick={handleSendPublicMessage}
                                disabled={!publicMessageInput.trim()}
                                aria-label="傳送世界頻道訊息"
                                className="p-2.5 bg-gradient-to-r from-[#FFD700] to-[#DAA520] rounded-full text-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                );
            case 'chat':
            default:
                return (
                    <div className="flex-1 flex flex-col bg-[#160b29] relative">
                        <div className="h-14 border-b border-white/10 flex justify-between items-center pl-6 pr-16 bg-[#1a0b2e]">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${selectedPrivatePlayer.avatar || 'bg-slate-700'} flex items-center justify-center`}>
                                    <UserIcon size={16} className="text-white/80" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">{selectedPrivatePlayer.name}</h3>
                                    {selectedPrivateBlocked ? (
                                        <span className="text-red-300 text-[10px] flex items-center gap-1">
                                            <ShieldAlert size={10} />
                                            已封鎖，無法私訊
                                        </span>
                                    ) : (
                                        <span className="text-green-500 text-[10px] flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            在線
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-white">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedPrivateBlocked && (
                                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
                                    您已將 {selectedPrivatePlayer.name} 加入黑名單，無法進行私人聊天。
                                </div>
                            )}
                            {selectedPrivateMessages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!msg.isMe && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openPlayerProfile(selectedPrivatePlayer.name);
                                            }}
                                            className={`w-8 h-8 rounded-full ${selectedPrivatePlayer.avatar || 'bg-slate-700'} flex-shrink-0 mr-2 flex items-center justify-center hover:scale-105 active:scale-95 transition-all`}
                                        >
                                            <UserIcon size={14} className="text-white/80" />
                                        </button>
                                    )}
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.isMe
                                        ? 'bg-[#FFD700] text-black rounded-tr-none'
                                        : 'bg-[#2a1b42] text-white rounded-tl-none border border-white/10'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div className="text-center text-[10px] text-slate-500 my-2">今天 10:30</div>
                            <div ref={messageEndRef} />
                        </div>
                        <div className="h-16 border-t border-white/10 p-3 flex items-center gap-3 bg-[#1a0b2e] relative">
                            {showAttachMenu && (
                                <div className="absolute bottom-16 left-3 bg-[#2a1b42] border border-white/20 rounded-xl shadow-xl p-2 w-40 animate-in fade-in zoom-in-95 duration-200">
                                    <button
                                        onClick={() => {
                                            navigate('vault', { vaultTab: 'gifts', vaultReceiverId: selectedPrivatePlayer.playerId });
                                            setShowAttachMenu(false);
                                        }}
                                        disabled={selectedPrivateBlocked}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg text-white text-sm transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
                                            <Coins size={16} />
                                        </div>
                                        <span>遊戲點數</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setToastMessage("功能開發中 (In Development)");
                                            setTimeout(() => setToastMessage(null), 2000);
                                            setShowAttachMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg text-white text-sm transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
                                            <Gift size={16} />
                                        </div>
                                        <span>贈送禮物</span>
                                    </button>
                                </div>
                            )}
                            {showAttachMenu && (
                                <div className="fixed inset-0 z-0" onClick={() => setShowAttachMenu(false)} />
                            )}

                            <button
                                onClick={() => setShowAttachMenu(!showAttachMenu)}
                                disabled={selectedPrivateBlocked}
                                className={`p-2 transition-colors rounded-full z-10 disabled:cursor-not-allowed disabled:opacity-40 ${showAttachMenu ? 'bg-[#FFD700] text-black' : 'text-slate-400 hover:text-[#FFD700] bg-white/5'}`}
                            >
                                {showAttachMenu ? <X size={20} /> : <Plus size={20} />}
                            </button>
                            <div className="flex-1 relative z-10">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(event) => handleEnterToSend(event, handleSendPrivateMessage)}
                                    disabled={selectedPrivateBlocked}
                                    placeholder={selectedPrivateBlocked ? '已封鎖，無法私訊' : '輸入訊息...'}
                                    className="w-full bg-[#0f061e] text-white text-sm rounded-full py-2.5 pl-4 pr-10 border border-white/10 focus:outline-none focus:border-[#FFD700] disabled:cursor-not-allowed disabled:text-slate-500"
                                />
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    disabled={selectedPrivateBlocked}
                                    className={`absolute right-3 top-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${showEmojiPicker ? 'text-[#FFD700]' : 'text-slate-400 hover:text-[#FFD700]'}`}
                                >
                                    <Smile size={20} />
                                </button>

                                {showEmojiPicker && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
                                        <div className="absolute bottom-full right-0 mb-3 w-64 bg-[#2a1b42] border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in zoom-in-95 duration-200">
                                            {/* Tabs */}
                                            <div className="flex border-b border-white/10 bg-black/20">
                                                <button
                                                    onClick={() => setEmojiTab('default')}
                                                    className={`flex-1 py-2 text-xs font-medium transition-colors ${emojiTab === 'default' ? 'bg-[#FFD700]/10 text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-slate-400 hover:text-slate-200'}`}
                                                >
                                                    預設
                                                </button>
                                                <button
                                                    onClick={() => setEmojiTab('reward')}
                                                    className={`flex-1 py-2 text-xs font-medium transition-colors ${emojiTab === 'reward' ? 'bg-[#FFD700]/10 text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-slate-400 hover:text-slate-200'}`}
                                                >
                                                    獎勵
                                                </button>
                                                <button
                                                    onClick={() => setEmojiTab('other')}
                                                    className={`flex-1 py-2 text-xs font-medium transition-colors ${emojiTab === 'other' ? 'bg-[#FFD700]/10 text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-slate-400 hover:text-slate-200'}`}
                                                >
                                                    其他
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-3 h-48 overflow-y-auto custom-scrollbar">
                                                {emojiTab === 'default' ? (
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {['😀', '😂', '😍', '😭', '😡', '👍', '🔥', '🎉', '💰', '🎰', '🤬', '🫣', '❤️', '💔', '👻', '💀', '💩', '🤡', '🤝', '🙌'].map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                onClick={() => setMessageInput(prev => prev + emoji)}
                                                                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-white/10 rounded-lg transition-colors"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                                            <Smile size={20} className="opacity-50" />
                                                        </div>
                                                        <span className="text-xs">尚未取得</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button
                                onClick={handleSendPrivateMessage}
                                disabled={selectedPrivateBlocked || !messageInput.trim()}
                                aria-label="傳送私人訊息"
                                className="p-2.5 bg-gradient-to-r from-[#FFD700] to-[#DAA520] rounded-full text-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="juheng-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="juheng-modal-panel relative w-[90%] max-w-[1000px] h-[600px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-200">

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#FFD700] text-black px-4 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-2">
                        <UserPlus size={16} />
                        {toastMessage}
                    </div>
                )}



                {/* Close Button */}
                <button
                    aria-label="關閉功能"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Panel */}
                <div className="w-[30%] bg-[#0f061e] border-r border-white/10 flex flex-col pt-2">
                    <div className="flex justify-between px-2 pt-2 pb-1 border-b border-white/5">
                        <TabButton id="public" icon={Globe} label="公共頻道" />
                        <TabButton id="chat" icon={MessageCircle} label="聊天" />
                        <TabButton id="support" icon={Headphones} label="線上客服" />
                    </div>

                    {chatTab !== 'support' && (
                        <div className="flex min-h-0 flex-1 flex-col">
                            <div className="border-b border-white/5 p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleLoadDirectory('players')}
                                        aria-pressed={directoryView === 'players'}
                                        className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-xs font-black transition-all active:scale-95 ${directoryView === 'players'
                                            ? 'border-[#FFD700] bg-[#FFD700] text-black shadow-[0_0_16px_rgba(255,215,0,0.16)]'
                                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-[#FFD700]/40 hover:text-[#FFD700]'
                                            }`}
                                    >
                                        <Users size={14} />
                                        玩家清單
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleLoadDirectory('friends')}
                                        aria-pressed={directoryView === 'friends'}
                                        className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-xs font-black transition-all active:scale-95 ${directoryView === 'friends'
                                            ? 'border-[#FFD700] bg-[#FFD700] text-black shadow-[0_0_16px_rgba(255,215,0,0.16)]'
                                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-[#FFD700]/40 hover:text-[#FFD700]'
                                            }`}
                                    >
                                        <UserPlus size={14} />
                                        好友清單
                                    </button>
                                </div>
                                <p className="mt-2 text-center text-[10px] leading-4 text-slate-600">點擊後才載入清單資料</p>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {directoryView === 'conversations' && chatTab === 'chat' && (
                                    <div>
                                        <div className="border-b border-white/5 px-4 py-3 text-[10px] font-black tracking-[0.18em] text-slate-500">近期對話</div>
                                        <div className="flex items-center gap-3 border-l-4 border-[#FFD700] bg-[#FFD700]/10 p-4">
                                            <button
                                                type="button"
                                                onClick={() => openPlayerProfile(selectedPrivatePlayer.name)}
                                                aria-label={`查看 ${selectedPrivatePlayer.name} 的玩家資訊`}
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FFD700]/40 ${selectedPrivatePlayer.avatar || 'bg-slate-700'} transition-transform hover:scale-105 active:scale-95`}
                                            >
                                                <UserIcon size={20} className="text-white/80" />
                                            </button>
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate text-sm font-bold text-[#FFD700]">{selectedPrivatePlayer.name}</div>
                                                <p className="truncate text-xs text-slate-400">{directChatTarget ? '臨時私人對話' : selectedFriend?.lastMsg || '私人對話'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {directoryView === 'conversations' && chatTab === 'public' && (
                                    <div className="flex h-full min-h-48 flex-col items-center justify-center px-6 text-center">
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 text-[#FFD700]">
                                            <Users size={22} />
                                        </div>
                                        <p className="text-sm font-black text-slate-200">清單尚未載入</p>
                                        <p className="mt-2 text-xs leading-5 text-slate-500">需要查看玩家或好友時，再點擊上方按鈕。</p>
                                    </div>
                                )}

                                {directoryView !== 'conversations' && directoryStatus === 'loading' && (
                                    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 text-slate-400">
                                        <LoaderCircle size={24} className="animate-spin text-[#FFD700]" />
                                        <span className="text-xs font-bold">正在載入{directoryView === 'players' ? '玩家' : '好友'}清單...</span>
                                    </div>
                                )}

                                {directoryView !== 'conversations' && directoryStatus === 'error' && (
                                    <div className="flex h-full min-h-48 flex-col items-center justify-center px-6 text-center">
                                        <p className="text-sm font-black text-slate-200">清單載入失敗</p>
                                        <button
                                            type="button"
                                            onClick={() => handleLoadDirectory(directoryView)}
                                            className="mt-3 flex items-center gap-2 rounded-lg border border-[#FFD700]/30 bg-[#FFD700]/10 px-3 py-2 text-xs font-black text-[#FFD700] transition-colors hover:bg-[#FFD700]/20"
                                        >
                                            <RefreshCw size={13} />
                                            重新載入
                                        </button>
                                    </div>
                                )}

                                {directoryView === 'players' && directoryStatus === 'loaded' && (
                                    <div>
                                        <div className="border-b border-white/5 px-4 py-3 text-[10px] font-black tracking-[0.18em] text-slate-500">玩家清單 · {loadedPlayers.length}</div>
                                        {loadedPlayers.map(player => {
                                            const playerId = player.playerId || getStablePlayerId(player.name, player.id);
                                            const alreadyFriend = isFriendPlayer(playerId);

                                            return (
                                                <div key={player.id} className="flex items-center gap-3 border-b border-white/5 p-3 transition-colors hover:bg-white/5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openPlayerProfile(player.name)}
                                                        aria-label={`查看 ${player.name} 的玩家資訊`}
                                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 ${player.avatar} shadow-md transition-all hover:scale-105 hover:border-[#FFD700]/60 active:scale-95`}
                                                    >
                                                        <UserIcon size={16} className="text-white/85" />
                                                    </button>
                                                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-200">{player.name}</span>
                                                    {!alreadyFriend && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddFriendFromList(player)}
                                                            className="shrink-0 rounded-lg border border-[#FFD700]/30 bg-[#FFD700]/10 px-2.5 py-2 text-[10px] font-black text-[#FFD700] transition-all hover:border-[#FFD700]/60 hover:bg-[#FFD700]/20 active:scale-95"
                                                        >
                                                            增加好友
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {directoryView === 'friends' && directoryStatus === 'loaded' && (
                                    <div>
                                        <div className="border-b border-white/5 px-4 py-3 text-[10px] font-black tracking-[0.18em] text-slate-500">好友清單 · {loadedFriends.length}</div>
                                        {loadedFriends.map(friend => (
                                            <div
                                                key={friend.id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => {
                                                    setChatTab('chat');
                                                    setDirectChatTarget(null);
                                                    setSelectedFriendId(friend.id);
                                                    setDirectoryView('conversations');
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key !== 'Enter' && event.key !== ' ') return;
                                                    event.preventDefault();
                                                    setChatTab('chat');
                                                    setDirectChatTarget(null);
                                                    setSelectedFriendId(friend.id);
                                                    setDirectoryView('conversations');
                                                }}
                                                className="flex cursor-pointer items-center gap-3 border-b border-white/5 p-3 transition-colors hover:bg-white/5 focus:outline-none focus-visible:bg-white/5"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        openPlayerProfile(friend.name);
                                                    }}
                                                    aria-label={`查看 ${friend.name} 的玩家資訊`}
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 ${friend.avatar} shadow-md transition-all hover:scale-105 hover:border-[#FFD700]/60 active:scale-95`}
                                                >
                                                    <UserIcon size={16} className="text-white/85" />
                                                </button>
                                                <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-200">{friend.name}</span>
                                            </div>
                                        ))}
                                        {loadedFriends.length === 0 && (
                                            <div className="px-6 py-12 text-center text-xs text-slate-500">目前還沒有好友</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {user?.canAutoSend && (
                                <div className="border-t border-white/5 p-3">
                                    <button
                                        onClick={() => setActiveAutoSendChannel(chatTab === 'public' ? 'public' : 'private')}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg
                                                   bg-gradient-to-r from-[#FFD700]/10 to-[#DAA520]/5
                                                   border border-[#FFD700]/25 text-[#FFD700] text-xs font-semibold
                                                   hover:from-[#FFD700]/20 hover:to-[#DAA520]/15 hover:border-[#FFD700]/50
                                                   hover:shadow-[0_0_12px_rgba(255,215,0,0.15)]
                                                   active:scale-95 transition-all duration-150"
                                    >
                                        <Zap size={13} />
                                        自動發送設定
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {chatTab === 'support' && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                            <div className="bg-blue-600/20 text-blue-400 p-8 rounded-full border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-pulse">
                                <Headphones size={80} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">需要協助嗎？</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    我們的支援團隊隨時準備<br />為您解決任何遊戲問題。
                                </p>
                            </div>
                        </div>
                    )}

                </div>
                {renderRightPanel()}

                {/* Auto-Send Settings Modal — rendered inside modal container */}
                {activeAutoSendChannel && (
                    <AutoSendSettingsModal
                        key={activeAutoSendChannel}
                        isOpen={true}
                        onClose={() => setActiveAutoSendChannel(null)}
                        channelType={activeAutoSendChannel}
                        settings={autoSendConfig[activeAutoSendChannel]}
                        onSave={(updated) => {
                            setAutoSendConfig(prev => ({ ...prev, [activeAutoSendChannel]: updated }));
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ChatInterface;
