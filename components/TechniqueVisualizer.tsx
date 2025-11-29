import React from 'react';
import { PrepTechnique, PrepAction, Language } from '../types';
import { Scissors } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import StickFigure from './StickFigure';

interface Props {
  techniques: PrepTechnique[];
  language: Language;
}

const TechniqueVisualizer: React.FC<Props> = ({ techniques, language }) => {
  if (!techniques || techniques.length === 0) return null;

  const t = getTranslation(language);

  const getActionLabel = (action: PrepAction) => {
    const key = action.toLowerCase() as keyof typeof t.prepAction;
    return t.prepAction[key] || action;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="bg-orange-100 p-1 rounded-md text-orange-600"><Scissors size={20}/></span>
        {t.prepTechniques}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techniques.map((tech, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-2xl border-2 border-gray-100 bg-white flex items-center gap-4 transition-transform hover:shadow-md"
          >
            <StickFigure action={tech.action as PrepAction} className="flex-shrink-0" />
            <div className="flex-1">
                <h4 className="font-bold text-gray-800 capitalize mb-1 flex items-center gap-2">
                    {getActionLabel(tech.action)} 
                    <span className="text-orange-600">{tech.ingredient}</span>
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">{tech.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechniqueVisualizer;
