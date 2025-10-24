import React, { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { AppSettings, Theme, AccentColor } from '../types';

const defaultSettings: AppSettings = {
    theme: 'dark',
    accentColor: 'indigo',
    systemPrompt: 'Bạn là một gia sư AI chuyên nghiệp. Mục tiêu của bạn là giúp người dùng hiểu các chủ đề phức tạp và giải quyết vấn đề. Hãy trả lời một cách khích lệ, rõ ràng và cung cấp giải thích từng bước. Khi phân tích hình ảnh hoặc tệp, hãy chi tiết và chính xác.'
};

export const SettingsContext = createContext<{
    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
    systemPrompt: string;
    setSystemPrompt: (prompt: string) => void;
}>({
    settings: defaultSettings,
    setSettings: () => {},
    theme: 'dark',
    setTheme: () => {},
    accentColor: 'indigo',
    setAccentColor: () => {},
    systemPrompt: defaultSettings.systemPrompt,
    setSystemPrompt: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', defaultSettings);
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(settings.theme);
    }, [settings.theme]);

    const setTheme = (theme: Theme) => {
        setSettings(prev => ({ ...prev, theme }));
    };

    const setAccentColor = (color: AccentColor) => {
        setSettings(prev => ({ ...prev, accentColor: color }));
    };
    
    const setSystemPrompt = (prompt: string) => {
        setSettings(prev => ({ ...prev, systemPrompt: prompt }));
    }

    return (
        <SettingsContext.Provider value={{
            settings,
            setSettings,
            theme: settings.theme,
            setTheme,
            accentColor: settings.accentColor,
            setAccentColor,
            systemPrompt: settings.systemPrompt,
            setSystemPrompt,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};
