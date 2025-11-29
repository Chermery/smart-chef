
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, Language, ApiConfig, UserProfile, AVAILABLE_EQUIPMENT, DIETARY_GOALS } from '../types';

const RECIPE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The name of the dish." },
    description: { type: Type.STRING, description: "A short, appetizing description." },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of ingredients with quantities."
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step by step cooking instructions."
    },
    calories: { type: Type.STRING, description: "Approximate calories per serving." },
    cookingTime: { type: Type.STRING, description: "Total cooking time." },
    prepTechniques: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ingredient: { type: Type.STRING },
          action: { 
            type: Type.STRING, 
            enum: ['CHOP', 'SLICE', 'PEEL', 'MIX', 'BOIL', 'FRY', 'WASH', 'OTHER'],
            description: "The type of physical action required."
          },
          tip: { type: Type.STRING, description: "A specific pro-tip for how to do this action for this ingredient (e.g. 'Use a rolling chop motion')." }
        },
        required: ['ingredient', 'action', 'tip']
      },
      description: "Detailed preparation techniques for key ingredients."
    }
  },
  required: ['title', 'description', 'ingredients', 'steps', 'prepTechniques']
};

function isGoogleProvider(config: ApiConfig): boolean {
  // Stricter check: only "google" (case insensitive) or empty defaults to Google SDK.
  // Anything else (e.g. "OpenRouter", "Custom", "OpenAI") uses the fetch adapter.
  const provider = config.provider?.trim().toLowerCase() || '';
  return provider === 'google' || provider === '';
}

// --- Google Client Helper ---
function getGoogleClient(apiConfig: ApiConfig) {
    const options: any = { apiKey: apiConfig.apiKey || process.env.API_KEY };
    return new GoogleGenAI(options);
}

// --- OpenAI-Compatible Fetch Helper (for OpenRouter, etc) ---
async function fetchOpenAICompatible(apiConfig: ApiConfig, messages: any[], jsonMode: boolean = false) {
    // robust URL construction
    let baseUrl = apiConfig.baseUrl.trim();
    if (!baseUrl) {
        baseUrl = 'https://openrouter.ai/api/v1';
    }
    // Remove trailing slash
    baseUrl = baseUrl.replace(/\/+$/, '');
    
    // If the user already included /chat/completions, don't add it again
    const endpoint = baseUrl.endsWith('/chat/completions') 
        ? baseUrl 
        : `${baseUrl}/chat/completions`;
    
    const body: any = {
        model: apiConfig.model,
        messages: messages,
        temperature: 0.7,
    };

    // Only apply JSON mode if not explicitly disabled or if widely supported.
    // Some custom endpoints might error on this, but standard OpenRouter/OpenAI supports it.
    if (jsonMode) {
        body.response_format = { type: "json_object" };
    }

    // Prepare headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiConfig.apiKey}`,
    };

    // OpenRouter specific headers
    if (baseUrl.includes('openrouter.ai')) {
        headers['HTTP-Referer'] = window.location.origin;
        headers['X-Title'] = 'SmartChef';
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error("No content received from provider");
        return content;
    } catch (error: any) {
        console.error("Fetch Error:", error);
        throw new Error(`Connection failed: ${error.message}`);
    }
}

// --- Main Exported Functions ---

export async function testConnection(apiConfig: ApiConfig): Promise<boolean> {
  try {
    if (isGoogleProvider(apiConfig)) {
        const ai = getGoogleClient(apiConfig);
        await ai.models.generateContent({
            model: apiConfig.model || 'gemini-2.5-flash',
            contents: { parts: [{ text: 'Hello' }] },
        });
    } else {
        await fetchOpenAICompatible(apiConfig, [{ role: 'user', content: 'Hello' }]);
    }
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    // Rethrow to let the UI display the actual error message
    throw error;
  }
}

export async function identifyIngredientsFromImage(base64Image: string, apiConfig: ApiConfig, language: Language): Promise<string[]> {
  try {
    const langPrompt = language === 'zh' ? "Please list the ingredients in Simplified Chinese." : "Return a comma-separated list in English.";
    const systemPrompt = `Identify the food ingredients in this image. Return a comma-separated list of the main ingredients visible. Ignore common pantry staples like salt or oil unless clearly visible. ${langPrompt}`;

    let text = "";

    if (isGoogleProvider(apiConfig)) {
        const ai = getGoogleClient(apiConfig);
        const response = await ai.models.generateContent({
            model: apiConfig.model,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: systemPrompt }
                ]
            }
        });
        text = response.text || "";
    } else {
        // OpenAI Compatible Image Handling
        const messages = [
            {
                role: "user",
                content: [
                    { type: "text", text: systemPrompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                ]
            }
        ];
        text = await fetchOpenAICompatible(apiConfig, messages);
    }

    // Handle both English comma and Chinese comma
    return text.split(/,|，/).map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Error identifying ingredients:", error);
    throw error;
  }
}

export async function generateRecipe(ingredients: string[], apiConfig: ApiConfig, language: Language, profile: UserProfile): Promise<Recipe> {
  try {
    // Convert profile IDs to readable strings
    const equipmentNames = profile.equipment.map(id => {
        const item = AVAILABLE_EQUIPMENT.find(e => e.id === id);
        return item ? (language === 'zh' ? item.zh : item.en) : id;
    });

    const goalNames = profile.dietaryGoals.map(id => {
        const item = DIETARY_GOALS.find(g => g.id === id);
        return item ? (language === 'zh' ? item.zh : item.en) : id;
    });

    const langInstruction = language === 'zh' 
      ? "IMPORTANT: Generate the recipe title, description, ingredients, steps, and tips entirely in Simplified Chinese (zh-CN)." 
      : "Generate the recipe in English.";

    const equipmentText = equipmentNames.length > 0 
        ? `User only has the following equipment available: ${equipmentNames.join(', ')}. Ensure the recipe can be cooked with these.` 
        : "";
    
    const goalText = goalNames.length > 0
        ? `User has the following dietary goals/habits: ${goalNames.join(', ')}. Adjust the recipe to fit these goals.`
        : "";

    const prompt = `Create a delicious recipe using some or all of these ingredients: ${ingredients.join(', ')}. 
    You can assume the user has basic pantry staples (salt, pepper, oil, water). 
    ${equipmentText}
    ${goalText}
    Focus on clear instructions and specifically highlight preparation techniques for the main ingredients.
    ${langInstruction}
    
    Return ONLY valid JSON matching this schema:
    {
      "title": "string",
      "description": "string",
      "ingredients": ["string"],
      "steps": ["string"],
      "calories": "string",
      "cookingTime": "string",
      "prepTechniques": [
         { "ingredient": "string", "action": "CHOP|SLICE|PEEL|MIX|BOIL|FRY|WASH|OTHER", "tip": "string" }
      ]
    }`;

    // Use default system prompt if user hasn't provided one
    const defaultSystemPrompt = "You are a helpful expert chef assistant. You always respond with valid JSON.";
    const effectiveSystemPrompt = apiConfig.systemPrompt?.trim() 
        ? `${defaultSystemPrompt} ${apiConfig.systemPrompt}` 
        : defaultSystemPrompt;

    let jsonStr = "";

    if (isGoogleProvider(apiConfig)) {
        const ai = getGoogleClient(apiConfig);
        const response = await ai.models.generateContent({
            model: apiConfig.model,
            contents: prompt,
            config: {
                systemInstruction: effectiveSystemPrompt,
                responseMimeType: "application/json",
                responseSchema: RECIPE_SCHEMA
            }
        });
        jsonStr = response.text || "{}";
    } else {
        const messages = [
            { role: "system", content: effectiveSystemPrompt },
            { role: "user", content: prompt }
        ];
        // Note: For OpenRouter, we enable jsonMode. If using a model that doesn't support it, 
        // the provider might ignore it or we might need to rely on the prompt instructions.
        jsonStr = await fetchOpenAICompatible(apiConfig, messages, true);
    }

    // Attempt to clean JSON if markdown code blocks are included (common with DeepSeek/OpenAI models)
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

    const recipeData = JSON.parse(jsonStr) as Recipe;
    return recipeData;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}
