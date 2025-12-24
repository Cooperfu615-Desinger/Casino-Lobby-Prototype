import { X, User as UserIcon, Crown, Camera, Copy, ChevronRight, UserCog, Phone, Gem, Headphones } from 'lucide-react';

interface UserModalProps {
    onClose: () => void;
}

const UserModal = ({ onClose }: UserModalProps) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300 p-4">
        <div className="w-full max-w-4xl bg-[#1a0b2e] rounded-3xl border border-white/10 shadow-2xl flex overflow-hidden max-h-[85vh]">

            {/* Sidebar / Left Info */}
            <div className="w-1/3 bg-[#120822] border-r border-white/10 p-8 flex flex-col items-center text-center relative">
                <div className="relative group mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-[#FFD700] p-1 overflow-hidden bg-slate-800 shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                            <UserIcon size={64} className="text-white" />
                        </div>
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white text-black p-2 rounded-full shadow-lg hover:bg-slate-200 transition-colors">
                        <Camera size={16} />
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">奧黛麗一本...</h2>
                <div className="flex items-center gap-2 text-slate-400 text-xs bg-white/5 px-3 py-1 rounded-full mb-6">
                    ID: 123456789 <button className="hover:text-white"><Copy size={12} /></button>
                </div>

                <div className="w-full space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <div className="text-slate-400 text-xs mb-1">總資產</div>
                        <div className="text-[#FFD700] text-2xl font-mono font-bold">1,234,567</div>
                    </div>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white border border-transparent hover:border-white/10">
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
            <div className="flex-1 p-8 bg-gradient-to-br from-[#1a0b2e] to-[#2a1b42] relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Crown className="text-[#FFD700]" /> VIP 會員中心
                </h3>

                {/* VIP Card */}
                <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl p-6 shadow-xl mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                    <div className="absolute -right-10 -top-10 text-black/10 group-hover:scale-110 transition-transform duration-700">
                        <Crown size={180} />
                    </div>

                    <div className="relative z-10 flex justify-between items-start mb-8">
                        <div>
                            <div className="text-black/60 font-bold text-sm tracking-widest mb-1">CURRENT LEVEL</div>
                            <div className="text-black font-black text-4xl italic">VIP 7</div>
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
                        <p className="text-xs text-black/60 mt-2">再獲得 55,000 經驗值即可升級至 VIP 8</p>
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
            </div>
        </div>
    </div>
);

export default UserModal;
