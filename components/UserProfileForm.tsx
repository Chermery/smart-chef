import React from 'react';
import { UserProfile, AVAILABLE_EQUIPMENT, DIETARY_GOALS, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { ChefHat, HeartPulse } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
  language: Language;
}

const UserProfileForm: React.FC<Props> = ({ profile, onChange, language }) => {
  const t = getTranslation(language);

  const toggleEquipment = (id: string) => {
    const newEq = profile.equipment.includes(id)
      ? profile.equipment.filter(e => e !== id)
      : [...profile.equipment, id];
    onChange({ ...profile, equipment: newEq });
  };

  const toggleGoal = (id: string) => {
    const newGoals = profile.dietaryGoals.includes(id)
      ? profile.dietaryGoals.filter(g => g !== id)
      : [...profile.dietaryGoals, id];
    onChange({ ...profile, dietaryGoals: newGoals });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-100">
        <h2 className="font-bold text-lg text-gray-800">{t.profileTitle}</h2>
        <span className="text-sm text-gray-400">{t.optional}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Equipment */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <ChefHat size={16} /> {t.equipment}
          </h3>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_EQUIPMENT.map(item => (
              <button
                key={item.id}
                onClick={() => toggleEquipment(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  profile.equipment.includes(item.id)
                    ? 'bg-orange-50 border-orange-200 text-orange-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200'
                }`}
              >
                {language === 'zh' ? item.zh : item.en}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <HeartPulse size={16} /> {t.goals}
          </h3>
          <div className="flex flex-wrap gap-2">
            {DIETARY_GOALS.map(item => (
              <button
                key={item.id}
                onClick={() => toggleGoal(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  profile.dietaryGoals.includes(item.id)
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-green-200'
                }`}
              >
                {language === 'zh' ? item.zh : item.en}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
