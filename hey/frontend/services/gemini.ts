import { GoogleGenAI } from "@google/genai";

interface Metadata {
  title?: string;
  artist?: string;
  tuning?: string;
  bpm?: string;
}

export const generateTabFromAudio = async (base64Audio: string, mimeType: string, metadata?: Metadata): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = 'gemini-2.5-flash'; 

  let userContext = "Audio File Uploaded.";
  let researchDirectives = "";

  if (metadata?.title || metadata?.artist) {
    const searchTerm = `${metadata.title || ''} ${metadata.artist || ''}`.trim();
    userContext += `
    METADATA PROVIDED:
    Song Title: ${metadata.title || 'Unknown'}
    Artist/Band: ${metadata.artist || 'Unknown'}
    Target Tuning: ${metadata.tuning || 'Standard E'}
    Est. BPM: ${metadata.bpm || 'Unknown'}
    `;

    researchDirectives = `
    STRICT RESEARCH PROTOCOL (HIERARCHY OF TRUTH):
    You MUST use the 'googleSearch' tool to find existing tabs for "${searchTerm}". 
    Follow this exact priority order for your research:
    
    1.  **Ultimate-Guitar.com**: Search specifically for "site:ultimate-guitar.com ${searchTerm} tab". Look for "Pro" or highly-rated versions.
    2.  **Songsterr.com**: Search "site:songsterr.com ${searchTerm}". Excellent for rhythmic alignment.
    3.  **Guitaretab.com**: Search "site:guitaretab.com ${searchTerm}".
    4.  **YouTube**: Search for "${searchTerm} guitar lesson" or "${searchTerm} live" to visually verify finger positions if audio is ambiguous.
    5.  **General Web**: (Facebook, TikTok, Blogs) Only if the above yield no results.

    SYNTHESIS & AUDIO VERIFICATION:
    - The internet provides the *notes*, but the provided AUDIO FILE is the *timing and nuance authority*.
    - If Ultimate-Guitar says "Fret 5" but the audio clearly sounds like "Fret 0", TRUST THE AUDIO.
    - If the live version (audio) differs from the studio album (tab), transcribe the AUDIO.
    `;
  } else {
    userContext += `
    NO METADATA PROVIDED.
    1. Analyze the audio purely by ear (Perfect Pitch Mode).
    2. Detect the key and tuning from the harmonic overtones.
    3. Transcribe with maximum precision.
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `
          You are TabSense AI, the most accurate guitar transcription engine in existence.
          YOUR GOAL: Produce a FLAWLESS, professional-grade ASCII guitar tab.

          METHODOLOGY:
          1. **Identify**: Listen to the audio. Determine Instrument, Tuning, and Tempo.
          2. **Research**: If metadata is present, scrape the specific sites requested.
          3. **Correct**: Overlay the research onto the actual audio waveform.
          4. **Notate**: Write the tab with perfect vertical alignment.

          NOTATION LEGEND:
          - h = hammer-on, p = pull-off, b = bend, r = release, / = slide up, \\ = slide down, PM = Palm Mute, ~ = Vibrato

          OUTPUT REQUIREMENTS:
          - Do NOT wrap in markdown code blocks.
          - Header: Song, Artist, Tuning, BPM.
        `,
      },
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Audio } },
          { text: `${userContext}\n\n${researchDirectives}\n\nGENERATE THE FLAWLESS TAB NOW.` }
        ]
      }
    });

    const text = response.text;
    if (!text) throw new Error("Gemini produced no output.");
    
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```(?:txt|guitar)?\n?/, '');
    cleanText = cleanText.replace(/```$/, '');
    
    return cleanText;

  } catch (error: any) {
    console.error("Gemini Audio Error:", error);
    if (error.message?.includes('API key')) {
      throw new Error("Invalid API Key. Please refresh and select a valid key.");
    }
    throw error;
  }
};