import React, { useState, useEffect } from 'react';
import { MessageCircle, UserCircle2 } from 'lucide-react';

interface LINELoginModalProps {
    onClose: () => void;
    onLogin: () => void;
}

type Status = 'connecting' | 'confirm' | 'logging_in';

const LINELoginModal: React.FC<LINELoginModalProps> = ({ onClose, onLogin }) => {
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
            {/* Modal Container - LINE Style */}
            <div className="w-[400px] bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 text-gray-800 animate-in zoom-in-95 duration-200 font-sans">

                {/* Header */}
                <div className="bg-[#06C755] p-4 flex items-center justify-center relative">
                    {status === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="absolute left-4 text-white/80 hover:text-white text-sm font-medium"
                        >
                            取消
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <MessageCircle size={24} className="text-white fill-current" />
                        <span className="font-bold text-white text-lg">LINE</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-gray-50">

                    {/* State: Connecting */}
                    {status === 'connecting' && (
                        <div className="flex flex-col items-center gap-6 animate-pulse">
                            <div className="w-20 h-20 bg-[#06C755] rounded-full flex items-center justify-center shadow-lg shadow-green-900/30">
                                <MessageCircle size={48} className="text-white fill-current" />
                            </div>
                            <span className="text-gray-500 font-medium tracking-wide">正在連接 LINE...</span>
                        </div>
                    )}

                    {/* State: Confirm */}
                    {status === 'confirm' && (
                        <div className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
                            {/* Avatar Stack */}
                            <div className="flex items-center -space-x-4">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-50">
                                    <UserCircle2 size={48} className="text-gray-400" />
                                </div>
                                <div className="w-20 h-20 bg-[#06C755] rounded-full flex items-center justify-center border-4 border-gray-50 z-10">
                                    <MessageCircle size={40} className="text-white fill-current" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-800">是否要連結您的 LINE 帳號進行登入？</h3>
                                <p className="text-sm text-gray-500 max-w-[280px]">
                                    YOTA 將會獲取您的 LINE 個人資料與頭像。
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full mt-4">
                                <button
                                    onClick={handleConfirm}
                                    className="w-full bg-[#06C755] hover:bg-[#05B04C] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    確認
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors"
                                >
                                    取消
                                </button>
                            </div>
                        </div>
                    )}

                    {/* State: Logging In */}
                    {status === 'logging_in' && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#06C755] rounded-full animate-spin"></div>
                            <span className="text-gray-700 font-medium">正在登入...</span>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 text-center bg-white">
                    <span className="text-xs text-gray-400">
                        <span className="font-bold">隱私權政策</span> • <span className="font-bold">服務條款</span>
                    </span>
                </div>

            </div>
        </div>
    );
};

export default LINELoginModal;
