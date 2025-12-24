import { useState } from 'react';
import {
    X, Crown, Users, LogIn, PlusCircle, ChevronRight,
    MessageCircle, Trophy, Gamepad2, Delete, Gem, Lock, LogOut
} from 'lucide-react';

const ClubInterface = () => {
    const [clubModal, setClubModal] = useState<'join' | 'create' | null>(null);
    const [clubView, setClubView] = useState<'initial' | 'dashboard'>('initial');
    const [joinCode, setJoinCode] = useState('');

    const handleDigitClick = (digit: string) => {
        if (joinCode.length < 6) {
            setJoinCode(prev => prev + digit);
        }
    };

    const handleDelete = () => {
        setJoinCode(prev => prev.slice(0, -1));
    };

    const handleJoinSubmit = () => {
        if (joinCode.length === 6) {
            setClubModal(null);
            setClubView('dashboard');
        }
    };

    const handleCreateSubmit = () => {
        setClubModal(null);
        setClubView('dashboard');
    };

    const ClubDashboard = () => (
        <div className="flex-1 flex flex-col h-full bg-[#160b29] animate-in fade-in duration-300">
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#1a0b2e]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                        <Crown size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg leading-tight">皇家俱樂部</h2>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Users size={10} /> 48/50 成員
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setClubView('initial')}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                    title="離開俱樂部"
                >
                    <LogOut size={20} />
                </button>
            </div>

            <div className="flex-1 p-8 flex items-center justify-center gap-6">
                <button className="group relative w-48 h-64 bg-[#2a1b42] hover:bg-[#342252] border border-white/10 hover:border-blue-500/50 rounded-3xl p-6 flex flex-col items-center justify-center transition-all shadow-xl hover:-translate-y-2">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <MessageCircle size={40} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">俱樂部聊天</h3>
                    <p className="text-xs text-slate-400 text-center">與成員交流戰術<br />分享中獎喜悅</p>
                </button>

                <button className="group relative w-48 h-64 bg-[#2a1b42] hover:bg-[#342252] border border-white/10 hover:border-[#FFD700]/50 rounded-3xl p-6 flex flex-col items-center justify-center transition-all shadow-xl hover:-translate-y-2">
                    <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                        <Trophy size={40} className="text-[#FFD700]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">俱樂部獎勵</h3>
                    <p className="text-xs text-slate-400 text-center">領取每日津貼<br />賽季結算獎勵</p>
                    <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
                </button>

                <button className="group relative w-48 h-64 bg-[#2a1b42] hover:bg-[#342252] border border-white/10 hover:border-red-500/50 rounded-3xl p-6 flex flex-col items-center justify-center transition-all shadow-xl hover:-translate-y-2">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                        <Gamepad2 size={40} className="text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">俱樂部活動</h3>
                    <p className="text-xs text-slate-400 text-center">參與團體競賽<br />爭奪最強榮耀</p>
                </button>
            </div>
        </div>
    );

    const ClubJoinModal = () => (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-sm bg-[#1a0b2e] border-2 border-blue-500/50 rounded-3xl p-6 flex flex-col items-center relative shadow-2xl">
                <button
                    onClick={() => {
                        setClubModal(null);
                        setJoinCode('');
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-bold text-white mb-4">輸入邀請碼</h3>

                <div className="flex gap-2 mb-6 justify-center w-full">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div key={idx} className={`w-10 h-12 bg-black/40 border ${joinCode[idx] ? 'border-blue-500' : 'border-white/10'} rounded-lg flex items-center justify-center text-xl font-mono text-white transition-colors`}>
                            {joinCode[idx] || ''}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-3 w-full mb-6 px-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleDigitClick(num.toString())}
                            className="h-12 bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold text-lg active:scale-95 transition-all border border-white/5"
                        >
                            {num}
                        </button>
                    ))}
                    <div className="h-12"></div>
                    <button
                        onClick={() => handleDigitClick('0')}
                        className="h-12 bg-white/5 hover:bg-white/10 rounded-lg text-white font-bold text-lg active:scale-95 transition-all border border-white/5"
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className="h-12 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white flex items-center justify-center active:scale-95 transition-all border border-white/5"
                    >
                        <Delete size={20} />
                    </button>
                </div>

                <button
                    onClick={handleJoinSubmit}
                    disabled={joinCode.length !== 6}
                    className={`w-full font-bold py-3 rounded-xl shadow-lg transition-all ${joinCode.length === 6
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-blue-500/30 active:scale-95'
                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    確認加入
                </button>
            </div>
        </div>
    );

    const ClubCreateModal = () => (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-lg bg-[#1a0b2e] border-2 border-green-500/50 rounded-2xl flex flex-col relative shadow-2xl max-h-full">
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <PlusCircle className="text-green-500" size={20} />
                        創建俱樂部
                    </h3>
                    <button
                        onClick={() => setClubModal(null)}
                        className="text-slate-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center cursor-pointer hover:border-green-500 hover:bg-white/10 transition-all mb-2">
                                <PlusCircle size={28} className="text-slate-500" />
                            </div>
                            <span className="text-xs text-slate-400">上傳徽章</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">名稱</label>
                        <input type="text" placeholder="俱樂部名稱..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">類型</label>
                            <div className="relative">
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 appearance-none">
                                    <option className="bg-[#1a0b2e]">休閒娛樂</option>
                                    <option className="bg-[#1a0b2e]">競技比賽</option>
                                    <option className="bg-[#1a0b2e]">高額投注</option>
                                </select>
                                <ChevronRight className="absolute right-3 top-3 text-slate-500 rotate-90" size={14} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">限制條件</label>
                            <div className="relative">
                                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 appearance-none">
                                    <option className="bg-[#1a0b2e]">無限制</option>
                                    <option className="bg-[#1a0b2e]">VIP 3 以上</option>
                                    <option className="bg-[#1a0b2e]">需審核</option>
                                </select>
                                <Lock className="absolute right-3 top-3 text-slate-500" size={14} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-bold mb-1.5 uppercase">簡述</label>
                        <textarea placeholder="寫點什麼來吸引成員..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"></textarea>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 flex gap-4 bg-[#150923] rounded-b-2xl">
                    <div className="flex-1 flex flex-col justify-center">
                        <span className="text-slate-400 text-xs">創建費用</span>
                        <span className="text-[#FFD700] font-bold flex items-center gap-1">
                            <Gem size={14} /> 500
                        </span>
                    </div>
                    <button
                        onClick={handleCreateSubmit}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-green-500/30 active:scale-95 transition-all"
                    >
                        立即創建
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="absolute top-[130px] bottom-[90px] left-0 right-0 z-20 flex bg-[#120822] border-t border-white/10 animate-in fade-in zoom-in-95 duration-300">
            {clubModal === 'join' && <ClubJoinModal />}
            {clubModal === 'create' && <ClubCreateModal />}

            {clubView === 'dashboard' ? (
                <ClubDashboard />
            ) : (
                <div className="flex-1 flex items-center justify-center bg-[#160b29] relative p-8">
                    <div className="grid grid-cols-2 gap-8 w-full max-w-2xl px-8">
                        <div
                            onClick={() => {
                                setClubModal('join');
                                setJoinCode('');
                            }}
                            className="group bg-[#2a1b42] hover:bg-[#342252] border border-white/10 hover:border-blue-500/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all shadow-xl hover:-translate-y-2 h-72"
                        >
                            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                                <LogIn size={48} className="text-blue-400" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 italic tracking-wide">加入俱樂部</h3>
                            <p className="text-base text-slate-400 text-center leading-relaxed">
                                輸入邀請碼<br />與好友一起並肩作戰
                            </p>
                        </div>

                        <div
                            onClick={() => setClubModal('create')}
                            className="group bg-[#2a1b42] hover:bg-[#342252] border border-white/10 hover:border-green-500/50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all shadow-xl hover:-translate-y-2 h-72"
                        >
                            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                <PlusCircle size={48} className="text-green-400" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-3 italic tracking-wide">創建俱樂部</h3>
                            <p className="text-base text-slate-400 text-center leading-relaxed">
                                建立屬於你的王國<br />招募夥伴共享榮耀
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubInterface;
