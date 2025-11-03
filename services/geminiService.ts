import { GoogleGenAI, Modality } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ImagePart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

/**
 * Analyzes an image using the gemini-2.5-flash model.
 * @param imagePart The image data to analyze.
 * @returns A text description of the image.
 */
export const analyzeImage = async (imagePart: ImagePart): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: "Describe esta imagen en detalle." },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error in analyzeImage:", error);
    throw new Error("Error al comunicarse con la API de Gemini para el análisis.");
  }
};

/**
 * Edits an image based on a text prompt using the gemini-2.5-flash-image model.
 * @param imagePart The source image data.
 * @param prompt The text prompt describing the desired edit.
 * @returns A base64 encoded string of the generated image.
 */
export const editImage = async (imagePart: ImagePart, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    // Safely access the image data from the response.
    const imagePartData = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
    )?.inlineData?.data;

    if (imagePartData) {
      return imagePartData;
    }
    
    // If no image data is found, log the response for debugging and throw an error.
    console.error("API response did not contain valid image data:", JSON.stringify(response, null, 2));
    throw new Error("No se encontraron datos de imagen en la respuesta de la API.");
  } catch (error) {
    console.error("Error in editImage:", error);
    // Check if it's the specific error we threw, otherwise throw a generic one.
    if (error instanceof Error && error.message.includes("No se encontraron datos de imagen")) {
      throw error;
    }
    throw new Error("Error al comunicarse con la API de Gemini para la generación de imágenes.");
  }
};