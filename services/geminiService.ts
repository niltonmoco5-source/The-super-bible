
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const startBibleChat = (history: Message[]) => {
  const ai = getAIClient();
  const formattedHistory = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: formattedHistory,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const sendMessageWithAudio = async (audioBase64: string, history: Message[]) => {
  const ai = getAIClient();
  
  const contents: any[] = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  contents.push({
    role: 'user',
    parts: [
      {
        inlineData: {
          mimeType: 'audio/webm',
          data: audioBase64
        }
      },
      { text: "Listen to this audio carefully. Identify the language spoken and respond as the Living Bible Counselor in that same language, offering scriptural guidance and comfort." }
    ]
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });

  return response.text;
};

export const generateDailyVerse = async (): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Gere um versículo bíblico de encorajamento para hoje, com uma breve reflexão de uma frase. Formato: "Versículo (Referência) - Reflexão"',
    });
    return response.text || "Salmos 23:1 - O Senhor é o meu pastor, nada me faltará.";
  } catch (error) {
    console.error("Error generating verse:", error);
    return "Filipenses 4:13 - Tudo posso naquele que me fortalece.";
  }
};

export const getMediaRecommendations = async (theme: string): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sugira uma música de louvor e um vídeo de estudo bíblico para o tema: "${theme}". Explique brevemente por que cada um ajuda na edificação espiritual.`,
      config: {
        systemInstruction: "Você é um curador de conteúdo cristão. Seja breve e inspirador.",
      }
    });
    return response.text || "Busque por 'Louvor e Adoração' no YouTube para edificar seu dia.";
  } catch (error) {
    return "Música: 'Aclame ao Senhor' - Vídeo: 'O Sermão da Montanha'.";
  }
};

export const searchBible = async (query: string): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Atue como um leitor da Bíblia. O usuário buscou por: "${query}". 
      Se for uma referência clara (ex: João 3, Salmo 23), forneça o texto bíblico principal e uma breve explicação contextual do capítulo. 
      Se for um tema (ex: amor, perdão), sugira os 3 capítulos mais relevantes e cite passagens curtas.
      Use uma formatação bonita com negritos e títulos. Identifique o idioma da busca e responda no mesmo idioma.`,
    });
    return response.text || "Não conseguimos encontrar essa passagem. Tente buscar algo como 'João 3' ou 'Salmo 23'.";
  } catch (error) {
    return "Erro ao buscar na Bíblia. Verifique sua conexão.";
  }
};
