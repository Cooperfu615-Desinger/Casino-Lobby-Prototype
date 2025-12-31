import React, { useState, useEffect } from 'react';
import { Facebook, UserCircle2 } from 'lucide-react';

interface FacebookLoginModalProps {
    onClose: () => void;
    onLogin: () => void;
}

type Status = 'connecting' | 'confirm' | 'logging_in';

const FacebookLoginModal: React.FC<FacebookLoginModalProps> = ({ onClose, onLogin }) => {
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
            {/* Modal Container - Facebook Dark Mode Style */}
            <div className="w-[400px] bg-[#242526] rounded-xl overflow-hidden shadow-2xl border border-[#3e4042] text-[#E4E6EB] animate-in zoom-in-95 duration-200 font-sans">

                {/* Header */}
                <div className="bg-[#242526] border-b border-[#3e4042] p-4 flex items-center justify-center relative">
                    {status === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="absolute left-4 text-[#B0B3B8] hover:text-[#E4E6EB] text-sm font-medium"
                        >
                            Cancel
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="bg-[#1877F2] rounded-full p-1">
                            <Facebook size={16} className="text-white fill-current" />
                        </div>
                        <span className="font-bold text-[#1877F2]">Facebook</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">

                    {/* State: Connecting */}
                    {status === 'connecting' && (
                        <div className="flex flex-col items-center gap-6 animate-pulse">
                            <div className="w-20 h-20 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50">
                                <Facebook size={48} className="text-white fill-current animate-spin-slow" />
                            </div>
                            <span className="text-[#B0B3B8] font-medium tracking-wide">Connecting to Facebook...</span>
                        </div>
                    )}

                    {/* State: Confirm */}
                    {status === 'confirm' && (
                        <div className="flex flex-col items-center gap-6 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
                            {/* Avatar Stack */}
                            <div className="flex items-center -space-x-4">
                                <div className="w-20 h-20 bg-[#3A3B3C] rounded-full flex items-center justify-center border-4 border-[#242526]">
                                    <UserCircle2 size={48} className="text-[#B0B3B8]" />
                                </div>
                                <div className="w-20 h-20 bg-[#1877F2] rounded-full flex items-center justify-center border-4 border-[#242526] z-10">
                                    <Facebook size={40} className="text-white fill-current" />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold">Continue as Player?</h3>
                                <p className="text-sm text-[#B0B3B8] max-w-[240px]">
                                    YOTA will receive access to your name and profile picture.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 w-full mt-4">
                                <button
                                    onClick={handleConfirm}
                                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    Continue as Player
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] font-bold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* State: Logging In */}
                    {status === 'logging_in' && (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-16 h-16 border-4 border-[#3A3B3C] border-t-[#1877F2] rounded-full animate-spin"></div>
                            <span className="text-[#E4E6EB] font-medium">Logging in...</span>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="border-t border-[#3e4042] p-4 text-center">
                    <span className="text-xs text-[#B0B3B8]">
                        <span className="font-bold">Privacy Policy</span> • <span className="font-bold">Terms of Service</span>
                    </span>
                </div>

            </div>
        </div>
    );
};

export default FacebookLoginModal;
