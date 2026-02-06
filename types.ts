export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Tailwind icon class or similar representation
  details?: string; // More detailed description for Gemini
}

export type GeminiAction = 'summarize' | 'analyze_services' | 'refine_text';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface GeminiAssistantProps {
  services: ServiceItem[];
}
