import { X, FileText, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TRANSACTION_HISTORY } from '../data/mockData';

interface HistoryModalProps {
    onClose: () => void;
}

const HistoryModal = ({ onClose }: HistoryModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-[#1a0b2e] border border-[#FFD700]/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 px-6 py-5 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#FFD700]/20 rounded-lg">
                            <FileText size={24} className="text-[#FFD700]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-wide">帳戶交易明細</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable Table */}
                <div className="overflow-auto flex-1 p-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-sm uppercase">
                                <th className="pb-3 pl-2 font-medium">交易單號</th>
                                <th className="pb-3 font-medium">時間</th>
                                <th className="pb-3 font-medium">類型</th>
                                <th className="pb-3 font-medium">金額</th>
                                <th className="pb-3 font-medium text-right pr-2">狀態</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {TRANSACTION_HISTORY.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="py-4 pl-2 text-slate-300 font-mono text-xs">{tx.id}</td>
                                    <td className="py-4 text-white text-sm">
                                        {tx.date.split(' ')[0]} <span className="text-slate-500 text-xs ml-1">{tx.date.split(' ')[1]}</span>
                                    </td>
                                    <td className="py-4 text-white">
                                        <div className="flex items-center gap-2">
                                            {tx.type === 'Deposit' ? (
                                                <ArrowDownLeft size={16} className="text-green-500" />
                                            ) : (
                                                <ArrowUpRight size={16} className="text-red-500" />
                                            )}
                                            <span className={tx.type === 'Deposit' ? 'text-green-400' : 'text-red-400'}>
                                                {tx.type === 'Deposit' ? '儲值' : '提現'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-white font-bold tracking-wide">
                                        {tx.amount}
                                    </td>
                                    <td className="py-4 pr-2 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'Success'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {tx.status === 'Success' ? '成功' : '處理中'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
