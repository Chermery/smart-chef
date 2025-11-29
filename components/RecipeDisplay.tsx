import React from 'react';
import { Recipe, Language } from '../types';
import { Clock, Flame, CheckCircle2 } from 'lucide-react';
import TechniqueVisualizer from './TechniqueVisualizer';
import { getTranslation } from '../utils/translations';

interface Props {
  recipe: Recipe;
  onReset: () => void;
  language: Language;
}

const RecipeDisplay: React.FC<Props> = ({ recipe, onReset, language }) => {
  const t = getTranslation(language);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border border-gray-100">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-8 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-white opacity-10">
             <ChefIcon size={200} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 relative z-10">{recipe.title}</h1>
          <p className="text-orange-50 text-lg relative z-10">{recipe.description}</p>
          
          <div className="flex gap-4 mt-6 relative z-10">
            {recipe.cookingTime && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                <Clock size={16} />
                {recipe.cookingTime}
              </div>
            )}
            {recipe.calories && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                <Flame size={16} />
                {recipe.calories}
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{t.ingredients}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {recipe.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 size={18} className="text-green-500 mt-1 shrink-0" />
                        <span>{ing}</span>
                    </li>
                ))}
            </ul>

            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">{t.instructions}</h3>
            <div className="space-y-6">
                {recipe.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mt-1 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                            {idx + 1}
                        </div>
                        <p className="text-gray-600 leading-relaxed pt-1">{step}</p>
                    </div>
                ))}
            </div>
            
            {/* Animated Techniques Section */}
            <TechniqueVisualizer techniques={recipe.prepTechniques} language={language} />
        </div>
      </div>

      <div className="text-center pb-12">
        <button 
            onClick={onReset}
            className="px-8 py-3 bg-gray-800 text-white rounded-full font-semibold shadow-lg hover:bg-gray-700 transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
            {t.startOver}
        </button>
      </div>
    </div>
  );
};

// Simple Icon component for the background
const ChefIcon = ({ size }: { size: number }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
);

export default RecipeDisplay;
