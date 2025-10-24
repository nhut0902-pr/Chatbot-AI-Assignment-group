import React, { useState, useContext } from 'react';
import { AppMode } from './types';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import ImageGenView from './components/ImageGenView';
import MindMapView from './components/MindMapView';
import SettingsView from './components/SettingsView';
import Welcome from './components/Welcome';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsContext } from './contexts/SettingsContext';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TUTOR);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isStarted, setIsStarted] = useLocalStorage('appStarted', false);
  const { theme } = useContext(SettingsContext);

  const renderContent = () => {
    switch (mode) {
      case AppMode.TUTOR:
        return <ChatView />;
      case AppMode.IMAGE_GEN:
        return <ImageGenView />;
      case AppMode.MIND_MAP:
        return <MindMapView />;
      case AppMode.SETTINGS:
        return <SettingsView />;
      default:
        return <ChatView />;
    }
  };
  
  if (!isStarted) {
      return <Welcome onStart={() => setIsStarted(true)} />;
  }

  return (
    <div className={`${theme} font-sans`}>
      <div className="flex h-screen w-screen bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Sidebar 
          currentMode={mode} 
          onModeChange={setMode}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        />
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;