import { useState, type ReactNode } from 'react';
import { X, User as UserIcon, Crown, Pencil, Copy, ChevronRight, UserCog, Phone, Gem, Headphones, Save, ArrowLeft, Facebook, MessageCircle, UserCircle2, TrendingUp, Trophy, Flame, Gift, Check, Lock, Coins, Wallet, CalendarDays, HandCoins, Percent } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { USER_STATS, ACHIEVEMENTS, VIP_LEVEL_RULES, type Achievement } from '../../data/mockData';
import AvatarDisplay from '../common/AvatarDisplay';
import AvatarSelectModal from './AvatarSelectModal';

interface UserModalProps {
    onClose: () => void;
}

const UserModal = ({ onClose }: UserModalProps) => {
    const { user, updateUser } = useAuth();
    const { showToast } = useUI();
    const [activeView, setActiveView] = useState<'overview' | 'edit'>('overview');
    const [activeTab, setActiveTab] = useState<'info' | 'achievements'>('info');
    const [showAvatarSelect, setShowAvatarSelect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showVipPrivileges, setShowVipPrivileges] = useState(false);
    const [claimingId, setClaimingId] = useState<number | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

    // Account binding states
    const [boundAccounts, setBoundAccounts] = useState({
        phone: false,
        facebook: false,
        line: false,
        apple: false
    });
    const [bindingConfirm, setBindingConfirm] = useState<'phone' | 'facebook' | 'line' | 'apple' | null>(null);
    const [bindingLoading, setBindingLoading] = useState(false);

    // Mock Login Type
    const loginType = 'email' as 'email' | 'facebook' | 'line' | 'apple' | 'guest';

    // Form State
    const [nickname, setNickname] = useState(user?.name || '');
    const [bio, setBio] = useState('幸運女神眷顧我！');
    const [birthday, setBirthday] = useState('1990-01-01');
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('********');

    const currentVipLevel = Math.max(0, Math.min(user?.vipLevel ?? 0, 10));
    const currentVipRule = VIP_LEVEL_RULES.find((rule) => rule.level === currentVipLevel) ?? VIP_LEVEL_RULES[0];
    const nextVipRule = VIP_LEVEL_RULES.find((rule) => rule.level === Math.min(currentVipLevel + 1, 10)) ?? currentVipRule;
    const currentDeposit = user?.vipDepositTotal ?? 0;
    const currentBet = user?.vipBetTotal ?? 0;
    const depositProgress = nextVipRule.requiredDeposit > 0
        ? Math.min((currentDeposit / nextVipRule.requiredDeposit) * 100, 100)
        : 100;
    const betProgress = nextVipRule.requiredBet > 0
        ? Math.min((currentBet / nextVipRule.requiredBet) * 100, 100)
        : 100;
    const isMaxVipLevel = currentVipLevel >= 10;

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

    // Binding confirmation handler
    const handleBindConfirm = () => {
        if (!bindingConfirm) return;
        setBindingLoading(true);
        setTimeout(() => {
            setBoundAccounts(prev => ({ ...prev, [bindingConfirm]: true }));
            setBindingLoading(false);
            setBindingConfirm(null);
            const labels = { phone: '手機', facebook: 'Facebook', line: 'LINE', apple: 'Apple' };
            showToast(`${labels[bindingConfirm]} 綁定成功！`, 'success');
        }, 1000);
    };

    const bindingOptions = [
        { key: 'phone' as const, label: '綁定手機', icon: Phone, color: 'from-emerald-500 to-green-600', confirmText: '是否要綁定您的手機號碼？' },
        { key: 'facebook' as const, label: '綁定 FB', icon: Facebook, color: 'from-[#1877F2] to-[#1565C0]', confirmText: '是否要綁定您的 Facebook 帳號？' },
        { key: 'line' as const, label: '綁定 LINE', icon: MessageCircle, color: 'from-[#06C755] to-[#05A045]', confirmText: '是否要綁定您的 LINE 帳號？' },
        { key: 'apple' as const, label: '綁定 Apple', icon: null, color: 'from-gray-700 to-gray-900', confirmText: '是否要綁定您的 Apple ID？' }
    ];

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-4">
            <div className="w-full max-w-4xl bg-[#1a0b2e] rounded-3xl border border-white/10 shadow-2xl flex overflow-hidden max-h-[85vh]">

                {/* Sidebar / Left Info */}
                <div className="w-1/3 bg-[#120822] border-r border-white/10 p-8 flex flex-col items-center text-center relative">
                    <div className="relative group mb-4">
                        <div className="w-32 h-32 rounded-full border-4 border-[#FFD700] p-1 overflow-hidden bg-slate-800 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                            <AvatarDisplay avatarId={user?.avatarId} size="lg" />
                        </div>
                        <button
                            aria-label="更換頭像"
                            onClick={() => setShowAvatarSelect(true)}
                            className="absolute bottom-0 right-0 bg-[#FFD700] hover:bg-yellow-300 text-black p-2 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                        >
                            <Pencil size={15} />
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-1">{user?.name}</h2>
                    <div className="flex items-center gap-2 text-slate-400 text-xs bg-white/5 px-3 py-1 rounded-full mb-6">
                        ID: {user?.id} <button className="hover:text-white"><Copy size={12} /></button>
                    </div>

                    <div className="w-full space-y-4">
                        {/* Three Currency Display */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                            {/* Gold */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-sm">🪙</div>
                                    <span className="text-slate-400 text-sm">金幣</span>
                                </div>
                                <div className="text-[#FFD700] text-xl font-mono font-bold">{user?.balance.gold.toLocaleString()}</div>
                            </div>
                            {/* Silver */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-sm">🥈</div>
                                    <span className="text-slate-400 text-sm">銀幣</span>
                                </div>
                                <div className="text-slate-300 text-xl font-mono font-bold">{user?.balance.silver.toLocaleString()}</div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-white/10 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-xs">總資產 (折合金幣)</span>
                                    <div className="text-[#FFD700] text-lg font-mono font-bold">
                                        {user ? Math.floor(user.balance.gold + (user.balance.silver / 100)).toLocaleString() : '0'}
                                    </div>
                                </div>
                            </div>
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

                        {/* 2x2 Account Binding Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {bindingOptions.map((option) => {
                                const isBound = boundAccounts[option.key];
                                const IconComponent = option.icon;
                                return (
                                    <button
                                        key={option.key}
                                        onClick={() => !isBound && setBindingConfirm(option.key)}
                                        disabled={isBound}
                                        className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all border ${isBound
                                            ? 'bg-slate-700/50 text-slate-500 border-slate-600 cursor-default'
                                            : `bg-gradient-to-r ${option.color} text-white border-transparent hover:brightness-110 active:scale-95`
                                            }`}
                                    >
                                        {option.key === 'apple' ? (
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.09-.64 1.8.55 2.91 1.77 3.48 2.65-3.05 1.57-2.48 5.67.65 6.94-.9 2.14-2.18 4.25-3.3 5.28zM14.99 4.26c.7-1.33 2.13-2.16 3.6-2.26.17 1.6-1.12 3.23-2.41 3.73-1.07.45-2.24-.04-2.61-1.46.46 0 .96.02 1.42-.01z" />
                                            </svg>
                                        ) : IconComponent ? (
                                            <IconComponent size={16} />
                                        ) : null}
                                        {isBound ? (
                                            <span className="flex items-center gap-1">
                                                <Check size={12} /> 已綁定
                                            </span>
                                        ) : (
                                            <span>{option.label}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content / Right Info */}
                <div className="flex-1 p-6 bg-gradient-to-br from-[#1a0b2e] to-[#2a1b42] relative flex flex-col">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 z-10"
                        title="關閉"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    {activeView === 'overview' ? (
                        <div className="flex flex-col h-full">
                            {/* Tab Navigation - with right margin for close button */}
                            <div className="flex gap-2 mb-4 mr-10">
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
                                                    VIP {currentVipLevel}
                                                </button>
                                            </div>
                                            <div className="bg-black/20 text-black font-bold px-3 py-1 rounded-lg backdrop-blur-sm text-xs">
                                                {isMaxVipLevel ? '最高等級' : `目標 VIP ${nextVipRule.level}`}
                                            </div>
                                        </div>

                                        <div className="relative z-10 space-y-3">
                                            <VipProgressRow
                                                icon={<Wallet size={16} className="text-black/70" />}
                                                label="累積儲值"
                                                currentValue={currentDeposit}
                                                targetValue={nextVipRule.requiredDeposit}
                                                progress={depositProgress}
                                                isMaxLevel={isMaxVipLevel}
                                            />
                                            <VipProgressRow
                                                icon={<TrendingUp size={16} className="text-black/70" />}
                                                label="累積投注"
                                                currentValue={currentBet}
                                                targetValue={nextVipRule.requiredBet}
                                                progress={betProgress}
                                                isMaxLevel={isMaxVipLevel}
                                            />
                                            <p className="text-xs text-black/65">
                                                {isMaxVipLevel
                                                    ? '已達 VIP 10，當前享有最高等級獎勵與權益。'
                                                    : `需同時達成累積儲值與累積投注條件，即可升級至 VIP ${nextVipRule.level}。`}
                                            </p>
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

            {/* Binding Confirmation Modal */}
            {bindingConfirm && (
                <div
                    className="absolute inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => !bindingLoading && setBindingConfirm(null)}
                >
                    <div
                        className="bg-gradient-to-br from-[#2a1b42] to-[#1a0b2e] rounded-2xl p-6 border border-white/20 shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white mb-4 text-center">帳號綁定</h3>
                        <p className="text-slate-300 text-center mb-6">
                            {bindingOptions.find(o => o.key === bindingConfirm)?.confirmText}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setBindingConfirm(null)}
                                disabled={bindingLoading}
                                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleBindConfirm}
                                disabled={bindingLoading}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {bindingLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                        綁定中...
                                    </>
                                ) : (
                                    '確認'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIP Privileges Overlay */}
            {showVipPrivileges && (
                <div
                    className="absolute inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setShowVipPrivileges(false)}
                >
                    <div
                        className="bg-gradient-to-br from-[#2a1b42] to-[#1a0b2e] rounded-2xl p-6 border border-[#FFD700]/30 shadow-2xl max-w-4xl w-full mx-4 animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                                <Crown size={24} className="text-black" />
                            </div>
                            <div>
                                <div className="text-[#FFD700] font-black text-xl">VIP 等級說明</div>
                                <div className="text-slate-400 text-xs">顯示 VIP 0 ~ VIP 10 的升級條件與對應獎勵</div>
                            </div>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar pr-1 space-y-3">
                            {VIP_LEVEL_RULES.map((rule) => (
                                <div
                                    key={rule.level}
                                    className={`rounded-xl border p-4 ${rule.level === currentVipLevel
                                        ? 'border-[#FFD700]/50 bg-[#FFD700]/10'
                                        : 'border-white/10 bg-white/5'}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="text-[#FFD700] font-black text-lg">VIP {rule.level}</div>
                                            <div className="mt-1 text-xs text-slate-400">
                                                {rule.level === currentVipLevel ? '目前等級' : `升級目標等級`}
                                            </div>
                                        </div>
                                        <div className="text-right text-xs text-slate-400">
                                            <div>累積儲值：<span className="font-bold text-white">{rule.requiredDeposit.toLocaleString()}</span></div>
                                            <div className="mt-1">累積投注：<span className="font-bold text-white">{rule.requiredBet.toLocaleString()}</span></div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                        {rule.rewards.map((reward) => (
                                            <div key={`${rule.level}-${reward.label}`} className="rounded-lg bg-black/20 p-3 border border-white/5">
                                                <div className="flex items-center gap-2 text-[#FFD700] text-xs font-bold">
                                                    {getRewardIcon(reward.label)}
                                                    <span>{reward.label}</span>
                                                </div>
                                                <div className="mt-2 text-sm font-black text-white">{reward.value}</div>
                                            </div>
                                        ))}
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

            {/* Avatar Select Modal — overlays on top of UserModal */}
            {showAvatarSelect && (
                <AvatarSelectModal onClose={() => setShowAvatarSelect(false)} />
            )}
        </div>
    );
};

interface VipProgressRowProps {
    icon: ReactNode;
    label: string;
    currentValue: number;
    targetValue: number;
    progress: number;
    isMaxLevel: boolean;
}

const VipProgressRow = ({ icon, label, currentValue, targetValue, progress, isMaxLevel }: VipProgressRowProps) => (
    <div className="rounded-xl bg-black/15 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-black/80">
                {icon}
                <span className="text-sm font-bold">{label}</span>
            </div>
            <span className="text-xs font-bold text-black/70">
                {isMaxLevel
                    ? `${currentValue.toLocaleString()} / MAX`
                    : `${currentValue.toLocaleString()} / ${targetValue.toLocaleString()}`}
            </span>
        </div>
        <div className="mt-2 h-2.5 rounded-full bg-black/20 overflow-hidden">
            <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${isMaxLevel ? 100 : progress}%` }}
            />
        </div>
    </div>
);

const getRewardIcon = (label: string) => {
    switch (label) {
        case '送銀幣':
            return <Coins size={14} />;
        case '手續費減免':
            return <Percent size={14} />;
        case '月月收獎':
            return <CalendarDays size={14} />;
        case '發財金':
            return <HandCoins size={14} />;
        case '登入禮':
            return <Gift size={14} />;
        default:
            return <Crown size={14} />;
    }
};

export default UserModal;
