import { GoogleGenAI } from "@google/genai";

interface Metadata {
  title?: string;
  artist?: string;
  tuning?: string;
  bpm?: string;
  note?: string;
}

export const generateTabFromAudio = async (base64Audio: string, mimeType: string, metadata?: Metadata): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Using gemini-3-pro-preview for complex reasoning and high-fidelity transcription
  const modelId = 'gemini-3-pro-preview'; 

  let userContext = "An audio file is provided as the primary source for transcription.";
  let researchDirectives = "";

  if (metadata?.title || metadata?.artist) {
    const searchTerm = `${metadata.title || ''} ${metadata.artist || ''}`.trim();
    userContext += `
    SONG METADATA:
    Title: ${metadata.title || 'Unknown'}
    Artist: ${metadata.artist || 'Unknown'}
    Target Tuning: ${metadata.tuning || 'Standard E'}
    Target BPM: ${metadata.bpm || 'Unknown'}
    User Note: ${metadata.note || 'None'}
    `;

    researchDirectives = `
    Use 'googleSearch' to look up the official guitar tuning and existing tablature for "${searchTerm}". 
    Verify against the audio. If the audio implies a different key or tuning than common online tabs, prioritize the audio analysis.
    Compare what is played in the audio with standard transcriptions to ensure 100% accuracy.
    `;
  } else {
    userContext += `
    No metadata provided. Perform a blind transcription. Detect key, tuning, and tempo purely from the audio.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4096 }, // Enable reasoning for better note detection and tab arrangement
        systemInstruction: `You are TabSense AI, a world-class guitar transcriber. 
        Your task is to convert guitar audio into accurate ASCII tablature.
        
        RULES:
        1. Output ONLY the ASCII tablature.
        2. Use standard notation: h (hammer-on), p (pull-off), b (bend), / (slide), ~ (vibrato), PM (palm mute).
        3. Include a header with Song Title, Artist, Tuning, and BPM.
        4. Organize the tab into logical sections (Intro, Verse, Chorus, etc.).
        5. Do NOT include markdown code block backticks (\`\`\`) in your final string response.
        6. Ensure the horizontal lines are properly aligned for 6 strings (e, B, G, D, A, E).
        7. Think through the fingering logic to ensure the tab is physically playable on a standard guitar.`,
      },
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Audio } },
          { text: `${userContext}\n\n${researchDirectives}\n\nAnalyze the audio carefully and produce the professional ASCII guitar tab.` }
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("The AI model failed to produce an output.");
    
    // Cleanup any accidental markdown formatting
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```(?:txt|guitar|text)?\n?/, '');
    cleanText = cleanText.replace(/```$/, '');
    
    return cleanText;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    let errorMessage = "An unexpected error occurred during transcription.";
    
    // Check if error message is a JSON string from the SDK
    try {
      const parsed = typeof error.message === 'string' ? JSON.parse(error.message) : error;
      const status = parsed?.error?.code || parsed?.status;
      const message = parsed?.error?.message || parsed?.message;

      if (status === 503 || status === 'UNAVAILABLE') {
        errorMessage = "The AI service is currently busy. Please wait 10 seconds and try again.";
      } else if (status === 429 || (message && message.toLowerCase().includes('quota'))) {
        errorMessage = "API Quota Exceeded. You have reached your limit. Please check your plan details or wait until your quota resets.";
      } else if (status === 404) {
        errorMessage = "The requested model was not found. Please verify API versioning.";
      } else if (message) {
        errorMessage = message;
      }
    } catch (e) {
      if (error.message) {
        if (error.message.includes('quota')) {
          errorMessage = "API Quota Exceeded. Please check your billing/usage plan.";
        } else {
          errorMessage = error.message;
        }
      }
    }

    if (errorMessage.includes('API key')) {
      errorMessage = "Invalid API Key. Please verify your environment configuration.";
    }
    
    throw new Error(errorMessage);
  }
};