
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartItemDetails = async (itemName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a professional description, category, and 3-5 keywords for the following item: "${itemName}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["description", "category", "tags"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation failed:", error);
    return {
      description: "No description generated.",
      category: "Other",
      tags: ["General"]
    };
  }
};
