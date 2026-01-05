
import { GoogleGenAI, Type } from "@google/genai";

export const generateCreativeGroupNames = async (count: number, theme: string = "Professional Teams") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} creative and catchy group names for an HR team building event. The theme is: ${theme}. Return only the names separated by commas.`,
      config: {
        temperature: 0.8,
        responseMimeType: "text/plain",
      },
    });

    const text = response.text || "";
    return text.split(',').map(name => name.trim()).slice(0, count);
  } catch (error) {
    console.error("Failed to generate group names:", error);
    return Array.from({ length: count }, (_, i) => `Group ${i + 1}`);
  }
};
