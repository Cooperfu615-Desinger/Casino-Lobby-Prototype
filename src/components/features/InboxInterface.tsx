import { useState } from 'react';
import { Mail, Clock, Trash2, X } from 'lucide-react';
import { INBOX_MESSAGES } from '../../data/mockData';

interface InboxInterfaceProps {
    onClose: () => void;
}

const InboxInterface = ({ onClose }: InboxInterfaceProps) => {
    const [selectedMsgId, setSelectedMsgId] = useState(1);
    const selectedMsg = INBOX_MESSAGES.find(m => m.id === selectedMsgId);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal Container */}
            <div className="relative w-[90%] max-w-[1000px] h-[600px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left Panel: Message List */}
                <div className="w-[35%] bg-[#0f061e] border-r border-white/10 flex flex-col">
                    <div className="h-14 flex items-center px-4 border-b border-white/5 gap-2">
                        <Mail size={18} className="text-[#FFD700]" />
                        <span className="text-white font-bold text-sm">收件夾</span>
                        <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">4 則訊息</span>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {INBOX_MESSAGES.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMsgId(msg.id)}
                                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedMsgId === msg.id ? 'bg-white/10 border-l-4 border-l-[#FFD700]' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${msg.type === 'system' ? 'border-red-500 text-red-400' :
                                        msg.type === 'promo' ? 'border-yellow-500 text-yellow-400' :
                                            'border-blue-500 text-blue-400'
                                        }`}>
                                        {msg.type === 'system' ? '系統' : msg.type === 'promo' ? '活動' : '通知'}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{msg.date}</span>
                                </div>
                                <h4 className={`text-sm font-bold mb-1 truncate ${!msg.read ? 'text-white' : 'text-slate-400'}`}>
                                    {!msg.read && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>}
                                    {msg.title}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{msg.content}</p>
                            </div>
                        ))}
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
                            </div>
                            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#1a0b2e]">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-slate-400 hover:text-white hover:border-white transition-colors text-xs font-bold">
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
