
import React, { useState, useEffect } from 'react';
import { X, Settings as SettingsIcon, CheckCircle2, AlertCircle, Loader2, Server, Globe, MessageSquare } from 'lucide-react';
import { ApiConfig, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { testConnection } from '../services/gemini';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onConfigChange: (config: ApiConfig) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const SettingsDialog: React.FC<Props> = ({ 
  isOpen, onClose, config, onConfigChange, language, onLanguageChange 
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Determine mode based on provider string
  // 'google' or empty -> Google Mode
  // Anything else -> Custom/OpenRouter Mode
  const isGoogle = config.provider.toLowerCase() === 'google' || config.provider.trim() === '';

  // Initialize defaults if switching to OpenRouter for the first time
  useEffect(() => {
    if (!isGoogle && !config.baseUrl) {
       onConfigChange({ ...config, baseUrl: 'https://openrouter.ai/api/v1' });
    }
  }, [isGoogle]);

  if (!isOpen) return null;

  const t = getTranslation(language);

  const handleChange = (field: keyof ApiConfig, value: string) => {
    onConfigChange({ ...config, [field]: value });
    setTestResult(null); 
    setErrorMessage('');
  };

  const setMode = (mode: 'google' | 'custom') => {
      if (mode === 'google') {
          onConfigChange({ 
              ...config, 
              provider: 'google', 
              baseUrl: '', 
              model: 'gemini-2.5-flash' 
          });
      } else {
          onConfigChange({ 
              ...config, 
              provider: 'OpenRouter', 
              baseUrl: 'https://openrouter.ai/api/v1', 
              model: 'openai/gpt-oss-20b:free' 
          });
      }
      setTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setErrorMessage('');
    
    try {
        await testConnection(config);
        setTestResult('success');
    } catch (e: any) {
        setTestResult('error');
        // Extract useful error message
        let msg = e.message || "Unknown error";
        if (msg.includes("404")) msg = "404 Not Found: Check Model Name or URL.";
        if (msg.includes("401")) msg = "401 Unauthorized: Check API Key.";
        setErrorMessage(msg);
    } finally {
        setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <SettingsIcon size={20} className="text-gray-500" />
            {t.settings}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">{t.language}</label>
            <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onLanguageChange('en')}
                  className={`py-2 px-4 rounded-xl border font-medium transition-colors ${language === 'en' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => onLanguageChange('zh')}
                  className={`py-2 px-4 rounded-xl border font-medium transition-colors ${language === 'zh' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  中文
                </button>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* API Provider Mode Switcher */}
          <div className="space-y-3">
             <label className="text-sm font-medium text-gray-700 block">{t.apiMode}</label>
             <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => setMode('google')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1 ${isGoogle ? 'bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                    <Server size={20} />
                    <span className="text-xs font-semibold">Google API</span>
                </button>
                <button 
                    onClick={() => setMode('custom')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1 ${!isGoogle ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                    <Globe size={20} />
                    <span className="text-xs font-semibold">OpenRouter / Custom</span>
                </button>
             </div>
          </div>

          {/* Fields for Custom Provider */}
          {!isGoogle && (
             <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">{t.provider}</label>
                    <input 
                      type="text"
                      value={config.provider}
                      onChange={(e) => handleChange('provider', e.target.value)}
                      placeholder="OpenRouter"
                      className="w-full px-4 py-2 rounded-xl border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">{t.baseUrl}</label>
                    <input 
                      type="text"
                      value={config.baseUrl}
                      onChange={(e) => handleChange('baseUrl', e.target.value)}
                      placeholder="https://openrouter.ai/api/v1"
                      className="w-full px-4 py-2 rounded-xl border border-gray-600 bg-gray-900 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                    />
                    <p className="text-[10px] text-gray-400">Example: https://openrouter.ai/api/v1</p>
                 </div>
             </div>
          )}

          {/* Model Name */}
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700 block">{t.model}</label>
             <input 
               type="text"
               value={config.model}
               onChange={(e) => handleChange('model', e.target.value)}
               className={`w-full px-4 py-2 rounded-xl border focus:ring-2 outline-none font-mono text-sm ${isGoogle ? 'focus:ring-green-500 border-gray-300' : 'focus:ring-blue-500 border-gray-300'}`}
               placeholder={isGoogle ? "gemini-2.5-flash" : "google/gemini-2.0-flash-exp:free"}
             />
             
             {isGoogle ? (
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                   <button onClick={() => handleChange('model', 'gemini-2.5-flash')} className="hover:text-green-600 underline bg-gray-50 px-2 py-1 rounded">Flash 2.5</button>
                   <button onClick={() => handleChange('model', 'gemini-3-pro-preview')} className="hover:text-green-600 underline bg-gray-50 px-2 py-1 rounded">Pro 3.0</button>
                </div>
             ) : (
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                   <button onClick={() => handleChange('model', 'google/gemini-2.0-flash-exp:free')} className="hover:text-blue-600 underline bg-gray-50 px-2 py-1 rounded">Gemini 2.0 (Free)</button>
                   <button onClick={() => handleChange('model', 'google/gemini-flash-1.5')} className="hover:text-blue-600 underline bg-gray-50 px-2 py-1 rounded">Flash 1.5</button>
                   <button onClick={() => handleChange('model', 'openai/gpt-4o-mini')} className="hover:text-blue-600 underline bg-gray-50 px-2 py-1 rounded">GPT-4o-mini</button>
                </div>
             )}
          </div>

          {/* API Key */}
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700 block">{t.apiKeyPlaceholder}</label>
             <input 
               type="password"
               value={config.apiKey}
               onChange={(e) => handleChange('apiKey', e.target.value)}
               placeholder={isGoogle ? "AIza..." : "sk-or-..."}
               className={`w-full px-4 py-2 rounded-xl border focus:ring-2 outline-none font-mono text-sm ${isGoogle ? 'focus:ring-green-500 border-gray-300' : 'focus:ring-blue-500 border-gray-300'}`}
             />
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
               <MessageSquare size={16} className="text-gray-400"/>
               {t.systemPrompt}
             </label>
             <textarea 
               value={config.systemPrompt || ''}
               onChange={(e) => handleChange('systemPrompt', e.target.value)}
               placeholder={t.systemPromptPlaceholder}
               rows={3}
               className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none text-sm resize-none ${isGoogle ? 'focus:ring-green-500 border-gray-300' : 'focus:ring-blue-500 border-gray-300'}`}
             />
          </div>
          
          {/* Test Connection Button */}
          <div className="pt-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !config.apiKey}
              className={`w-full py-2.5 rounded-xl font-medium text-sm border flex items-center justify-center gap-2 transition-colors ${
                testResult === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : testResult === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {isTesting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t.testing}
                </>
              ) : testResult === 'success' ? (
                <>
                  <CheckCircle2 size={16} />
                  {t.testSuccess}
                </>
              ) : testResult === 'error' ? (
                <>
                  <AlertCircle size={16} />
                  {t.testFailed}
                </>
              ) : (
                t.testConnection
              )}
            </button>
            {testResult === 'error' && errorMessage && (
                <div className="mt-2 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 text-center break-all">
                    {errorMessage}
                </div>
            )}
          </div>

        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex-shrink-0">
           <button 
             onClick={onClose}
             className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
           >
             {t.save}
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
