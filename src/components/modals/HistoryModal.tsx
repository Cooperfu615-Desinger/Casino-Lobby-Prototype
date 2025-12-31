import { useState } from 'react';
import { X, FileText, ArrowUpRight, ArrowDownLeft, Filter, RefreshCw } from 'lucide-react';
import { TRANSACTION_HISTORY } from '../../data/mockData';

interface HistoryModalProps {
    onClose: () => void;
}

type TabType = 'deposit' | 'withdraw' | 'rebate' | 'progress';

const HistoryModal = ({ onClose }: HistoryModalProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('deposit');

    const filteredData = TRANSACTION_HISTORY.filter(item => {
        if (activeTab === 'progress') return item.status === 'processing';
        return item.type === activeTab;
    });

    const getTabLabel = (tab: TabType) => {
        switch (tab) {
            case 'deposit': return '儲值';
            case 'withdraw': return '提款';
            case 'rebate': return '返水';
            case 'progress': return '進度查詢';
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Modal */}
            <div className="relative w-[90%] max-w-4xl bg-[#1a0b2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-6 py-5 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#FFD700]/20 rounded-lg">
                            <FileText size={24} className="text-[#FFD700]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">帳戶交易明細</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 p-4 border-b border-white/5 bg-black/20 overflow-x-auto">
                    {(['deposit', 'withdraw', 'rebate', 'progress'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 scale-105'
                                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {getTabLabel(tab)}
                        </button>
                    ))}
                </div>

                {/* Content - Scrollable Table */}
                <div className="overflow-auto flex-1 p-6">
                    {filteredData.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm uppercase">
                                    <th className="pb-3 pl-2 font-medium">交易單號</th>
                                    <th className="pb-3 font-medium">時間</th>
                                    <th className="pb-3 font-medium">類型</th>
                                    <th className="pb-3 font-medium">
                                        {activeTab === 'withdraw' || activeTab === 'rebate' || activeTab === 'deposit' ? '來源/渠道' : '方式'}
                                    </th>
                                    <th className="pb-3 font-medium">金額</th>
                                    <th className="pb-3 font-medium text-right pr-2">狀態</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredData.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-2 text-slate-300 font-mono text-xs">{tx.id}</td>
                                        <td className="py-4 text-white text-sm">
                                            {tx.date.split(' ')[0]} <span className="text-slate-500 text-xs ml-1">{tx.date.split(' ')[1]}</span>
                                        </td>
                                        <td className="py-4 text-white">
                                            <div className="flex items-center gap-2">
                                                {tx.type === 'deposit' && <ArrowDownLeft size={16} className="text-green-500" />}
                                                {tx.type === 'withdraw' && <ArrowUpRight size={16} className="text-red-500" />}
                                                {tx.type === 'rebate' && <RefreshCw size={16} className="text-yellow-500" />}

                                                <span className={`capitalize ${tx.type === 'deposit' ? 'text-green-400' : tx.type === 'withdraw' ? 'text-red-400' : 'text-yellow-400'}`}>
                                                    {tx.type === 'deposit' ? '儲值' : tx.type === 'withdraw' ? '提現' : '返水'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-slate-300 text-sm">
                                            {tx.method}
                                        </td>
                                        <td className="py-4 text-white font-bold tracking-wide">
                                            {tx.amount}
                                        </td>
                                        <td className="py-4 pr-2 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'success'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : tx.status === 'processing'
                                                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                }`}>
                                                {tx.status === 'success' ? '成功' : tx.status === 'processing' ? '處理中' : '失敗'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                            <Filter size={48} className="mb-4 opacity-20" />
                            <p>尚無相關紀錄</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-black/40 px-6 py-4 border-t border-white/5 flex justify-between items-center text-xs text-slate-500">
                    <span>只顯示最近 30 天的交易紀錄</span>
                    <span>如有疑問請聯繫客服</span>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
