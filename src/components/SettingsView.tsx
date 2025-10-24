import React, { useContext, useState, useEffect } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { AccentColor, Theme } from '../types';
import SunIcon from './SunIcon';
import MoonIcon from './icons/MoonIcon';

const SettingsView: React.FC = () => {
    const { settings, setTheme, setAccentColor, setSystemPrompt } = useContext(SettingsContext);
    const [prompt, setPrompt] = useState(settings.systemPrompt);
    
    useEffect(() => {
        setPrompt(settings.systemPrompt)
    }, [settings.systemPrompt]);

    const handlePromptSave = () => {
        setSystemPrompt(prompt);
        alert("Đã lưu hướng dẫn cho AI!");
    };

    const accentClassMap = {
        indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', ring: 'focus:ring-indigo-500', ring_offset: 'ring-indigo-500' },
        blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', ring: 'focus:ring-blue-500', ring_offset: 'ring-blue-500' },
        green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', ring: 'focus:ring-green-500', ring_offset: 'ring-green-500' },
        orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', ring: 'focus:ring-orange-500', ring_offset: 'ring-orange-500' },
        rose: { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', ring: 'focus:ring-rose-500', ring_offset: 'ring-rose-500' },
    };

    const currentAccent = accentClassMap[settings.accentColor] || accentClassMap.indigo;
    
    const accentColorOptions: { name: AccentColor, class: string }[] = [
        { name: 'indigo', class: 'bg-indigo-500' },
        { name: 'blue', class: 'bg-blue-500' },
        { name: 'green', class: 'bg-green-500' },
        { name: 'orange', class: 'bg-orange-500' },
        { name: 'rose', class: 'bg-rose-500' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Cài đặt</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Tùy chỉnh giao diện và trải nghiệm của bạn.</p>
                </div>
                
                {/* Theme Settings */}
                <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-xl">
                    <h3 className="text-xl font-semibold mb-4">Giao diện</h3>
                    <div className="flex items-center space-x-4">
                        <p className="text-slate-600 dark:text-slate-300">Chế độ:</p>
                        <div className="flex rounded-lg p-1 bg-slate-300 dark:bg-slate-700">
                             <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-md transition-colors ${settings.theme === 'light' ? 'bg-white shadow' : ''}`}>
                                 <SunIcon className="w-5 h-5"/>
                             </button>
                             <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-md transition-colors ${settings.theme === 'dark' ? 'bg-slate-800 text-white shadow' : ''}`}>
                                 <MoonIcon className="w-5 h-5"/>
                             </button>
                        </div>
                    </div>
                     <div className="flex items-center space-x-4 mt-4">
                        <p className="text-slate-600 dark:text-slate-300">Màu nhấn:</p>
                        <div className="flex space-x-2">
                            {accentColorOptions.map(color => (
                                <button 
                                    key={color.name}
                                    onClick={() => setAccentColor(color.name)}
                                    className={`w-8 h-8 rounded-full ${color.class} ${settings.accentColor === color.name ? `ring-2 ring-offset-2 ring-offset-slate-200 dark:ring-offset-slate-800 ${currentAccent.ring_offset}` : ''}`}
                                    aria-label={`Select ${color.name} color`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Settings */}
                <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-xl">
                    <h3 className="text-xl font-semibold mb-4">Tinh chỉnh AI</h3>
                     <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Cung cấp hướng dẫn hệ thống để thay đổi cách AI trả lời. Thay đổi sẽ áp dụng cho các cuộc trò chuyện mới.</p>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="VD: Bạn là một nhà thơ chuyên nghiệp, hãy trả lời mọi thứ bằng một bài thơ..."
                        className={`w-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 ${currentAccent.ring}`}
                        rows={6}
                    />
                    <button
                        onClick={handlePromptSave}
                        className={`mt-4 w-full flex justify-center items-center ${currentAccent.bg} text-white font-bold py-3 px-4 rounded-lg ${currentAccent.hover} transition-colors duration-300`}
                    >
                       Lưu hướng dẫn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;