import React, { useContext } from 'react';
import ChatIcon from './icons/ChatIcon';
import ImageIcon from './icons/ImageIcon';
import MindMapIcon from './icons/MindMapIcon';
import { SettingsContext } from '../contexts/SettingsContext';

interface WelcomeProps {
    onStart: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string, accentColorClass: string }> = ({ icon, title, description, accentColorClass }) => (
    <div className="bg-slate-800 p-6 rounded-lg text-center transform hover:scale-105 transition-transform duration-300">
        <div className={`flex justify-center items-center mb-4 ${accentColorClass}`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-400">{description}</p>
    </div>
);


const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  const { accentColor } = useContext(SettingsContext);

  const accentClassMap = {
    indigo: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-indigo-500', shadow: 'hover:shadow-indigo-500/50', icon_text: 'text-indigo-400' },
    blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-500', shadow: 'hover:shadow-blue-500/50', icon_text: 'text-blue-400' },
    green: { bg: 'bg-green-600', hover: 'hover:bg-green-700', text: 'text-green-500', shadow: 'hover:shadow-green-500/50', icon_text: 'text-green-400' },
    orange: { bg: 'bg-orange-600', hover: 'hover:bg-orange-700', text: 'text-orange-500', shadow: 'hover:shadow-orange-500/50', icon_text: 'text-orange-400' },
    rose: { bg: 'bg-rose-600', hover: 'hover:bg-rose-700', text: 'text-rose-500', shadow: 'hover:shadow-rose-500/50', icon_text: 'text-rose-400' },
  };

  const currentAccent = accentClassMap[accentColor] || accentClassMap.indigo;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                Chào mừng đến với <span className={currentAccent.text}>Gia Sư AI</span>
            </h1>
            <p className="text-xl text-slate-300 mb-12">
                Trợ lý học tập cá nhân của bạn, được trang bị những công cụ mạnh mẽ để biến việc học trở nên dễ dàng và trực quan hơn.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <FeatureCard 
                    icon={<ChatIcon className="w-12 h-12"/>}
                    title="Gia sư Thông minh"
                    description="Hỏi đáp, giải bài tập, phân tích tệp và hình ảnh để nhận được giải thích chi tiết, từng bước một."
                    accentColorClass={currentAccent.icon_text}
                />
                <FeatureCard 
                    icon={<ImageIcon className="w-12 h-12"/>}
                    title="Tạo Hình ảnh"
                    description="Biến những ý tưởng và mô tả phức tạp thành hình ảnh trực quan, sinh động chỉ trong vài giây."
                    accentColorClass={currentAccent.icon_text}
                />
                 <FeatureCard 
                    icon={<MindMapIcon className="w-12 h-12"/>}
                    title="Sơ đồ Tư duy"
                    description="Tự động tạo sơ đồ tư duy từ bất kỳ chủ đề nào, giúp bạn hệ thống hóa kiến thức hiệu quả."
                    accentColorClass={currentAccent.icon_text}
                />
            </div>

            <button
                onClick={onStart}
                className={`${currentAccent.bg} text-white font-bold py-4 px-10 rounded-full text-lg ${currentAccent.hover} transition-all duration-300 shadow-lg ${currentAccent.shadow}`}
            >
                Bắt đầu học ngay
            </button>
        </div>
    </div>
  );
};

export default Welcome;