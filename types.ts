
export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING_IMAGE = 'ANALYZING_IMAGE',
  GENERATING_RECIPE = 'GENERATING_RECIPE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export enum PrepAction {
  CHOP = 'CHOP',
  SLICE = 'SLICE',
  PEEL = 'PEEL',
  MIX = 'MIX',
  BOIL = 'BOIL',
  FRY = 'FRY',
  WASH = 'WASH',
  OTHER = 'OTHER'
}

export interface PrepTechnique {
  ingredient: string;
  action: PrepAction;
  tip: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTechniques: PrepTechnique[];
  calories?: string;
  cookingTime?: string;
}

export interface IngredientOption {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  emoji: string;
}

export type Language = 'en' | 'zh';
export type AiModel = 'gemini-2.5-flash' | 'gemini-3-pro-preview';

export interface ApiConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  systemPrompt?: string;
}

export interface UserProfile {
  equipment: string[];
  dietaryGoals: string[];
}

export const AVAILABLE_EQUIPMENT = [
  { id: 'stove', en: 'Stove', zh: '燃气灶/电磁炉' },
  { id: 'oven', en: 'Oven', zh: '烤箱' },
  { id: 'microwave', en: 'Microwave', zh: '微波炉' },
  { id: 'airfryer', en: 'Air Fryer', zh: '空气炸锅' },
  { id: 'blender', en: 'Blender', zh: '搅拌机' },
  { id: 'ricecooker', en: 'Rice Cooker', zh: '电饭煲' },
];

export const DIETARY_GOALS = [
  { id: 'balanced', en: 'Balanced', zh: '均衡饮食' },
  { id: 'lowcarb', en: 'Low Carb', zh: '低碳水' },
  { id: 'highprotein', en: 'High Protein', zh: '高蛋白' },
  { id: 'vegetarian', en: 'Vegetarian', zh: '素食' },
  { id: 'quick', en: 'Quick & Easy', zh: '快速简单' },
  { id: 'lowfat', en: 'Low Fat', zh: '低脂' },
];
