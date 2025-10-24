import React, { useContext } from 'react';
import { AppMode } from '../types';
import ChatIcon from './icons/ChatIcon';
import ImageIcon from './icons/ImageIcon';
import MindMapIcon from './icons/MindMapIcon';
import CogIcon from './icons/CogIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import { SettingsContext } from '../contexts/SettingsContext';
import { AccentColor } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  accentColor: AccentColor;
}> = ({ label, icon, isActive, isCollapsed, onClick, accentColor }) => {
  
  const accentClassMap = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    rose: 'bg-rose-600'
  };

  const activeClasses = `${accentClassMap[accentColor]} text-white shadow-lg`;
  const inactiveClasses = 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white';
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-3 my-1 rounded-lg transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      aria-label={label}
    >
      {icon}
      {!isCollapsed && <span className="ml-4 font-semibold">{label}</span>}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, isCollapsed, onToggleCollapse }) => {
  const { accentColor } = useContext(SettingsContext);

  return (
    <aside className={`bg-slate-200 dark:bg-slate-800 p-4 flex flex-col border-r border-slate-300 dark:border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`mb-8 flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-wider">Gia Sư AI</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Trợ lý học tập cá nhân</p>
          </div>
        )}
      </div>
      <nav className="flex flex-col">
        <SidebarButton
          label="Gia sư AI"
          icon={<ChatIcon />}
          isActive={currentMode === AppMode.TUTOR}
          isCollapsed={isCollapsed}
          onClick={() => onModeChange(AppMode.TUTOR)}
          accentColor={accentColor}
        />
        <SidebarButton
          label="Tạo hình ảnh"
          icon={<ImageIcon />}
          isActive={currentMode === AppMode.IMAGE_GEN}
          isCollapsed={isCollapsed}
          onClick={() => onModeChange(AppMode.IMAGE_GEN)}
          accentColor={accentColor}
        />
        <SidebarButton
          label="Tạo sơ đồ tư duy"
          icon={<MindMapIcon />}
          isActive={currentMode === AppMode.MIND_MAP}
          isCollapsed={isCollapsed}
          onClick={() => onModeChange(AppMode.MIND_MAP)}
          accentColor={accentColor}
        />
        <SidebarButton
          label="Cài đặt"
          icon={<CogIcon />}
          isActive={currentMode === AppMode.SETTINGS}
          isCollapsed={isCollapsed}
          onClick={() => onModeChange(AppMode.SETTINGS)}
          accentColor={accentColor}
        />
      </nav>
      <div className="mt-auto">
        <button onClick={onToggleCollapse} className="flex items-center justify-center w-full p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
            <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                <ChevronLeftIcon />
            </div>
        </button>
        {!isCollapsed && (
            <div className="text-center text-xs text-slate-500 mt-4">
                <p>Phát triển bởi Gemini</p>
            </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;