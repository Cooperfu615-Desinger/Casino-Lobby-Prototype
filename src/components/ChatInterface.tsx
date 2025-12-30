import { useState } from 'react';
import {
    Globe, MessageCircle, Headphones, Search, MoreVertical,
    Send, Plus, Smile, Megaphone, Bot, User as UserIcon, X, UserPlus
} from 'lucide-react';
import { FRIENDS, ONLINE_PLAYERS, CHAT_HISTORY, PUBLIC_CHAT_HISTORY } from '../data/mockData';

interface ChatInterfaceProps {
    initialTab?: 'public' | 'chat' | 'support';
    onClose: () => void;
}

const ChatInterface = ({ initialTab, onClose }: ChatInterfaceProps) => {
    const [chatTab, setChatTab] = useState<'public' | 'chat' | 'support'>(initialTab || 'chat');
    const [selectedFriendId, setSelectedFriendId] = useState(2);
    const [sidebarTab, setSidebarTab] = useState<'friends' | 'chats'>('friends');
    const [publicMenu, setPublicMenu] = useState<{ x: number, y: number, name: string } | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const selectedFriend = FRIENDS.find(f => f.id === selectedFriendId)!;

    const handleFriendRequest = (name: string) => {
        setPublicMenu(null);
        setToastMessage(`已發送好友邀請給 ${name}！(Friend request sent!)`);
        setTimeout(() => setToastMessage(null), 3000);
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
                        <div className="h-14 border-b border-white/10 flex justify-between items-center px-6 bg-[#1a0b2e]">
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
                            <div className="flex justify-start">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 mr-2 flex items-center justify-center border border-white/20">
                                    <Bot size={14} className="text-white" />
                                </div>
                                <div className="max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm bg-[#2a1b42] text-white rounded-tl-none border border-white/10">
                                    <p>親愛的玩家您好！我是您的專屬 AI 客服助理。</p>
                                    <p className="mt-2">如果您遇到任何遊戲問題、儲值問題或建議，請直接在下方輸入，我將盡快為您協助！🤖</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-16 border-t border-white/10 p-3 flex items-center gap-3 bg-[#1a0b2e]">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="請輸入您的問題..."
                                    className="w-full bg-[#0f061e] text-white text-sm rounded-full py-2.5 pl-4 pr-10 border border-white/10 focus:outline-none focus:border-[#FFD700]"
                                />
                            </div>
                            <button className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-white shadow-lg hover:scale-105 active:scale-95 transition-all">
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                );
            case 'public':
                return (
                    <div className="flex-1 flex flex-col bg-[#160b29] relative">
                        <div className="h-14 border-b border-white/10 flex justify-between items-center px-6 bg-[#1a0b2e]">
                            <div className="flex items-center gap-3">
                                <Globe size={18} className="text-[#FFD700]" />
                                <h3 className="text-white font-bold text-sm">公共頻道 (World Chat)</h3>
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                1,208 人在線
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {PUBLIC_CHAT_HISTORY.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} relative group`}>
                                    {!msg.isSystem && !msg.isMe && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setPublicMenu({ x: rect.left, y: rect.bottom, name: msg.sender });
                                            }}
                                            className="flex flex-col items-center mr-2 hover:opacity-80 transition-opacity"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-white/10 group-hover:border-[#FFD700] transition-colors">
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

                            {/* User Action Menu */}
                            {publicMenu && (
                                <div
                                    className="fixed z-50 bg-[#2a1b42] border border-white/20 rounded-lg shadow-xl py-1 w-32 animate-in fade-in zoom-in-95 duration-100"
                                    style={{ top: publicMenu.y, left: publicMenu.x }}
                                >
                                    <div className="px-3 py-1.5 text-xs text-white/50 border-b border-white/10 mb-1">
                                        {publicMenu.name}
                                    </div>
                                    <button
                                        onClick={() => handleFriendRequest(publicMenu.name)}
                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2"
                                    >
                                        <UserPlus size={14} className="text-[#FFD700]" />
                                        加入好友
                                    </button>
                                    <button
                                        onClick={() => setPublicMenu(null)}
                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/10 flex items-center gap-2"
                                    >
                                        <X size={14} />
                                        關閉
                                    </button>
                                </div>
                            )}

                            {/* Global Click Listener to close menu */}
                            {publicMenu && (
                                <div className="fixed inset-0 z-40" onClick={() => setPublicMenu(null)} />
                            )}
                        </div>
                        <div className="h-16 border-t border-white/10 p-3 flex items-center gap-3 bg-[#1a0b2e]">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="發送訊息到公共頻道..."
                                    className="w-full bg-[#0f061e] text-white text-sm rounded-full py-2.5 pl-4 pr-10 border border-white/10 focus:outline-none focus:border-[#FFD700]"
                                />
                            </div>
                            <button className="p-2.5 bg-gradient-to-r from-[#FFD700] to-[#DAA520] rounded-full text-black shadow-lg hover:scale-105 active:scale-95 transition-all">
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                );
            case 'chat':
            default:
                return (
                    <div className="flex-1 flex flex-col bg-[#160b29] relative">
                        <div className="h-14 border-b border-white/10 flex justify-between items-center px-6 bg-[#1a0b2e]">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${selectedFriend.avatar} flex items-center justify-center`}>
                                    <UserIcon size={16} className="text-white/80" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm">{selectedFriend.name}</h3>
                                    <span className="text-green-500 text-[10px] flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        在線
                                    </span>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-white">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {CHAT_HISTORY.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                    {!msg.isMe && (
                                        <div className={`w-8 h-8 rounded-full ${selectedFriend.avatar} flex-shrink-0 mr-2 flex items-center justify-center`}>
                                            <UserIcon size={14} className="text-white/80" />
                                        </div>
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
                        </div>
                        <div className="h-16 border-t border-white/10 p-3 flex items-center gap-3 bg-[#1a0b2e]">
                            <button className="p-2 text-slate-400 hover:text-[#FFD700] transition-colors bg-white/5 rounded-full">
                                <Plus size={20} />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="輸入訊息..."
                                    className="w-full bg-[#0f061e] text-white text-sm rounded-full py-2.5 pl-4 pr-10 border border-white/10 focus:outline-none focus:border-[#FFD700]"
                                />
                                <button className="absolute right-3 top-2.5 text-slate-400 hover:text-[#FFD700]">
                                    <Smile size={20} />
                                </button>
                            </div>
                            <button className="p-2.5 bg-gradient-to-r from-[#FFD700] to-[#DAA520] rounded-full text-black shadow-lg hover:scale-105 active:scale-95 transition-all">
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1100px] h-[650px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-200">

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#FFD700] text-black px-4 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-2">
                        <UserPlus size={16} />
                        {toastMessage}
                    </div>
                )}

                {/* Close Button */}
                <button
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

                    {chatTab === 'public' && (
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="p-3 border-b border-white/5">
                                <h4 className="text-white text-xs font-bold mb-2">線上玩家 ({ONLINE_PLAYERS.length})</h4>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {ONLINE_PLAYERS.map(player => (
                                    <div key={player.id} className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer">
                                        <div className={`w-8 h-8 rounded-full ${player.avatar} flex items-center justify-center border border-white/10`}>
                                            <UserIcon size={14} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-slate-200 text-sm font-bold">{player.name}</div>
                                            <div className="text-slate-500 text-[10px]">Level {player.level}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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

                    {chatTab === 'chat' && (
                        <div className="flex-1 flex flex-col min-h-0">
                            {/* Sidebar Tabs */}
                            <div className="p-4 pb-0">
                                <div className="flex p-1 bg-black/40 rounded-lg mb-3">
                                    <button
                                        onClick={() => setSidebarTab('friends')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${sidebarTab === 'friends' ? 'bg-[#FFD700] text-black shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        好友清單
                                    </button>
                                    <button
                                        onClick={() => setSidebarTab('chats')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${sidebarTab === 'chats' ? 'bg-[#FFD700] text-black shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        對話內容
                                    </button>
                                </div>
                            </div>

                            <div className="px-4 pb-3 border-b border-white/5">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={sidebarTab === 'friends' ? "搜尋好友 (Search Player)" : "搜尋內容 (Search History)"}
                                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto no-scrollbar">
                                {sidebarTab === 'chats' ? (
                                    /* Chat List Mode */
                                    FRIENDS.map(friend => (
                                        <div
                                            key={friend.id}
                                            onClick={() => {
                                                setChatTab('chat');
                                                setSelectedFriendId(friend.id);
                                            }}
                                            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors ${chatTab === 'chat' && selectedFriendId === friend.id ? 'bg-white/10 border-l-4 border-[#FFD700]' : 'border-l-4 border-transparent'}`}
                                        >
                                            <div className="relative">
                                                <div className={`w-10 h-10 rounded-full ${friend.avatar} flex items-center justify-center border border-white/20`}>
                                                    <UserIcon size={20} className="text-white/80" />
                                                </div>
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f061e] ${friend.status === 'online' ? 'bg-green-500' : friend.status === 'playing' ? 'bg-yellow-500' : 'bg-slate-500'}`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <span className={`text-sm font-bold truncate ${chatTab === 'chat' && selectedFriendId === friend.id ? 'text-[#FFD700]' : 'text-slate-200'}`}>
                                                        {friend.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">10:30</span>
                                                </div>
                                                <p className="text-xs text-slate-400 truncate">
                                                    {friend.status === 'playing' ? '正在遊玩: 雷神之錘' : friend.lastMsg}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    /* Friends List Mode (Simpler view) */
                                    FRIENDS.map(friend => (
                                        <div
                                            key={friend.id}
                                            onClick={() => {
                                                setSelectedFriendId(friend.id);
                                                // Switch sidebar to chats implies starting a chat, which is fine
                                            }}
                                            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 ${selectedFriendId === friend.id ? 'bg-white/5' : ''}`}
                                        >
                                            <div className="relative">
                                                <div className={`w-10 h-10 rounded-full ${friend.avatar} flex items-center justify-center border border-white/20`}>
                                                    <UserIcon size={20} className="text-white/80" />
                                                </div>
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f061e] ${friend.status === 'online' ? 'bg-green-500' : friend.status === 'playing' ? 'bg-yellow-500' : 'bg-slate-500'}`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm font-bold truncate text-slate-200`}>
                                                        {friend.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${friend.status === 'online' ? 'bg-green-500' : friend.status === 'playing' ? 'bg-yellow-500' : 'bg-slate-500'}`} />
                                                    <span className="text-[10px] text-slate-500 truncate">
                                                        {friend.status === 'online' ? 'Online' : friend.status === 'playing' ? 'Playing' : 'Offline'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="p-2 bg-white/5 rounded-full hover:bg-[#FFD700] hover:text-black transition-all group">
                                                <MessageCircle size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {renderRightPanel()}
            </div>
        </div>
    );
};

export default ChatInterface;
