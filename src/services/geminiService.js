import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.5-flash';

class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  async analyzeImage(imageData) {
    try {
      if (!imageData) {
        throw new Error('No image data provided');
      }

      // Convert base64 image data to binary
      const base64Data = imageData.split(',')[1];
      if (!base64Data) {
        throw new Error('Invalid image data format');
      }

      // Create image part for the model
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      };

      // Prepare the prompt with more specific instructions
      const prompt = 'Analyze this food image and provide nutritional information. Return ONLY a JSON object in this exact format, with no additional text: {"foodName": "name of the food", "calories": number without units, "protein": "Xg", "carbs": "Xg", "fat": "Xg", "fiber": "Xg", "sugar": "Xg", "saturatedFat": "Xg"}. Be precise with measurements.';

      // Generate content
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      try {
        // Attempt to extract JSON from the response
        const jsonMatch = text.match(/\{[^\}]+\}/); 
        if (!jsonMatch) {
          throw new Error('No valid JSON found in response');
        }

        const parsedData = JSON.parse(jsonMatch[0]);

        // Validate the parsed data structure
        if (!parsedData.foodName || 
            typeof parsedData.calories !== 'number' || 
            !parsedData.protein || 
            !parsedData.carbs || 
            !parsedData.fat) {
          throw new Error('Invalid nutrition data format');
        }

        return parsedData;
      } catch (parseError) {
        console.error('Error parsing nutrition data:', parseError);
        throw new Error('Unable to parse nutrition information. Please try again with a clearer image.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }
}

export default GeminiService;