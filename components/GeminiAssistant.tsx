import React, { useState, useCallback, useRef, useEffect } from 'react';
import { processWithGemini } from '../services/geminiService';
import Button from './Button';
import Loader from './Loader';
import { GeminiAction, ToastMessage, GeminiAssistantProps } from '../types';
import FileUpload from './FileUpload';
// Import the Toast component
import Toast from './Toast';

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ services }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const responseRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const handleFileSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    if (file) {
      addToast(`تم تحديد الملف: ${file.name}`, 'info');
    } else {
      addToast('لم يتم تحديد أي ملف.', 'info');
    }
  }, [addToast]);

  const handleSubmit = useCallback(async (action: GeminiAction) => {
    if (!prompt && !selectedFile) {
      addToast('الرجاء إدخال نص أو رفع ملف للبدء.', 'error');
      return;
    }

    setLoading(true);
    setGeminiResponse(null);
    setError(null);

    try {
      const response = await processWithGemini(prompt, action, services, selectedFile);
      if (response) {
        setGeminiResponse(response);
        addToast('تمت معالجة طلبك بنجاح!', 'success');
      } else {
        setError('لم يتم تلقي استجابة من Gemini.');
        addToast('لم يتم تلقي استجابة من Gemini.', 'error');
      }
    } catch (err: any) {
      console.error('Error in Gemini processing:', err);
      const errorMessage = err.message || 'حدث خطأ غير متوقع أثناء الاتصال بـ Gemini.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [prompt, selectedFile, services, addToast]);

  useEffect(() => {
    if (geminiResponse && responseRef.current) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [geminiResponse]);

  // Check if API key is selected on mount for VEO/Pro-Image models (though not strictly for this model,
  // good practice for a general Gemini assistant).
  useEffect(() => {
    const checkApiKey = async () => {
      // Assuming 'gemini-3-pro-preview' might require explicit API key selection in some environments
      // or for future models.
      if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        try {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) {
            addToast('الرجاء تحديد مفتاح API الخاص بك للمتابعة.', 'info');
            // Do not call openSelectKey directly here to avoid blocking UI or
            // unnecessary popups on initial load. Let the user trigger it
            // if an API error occurs.
          }
        } catch (e) {
          console.error("Error checking API key:", e);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    checkApiKey();
  }, []); // Run only once on mount

  const renderGeminiResponse = (text: string) => {
    // Simple markdown-like rendering for bold and newlines
    const formattedText = text
      .split('\n')
      .map((line, index) => {
        if (line.trim().startsWith('###')) {
          return <h3 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(3).trim()}</h3>;
        }
        if (line.trim().startsWith('##')) {
          return <h2 key={index} className="text-2xl font-bold mt-5 mb-3">{line.substring(2).trim()}</h2>;
        }
        if (line.trim().startsWith('*')) {
          return <li key={index} className="mr-4 text-right list-disc pr-4">{line.substring(1).trim()}</li>;
        }
        return <p key={index} className="mb-2 leading-relaxed">{line}</p>;
      });

    return <div className="prose max-w-none text-right">{formattedText}</div>;
  };


  return (
    <section id="gemini-assistant" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          مساعد Gemini الذكي
        </h2>
        <p className="text-lg text-gray-700 text-center mb-10">
          استخدم مساعدنا المدعوم بالذكاء الاصطناعي من Gemini لتحليل المحتوى، تلخيص المستندات، أو تحسين النصوص المتعلقة بخدماتنا.
        </p>

        <div className="bg-gray-100 p-8 rounded-lg shadow-xl border border-indigo-200">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 mb-4 text-right resize-y min-h-[150px]"
            placeholder="أدخل النص هنا للتحليل أو التلخيص أو التحسين..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          ></textarea>

          <FileUpload
            onFileSelect={handleFileSelect}
            acceptedFileTypes="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            maxFileSizeMB={10}
            label="أو ارفع ملف للتحليل (صور، PDF، مستندات نصية/Word)"
            error={error}
          />

          <div className="flex flex-wrap justify-end gap-3 mt-6">
            <Button
              onClick={() => handleSubmit('summarize')}
              loading={loading}
              disabled={loading || (!prompt && !selectedFile)}
              variant="primary"
            >
              تلخيص المحتوى
            </Button>
            <Button
              onClick={() => handleSubmit('analyze_services')}
              loading={loading}
              disabled={loading || (!prompt && !selectedFile)}
              variant="primary"
            >
              تحليل واقتراح الخدمات
            </Button>
            <Button
              onClick={() => handleSubmit('refine_text')}
              loading={loading}
              disabled={loading || !prompt}
              variant="primary"
            >
              تحسين وتدقيق النص
            </Button>
          </div>

          {loading && (
            <div className="mt-8">
              <Loader message="Gemini يعالج طلبك، يرجى الانتظار..." />
            </div>
          )}

          {geminiResponse && (
            <div ref={responseRef} className="mt-8 p-6 bg-indigo-50 border border-indigo-300 rounded-lg shadow-inner text-gray-800 text-right">
              <h3 className="text-2xl font-bold mb-4 text-indigo-700">استجابة Gemini:</h3>
              {renderGeminiResponse(geminiResponse)}
            </div>
          )}

          {error && !loading && (
            <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-right">
              <p className="font-bold">خطأ:</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      {/* Toast Notifications Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </section>
  );
};

export default GeminiAssistant;
