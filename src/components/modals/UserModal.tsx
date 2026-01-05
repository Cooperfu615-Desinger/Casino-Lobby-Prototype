import { useState } from 'react';
import { X, User as UserIcon, Crown, Camera, Copy, ChevronRight, UserCog, Phone, Gem, Headphones, Save, ArrowLeft, Facebook, MessageCircle, UserCircle2, TrendingUp, Trophy, Flame, Gift, Check, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { USER_STATS, ACHIEVEMENTS, VIP_PRIVILEGES, type Achievement } from '../../data/mockData';

interface UserModalProps {
    onClose: () => void;
}

const UserModal = ({ onClose }: UserModalProps) => {
    const { user, updateUser } = useAuth();
    const { showToast } = useUI();
    const [activeView, setActiveView] = useState<'overview' | 'edit'>('overview');
    const [activeTab, setActiveTab] = useState<'info' | 'achievements'>('info');
    const [isLoading, setIsLoading] = useState(false);
    const [showVipPrivileges, setShowVipPrivileges] = useState(false);
    const [claimingId, setClaimingId] = useState<number | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

    // Mock Login Type
    const loginType = 'email' as 'email' | 'facebook' | 'line' | 'apple' | 'guest';

    // Form State
    const [nickname, setNickname] = useState(user?.name || '');
    const [bio, setBio] = useState('幸運女神眷顧我！');
    const [birthday, setBirthday] = useState('1990-01-01');
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('********');

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            updateUser({ name: nickname });
            setIsLoading(false);
            showToast('資料已更新！', 'success');
            setActiveView('overview');
        }, 500);
    };

    const handleClaimAchievement = (id: number) => {
        setClaimingId(id);
        setTimeout(() => {
            setAchievements(prev => prev.map(a =>
                a.id === id ? { ...a, claimed: true } : a
            ));
            setClaimingId(null);
            showToast('領取獎勵成功！', 'success');
        }, 500);
    };

    // VIP Progress: Level 15 -> 16, 75%
    const vipProgress = 75;
    const currentExp = 75000;
    const requiredExp = 100000;

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-4">
            <div className="w-full max-w-4xl bg-[#1a0b2e] rounded-3xl border border-white/10 shadow-2xl flex overflow-hidden max-h-[85vh]">

                {/* Sidebar / Left Info */}
                <div className="w-1/3 bg-[#120822] border-r border-white/10 p-8 flex flex-col items-center text-center relative">
                    <div className="relative group mb-4">
                        <div className="w-32 h-32 rounded-full border-4 border-[#FFD700] p-1 overflow-hidden bg-slate-800 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                            <div className={`w-full h-full rounded-full ${user?.avatar || 'bg-slate-600'} flex items-center justify-center`}>
                                <UserIcon size={64} className="text-white" />
                            </div>
                        </div>
                        <button className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg hover:bg-slate-200 transition-colors">
                            <Camera size={16} />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                    <div className="flex items-center gap-2 text-slate-400 text-xs bg-white/5 px-3 py-1 rounded-full mb-6">
                        ID: {user?.id} <button className="hover:text-white"><Copy size={12} /></button>
                    </div>

                    <div className="w-full space-y-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="text-slate-400 text-xs mb-1">總資產</div>
                            <div className="text-[#FFD700] text-2xl font-mono font-bold">{user?.balance.toLocaleString()}</div>
                        </div>

                        <button
                            onClick={() => setActiveView('edit')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors border ${activeView === 'edit' ? 'bg-white/20 text-white border-white/30' : 'text-slate-300 hover:bg-white/5 hover:text-white border-transparent hover:border-white/10'}`}
                        >
                            <div className="flex items-center gap-3">
                                <UserCog size={20} />
                                <span>修改資料</span>
                            </div>
                            <ChevronRight size={16} />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white border border-transparent hover:border-white/10">
                            <div className="flex items-center gap-3">
                                <Phone size={20} />
                                <span>綁定手機</span>
                            </div>
                            <span className="text-xs text-red-400">未綁定</span>
                        </button>
                    </div>
                </div>

                {/* Main Content / Right Info */}
                <div className="flex-1 p-6 bg-gradient-to-br from-[#1a0b2e] to-[#2a1b42] relative flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 z-10"
                    >
                        <X size={24} />
                    </button>

                    {activeView === 'overview' ? (
                        <div className="flex flex-col h-full">
                            {/* Tab Navigation */}
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'info' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                >
                                    📊 資訊
                                </button>
                                <button
                                    onClick={() => setActiveTab('achievements')}
                                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'achievements' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                >
                                    🏆 成就
                                </button>
                            </div>

                            {activeTab === 'info' ? (
                                <div className="flex-1 flex flex-col">
                                    {/* VIP Card */}
                                    <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-5 shadow-xl mb-4 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                                        <div className="absolute -right-10 -top-10 text-black/10 group-hover:scale-110 transition-transform duration-700">
                                            <Crown size={140} />
                                        </div>

                                        <div className="relative z-10 flex justify-between items-start mb-4">
                                            <div>
                                                <div className="text-black/60 font-bold text-xs tracking-widest mb-1">CURRENT LEVEL</div>
                                                <button
                                                    onClick={() => setShowVipPrivileges(true)}
                                                    className="text-black font-black text-3xl italic hover:underline cursor-pointer"
                                                >
                                                    VIP 15
                                                </button>
                                            </div>
                                            <div className="bg-black/20 text-black font-bold px-3 py-1 rounded-lg backdrop-blur-sm text-xs">
                                                特權已激活
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between text-xs font-bold text-black/70 mb-1">
                                                <span>升級進度 → VIP 16</span>
                                                <span>{currentExp.toLocaleString()} / {requiredExp.toLocaleString()} ({vipProgress}%)</span>
                                            </div>
                                            <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-white rounded-full transition-all duration-500"
                                                    style={{ width: `${vipProgress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-black/60 mt-1">再獲得 {(requiredExp - currentExp).toLocaleString()} 經驗值即可升級</p>
                                        </div>
                                    </div>

                                    {/* Stats Cards */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                                <TrendingUp size={16} className="text-white" />
                                            </div>
                                            <div className="text-slate-400 text-xs mb-1">累積總贏分</div>
                                            <div className="text-white font-bold text-lg">{USER_STATS.totalWin.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                                <Trophy size={16} className="text-white" />
                                            </div>
                                            <div className="text-slate-400 text-xs mb-1">最高贏分紀錄</div>
                                            <div className="text-white font-bold text-lg">{USER_STATS.maxWin.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
                                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                                                <Flame size={16} className="text-white" />
                                            </div>
                                            <div className="text-slate-400 text-xs mb-1">連續登入天數</div>
                                            <div className="text-white font-bold text-lg">{USER_STATS.dailyStreak} 天</div>
                                        </div>
                                    </div>

                                    {/* Privileges */}
                                    <h4 className="text-white font-bold mb-2 text-sm">我的特權</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black shadow-lg shrink-0">
                                                <Gem size={18} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-sm">每日紅利</div>
                                                <div className="text-slate-400 text-xs">+15% 額外加成</div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/10">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-lg shrink-0">
                                                <Headphones size={18} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-sm">專屬客服</div>
                                                <div className="text-slate-400 text-xs">優先處理通道</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Achievements Tab */
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <Trophy className="text-[#FFD700]" size={20} /> 成就牆
                                    </h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {achievements.map((achievement) => (
                                            <div
                                                key={achievement.id}
                                                className={`rounded-xl p-3 border text-center transition-all ${achievement.achieved
                                                        ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30'
                                                        : 'bg-white/5 border-white/10 opacity-60 grayscale'
                                                    }`}
                                            >
                                                <div className="text-3xl mb-2">{achievement.icon}</div>
                                                <div className={`font-bold text-sm mb-1 ${achievement.achieved ? 'text-white' : 'text-slate-400'}`}>
                                                    {achievement.title}
                                                </div>
                                                <div className="text-xs text-slate-400 mb-2">
                                                    {achievement.achieved ? achievement.description : achievement.condition}
                                                </div>

                                                {achievement.achieved && (
                                                    <div className="mt-2">
                                                        {achievement.claimed ? (
                                                            <div className="flex items-center justify-center gap-1 text-green-400 text-xs font-bold">
                                                                <Check size={12} /> 已領取
                                                            </div>
                                                        ) : claimingId === achievement.id ? (
                                                            <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs">
                                                                <div className="w-3 h-3 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                                                                領取中...
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleClaimAchievement(achievement.id)}
                                                                className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                <Gift size={12} /> 領取 {achievement.reward.toLocaleString()}
                                                            </button>
                                                        )}
                                                    </div>
                                                )}

                                                {!achievement.achieved && (
                                                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mt-2">
                                                        <Lock size={12} /> 未達成
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right duration-300 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setActiveView('overview')} className="text-slate-400 hover:text-white transition-colors">
                                    <ArrowLeft size={24} />
                                </button>
                                <h3 className="text-xl font-bold text-white">編輯個人檔案</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Nickname */}
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">暱稱 (Nickname)</label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                        placeholder="輸入暱稱"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold uppercase mb-2">個人簡介 (Bio)</label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors h-24 resize-none"
                                        placeholder="介紹一下自己..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Birthday */}
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold uppercase mb-2">生日 (Birthday)</label>
                                        <input
                                            type="date"
                                            value={birthday}
                                            onChange={(e) => setBirthday(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                        />
                                    </div>

                                    {/* Email */}
                                    {loginType === 'email' && (
                                        <div>
                                            <label className="block text-slate-400 text-xs font-bold uppercase mb-2">電子信箱 (Email)</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors opacity-50 cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic Login Provider Section */}
                                <div>
                                    {loginType === 'email' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">帳號 (Account)</label>
                                                <input
                                                    type="text"
                                                    value="yota_player01"
                                                    disabled
                                                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg p-3 text-slate-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">密碼 (Password)</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-white text-black border border-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-colors font-bold"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {loginType === 'facebook' && (
                                        <div className="bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-xl p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white">
                                                <Facebook size={24} fill="white" />
                                            </div>
                                            <div>
                                                <div className="text-[#1877F2] font-bold text-sm">已連結 Facebook 帳號</div>
                                                <div className="text-white font-bold text-lg">YotaTest999</div>
                                            </div>
                                        </div>
                                    )}

                                    {loginType === 'line' && (
                                        <div className="bg-[#06C755]/10 border border-[#06C755]/30 rounded-xl p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#06C755] rounded-full flex items-center justify-center text-white">
                                                <MessageCircle size={24} fill="white" />
                                            </div>
                                            <div>
                                                <div className="text-[#06C755] font-bold text-sm">已連結 LINE 帳號</div>
                                                <div className="text-white font-bold text-lg">YotaTest777</div>
                                            </div>
                                        </div>
                                    )}

                                    {loginType === 'apple' && (
                                        <div className="bg-white/5 border border-white/20 rounded-xl p-4 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black">
                                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.09-.64 1.8.55 2.91 1.77 3.48 2.65-3.05 1.57-2.48 5.67.65 6.94-.9 2.14-2.18 4.25-3.3 5.28zM14.99 4.26c.7-1.33 2.13-2.16 3.6-2.26.17 1.6-1.12 3.23-2.41 3.73-1.07.45-2.24-.04-2.61-1.46.46 0 .96.02 1.42-.01z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-slate-300 font-bold text-sm">已連結 Apple ID</div>
                                                <div className="text-white font-bold text-lg">YotaTest777</div>
                                            </div>
                                        </div>
                                    )}

                                    {loginType === 'guest' && (
                                        <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-slate-300">
                                                    <UserCircle2 size={24} />
                                                </div>
                                                <div>
                                                    <div className="text-slate-400 font-bold text-sm">當前身份</div>
                                                    <div className="text-white font-bold text-lg">遊客帳號 (Guest)</div>
                                                </div>
                                            </div>
                                            <button className="bg-[#FFD700] hover:bg-[#DAA520] text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-colors">
                                                綁定帳號
                                            </button>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-4 border-t border-white/10 mt-8">
                                        <button
                                            onClick={() => setActiveView('overview')}
                                            className="flex-1 py-3 px-4 rounded-xl text-slate-300 font-bold hover:bg-white/5 transition-colors"
                                        >
                                            取消
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                    更新中...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    儲存變更
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* VIP Privileges Overlay */}
            {showVipPrivileges && (
                <div
                    className="absolute inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowVipPrivileges(false)}
                >
                    <div
                        className="bg-gradient-to-br from-[#2a1b42] to-[#1a0b2e] rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                                <Crown size={24} className="text-black" />
                            </div>
                            <div>
                                <div className="text-[#FFD700] font-black text-xl">VIP 15</div>
                                <div className="text-slate-400 text-xs">當前等級特權</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {VIP_PRIVILEGES.map((privilege) => (
                                <div key={privilege.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
                                    <span className="text-2xl">{privilege.icon}</span>
                                    <div>
                                        <div className="text-white font-bold text-sm">{privilege.title}</div>
                                        <div className="text-slate-400 text-xs">{privilege.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowVipPrivileges(false)}
                            className="w-full mt-4 py-2 rounded-lg bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors"
                        >
                            關閉
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserModal;
