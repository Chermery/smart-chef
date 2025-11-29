import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { IngredientOption, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface Props {
  selected: string[];
  onUpdate: (ingredients: string[]) => void;
  language: Language;
}

const COMMON_INGREDIENTS: IngredientOption[] = [
  { id: 'egg', name: { en: 'Eggs', zh: '鸡蛋' }, emoji: '🥚' },
  { id: 'chicken', name: { en: 'Chicken', zh: '鸡肉' }, emoji: '🍗' },
  { id: 'rice', name: { en: 'Rice', zh: '米饭' }, emoji: '🍚' },
  { id: 'tomato', name: { en: 'Tomato', zh: '番茄' }, emoji: '🍅' },
  { id: 'potato', name: { en: 'Potato', zh: '土豆' }, emoji: '🥔' },
  { id: 'onion', name: { en: 'Onion', zh: '洋葱' }, emoji: '🧅' },
  { id: 'garlic', name: { en: 'Garlic', zh: '大蒜' }, emoji: '🧄' },
  { id: 'beef', name: { en: 'Beef', zh: '牛肉' }, emoji: '🥩' },
  { id: 'pasta', name: { en: 'Pasta', zh: '意面' }, emoji: '🍝' },
  { id: 'carrot', name: { en: 'Carrot', zh: '胡萝卜' }, emoji: '🥕' },
];

const IngredientInput: React.FC<Props> = ({ selected, onUpdate, language }) => {
  const [inputValue, setInputValue] = useState('');
  const t = getTranslation(language);

  const addIngredient = (name: string) => {
    if (!selected.includes(name)) {
      onUpdate([...selected, name]);
    }
    setInputValue('');
  };

  const removeIngredient = (name: string) => {
    onUpdate(selected.filter(i => i !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      addIngredient(inputValue.trim());
    }
  };

  const getCommonName = (ing: IngredientOption) => {
    return language === 'zh' ? ing.name.zh : ing.name.en;
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {COMMON_INGREDIENTS.map((ing) => {
          const name = getCommonName(ing);
          return (
            <button
              key={ing.id}
              onClick={() => selected.includes(name) ? removeIngredient(name) : addIngredient(name)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selected.includes(name)
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <span>{ing.emoji}</span>
              {name}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.placeholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none shadow-sm text-gray-800 placeholder-gray-400 bg-white"
        />
        <button
          onClick={() => inputValue.trim() && addIngredient(inputValue.trim())}
          className="absolute right-2 top-2 p-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {selected.length > 0 && (
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <h3 className="text-sm font-semibold text-orange-800 mb-2">{t.basket}</h3>
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 pl-3 pr-2 py-1 bg-white text-orange-700 rounded-lg shadow-sm border border-orange-100 text-sm"
              >
                {item}
                <button
                  onClick={() => removeIngredient(item)}
                  className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors ml-1"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput;
