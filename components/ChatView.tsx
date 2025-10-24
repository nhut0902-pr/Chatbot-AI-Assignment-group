import React, { useState, useRef, useEffect, useContext } from 'react';
import type { Chat } from '@google/genai';
import { ChatMessage } from '../types';
import { streamChatResponse, createChatInstance } from '../services/geminiService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SettingsContext } from '../contexts/SettingsContext';
import SendIcon from './icons/SendIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import Spinner from './icons/Spinner';
import PlusIcon from './icons/PlusIcon';

interface UploadedFile {
    data: string;
    mimeType: string;
    name: string;
}

const ChatView: React.FC = () => {
    const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chatHistory', []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatRef = useRef<Chat | null>(null);
    
    const { systemPrompt } = useContext(SettingsContext);

    useEffect(() => {
        // Initialize chat instance on mount
        chatRef.current = createChatInstance(systemPrompt);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleNewChat = () => {
        setMessages([]);
        chatRef.current = createChatInstance(systemPrompt);
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Data = (e.target?.result as string).split(',')[1];
                setUploadedFile({ data: base64Data, mimeType: file.type, name: file.name });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chatRef.current) return;

        const userMessage: ChatMessage = {
            role: 'user',
            parts: [{ text: input, file: uploadedFile || undefined }],
            timestamp: Date.now(),
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setUploadedFile(null);
        setIsLoading(true);

        const modelMessage: ChatMessage = { role: 'model', parts: [{ text: '' }], timestamp: Date.now() };
        setMessages(prev => [...prev, modelMessage]);

        try {
            const stream = await streamChatResponse(chatRef.current, input, uploadedFile || undefined);
            let fullResponse = '';
            for await (const chunk of stream) {
                const chunkText = chunk.text;
                fullResponse += chunkText;
                setMessages(prev => prev.map((msg, index) => 
                    index === prev.length - 1 ? { ...msg, parts: [{ text: fullResponse }] } : msg
                ));
            }
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            const errorMessage = "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.";
            setMessages(prev => prev.map((msg, index) => 
                index === prev.length - 1 ? { ...msg, parts: [{ text: errorMessage }], isError: true } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900">
            <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-700">
                <h2 className="text-xl font-bold">Gia sư AI</h2>
                <button onClick={handleNewChat} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    <PlusIcon />
                    Cuộc trò chuyện mới
                </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl lg:max-w-3xl px-5 py-3 rounded-2xl shadow-md transition-colors ${
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white' 
                                : `bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 ${msg.isError ? 'border border-red-500' : ''}`
                        }`}>
                            {msg.parts.map((part, partIndex) => (
                                <div key={partIndex}>
                                    {part.file && (
                                        <div className="mb-2">
                                            <p className="font-bold text-sm mb-1">Tệp đính kèm: {part.file.name}</p>
                                            <img src={`data:${part.file.mimeType};base64,${part.file.data}`} alt="uploaded content" className="rounded-lg max-h-48" />
                                        </div>
                                    )}
                                    <p className={`whitespace-pre-wrap ${msg.isError ? 'text-red-500' : ''}`}>{part.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                 {isLoading && messages[messages.length - 1]?.role === 'model' && !messages[messages.length - 1]?.parts[0].text &&(
                    <div className="flex justify-start">
                        <div className="max-w-xl lg:max-w-2xl px-5 py-3 rounded-2xl shadow-md bg-slate-200 dark:bg-slate-700">
                             <Spinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-slate-200 dark:bg-slate-800 border-t border-slate-300 dark:border-slate-700">
                <div className="max-w-4xl mx-auto">
                    {uploadedFile && (
                        <div className="mb-2 p-2 bg-slate-300 dark:bg-slate-700 rounded-lg flex items-center justify-between text-sm">
                            <span>Tệp đính kèm: {uploadedFile.name}</span>
                            <button onClick={() => setUploadedFile(null)} className="text-red-500 hover:text-red-400 font-bold text-lg">
                                &times;
                            </button>
                        </div>
                    )}
                    <div className="relative flex items-center">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Hỏi bất cứ điều gì hoặc mô tả vấn đề bạn cần giúp..."
                            className="w-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-lg p-4 pr-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={1}
                        />
                        <div className="absolute right-3 flex items-center">
                             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*, application/pdf, .txt, .md" />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                            >
                                <PaperclipIcon />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isLoading || input.trim() === ''}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 disabled:text-slate-500 dark:disabled:text-slate-600"
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
