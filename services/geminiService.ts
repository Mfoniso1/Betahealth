
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const createStemCellChat = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are BetaHealth AI, a world-class expert in regenerative medicine and stem cell therapy. 
      Your goal is to educate the public, patients, and researchers about the potential of stem cells in treating diseases like Leukemia, Diabetes, Parkinson's, and Heart Disease.
      
      Guidelines:
      1. Provide accurate, evidence-based scientific information.
      2. Use a compassionate but professional tone.
      3. Always clarify that you are an AI and not a substitute for professional medical advice.
      4. If asked about controversial topics, present the current scientific consensus and ethical frameworks fairly.
      5. Focus on the mechanism of action (how it works) and current clinical trial landscape.
      6. Format your responses using clean Markdown.`,
    },
  });
};

export const generateTherapyImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality medical scientific illustration of ${prompt}, microscopic view, blue and teal lighting, professional aesthetic, 4k.` }],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Failed to generate image:", error);
    return null;
  }
};
