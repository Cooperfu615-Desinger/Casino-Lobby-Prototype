// Game related types

export interface Game {
    id: number;
    title: string;
    category: 'card' | 'slot' | 'fish';
    image: string;
    icon: string;
    size?: 'standard' | 'large';
    hasJackpot?: boolean;
}

export type GameCategory = 'card' | 'slot' | 'fish';

export interface SeatTrendMetric {
    today: number;
    threeDay: number;
    sevenDay: number;
}

export interface SeatFreeGameStats {
    unopened: number;
    previousOne: number;
    previousTwo: number;
}

export interface GameSeat {
    id: string;
    page: number;
    seatNo: string;
    rtp: number;
    isOccupied: boolean;
    occupantName?: string;
    freeGame: SeatFreeGameStats;
    rtpAverage: SeatTrendMetric;
    hitRate: SeatTrendMetric;
    totalBet: SeatTrendMetric;
}
