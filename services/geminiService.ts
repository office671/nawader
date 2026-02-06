import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ServiceItem } from '../types';

interface GeminiServiceConfig {
  apiKey: string;
}

const API_KEY = process.env.API_KEY || ''; 

// Helper function to convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Extract only the base64 part (remove data:mimeType;base64,)
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function processWithGemini(
  promptText: string,
  action: 'summarize' | 'analyze_services' | 'refine_text',
  services: ServiceItem[],
  file?: File,
): Promise<string | undefined> {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please ensure process.env.API_KEY is set.");
  }

  // Create a new GoogleGenAI instance for each call to ensure the latest API key is used
  // and to avoid issues with stale closures if the key changes.
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  let fullPrompt = '';
  const parts: (string | { inlineData: { mimeType: string; data: string } })[] = [];

  if (file) {
    try {
      const base64Data = await fileToBase64(file);
      parts.push({
        inlineData: {
          mimeType: file.type,
          data: base64Data,
        },
      });
      fullPrompt += `المحتوى المقدم في الصورة/الملف هو: `;
    } catch (error) {
      console.error('Error converting file to base64:', error);
      return 'حدث خطأ في معالجة الملف.';
    }
  }

  if (promptText) {
    parts.push(promptText);
  }

  // Add specific instructions based on the action
  switch (action) {
    case 'summarize':
      fullPrompt += `
      أنت مساعد خبير في تحليل المستندات.
      لخص المحتوى التالي بدقة ووضوح في نقاط رئيسية، مع التركيز على أهم المعلومات:
      """
      ${promptText}
      """
      `;
      break;
    case 'analyze_services':
      const serviceDescriptions = services.map(s => `ID: ${s.id}\nالخدمة: ${s.title}\nالوصف: ${s.description}\nالتفاصيل: ${s.details}`).join('\n---\n');
      fullPrompt += `
      أنت مساعد خبير في مطابقة الخدمات.
      استنادًا إلى وصف الخدمات التالي:
      """
      ${serviceDescriptions}
      """
      والمحتوى/الطلب التالي:
      """
      ${promptText}
      """
      حدد الخدمات الأكثر صلة من قائمتنا (اذكر ID الخدمة وعنوانها) وقدم شرحًا موجزًا لماذا هي مناسبة.
      `;
      break;
    case 'refine_text':
      fullPrompt += `
      أنت خبير في تحسين النصوص باللغة العربية، وخصوصًا النصوص الرسمية والتجارية في سياق المملكة العربية السعودية.
      قم بتحسين وتدقيق النص التالي ليكون أكثر وضوحًا، احترافية، وخاليًا من الأخطاء اللغوية والإملائية، مع الحفاظ على المعنى الأصلي.
      """
      ${promptText}
      """
      `;
      break;
    default:
      fullPrompt += `
      أنت مساعد عام.
      قم بالرد على الاستعلام التالي:
      """
      ${promptText}
      """
      `;
      break;
  }

  const contents = parts.length > 1 ? { parts: [{ text: fullPrompt }, ...parts.filter(p => typeof p !== 'string')] } : fullPrompt;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Use Pro for complex tasks
      contents: contents,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 2048,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    if (error.message && error.message.includes("Requested entity was not found.")) {
      // Race condition or API key issue. Prompt user to select key again.
      // This part assumes window.aistudio is available in the environment.
      if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
        (window as any).aistudio.openSelectKey();
        return 'حدث خطأ في المصادقة. يرجى اختيار مفتاح API الخاص بك مرة أخرى.';
      }
    }
    return `حدث خطأ أثناء الاتصال بخدمة Gemini: ${error.message || 'خطأ غير معروف'}. يرجى المحاولة مرة أخرى.`;
  }
}

// Global functions for audio decoding/encoding for Live API, if needed later.
// For now, I will include placeholder, but they are not used in this specific app.
// If implementing Live API, these would be crucial.
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
