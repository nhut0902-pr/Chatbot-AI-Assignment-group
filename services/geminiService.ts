import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { MindMapNode } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatInstance = (systemInstruction: string): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

export const streamChatResponse = async (
    chat: Chat,
    prompt: string,
    file?: { data: string; mimeType: string }
) => {
    const parts: any[] = [{ text: prompt }];

    if (file) {
        parts.unshift({
            inlineData: {
                data: file.data,
                mimeType: file.mimeType,
            },
        });
    }
    
    // Sửa lỗi: Phương thức `sendMessageStream` trên đối tượng Chat yêu cầu thuộc tính `message` chứa các phần.
    return await chat.sendMessageStream({ message: parts });
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("Không có hình ảnh nào được tạo.");
    } catch (error) {
        console.error("Lỗi tạo ảnh:", error);
        throw new Error("Không thể tạo ảnh. Vui lòng kiểm tra lại câu lệnh và API key của bạn.");
    }
};

export const generateMindMapData = async (topic: string): Promise<MindMapNode> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Dựa trên chủ đề sau, hãy tạo cấu trúc sơ đồ tư duy phân cấp ở định dạng JSON. Nút gốc phải đại diện cho chủ đề chính. Mỗi nút phải có 'name' (string) và tùy chọn 'children' (mảng các nút). Giữ tên nút ngắn gọn. Chủ đề: "${topic}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        children: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    children: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING },
                                                children: {
                                                    type: Type.ARRAY,
                                                    items: {
                                                         type: Type.OBJECT,
                                                         properties: {
                                                            name: {type: Type.STRING}
                                                         }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    required: ["name"]
                },
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        return data as MindMapNode;

    } catch (error) {
        console.error("Lỗi tạo dữ liệu sơ đồ tư duy:", error);
        throw new Error("Không thể tạo dữ liệu sơ đồ tư duy. Model có thể đã trả về một cấu trúc không hợp lệ.");
    }
};