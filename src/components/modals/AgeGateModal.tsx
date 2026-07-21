import { ShieldCheck, X } from 'lucide-react';

interface AgeGateModalProps {
    onContinue: () => void;
}

const AgeGateModal = ({ onContinue }: AgeGateModalProps) => (
    <div
        className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) onContinue();
        }}
    >
        <div className="relative w-full max-w-[460px] overflow-hidden rounded-[30px] border border-white/25 bg-gradient-to-br from-[#888fff] via-[#5b63e8] to-[#393f9d] p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.7),0_0_52px_rgba(139,92,246,0.3)] animate-in zoom-in-95 duration-200">
            <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#FFD700]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-purple-950/35 blur-3xl" />

            <button
                type="button"
                aria-label="關閉年齡提示"
                onClick={onContinue}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-95"
            >
                <X size={18} />
            </button>

            <div className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border-[3px] border-white/80 bg-gradient-to-br from-[#FFE77A] to-[#E8A817] text-2xl font-black text-[#2b1500] shadow-[0_12px_28px_rgba(0,0,0,0.3),0_0_24px_rgba(255,215,0,0.32)]">
                    18+
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-white/70">
                    <ShieldCheck size={16} />
                    <span className="text-[11px] font-black tracking-[0.24em]">RESPONSIBLE PLAY</span>
                </div>

                <h1 id="age-gate-title" className="mt-3 text-2xl font-black tracking-[0.12em] text-white drop-shadow-md">
                    限制級提示
                </h1>

                <p className="mx-auto mt-5 max-w-[350px] text-[15px] font-bold leading-7 text-white/90">
                    本 APP 於遊戲軟體分級為限制級。進入註冊、登入及遊戲大廳前，請確認您已年滿 18 歲。
                </p>

                <button
                    type="button"
                    onClick={onContinue}
                    className="mt-7 flex min-h-14 w-full items-center justify-center rounded-2xl border border-white/80 bg-gradient-to-b from-[#A3FFD1] to-[#1AB16D] px-5 text-base font-black tracking-wide text-white shadow-[0_10px_26px_rgba(4,82,49,0.34)] transition-all hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.99]"
                >
                    我已年滿 18 歲，繼續
                </button>

                <p className="mt-4 text-xs font-semibold text-white/55">
                    請理性娛樂，未滿 18 歲請勿使用本服務。
                </p>
            </div>
        </div>
    </div>
);

export default AgeGateModal;
