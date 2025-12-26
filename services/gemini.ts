
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  summarizeNote: async (content: string): Promise<string> => {
    if (!content || content.length < 10) return "Content too short to summarize.";
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Summarize the following note into a concise paragraph (max 3 sentences): \n\n${content}`,
        config: {
            temperature: 0.7,
            topP: 0.95,
        }
      });
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error('Gemini error:', error);
      return "AI service unavailable. Please check your network.";
    }
  },

  suggestTags: async (content: string): Promise<string[]> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Based on the following content, provide 3-5 relevant tags as a comma-separated list: \n\n${content}`,
      });
      const tagsString = response.text || "";
      return tagsString.split(',').map(tag => tag.trim().replace(/^#/, ''));
    } catch (error) {
        return [];
    }
  }
};
