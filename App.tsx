import React, { useState, useRef } from 'react';
import { Camera, ChefHat, Loader2, Sparkles, ArrowRight, Globe, Settings as SettingsIcon } from 'lucide-react';
import IngredientInput from './components/IngredientInput';
import RecipeDisplay from './components/RecipeDisplay';
import UserProfileForm from './components/UserProfileForm';
import SettingsDialog from './components/SettingsDialog';
import { identifyIngredientsFromImage, generateRecipe } from './services/gemini';
import { LoadingState, Recipe, Language, ApiConfig, UserProfile } from './types';
import { getTranslation } from './utils/translations';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'camera'>('manual');
  
  // Settings State
  const [language, setLanguage] = useState<Language>('zh');
  const [showSettings, setShowSettings] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    provider: 'google',
    baseUrl: '',
    apiKey: '',
    model: 'gemini-2.5-flash'
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    equipment: [],
    dietaryGoals: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = getTranslation(language);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingState(LoadingState.ANALYZING_IMAGE);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      
      try {
        const detectedIngredients = await identifyIngredientsFromImage(base64Data, apiConfig, language);
        setIngredients(prev => [...new Set([...prev, ...detectedIngredients])]);
        setActiveTab('manual'); 
        setLoadingState(LoadingState.IDLE);
      } catch (error) {
        console.error(error);
        setLoadingState(LoadingState.ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) return;
    
    setLoadingState(LoadingState.GENERATING_RECIPE);
    try {
      const result = await generateRecipe(ingredients, apiConfig, language, userProfile);
      setRecipe(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const resetApp = () => {
    setRecipe(null);
    setIngredients([]);
    setLoadingState(LoadingState.IDLE);
    setActiveTab('manual');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Settings Dialog */}
      <SettingsDialog 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        config={apiConfig}
        onConfigChange={setApiConfig}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-orange-600 cursor-pointer flex-shrink-0" onClick={resetApp}>
            <div className="bg-orange-100 p-2 rounded-lg">
               <ChefHat size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">{t.appTitle}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors border border-gray-200"
            >
              <SettingsIcon size={18} />
              <span className="hidden sm:inline">{t.settings}</span>
            </button>

            <button 
              onClick={() => setLanguage(l => l === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-full transition-colors"
            >
              <Globe size={18} />
              <span className="uppercase">{language}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Loading Overlay */}
        {(loadingState === LoadingState.ANALYZING_IMAGE || loadingState === LoadingState.GENERATING_RECIPE) && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-20"></div>
              <div className="bg-white p-4 rounded-full shadow-xl relative">
                <Loader2 size={48} className="text-orange-500 animate-spin" />
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-800">
              {loadingState === LoadingState.ANALYZING_IMAGE ? t.analyzing : t.cooking}
            </h2>
            <p className="text-gray-500 mt-2">
              {loadingState === LoadingState.ANALYZING_IMAGE ? t.analyzingSub : t.cookingSub}
            </p>
          </div>
        )}

        {/* Initial View */}
        {!recipe && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {t.heroTitle} <span className="text-orange-600">{t.heroHighlight}</span>
              </h1>
              <p className="text-lg text-gray-600">
                {t.heroDesc}
              </p>
            </div>

            {/* User Profile Section (Equipment & Goals) */}
            <UserProfileForm 
              profile={userProfile} 
              onChange={setUserProfile} 
              language={language}
            />

            {/* Input Method Tabs */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'manual' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles size={18} />
                  {t.tabManual}
                </button>
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'camera' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Camera size={18} />
                  {t.tabCamera}
                </button>
              </div>

              <div className="p-6 md:p-8 min-h-[300px]">
                {activeTab === 'manual' ? (
                  <div className="animate-in fade-in duration-300">
                    <IngredientInput selected={ingredients} onUpdate={setIngredients} language={language} />
                    
                    {ingredients.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={handleGenerateRecipe}
                          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-orange-200 hover:scale-105 transition-all"
                        >
                          {t.generate} <ArrowRight size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10 animate-in fade-in duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div 
                      onClick={triggerFileInput}
                      className="group cursor-pointer w-full max-w-sm border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center hover:border-orange-400 hover:bg-orange-50 transition-all"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                        <Camera size={32} className="text-gray-400 group-hover:text-orange-500" />
                      </div>
                      <p className="text-lg font-medium text-gray-700 mb-2">{t.takePhoto}</p>
                      <p className="text-sm text-gray-400 text-center">
                        {t.uploadDesc}
                      </p>
                      <button className="mt-6 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm font-medium group-hover:border-orange-200 group-hover:text-orange-600">
                        {t.chooseImage}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {loadingState === LoadingState.ERROR && (
               <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                 {t.error}
               </div>
            )}
          </div>
        )}

        {/* Recipe Result View */}
        {recipe && (
          <RecipeDisplay recipe={recipe} onReset={resetApp} language={language} />
        )}
        
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>{t.footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
