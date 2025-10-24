import React, { useState, useEffect } from 'react';
import { generateMindMapData } from '../services/geminiService';
import { MindMapNode } from '../types';
import MindMap from './MindMap';
import Spinner from './icons/Spinner';
import MindMapIcon from './icons/MindMapIcon';

const loadingMessages = [
    "Đang phân tích chủ đề của bạn...",
    "Xây dựng cấu trúc các ý chính...",
    "Thêm các nhánh phụ và chi tiết...",
    "Sắp xếp bố cục sơ đồ...",
    "Hoàn tất và hiển thị...",
];

const MindMapView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [mindMapData, setMindMapData] = useState<MindMapNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!topic.trim() || isLoading) return;
    setIsLoading(true);
    setError('');
    setMindMapData(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const data = await generateMindMapData(topic);
      setMindMapData(data);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không mong muốn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
        }
    };

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto w-full mb-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tạo Sơ Đồ Tư Duy</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Trực quan hóa ý tưởng của bạn. Nhập một chủ đề để tạo sơ đồ.</p>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-xl">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="VD: Hệ Mặt Trời, Lịch sử Đế chế La Mã, Các khái niệm về ReactJS"
            className="w-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={2}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="mt-4 w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-800 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : 'Tạo sơ đồ'}
          </button>
        </div>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>

      <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden relative border-2 border-slate-300 dark:border-slate-700">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Spinner />
            <p className="mt-4 text-slate-600 dark:text-slate-300 transition-all">{loadingMessage}</p>
          </div>
        ) : mindMapData ? (
          <MindMap data={mindMapData} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full p-4">
             <MindMapIcon className="w-16 h-16 text-slate-500 dark:text-slate-600 mb-4" />
             <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">Sơ đồ tư duy của bạn sẽ được hiển thị ở đây</h3>
             <p className="text-slate-500">Nhập một chủ đề ở trên để bắt đầu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMapView;