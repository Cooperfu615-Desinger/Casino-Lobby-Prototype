import { useState, useCallback } from 'react';
import {
    X, Crown, Users, LogIn, PlusCircle, ChevronRight,
    Delete, Gem, Lock, LogOut, Info, ListChecks, Trophy,
    Shield, UserPlus, Bell, Check, Loader2, Star, Medal
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

interface ClubInterfaceProps {
    onClose: () => void;
}

// Mock club data
const MOCK_CLUB = {
    name: '皇家俱樂部',
    level: 18,
    levelProgress: 65,
    memberCount: 48,
    maxMembers: 50,
    announcement: '🎉 本週挑戰開啟！目標：總押碼量突破 5,000,000！達成即可獲得專屬獎勵，大家一起努力！',
    leaders: ['會長小明', '副會長小華'],
};

// Mock member data
const MOCK_MEMBERS = [
    { id: 1, name: '會長小明', role: 'leader', vipLevel: 12, lastOnline: '在線', avatar: '👑' },
    { id: 2, name: '副會長小華', role: 'vice', vipLevel: 10, lastOnline: '在線', avatar: '⭐' },
    { id: 3, name: 'LuckyPlayer88', role: 'member', vipLevel: 8, lastOnline: '5 分鐘前', avatar: '🎮' },
    { id: 4, name: '財神爺', role: 'member', vipLevel: 7, lastOnline: '1 小時前', avatar: '💰' },
    { id: 5, name: 'SlotMaster', role: 'member', vipLevel: 6, lastOnline: '3 小時前', avatar: '🎰' },
    { id: 6, name: '歐皇轉世', role: 'member', vipLevel: 5, lastOnline: '昨天', avatar: '🌟' },
];

// Mock mission data
const MOCK_MISSIONS = [
    { id: 1, title: '今日總押碼量', target: '1,000,000', current: '856,420', progress: 85, reward: '10,000 金幣', completed: false },
    { id: 2, title: '成員登入人數', target: '30 人', current: '28 人', progress: 93, reward: '5,000 金幣', completed: false },
    { id: 3, title: '本週勝率挑戰', target: '60%', current: '62%', progress: 100, reward: '20,000 金幣', completed: true },
];

// Mock ranking data
const MOCK_RANKINGS = [
    { rank: 1, name: '會長小明', score: '2,450,000', avatar: '👑' },
    { rank: 2, name: '財神爺', score: '1,890,000', avatar: '💰' },
    { rank: 3, name: 'LuckyPlayer88', score: '1,625,000', avatar: '🎮' },
    { rank: 4, name: '副會長小華', score: '1,420,000', avatar: '⭐' },
    { rank: 5, name: 'SlotMaster', score: '980,000', avatar: '🎰' },
    { rank: 6, name: '歐皇轉世', score: '756,000', avatar: '🌟' },
];

// Mock recommended clubs for non-members
const MOCK_RECOMMENDED_CLUBS = [
    { id: 1, name: '新手樂園', members: 35, maxMembers: 50, level: 5, description: '歡迎新手加入，互相學習！' },
    { id: 2, name: '高手俱樂部', members: 48, maxMembers: 50, level: 25, description: 'VIP5以上，競技為主' },
    { id: 3, name: '休閒娛樂社', members: 20, maxMembers: 50, level: 8, description: '輕鬆遊戲，歡樂至上' },
];

/**
 * ClubInterface - 俱樂部系統進階原型
 * 
 * 包含內部導航 (Sub-Tabs) 與權限示範：
 * - 資訊分頁：俱樂部 Logo、等級進度條、今日公告
 * - 成員分頁：成員列表（職位/等級/在線時間）
 * - 任務分頁：團體任務與領取獎勵
 * - 排行分頁：成員貢獻排行
 * 
 * 權限系統（以註解說明）：
 * - userRole: 'leader' | 'member' | 'guest'
 * - 會長可見：審核申請、修改公告按鈕
 * - 成員可見：基本資訊、退出俱樂部按鈕
 * - 訪客可見：推薦列表、申請加入按鈕
 */
const ClubInterface = ({ onClose }: ClubInterfaceProps) => {
    const { showToast } = useUI();

    // ========================================================================
    // 權限狀態說明（實際開發時應從 AuthContext 或 API 取得）
    // userRole: 'leader' - 會長/副會長，可管理俱樂部
    // userRole: 'member' - 一般成員，僅可查看與參與
    // userRole: 'guest' - 尚未加入俱樂部
    // ========================================================================
    const [userRole, setUserRole] = useState<'leader' | 'member' | 'guest'>('guest');

    const [clubModal, setClubModal] = useState<'join' | 'create' | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'members' | 'missions' | 'ranking'>('info');
    const [joinCode, setJoinCode] = useState('');
    const [claimedMissions, setClaimedMissions] = useState<Set<number>>(new Set());
    const [claimingId, setClaimingId] = useState<number | null>(null);
    const [joiningClubId, setJoiningClubId] = useState<number | null>(null);

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
            setUserRole('member');
            showToast('成功加入俱樂部！', 'success');
        }
    };

    const handleCreateSubmit = () => {
        setClubModal(null);
        setUserRole('leader');
        showToast('俱樂部創建成功！', 'success');
    };

    /**
     * 申請加入推薦俱樂部
     * 觸發 Loading -> Toast -> 狀態變更
     */
    const handleApplyJoin = useCallback(async (clubId: number) => {
        if (joiningClubId !== null) return;

        setJoiningClubId(clubId);
        await new Promise(resolve => setTimeout(resolve, 800));

        setJoiningClubId(null);
        setUserRole('member');
        showToast('申請成功！已加入俱樂部', 'success');
    }, [joiningClubId, showToast]);

    /**
     * 領取任務獎勵
     * 點擊 -> Loading (0.5s) -> Toast -> 按鈕變更
     */
    const handleClaimMission = useCallback(async (missionId: number) => {
        if (claimedMissions.has(missionId) || claimingId !== null) return;

        setClaimingId(missionId);
        await new Promise(resolve => setTimeout(resolve, 500));

        setClaimedMissions(prev => new Set([...prev, missionId]));
        setClaimingId(null);
        showToast('任務獎勵已領取！', 'success');
    }, [claimedMissions, claimingId, showToast]);

    const handleLeaveClub = () => {
        setUserRole('guest');
        setActiveTab('info');
        showToast('已退出俱樂部', 'info');
    };

    // ========================================================================
    // Sub-Tab Navigation
    // ========================================================================
    const TabNavigation = () => (
        <div className="h-14 border-b border-white/10 flex items-center px-6 bg-[#1a0b2e] gap-1">
            {[
                { key: 'info', label: '資訊', icon: Info },
                { key: 'members', label: '成員', icon: Users },
                { key: 'missions', label: '任務', icon: ListChecks },
                { key: 'ranking', label: '排行', icon: Trophy },
            ].map(tab => (
                <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === tab.key
                        ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
                {/* 會長專屬：審核申請按鈕 */}
                {userRole === 'leader' && (
                    <button
                        onClick={() => showToast('審核功能開發中', 'info')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors text-xs font-bold"
                    >
                        <UserPlus size={14} />
                        審核申請 <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">3</span>
                    </button>
                )}
                {/* 會長專屬：修改公告按鈕 */}
                {userRole === 'leader' && (
                    <button
                        onClick={() => showToast('公告修改功能開發中', 'info')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors text-xs font-bold"
                    >
                        <Bell size={14} />
                        修改公告
                    </button>
                )}
                {/* 成員：退出俱樂部按鈕 */}
                {userRole === 'member' && (
                    <button
                        onClick={handleLeaveClub}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-bold"
                    >
                        <LogOut size={14} />
                        退出俱樂部
                    </button>
                )}
            </div>
        </div>
    );

    // ========================================================================
    // 資訊分頁
    // ========================================================================
    const InfoTab = () => (
        <div className="flex-1 p-6 flex gap-6">
            {/* Left: Club Info */}
            <div className="flex-1 flex flex-col gap-4">
                {/* Club Header */}
                <div className="bg-[#2a1b42] rounded-2xl p-6 border border-white/10 flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-2xl">
                        <Crown size={48} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-white mb-2">{MOCK_CLUB.name}</h2>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-400 flex items-center gap-1">
                                <Users size={14} /> {MOCK_CLUB.memberCount}/{MOCK_CLUB.maxMembers} 成員
                            </span>
                            <span className="text-[#FFD700] flex items-center gap-1">
                                <Star size={14} /> Lv.{MOCK_CLUB.level}
                            </span>
                        </div>
                        {/* Level Progress */}
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">俱樂部等級進度</span>
                                <span className="text-[#FFD700]">{MOCK_CLUB.levelProgress}%</span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#FFD700] to-amber-500 rounded-full transition-all"
                                    style={{ width: `${MOCK_CLUB.levelProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Announcement */}
                <div className="bg-[#2a1b42] rounded-2xl p-6 border border-white/10 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell size={18} className="text-[#FFD700]" />
                        <h3 className="text-white font-bold">今日公告</h3>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <p className="text-slate-300 text-sm leading-relaxed">{MOCK_CLUB.announcement}</p>
                    </div>
                </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="w-72 flex flex-col gap-4">
                <div className="bg-[#2a1b42] rounded-2xl p-5 border border-white/10">
                    <h4 className="text-slate-400 text-xs font-bold mb-3">俱樂部領導</h4>
                    <div className="space-y-2">
                        {MOCK_MEMBERS.filter(m => m.role !== 'member').map(member => (
                            <div key={member.id} className="flex items-center gap-3 bg-black/20 rounded-lg p-2">
                                <span className="text-2xl">{member.avatar}</span>
                                <div>
                                    <p className="text-white font-bold text-sm">{member.name}</p>
                                    <p className="text-xs text-[#FFD700]">{member.role === 'leader' ? '會長' : '副會長'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#2a1b42] rounded-2xl p-5 border border-white/10 flex-1">
                    <h4 className="text-slate-400 text-xs font-bold mb-3">今日活躍</h4>
                    <div className="text-center py-4">
                        <p className="text-4xl font-black text-white">28</p>
                        <p className="text-slate-400 text-sm">位成員在線</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // ========================================================================
    // 成員分頁
    // ========================================================================
    const MembersTab = () => (
        <div className="flex-1 p-6">
            <div className="bg-[#2a1b42] rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-bold">成員列表</h3>
                    <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">
                        {MOCK_MEMBERS.length} 位成員
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-black/20 sticky top-0">
                            <tr className="text-xs text-slate-400">
                                <th className="text-left py-3 px-4 font-bold">成員</th>
                                <th className="text-center py-3 px-4 font-bold">職位</th>
                                <th className="text-center py-3 px-4 font-bold">VIP 等級</th>
                                <th className="text-right py-3 px-4 font-bold">最後在線</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_MEMBERS.map(member => (
                                <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{member.avatar}</span>
                                            <span className="text-white font-medium">{member.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${member.role === 'leader' ? 'bg-[#FFD700]/20 text-[#FFD700]' :
                                            member.role === 'vice' ? 'bg-purple-500/20 text-purple-400' :
                                                'bg-white/10 text-slate-400'
                                            }`}>
                                            {member.role === 'leader' ? '會長' : member.role === 'vice' ? '副會長' : '成員'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="text-[#FFD700] font-bold">VIP {member.vipLevel}</span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className={`text-sm ${member.lastOnline === '在線' ? 'text-green-400' : 'text-slate-500'}`}>
                                            {member.lastOnline === '在線' && <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse" />}
                                            {member.lastOnline}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // ========================================================================
    // 任務分頁
    // ========================================================================
    const MissionsTab = () => (
        <div className="flex-1 p-6">
            <div className="grid gap-4">
                {MOCK_MISSIONS.map(mission => (
                    <div key={mission.id} className="bg-[#2a1b42] rounded-2xl p-5 border border-white/10 flex items-center gap-6">
                        <div className="w-16 h-16 bg-[#FFD700]/20 rounded-xl flex items-center justify-center">
                            <ListChecks size={32} className="text-[#FFD700]" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-1">{mission.title}</h4>
                            <div className="flex items-center gap-4 text-sm mb-2">
                                <span className="text-slate-400">目標：{mission.target}</span>
                                <span className="text-[#FFD700]">當前：{mission.current}</span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${mission.progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`}
                                    style={{ width: `${Math.min(mission.progress, 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[#FFD700] font-bold text-lg mb-2">{mission.reward}</p>
                            {mission.progress >= 100 ? (
                                <button
                                    onClick={() => handleClaimMission(mission.id)}
                                    disabled={claimedMissions.has(mission.id) || claimingId === mission.id}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all min-w-[80px] ${claimedMissions.has(mission.id)
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : claimingId === mission.id
                                            ? 'bg-slate-600 text-slate-300 cursor-wait'
                                            : 'bg-gradient-to-r from-[#FFD700] to-amber-500 text-black hover:brightness-110 active:scale-95'
                                        }`}
                                >
                                    {claimedMissions.has(mission.id) ? (
                                        <span className="flex items-center gap-1"><Check size={14} /> 已領取</span>
                                    ) : claimingId === mission.id ? (
                                        <Loader2 size={16} className="animate-spin mx-auto" />
                                    ) : (
                                        '領取'
                                    )}
                                </button>
                            ) : (
                                <span className="text-slate-500 text-sm">{mission.progress}% 完成</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ========================================================================
    // 排行分頁
    // ========================================================================
    const RankingTab = () => (
        <div className="flex-1 p-6">
            <div className="bg-[#2a1b42] rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Trophy size={18} className="text-[#FFD700]" />
                        本週貢獻排行
                    </h3>
                    <span className="text-xs text-slate-400">統計截止：週日 23:59</span>
                </div>
                <div className="flex-1 p-4 space-y-3">
                    {MOCK_RANKINGS.map(player => (
                        <div key={player.rank} className={`flex items-center gap-4 p-4 rounded-xl transition-all ${player.rank <= 3 ? 'bg-gradient-to-r from-[#FFD700]/10 to-transparent border border-[#FFD700]/20' : 'bg-black/20'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${player.rank === 1 ? 'bg-[#FFD700] text-black' :
                                player.rank === 2 ? 'bg-slate-300 text-black' :
                                    player.rank === 3 ? 'bg-orange-400 text-black' :
                                        'bg-white/10 text-slate-400'
                                }`}>
                                {player.rank <= 3 ? <Medal size={20} /> : player.rank}
                            </div>
                            <span className="text-2xl">{player.avatar}</span>
                            <div className="flex-1">
                                <p className="text-white font-bold">{player.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[#FFD700] font-bold">{player.score}</p>
                                <p className="text-slate-500 text-xs">押碼貢獻</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ========================================================================
    // 訪客視角：推薦俱樂部列表
    // ========================================================================
    const GuestView = () => (
        <div className="flex-1 flex flex-col bg-[#160b29]">
            <div className="h-14 border-b border-white/10 flex items-center px-6 bg-[#1a0b2e]">
                <h2 className="text-white font-bold">推薦俱樂部</h2>
                <span className="ml-3 text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">尚未加入任何俱樂部</span>
            </div>
            <div className="flex-1 p-6">
                <div className="grid gap-4 mb-6">
                    {MOCK_RECOMMENDED_CLUBS.map(club => (
                        <div key={club.id} className="bg-[#2a1b42] rounded-2xl p-5 border border-white/10 flex items-center gap-5">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center border border-white/20">
                                <Crown size={28} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold text-lg">{club.name}</h4>
                                <p className="text-slate-400 text-sm mb-1">{club.description}</p>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-slate-500"><Users size={12} className="inline mr-1" />{club.members}/{club.maxMembers}</span>
                                    <span className="text-[#FFD700]"><Star size={12} className="inline mr-1" />Lv.{club.level}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleApplyJoin(club.id)}
                                disabled={joiningClubId === club.id}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${joiningClubId === club.id
                                    ? 'bg-slate-600 text-slate-300 cursor-wait'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:brightness-110 active:scale-95'
                                    }`}
                            >
                                {joiningClubId === club.id ? <Loader2 size={16} className="animate-spin" /> : '申請加入'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => {
                            setClubModal('join');
                            setJoinCode('');
                        }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors font-bold"
                    >
                        <LogIn size={18} />
                        輸入邀請碼加入
                    </button>
                    <button
                        onClick={() => setClubModal('create')}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-bold"
                    >
                        <PlusCircle size={18} />
                        創建新俱樂部
                    </button>
                </div>
            </div>
        </div>
    );

    // ========================================================================
    // Modals
    // ========================================================================
    const ClubJoinModal = () => (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
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
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
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

    // ========================================================================
    // Main Render
    // ========================================================================
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-[90%] max-w-[1150px] h-[650px] bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[100] bg-black/40 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="關閉俱樂部"
                >
                    <X size={20} />
                </button>

                {clubModal === 'join' && <ClubJoinModal />}
                {clubModal === 'create' && <ClubCreateModal />}

                {/* 根據使用者角色顯示不同視圖 */}
                {userRole === 'guest' ? (
                    <GuestView />
                ) : (
                    <>
                        {/* Club Header */}
                        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-gradient-to-r from-[#2a1b42] to-[#1a0b2e] pr-16">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                                    <Crown size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg leading-tight">{MOCK_CLUB.name}</h2>
                                    <p className="text-xs text-slate-400 flex items-center gap-2">
                                        <Users size={10} /> {MOCK_CLUB.memberCount}/{MOCK_CLUB.maxMembers} 成員
                                        <span className="text-[#FFD700]">• Lv.{MOCK_CLUB.level}</span>
                                    </p>
                                </div>
                            </div>
                            {userRole === 'leader' && (
                                <span className="bg-[#FFD700]/20 text-[#FFD700] text-xs font-bold px-3 py-1 rounded-full border border-[#FFD700]/30 flex items-center gap-1">
                                    <Shield size={12} /> 會長
                                </span>
                            )}
                        </div>

                        {/* Tab Navigation */}
                        <TabNavigation />

                        {/* Tab Content */}
                        {activeTab === 'info' && <InfoTab />}
                        {activeTab === 'members' && <MembersTab />}
                        {activeTab === 'missions' && <MissionsTab />}
                        {activeTab === 'ranking' && <RankingTab />}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClubInterface;
