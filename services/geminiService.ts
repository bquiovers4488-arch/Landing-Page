import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Helper to get AI instance. Re-instantiated to ensure fresh key if changed.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a claim document text or image.
 */
export const analyzeClaim = async (text: string, imageBase64?: string): Promise<string> => {
  const ai = getAI();
  
  const parts: any[] = [];
  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from upload
        data: imageBase64
      }
    });
  }
  parts.push({ text: `You are a professional insurance and claim estimation assistant for "Estimate Reliance". Analyze this claim submission. 
  If it's a document, summarize the key points, cost estimates if visible, and missing information. 
  If it's a description, provide professional reassurance and next steps for the estimate process. 
  
  User input: ${text}` });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts },
  });

  return response.text || "I couldn't process that claim. Please try again.";
};

/**
 * Generates marketing copy, slogans, or business ideas with specific personas.
 */
export const generateMarketingContent = async (
  prompt: string, 
  type: 'slogan' | 'mission', 
  persona: 'Gemini' | 'GPT' | 'Grok' = 'Gemini'
): Promise<string> => {
  const ai = getAI();
  
  let systemInstruction = "You are a world-class marketing expert.";
  
  if (persona === 'GPT') {
    systemInstruction += " Adopt a highly professional, expansive, and corporate-friendly tone, similar to GPT-4.";
  } else if (persona === 'Grok') {
    systemInstruction += " Adopt a witty, rebellious, and slightly edgy tone, similar to Grok.";
  } else {
    systemInstruction += " Adopt a balanced, innovative, and helpful tone characteristic of Gemini.";
  }

  const context = type === 'slogan' 
    ? `Generate 5 catchy, unique slogans for the following business or product. Format as a bulleted list.`
    : `Write a powerful and inspiring Mission Statement for the following business. Focus on value, vision, and reliability.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `${context}\n\nTopic: ${prompt}`,
    config: {
      systemInstruction: systemInstruction,
    }
  });

  return response.text || "Could not generate content.";
};

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image (Nano Banana).
 * Kept for legacy or lighter tasks.
 */
export const editImage = async (imageBase64: string, prompt: string, mimeType: string = 'image/jpeg'): Promise<string> => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  // Extract image from response
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("No image generated. The model might have returned only text.");
};

/**
 * Generates high-quality graphics using Gemini 3 Pro Image (Nano Banana Pro).
 */
export const generateProGraphics = async (prompt: string, assetType: string, imageBase64?: string): Promise<string> => {
  const ai = getAI();

  const fullPrompt = `Create a high-quality professional ${assetType} design. Description: ${prompt}. Ensure text is legible and the design is suitable for print or digital marketing.`;

  const parts: any[] = [];
  if (imageBase64) {
    parts.push({
        inlineData: {
            data: imageBase64,
            mimeType: 'image/jpeg',
        }
    });
  }
  parts.push({ text: fullPrompt });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts },
    config: {
        imageConfig: {
            imageSize: '2K', // High quality for professional graphics
            aspectRatio: '1:1'
        }
    }
  });

  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("Graphic generation failed.");
}

/**
 * Generates a video using Veo 3.1 based on an image and optional prompt.
 */
export const generateVeoVideo = async (imageBase64: string, prompt: string = "Animate this naturally"): Promise<string> => {
  const ai = getAI();

  // Initial request
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: imageBase64,
      mimeType: 'image/jpeg', // Assuming jpeg/png input
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9' 
    }
  });

  // Polling
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  if (operation.response?.generatedVideos?.[0]?.video?.uri) {
    const downloadLink = operation.response.generatedVideos[0].video.uri;
    // Proxy fetch to get blob url
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  throw new Error("Video generation failed.");
};