import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './icons/Spinner';
import ImageIcon from './icons/ImageIcon';

const ImageGenView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError('');
    setImageUrl('');

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
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
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Tạo Hình Ảnh</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Biến ý tưởng của bạn thành hiện thực. Mô tả bất cứ điều gì bạn có thể tưởng tượng.</p>
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-lg shadow-xl">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="VD: Một bức ảnh chân thực về một con sư tử oai vệ đội vương miện, ngồi trên ngai vàng trên sao Hỏa"
            className="w-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="mt-4 w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-800 dark:disabled:bg-indigo-900 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : 'Tạo ảnh'}
          </button>
        </div>

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        <div className="mt-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-lg p-8 aspect-square">
              <Spinner />
              <p className="mt-4 text-slate-600 dark:text-slate-300">Đang tạo ra kiệt tác của bạn...</p>
            </div>
          ) : imageUrl ? (
            <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-lg">
                <img src={imageUrl} alt="Generated" className="rounded-lg w-full h-auto object-cover aspect-square" />
                <a 
                    href={imageUrl} 
                    download={`ai-generated-${Date.now()}.png`}
                    className="mt-4 block w-full text-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                    Tải ảnh xuống
                </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center bg-slate-200 dark:bg-slate-800 rounded-lg p-8 aspect-square border-2 border-dashed border-slate-400 dark:border-slate-700">
              <ImageIcon className="w-16 h-16 text-slate-500 dark:text-slate-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400">Hình ảnh bạn tạo sẽ xuất hiện ở đây</h3>
              <p className="text-slate-500">Nhập mô tả ở trên và nhấp vào "Tạo ảnh" để bắt đầu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenView;
