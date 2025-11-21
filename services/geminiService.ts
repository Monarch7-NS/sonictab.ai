import { GoogleGenAI } from "@google/genai";
import { TabResult, SongMetadata } from "../types";

const getClient = () => {
  let apiKey = process.env.API_KEY;

  // SANITIZATION: Remove accidental spaces or quotes from the key
  if (apiKey) {
    apiKey = apiKey.trim().replace(/^["']|["']$/g, '');
  }

  if (!apiKey) {
    throw new Error("API Key not found. Please ensure you have a .env file with API_KEY=...");
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateTabsFromAudio = async (
  base64Data: string, 
  mimeType: string, 
  tuning: string,
  metadata: SongMetadata,
  fileName: string
): Promise<TabResult> => {
  const ai = getClient();

  const promptText = `
    You are an expert professional guitar transcriber.
    
    Context:
    - Audio File Name: "${fileName}"
    - Requested Tuning: "${tuning}"
    - Metadata Provided: Song="${metadata.title}", Artist="${metadata.artist}", BPM="${metadata.bpm}"
    
    Task:
    1. Listen to the audio file carefully.
    2. If Song/Artist is provided, research the song online to find the official key and techniques.
    3. Generate accurate Guitar Tablature.
    
    Requirements:
    - Accurately capture the main riffs, chords, and solos.
    - Notate specific techniques: h (hammer-on), p (pull-off), b (bend), / (slide), ~ (vibrato).
    - Separate sections (Intro, Verse, Chorus, Bridge).
    - DO NOT include conversational text. Output ONLY the tabs.
  `;

  try {
    console.log("Generating tabs with Gemini 2.5 Flash...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          { text: promptText }
        ]
      },
      config: {
        tools: [{ googleSearch: {} }],
        // Thinking budget adjusted for Flash model constraints
        thinkingConfig: { thinkingBudget: 8192 } 
      }
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response generated from AI.");
    }

    const candidate = response.candidates[0];
    const text = candidate.content.parts.map(p => p.text).join('');
    
    // Extract Grounding Metadata (Search Sources)
    const groundingChunks = candidate.groundingMetadata?.groundingChunks || [];
    const sourceUrls = groundingChunks
      .filter(c => c.web?.uri && c.web?.title)
      .map(c => ({ title: c.web!.title!, uri: c.web!.uri! }));

    return {
      rawText: text,
      sourceUrls: sourceUrls,
      modelUsed: 'gemini-2.5-flash'
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Provide more helpful error messages for common issues
    if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("API Quota Exceeded. Please try again in a minute or check your Google AI Studio quota.");
    }
    throw error;
  }
};