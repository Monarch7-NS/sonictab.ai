import { GoogleGenAI } from "@google/genai";

interface Metadata {
  title?: string;
  artist?: string;
  tuning?: string;
  bpm?: string;
}

export const generateTabFromAudio = async (base64Audio: string, mimeType: string, metadata?: Metadata): Promise<string> => {
  // CRITICAL FIX: Initialize the client INSIDE the function to ensure it picks up the 
  // latest process.env.API_KEY after the user completes the key selection dialog.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelId = 'gemini-2.5-flash'; 

  // Construct a highly specific context prompt based on user input
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
    - Combine the structural knowledge from the web with the raw listening data from the file.
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
        // Enable Google Search Grounding for research
        tools: [{ googleSearch: {} }],
        // Critical: Set safety settings to BLOCK_NONE to avoid refusals when generating "Copyrighted" lyrics/tabs
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
        systemInstruction: `
          You are TabSense AI, the most accurate guitar transcription engine in existence.
          
          YOUR GOAL: Produce a FLAWLESS, professional-grade ASCII guitar tab.

          METHODOLOGY:
          1. **Identify**: Listen to the audio. Determine Instrument, Tuning, and Tempo.
          2. **Research**: If metadata is present, scrape the specific sites requested (Ultimate Guitar, Songsterr, etc) to get the baseline composition.
          3. **Correct**: Overlay the research onto the actual audio waveform. Fix every single discrepancy. 
          4. **Notate**: Write the tab with perfect vertical alignment.

          NOTATION LEGEND:
          - h = hammer-on
          - p = pull-off
          - b = bend (e.g. 7b9)
          - r = release
          - / = slide up
          - \\ = slide down
          - PM = Palm Mute (PM-------)
          - ~ = Vibrato

          OUTPUT REQUIREMENTS:
          - Do NOT wrap in markdown code blocks if possible, or use '''guitar.
          - Header: Song, Artist, Tuning, BPM.
          - Structure: Intro, Verse, Chorus, etc. with timestamps.
        `,
      },
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          {
            text: `
            ${userContext}

            ${researchDirectives}

            GENERATE THE FLASWLESS TAB NOW.
            Ensure the output matches this structure EXACTLY:

            ''' guitar
            Song: ${metadata?.title || 'Unknown'}
            Artist: ${metadata?.artist || 'Unknown'}
            Tuning: ${metadata?.tuning || 'E A D G B E'}
            BPM: ${metadata?.bpm || 'N/A'}

            [Section Name] (Start Time - End Time)
            E|-------------------------------------------------|
            B|-------------------------------------------------|
            G|-------------------------------------------------|
            D|-------------------------------------------------|
            A|-------------------------------------------------|
            E|-------------------------------------------------|
            PM---------------------------------------------
            `
          }
        ]
      }
    });

    const text = response.text;
    if (!text) {
      console.warn("Gemini returned empty text. Full response:", response);
      throw new Error("Gemini produced no output. The audio might be silent or the model refused the request.");
    }
    
    // Cleanup: Remove any accidental markdown fencing
    let cleanText = text.trim();
    cleanText = cleanText.replace(/^```(?:txt|guitar)?\n?/, '');
    cleanText = cleanText.replace(/```$/, '');
    
    return cleanText;

  } catch (error: any) {
    console.error("Gemini Audio Error:", error);
    // Return a clean error message to the UI
    if (error.message?.includes('API key')) {
      throw new Error("Invalid API Key. Please refresh and select a valid key.");
    }
    throw error;
  }
};