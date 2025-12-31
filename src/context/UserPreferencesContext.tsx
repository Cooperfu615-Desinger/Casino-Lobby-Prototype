import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ============================================================================
// 設計說明：為何 UserPreferencesContext 獨立於 AuthContext？
// ============================================================================
// 
// 1. 【生命週期不同】
//    - 偏好設定（語言、音效）在用戶登出後仍應保留
//    - 帳號資訊（用戶名、餘額）隨登出操作清空
//    - 若合併管理，登出時需複雜邏輯分離資料
//
// 2. 【關注點分離 (Separation of Concerns)】
//    - AuthContext 專注於：身份驗證、登入/登出、用戶資料
//    - UserPreferencesContext 專注於：UX 設定、個人化體驗
//    - 單一職責讓 Context 更易維護與測試
//
// 3. 【訪客支援】
//    - 未登入的訪客也需要語言與音效設定
//    - 這些設定與帳號無關，是設備層級的偏好
//
// 4. 【持久化策略不同】
//    - 偏好設定使用 localStorage（本機儲存）
//    - 帳號資訊實務上由後端 Session/Token 管理
//
// ============================================================================

// ============================================================================
// Types & Interfaces
// ============================================================================

/** 支援的語言代碼 */
export type Language = 'zh-TW' | 'en' | 'ja';

/** 用戶偏好設定介面 */
export interface UserPreferences {
    language: Language;
    soundEnabled: boolean;
    musicEnabled: boolean;
}

/** Context 提供的方法與狀態 */
interface UserPreferencesContextType extends UserPreferences {
    setLanguage: (lang: Language) => void;
    toggleSound: () => void;
    toggleMusic: () => void;
    setSoundEnabled: (enabled: boolean) => void;
    setMusicEnabled: (enabled: boolean) => void;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'user-preferences';

/** 預設偏好設定 */
const DEFAULT_PREFERENCES: UserPreferences = {
    language: 'zh-TW',
    soundEnabled: true,
    musicEnabled: true,
};

// ============================================================================
// Storage Helpers
// ============================================================================

/**
 * 從 localStorage 讀取偏好設定
 * 若無資料或解析失敗，返回預設值
 */
const loadPreferences = (): UserPreferences => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                language: parsed.language ?? DEFAULT_PREFERENCES.language,
                soundEnabled: parsed.soundEnabled ?? DEFAULT_PREFERENCES.soundEnabled,
                musicEnabled: parsed.musicEnabled ?? DEFAULT_PREFERENCES.musicEnabled,
            };
        }
    } catch (error) {
        console.warn('Failed to load preferences from localStorage:', error);
    }
    return DEFAULT_PREFERENCES;
};

/**
 * 將偏好設定寫入 localStorage
 */
const savePreferences = (preferences: UserPreferences): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.warn('Failed to save preferences to localStorage:', error);
    }
};

// ============================================================================
// Context Definition
// ============================================================================

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
    // 初始化時從 localStorage 讀取
    const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);

    // 偏好變更時自動儲存至 localStorage
    useEffect(() => {
        savePreferences(preferences);
    }, [preferences]);

    // --------------------------------------------------------------------------
    // Language Methods
    // --------------------------------------------------------------------------

    /**
     * 設定介面語言
     * @param lang - 目標語言代碼
     */
    const setLanguage = useCallback((lang: Language) => {
        setPreferences(prev => ({ ...prev, language: lang }));
    }, []);

    // --------------------------------------------------------------------------
    // Sound Methods
    // --------------------------------------------------------------------------

    /**
     * 切換遊戲音效
     */
    const toggleSound = useCallback(() => {
        setPreferences(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
    }, []);

    /**
     * 設定遊戲音效狀態
     * @param enabled - 是否啟用音效
     */
    const setSoundEnabled = useCallback((enabled: boolean) => {
        setPreferences(prev => ({ ...prev, soundEnabled: enabled }));
    }, []);

    // --------------------------------------------------------------------------
    // Music Methods
    // --------------------------------------------------------------------------

    /**
     * 切換背景音樂
     */
    const toggleMusic = useCallback(() => {
        setPreferences(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }));
    }, []);

    /**
     * 設定背景音樂狀態
     * @param enabled - 是否啟用音樂
     */
    const setMusicEnabled = useCallback((enabled: boolean) => {
        setPreferences(prev => ({ ...prev, musicEnabled: enabled }));
    }, []);

    // --------------------------------------------------------------------------
    // Context Value
    // --------------------------------------------------------------------------

    const value: UserPreferencesContextType = {
        // State
        language: preferences.language,
        soundEnabled: preferences.soundEnabled,
        musicEnabled: preferences.musicEnabled,
        // Methods
        setLanguage,
        toggleSound,
        toggleMusic,
        setSoundEnabled,
        setMusicEnabled,
    };

    return (
        <UserPreferencesContext.Provider value={value}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

// ============================================================================
// Custom Hook
// ============================================================================

export const useUserPreferences = () => {
    const context = useContext(UserPreferencesContext);
    if (!context) {
        throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
    }
    return context;
};
