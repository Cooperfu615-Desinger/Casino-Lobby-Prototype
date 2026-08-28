import React, { useState, useEffect } from 'react';
import { CheckCircle2, UserCircle2 } from 'lucide-react';
import PrototypeOverlay from '../common/PrototypeOverlay';
import { PRODUCT_NAME } from '../../config/brand';

interface GoogleLoginModalProps {
    onClose: () => void;
    onLogin: () => void;
}

type Status = 'connecting' | 'confirm' | 'logging_in' | 'success';

// Google 官方四色 Logo SVG
const GoogleLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ onClose, onLogin }) => {
    const [status, setStatus] = useState<Status>('connecting');

    useEffect(() => {
        if (status === 'connecting') {
            const timer = setTimeout(() => setStatus('confirm'), 1500);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleConfirm = () => {
        setStatus('logging_in');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onLogin();
                onClose();
            }, 650);
        }, 900);
    };

    return (
        <PrototypeOverlay layer="auth">
            <div className="juheng-auth-provider-panel w-[400px] bg-white rounded-2xl overflow-hidden shadow-2xl text-gray-800 animate-in zoom-in-95 duration-200 font-sans">

                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-center relative">
                    {status === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="absolute left-4 text-gray-500 hover:text-gray-800 text-sm font-medium"
                        >
                            取消
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <GoogleLogo className="w-6 h-6" />
                        <span className="font-semibold text-gray-700 text-lg">使用 Google 登入</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px] bg-gray-50">

                    {/* State: Connecting */}
                    {status === 'connecting' && (
                        <div className="flex flex-col items-center gap-6 animate-pulse">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
                                <GoogleLogo className="w-12 h-12" />
                            </div>
                            <span className="text-gray-500 font-medium tracking-wide">正在連接 Google 帳號...</span>
                        </div>
                    )}

                    {/* State: Confirm */}
                    {status === 'confirm' && (
                        <div className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
                            {/* Avatar Stack */}
                            <div className="flex items-center -space-x-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-50">
                                    <UserCircle2 size={48} className="text-gray-400" />
                                </div>
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-gray-50 shadow z-10">
                                    <GoogleLogo className="w-10 h-10" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-gray-900">允許 {PRODUCT_NAME} 使用此帳號登入？</h3>
                                <p className="text-sm text-gray-500 max-w-[280px]">
                                    將建立示範帳號，不會取得真實社群資料。
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full mt-4">
                                <button
                                    onClick={handleConfirm}
                                    className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <GoogleLogo className="w-5 h-5" />
                                    允許並繼續
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
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#4285F4] rounded-full animate-spin"></div>
                            <span className="text-gray-700 font-medium">正在登入...</span>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-5 text-center">
                            <CheckCircle2 size={64} className="text-emerald-500" />
                            <strong className="text-xl font-black text-gray-900">登入成功</strong>
                            <span className="text-sm text-gray-500">即將進入遊戲大廳</span>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 text-center bg-white">
                    <span className="text-xs text-gray-400">
                        <span className="font-medium">隱私權政策</span> • <span className="font-medium">服務條款</span>
                    </span>
                </div>

            </div>
        </PrototypeOverlay>
    );
};

export default GoogleLoginModal;
