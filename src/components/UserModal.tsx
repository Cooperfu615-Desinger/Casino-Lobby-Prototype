import { useState } from 'react';
import { X, User as UserIcon, Crown, Camera, Copy, ChevronRight, UserCog, Phone, Gem, Headphones, Save, ArrowLeft, Facebook, MessageCircle, UserCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserModalProps {
    onClose: () => void;
}

const UserModal = ({ onClose }: UserModalProps) => {
    const { user, updateUser } = useAuth();
    const [activeView, setActiveView] = useState<'overview' | 'edit'>('overview');
    const [isLoading, setIsLoading] = useState(false);

    // Mock Login Type: 'email' | 'facebook' | 'line' | 'apple' | 'guest'
    // Use 'as' casting to prevent TypeScript from narrowing this constant to the literal 'email'
    const loginType = 'email' as 'email' | 'facebook' | 'line' | 'apple' | 'guest';

    // Form State
    const [nickname, setNickname] = useState(user?.name || '');
    const [bio, setBio] = useState('幸運女神眷顧我！');
    const [birthday, setBirthday] = useState('1990-01-01');
    const [email, setEmail] = useState('user@example.com');
    // Initialize password with the mock value "********"
    const [password, setPassword] = useState('********');

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            updateUser({ name: nickname });
            setIsLoading(false);
            alert('資料已更新！'); // Simple feedback as requested
            setActiveView('overview');
        }, 500);
    };

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
                <div className="flex-1 p-8 bg-gradient-to-br from-[#1a0b2e] to-[#2a1b42] relative overflow-y-auto custom-scrollbar">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 z-10"
                    >
                        <X size={24} />
                    </button>

                    {activeView === 'overview' ? (
                        <>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Crown className="text-[#FFD700]" /> VIP 會員中心
                            </h3>

                            {/* VIP Card */}
                            <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-xl mb-8 relative overflow-hidden group h-[200px]">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                                <div className="absolute -right-10 -top-10 text-black/10 group-hover:scale-110 transition-transform duration-700">
                                    <Crown size={180} />
                                </div>

                                <div className="relative z-10 flex justify-between items-start mb-8">
                                    <div>
                                        <div className="text-black/60 font-bold text-sm tracking-widest mb-1">CURRENT LEVEL</div>
                                        <div className="text-black font-black text-4xl italic">VIP {user?.vipLevel}</div>
                                    </div>
                                    <div className="bg-black/20 text-black font-bold px-3 py-1 rounded-lg backdrop-blur-sm text-xs">
                                        特權已激活
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between text-xs font-bold text-black/70 mb-1">
                                        <span>經驗值</span>
                                        <span>45,000 / 100,000</span>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full w-[45%] bg-white rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-black/60 mt-2">再獲得 55,000 經驗值即可升級至 VIP {user?.vipLevel ? user.vipLevel + 1 : 1}</p>
                                </div>
                            </div>

                            <h4 className="text-white font-bold mb-4">我的特權</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black shadow-lg">
                                        <Gem size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">每日紅利</div>
                                        <div className="text-slate-400 text-xs">+15% 額外加成</div>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white shadow-lg">
                                        <Headphones size={20} />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">專屬客服</div>
                                        <div className="text-slate-400 text-xs">優先處理通道</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="animate-in slide-in-from-right duration-300">
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
                                            {/* Account (Read-only) */}
                                            <div>
                                                <label className="block text-slate-400 text-xs font-bold uppercase mb-2">帳號 (Account)</label>
                                                <input
                                                    type="text"
                                                    value="yota_player01"
                                                    disabled
                                                    className="w-full bg-slate-800/50 border border-white/5 rounded-lg p-3 text-slate-400 cursor-not-allowed"
                                                />
                                            </div>
                                            {/* Password (Editable) */}
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
        </div>
    );
};

export default UserModal;
