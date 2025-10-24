declare const process: {
  env: {
    API_KEY: string;
  };
};

export enum AppMode {
  TUTOR = 'TUTOR',
  IMAGE_GEN = 'IMAGE_GEN',
  MIND_MAP = 'MIND_MAP',
  SETTINGS = 'SETTINGS',
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string; file?: { data: string; mimeType: string; name: string } }[];
  timestamp: number;
  isError?: boolean;
}

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

export type Theme = 'light' | 'dark';
export type AccentColor = 'indigo' | 'blue' | 'green' | 'orange' | 'rose';

export interface AppSettings {
    theme: Theme;
    accentColor: AccentColor;
    systemPrompt: string;
}