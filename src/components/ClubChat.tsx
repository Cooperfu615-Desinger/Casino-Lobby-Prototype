import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Users, Crown, Shield } from 'lucide-react';
import { CLUB_CHAT_HISTORY } from '../data/mockData';

interface ClubChatProps {
    onBack: () => void;
}

const ClubChat = ({ onBack }: ClubChatProps) => {
    const [messages, setMessages] = useState(CLUB_CHAT_HISTORY);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: messages.length + 1,
            sender: 'Me',
            text: newMessage,
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: 'member' as const
        };

        setMessages([...messages, msg]);
        setNewMessage('');
    };

    return (
        <div className="flex flex-col h-full bg-[#120822] animate-in slide-in-from-right duration-300">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 bg-[#1a0b2e] border-b border-white/10 shrink-0 shadow-md z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            <Shield size={18} className="text-[#FFD700]" />
                            皇家俱樂部
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-green-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span>28 人在線</span>
                        </div>
                    </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors border border-white/5">
                    <Users size={20} className="text-slate-300" />
                </button>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                    >
                        {/* Sender Name */}
                        {!msg.isMe && (
                            <div className="flex items-center gap-1.5 mb-1 ml-1">
                                {msg.role === 'leader' && <Crown size={12} className="text-[#FFD700]" fill="currentColor" />}
                                <span className={`text-xs font-bold ${msg.role === 'leader' ? 'text-[#FFD700]' :
                                        msg.role === 'admin' ? 'text-blue-400' : 'text-slate-400'
                                    }`}>
                                    {msg.sender}
                                </span>
                            </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl relative group ${msg.isMe
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none'
                                : msg.role === 'leader'
                                    ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border border-[#FFD700]/30 text-white rounded-tl-none shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                    : 'bg-[#2a1b3d] text-slate-200 rounded-tl-none'
                            }`}>
                            <p className="tex-sm leading-relaxed">{msg.text}</p>
                            <span className={`text-[10px] absolute bottom-1 ${msg.isMe ? 'text-blue-200 left-[-35px]' : 'text-slate-500 right-[-35px]'
                                } opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                                {msg.time}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a0b2e] border-t border-white/10 shrink-0">
                <form onSubmit={handleSend} className="flex gap-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="輸入訊息..."
                        className="flex-1 bg-black/40 text-white placeholder-slate-500 px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClubChat;
