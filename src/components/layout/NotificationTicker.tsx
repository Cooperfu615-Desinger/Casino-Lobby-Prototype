import { Megaphone } from 'lucide-react';

const NotificationTicker = () => {
    return (
        <div className="absolute top-[88px] left-0 right-0 z-30 bg-black/50 backdrop-blur-sm border-y border-white/5 h-9 flex items-center overflow-hidden">
            <Megaphone size={16} className="text-[#FFD700] ml-6 flex-shrink-0 animate-pulse" />
            <div className="overflow-hidden w-full ml-4">
                <p className="text-white text-sm whitespace-nowrap animate-marquee font-medium tracking-wide">
                    恭喜玩家 <span className="text-[#FFD700]">奧黛麗一本123456789</span> 在 <span className="text-green-400">Lucky Tiger Rush</span> 贏得 GRAND JACKPOT $50,000！  •  限時活動：充值回饋 200%！  •  恭喜玩家 <span className="text-[#FFD700]">Tom888</span> 獲得首儲好禮！
                </p>
            </div>
        </div>
    );
};

export default NotificationTicker;
