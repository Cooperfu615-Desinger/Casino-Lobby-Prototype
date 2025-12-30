import { useState } from 'react';
import { X, Send, User, Coins, ArrowRight, AlertTriangle, ShieldCheck, Wallet } from 'lucide-react';

interface TransferModalProps {
    onClose: () => void;
}

const CONSTANTS = {
    FEE_RATE: 0.01,
    DAILY_LIMIT_LEFT: 2,
    DAILY_LIMIT_TOTAL: 10,
    PLAYER_LEVEL: 8,
    MOCK_BALANCE: 123456789
};

const TransferModal = ({ onClose }: TransferModalProps) => {
    const [step, setStep] = useState<'input' | 'confirm'>('input');
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState<number | ''>('');

    const numericAmount = Number(amount) || 0;
    const fee = Math.floor(numericAmount * CONSTANTS.FEE_RATE);
    const actualTotal = numericAmount + fee; // "Actual Transfer Out" usually implies Amount + Fee deducted from balance, OR Amount is total and fee is deducted from it. 
    // Requirement says: "Fee Preview: System Fee ... Actual Transfer Out".
    // AND in Step 2: "Actual Received: (Amount - Fee)".
    // Let's interpret: User enters Amount to SEND. Fee is deducted from that amount for the receiver.
    // So if I send 100, Fee is 1, Receiver gets 99. My balance decreases by 100.
    // Let's stick to the prompt description for Step 2: "Actual Received: $XXX (Amount - Fee)".
    // And for Step 1: "Actual Transfer Out" -> This is likely "Total deducted from balance" which is just the Amount entered (if fee is internal) OR Amount + Fee (if fee is external).
    // Let's assume Fee is inclusive in the deduction or exclusive?
    // User Prompt Step 1: "Actual转出 (Actual Rollout?)" could mean Amount. 
    // User Prompt Step 2: "Actual Received (Amount - Fee)".
    // This implies the Input Amount is what leaves the sender's wallet.

    // Let's refine based on typical casino logic:
    // User types 100.
    // Balance - 100.
    // Fee = 1.
    // Receiver + 99.

    const actualReceived = Math.max(0, numericAmount - fee);

    const handleConfirm = () => {
        console.log({
            type: 'TRANSFER',
            to: receiverId,
            amount: numericAmount,
            fee,
            received: actualReceived,
            timestamp: new Date().toISOString()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-[90%] max-w-[500px] bg-gradient-to-b from-[#1a0b2e] to-[#2d1b4e] border border-[#FFD700]/30 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-0 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                {/* Header Graphic */}
                <div className="relative h-32 bg-gradient-to-b from-[#4B0082]/50 to-transparent flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#FFD700] blur-[100px] opacity-20 pointer-events-none"></div>

                    <div className="flex flex-col items-center z-10 mt-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#DAA520] p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                            <div className="w-full h-full rounded-full bg-[#1a0b2e] flex items-center justify-center">
                                {step === 'input' ? (
                                    <Send size={32} className="text-[#FFD700] ml-1" />
                                ) : (
                                    <ShieldCheck size={32} className="text-green-400" />
                                )}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white mt-3 tracking-wide">
                            {step === 'input' ? '轉帳中心' : '確認轉帳資訊'}
                        </h2>
                    </div>
                </div>

                <div className="p-6 pt-2">
                    {step === 'input' ? (
                        <div className="space-y-6">
                            {/* Info Card */}
                            <div className="bg-black/30 border border-white/5 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">My Balance</span>
                                    <div className="flex items-center gap-2 text-[#FFD700] font-mono font-bold text-lg">
                                        <Wallet size={16} />
                                        ${CONSTANTS.MOCK_BALANCE.toLocaleString()}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded text-center">
                                        Lv.{CONSTANTS.PLAYER_LEVEL}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        今日剩餘: {CONSTANTS.DAILY_LIMIT_LEFT}/{CONSTANTS.DAILY_LIMIT_TOTAL}
                                    </span>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs text-slate-300 ml-1 font-medium">接收者 ID (Receiver ID)</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={receiverId}
                                            onChange={(e) => setReceiverId(e.target.value)}
                                            placeholder="請輸入玩家 ID"
                                            className="w-full bg-[#0f0518] border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFD700] transition-colors shadow-inner"
                                        />
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#FFD700] transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs text-slate-300 ml-1 font-medium">轉帳金額 (Amount)</label>
                                    <div className="bg-[#0f0518] border border-white/10 rounded-xl p-4 shadow-inner space-y-4">
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => {
                                                    const val = e.target.value === '' ? '' : Number(e.target.value);
                                                    if (val === '' || (val >= 0 && val <= CONSTANTS.MOCK_BALANCE)) {
                                                        setAmount(val);
                                                    }
                                                }}
                                                placeholder="0"
                                                className="w-full bg-transparent text-center text-3xl font-bold text-[#FFD700] placeholder:text-white/10 focus:outline-none"
                                            />
                                            <div className="flex justify-center mt-1">
                                                <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded">MAX: {CONSTANTS.MOCK_BALANCE.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Slider */}
                                        <div className="px-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max={CONSTANTS.MOCK_BALANCE}
                                                step="1000"
                                                value={numericAmount}
                                                onChange={(e) => setAmount(Number(e.target.value))}
                                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                                            />
                                            <div className="flex justify-between mt-2">
                                                <button onClick={() => setAmount(0)} className="text-[10px] text-slate-500 hover:text-white transition-colors">0%</button>
                                                <button onClick={() => setAmount(Math.floor(CONSTANTS.MOCK_BALANCE * 0.25))} className="text-[10px] text-slate-500 hover:text-white transition-colors">25%</button>
                                                <button onClick={() => setAmount(Math.floor(CONSTANTS.MOCK_BALANCE * 0.5))} className="text-[10px] text-slate-500 hover:text-white transition-colors">50%</button>
                                                <button onClick={() => setAmount(Math.floor(CONSTANTS.MOCK_BALANCE * 0.75))} className="text-[10px] text-slate-500 hover:text-white transition-colors">75%</button>
                                                <button onClick={() => setAmount(CONSTANTS.MOCK_BALANCE)} className="text-[10px] text-slate-500 hover:text-white transition-colors">MAX</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Preview */}
                            <div className="bg-white/5 rounded-lg p-3 space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>系統手續費 (1%)</span>
                                    <span className="text-red-400 font-mono">-${fee.toLocaleString()}</span>
                                </div>
                                <div className="w-full h-px bg-white/10"></div>
                                <div className="flex justify-between text-sm font-bold text-slate-200">
                                    <span>預計扣款</span>
                                    <span className="text-white font-mono">${numericAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Action */}
                            <button
                                onClick={() => setStep('confirm')}
                                disabled={!receiverId || numericAmount <= 0}
                                className="w-full bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
                            >
                                <span>下一步</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 items-start">
                                <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                                <p className="text-xs text-yellow-200/80 leading-relaxed">
                                    請仔細核對轉帳資訊。交易一旦確認即無法撤回。系統將自動扣除手續費。
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500 ml-1">轉帳對象 (To)</span>
                                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                            <User size={20} className="text-slate-300" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold">{receiverId}</span>
                                            <span className="text-[10px] text-green-400">Verified User</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500 ml-1">交易明細 (Details)</span>
                                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">轉帳金額</span>
                                            <span className="text-white font-mono font-bold">${numericAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">系統手續費</span>
                                            <span className="text-red-400 font-mono">-${fee.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-px bg-white/10 my-1"></div>
                                        <div className="flex justify-between text-base">
                                            <span className="text-[#FFD700] font-bold">對方實收</span>
                                            <span className="text-[#FFD700] font-mono font-bold">${actualReceived.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep('input')}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3.5 rounded-xl transition-colors"
                                >
                                    返回修改
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-[2] bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-black font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:brightness-110 active:scale-95 transition-all"
                                >
                                    確認轉移
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransferModal;
