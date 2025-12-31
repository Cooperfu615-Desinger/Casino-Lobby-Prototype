import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Crown, Shield } from 'lucide-react';
import { CLUB_CHAT_HISTORY } from '../../data/mockData';

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
        <div className="flex w-full h-full bg-[#120822] animate-in slide-in-from-right duration-300">

            {/* Left Panel: Club Info & Members */}
            <div className="w-[30%] bg-[#0f061e] border-r border-white/10 flex flex-col relative">
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="font-bold text-slate-300">Back</span>
                </div>

                <div className="p-6 flex flex-col items-center border-b border-white/5 bg-[#160b29]">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-[#1a0b2e] shadow-xl mb-3">
                        <Crown size={32} className="text-white" />
                    </div>
                    <h2 className="text-white font-bold text-lg text-center flex items-center gap-2">
                        皇家俱樂部
                        <Shield size={14} className="text-[#FFD700]" fill="currentColor" />
                    </h2>
                    <p className="text-slate-500 text-xs mt-1">ID: 888888</p>

                    <div className="flex gap-4 mt-4 w-full">
                        <div className="flex-1 bg-black/20 rounded-lg p-2 text-center border border-white/5">
                            <span className="block text-[#FFD700] font-bold text-sm">LV.5</span>
                            <span className="text-[10px] text-slate-500 uppercase">Level</span>
                        </div>
                        <div className="flex-1 bg-black/20 rounded-lg p-2 text-center border border-white/5">
                            <span className="block text-green-400 font-bold text-sm">48/50</span>
                            <span className="text-[10px] text-slate-500 uppercase">Members</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="text-xs text-slate-500 font-bold uppercase mb-3 px-2">Online Members</h3>
                    <div className="space-y-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group">
                                <div className="relative">
                                    <div className="w-8 h-8 bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`w-full h-full bg-gradient-to-br ${i === 1 ? 'from-yellow-400 to-yellow-600' : 'from-slate-500 to-slate-700'}`}></div>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0f061e]"></div>
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-bold ${i === 1 ? 'text-[#FFD700]' : 'text-slate-300'}`}>
                                        {i === 1 ? 'GodOfGamblers' : `Member_${99 + i}`}
                                    </p>
                                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400">Playing: Gates of Olympus</p>
                                </div>
                                {i === 1 && <Crown size={12} className="text-[#FFD700]" fill="currentColor" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel: Chat Window */}
            <div className="flex-1 flex flex-col bg-[#120822] relative">
                {/* Chat content background effect */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth relative z-10">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                        >
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

                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl relative group shadow-md ${msg.isMe
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none'
                                : msg.role === 'leader'
                                    ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border border-[#FFD700]/30 text-white rounded-tl-none shadow-[0_0_10px_rgba(255,215,0,0.1)]'
                                    : 'bg-[#2a1b3d] text-slate-200 rounded-tl-none border border-white/5'
                                }`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] absolute bottom-1 ${msg.isMe ? 'text-blue-200 left-[-35px]' : 'text-slate-500 right-[-35px]'
                                    } opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-[#1a0b2e] border-t border-white/10 shrink-0 relative z-20">
                    <form onSubmit={handleSend} className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message to club members..."
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
        </div>
    );
};

export default ClubChat;
