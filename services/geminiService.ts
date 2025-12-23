
import { GoogleGenAI, Type } from "@google/genai";
import { SenseiQuote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSenseiWisdom(context: string): Promise<SenseiQuote> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Tu es un Sensei de Karaté sage et mystique. L'élève vient de : ${context}. Donne un conseil de sagesse court (1 phrase), cryptique mais encourageant, EN FRANÇAIS. Retourne du JSON avec "text" et "mood" (mood peut être: peaceful, strict, proud).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            mood: { type: Type.STRING }
          },
          required: ["text", "mood"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erreur Gemini:", error);
    return {
      text: "La montagne ne s'incline pas devant le vent. Concentre-toi, élève.",
      mood: "strict"
    };
  }
}
