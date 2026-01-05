import React, { useState, useEffect } from 'react';
import { UserCircle2 } from 'lucide-react';

interface AppleLoginModalProps {
    onClose: () => void;
    onLogin: () => void;
}

type Status = 'connecting' | 'confirm' | 'logging_in';

// Apple logo SVG component
const AppleLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.15 4.09-.64 1.8.55 2.91 1.77 3.48 2.65-3.05 1.57-2.48 5.67.65 6.94-.9 2.14-2.18 4.25-3.3 5.28zM14.99 4.26c.7-1.33 2.13-2.16 3.6-2.26.17 1.6-1.12 3.23-2.41 3.73-1.07.45-2.24-.04-2.61-1.46.46 0 .96.02 1.42-.01z" fill="currentColor" />
    </svg>
);

const AppleLoginModal: React.FC<AppleLoginModalProps> = ({ onClose, onLogin }) => {
    const [status, setStatus] = useState<Status>('connecting');

    // Auto-transition from connecting to confirm
    useEffect(() => {
        if (status === 'connecting') {
            const timer = setTimeout(() => {
                setStatus('confirm');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleConfirm = () => {
        setStatus('logging_in');
        setTimeout(() => {
            onLogin(); // Trigger parent login
            onClose(); // Close modal
        }, 1500);
    };

    return (
        <div className="absolute inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
            {/* Modal Container - Apple Style (Clean, Minimal) */}
            <div className="w-[400px] bg-white rounded-2xl overflow-hidden shadow-2xl text-gray-900 animate-in zoom-in-95 duration-200 font-sans">

                {/* Header */}
                <div className="bg-black p-4 flex items-center justify-center relative">
                    {status === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="absolute left-4 text-white/70 hover:text-white text-sm font-medium"
                        >
                            取消
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <AppleLogo className="w-6 h-6 text-white" />
                        <span className="font-semibold text-white text-lg">使用 Apple 登入</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">

                    {/* State: Connecting */}
                    {status === 'connecting' && (
                        <div className="flex flex-col items-center gap-6 animate-pulse">
                            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center shadow-lg">
                                <AppleLogo className="w-12 h-12 text-white" />
                            </div>
                            <span className="text-gray-500 font-medium tracking-wide">正在連接 Apple ID...</span>
                        </div>
                    )}

                    {/* State: Confirm */}
                    {status === 'confirm' && (
                        <div className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
                            {/* Avatar Stack */}
                            <div className="flex items-center -space-x-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white">
                                    <UserCircle2 size={48} className="text-gray-400" />
                                </div>
                                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center border-4 border-white z-10">
                                    <AppleLogo className="w-10 h-10 text-white" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-900">是否要連結您的 Apple 帳號進行登入？</h3>
                                <p className="text-sm text-gray-500 max-w-[280px]">
                                    YOTA 將會獲取您的 Apple ID 個人資料。
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full mt-4">
                                <button
                                    onClick={handleConfirm}
                                    className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <AppleLogo className="w-5 h-5" />
                                    確認
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )}

                    {/* State: Logging In */}
                    {status === 'logging_in' && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                            <span className="text-gray-700 font-medium">正在登入...</span>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 text-center">
                    <span className="text-xs text-gray-400">
                        <span className="font-medium">隱私權政策</span> • <span className="font-medium">服務條款</span>
                    </span>
                </div>

            </div>
        </div>
    );
};

export default AppleLoginModal;
